import { describe, expect, it } from 'vitest';
import type { IndexEntry } from '../content/schema.ts';
import { applyExposure, applyRetrieval, newProgress, type ItemProgress } from '../scheduler/scheduler.ts';
import { buildSession, requeueAfterFailure, STEP_SECONDS, type SessionOptions, type Step } from './selector.ts';

const now = new Date('2026-10-12T10:00:00Z');
const earlier = new Date('2026-09-01T10:00:00Z');

function entry(id: string, kind: 'card' | 'question', macroId: string, microId: string, conceptId: string, seq: number, tags: IndexEntry['tags'] = []): IndexEntry {
  return { id, kind, moduleId: `${macroId}-m`, lessonId: `${microId}-l`, microId, macroId, conceptId, seq, rev: 1, tags };
}

/** 3 macros × 2 micros × 4 concepts, each concept = 1 card + 1 question. */
function corpus(): IndexEntry[] {
  const out: IndexEntry[] = [];
  for (const macro of ['fert', 'pcos', 'nutr']) {
    for (const micro of ['a', 'b']) {
      for (let c = 0; c < 4; c++) {
        const concept = `${macro}.${micro}.c${c}`;
        out.push(entry(`${concept}.card`, 'card', macro, `${macro}.${micro}`, concept, c * 2, macro === 'nutr' ? ['diet'] : []));
        out.push(entry(`${concept}.q`, 'question', macro, `${macro}.${micro}`, concept, c * 2 + 1, macro === 'nutr' ? ['diet'] : []));
      }
    }
  }
  return out;
}

const opts = (o: Partial<SessionOptions> = {}): SessionOptions => ({ minutes: 5, scope: { kind: 'all' }, filters: [], mode: 'balanced', ...o });
const cost = (steps: Step[]) => steps.reduce((s, x) => s + STEP_SECONDS[x.mode], 0);

function dueProgress(index: IndexEntry[], ids: string[]): Map<string, ItemProgress> {
  const m = new Map<string, ItemProgress>();
  for (const id of ids) {
    const e = index.find((x) => x.id === id)!;
    m.set(id, applyRetrieval(newProgress(id, e.kind, e.conceptId, earlier), 'good', 1, earlier));
  }
  return m;
}

describe('buildSession', () => {
  it('with no reviews, starts new content and fits the time budget', () => {
    const steps = buildSession({ index: corpus(), progress: new Map(), options: opts(), now, seed: 1 });
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.every((s) => s.mode === 'learn' || s.mode === 'question')).toBe(true);
    expect(cost(steps)).toBeLessThanOrEqual(5 * 60 + 30);
  });

  it('longer sessions hold more steps', () => {
    const a = buildSession({ index: corpus(), progress: new Map(), options: opts({ minutes: 3 }), now, seed: 1 });
    const b = buildSession({ index: corpus(), progress: new Map(), options: opts({ minutes: 15 }), now, seed: 1 });
    expect(b.length).toBeGreaterThan(a.length);
  });

  it('balanced mode mixes due reviews with new material', () => {
    const index = corpus();
    const ids = index.filter((e) => e.kind === 'card' && e.microId === 'pcos.a').map((e) => e.id);
    const steps = buildSession({ index, progress: dueProgress(index, ids), options: opts({ minutes: 10 }), now, seed: 2 });
    expect(steps.some((s) => s.mode === 'review')).toBe(true);
    expect(steps.some((s) => s.mode === 'learn')).toBe(true);
  });

  it('never asks a new question about a concept that was not read', () => {
    const steps = buildSession({ index: corpus(), progress: new Map(), options: opts({ minutes: 15 }), now, seed: 3 });
    for (const [i, s] of steps.entries()) {
      if (s.mode !== 'question') continue;
      expect(steps.slice(0, i).some((p) => p.conceptId === s.conceptId && p.mode === 'learn')).toBe(true);
    }
  });

  it('keeps steps of the same concept apart', () => {
    const steps = buildSession({ index: corpus(), progress: new Map(), options: opts({ minutes: 15 }), now, seed: 4 });
    for (let i = 1; i < steps.length; i++) expect(steps[i]!.conceptId).not.toBe(steps[i - 1]!.conceptId);
  });

  it('respects scope and clinical filters', () => {
    const micro = buildSession({ index: corpus(), progress: new Map(), options: opts({ scope: { kind: 'micro', microId: 'pcos.b' } }), now, seed: 5 });
    expect(micro.every((s) => s.microId === 'pcos.b')).toBe(true);
    const diet = buildSession({ index: corpus(), progress: new Map(), options: opts({ filters: ['diet'] }), now, seed: 5 });
    expect(diet.every((s) => s.microId.startsWith('nutr'))).toBe(true);
  });

  it('gives the fertility track priority in the whole programme', () => {
    let fert = 0;
    let total = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const steps = buildSession({ index: corpus(), progress: new Map(), options: opts({ minutes: 15 }), now, seed });
      fert += steps.filter((s) => s.microId.startsWith('fert')).length;
      total += steps.length;
    }
    expect(fert / total).toBeGreaterThan(1 / 3);
  });

  it('mistakes scope only brings back failed items', () => {
    const index = corpus();
    const progress = new Map<string, ItemProgress>();
    const failed = index.find((e) => e.id === 'pcos.a.c1.q')!;
    const passed = index.find((e) => e.id === 'pcos.a.c2.q')!;
    progress.set(failed.id, applyRetrieval(newProgress(failed.id, 'question', failed.conceptId, earlier), 'again', 1, earlier, false));
    progress.set(passed.id, applyRetrieval(newProgress(passed.id, 'question', passed.conceptId, earlier), 'good', 1, earlier, true));
    const steps = buildSession({ index, progress, options: opts({ scope: { kind: 'mistakes' } }), now, seed: 6 });
    expect(steps.map((s) => s.itemId)).toEqual([failed.id]);
  });

  it('reading alone does not make an item due', () => {
    const index = corpus();
    const e = index[0]!;
    const progress = new Map([[e.id, applyExposure(newProgress(e.id, 'card', e.conceptId, earlier), earlier)]]);
    const steps = buildSession({ index, progress, options: opts({ mode: 'review' }), now, seed: 7 });
    expect(steps).toEqual([]);
  });
});

describe('requeueAfterFailure', () => {
  const q: Step[] = ['a', 'b', 'c', 'd', 'e'].map((x) => ({ itemId: x, mode: 'learn', conceptId: x, microId: 'm' }));

  it('after a failed question, brings back the concept card later, not the same question', () => {
    const failed: Step = { itemId: 'qx', mode: 'question', conceptId: 'cx', microId: 'm' };
    const queue = [...q.slice(0, 2), failed, ...q.slice(2)];
    const out = requeueAfterFailure(queue, 2, failed, 'card-cx');
    const idx = out.findIndex((s) => s.itemId === 'card-cx');
    expect(idx).toBe(6);
    expect(out.filter((s) => s.itemId === 'qx')).toHaveLength(1);
  });

  it('reinserts a failed card only once', () => {
    const failed: Step = { itemId: 'a', mode: 'review', conceptId: 'a', microId: 'm' };
    const once = requeueAfterFailure([failed, ...q.slice(1)], 0, failed, undefined);
    const pos = once.findIndex((s, i) => i > 0 && s.itemId === 'a');
    const twice = requeueAfterFailure(once, pos, once[pos]!, undefined);
    expect(twice.filter((s) => s.itemId === 'a')).toHaveLength(2);
  });
});
