import { describe, expect, it } from 'vitest';
import type { IndexEntry } from '../content/schema.ts';
import { applyExposure, applyRetrieval, newProgress, suspend, type ItemProgress } from '../scheduler/scheduler.ts';
import { buildSession, requeueAfterFailure, MIN_GAP, STEP_SECONDS, type SessionOptions, type Step } from './selector.ts';

const now = new Date('2026-10-12T10:00:00Z');
const earlier = new Date('2026-09-01T10:00:00Z');
let orderSeq = 0;

function entry(id: string, kind: 'card' | 'question', macroId: string, microId: string, conceptId: string, seq: number, extra: Partial<IndexEntry> = {}): IndexEntry {
  return { id, kind, moduleId: `${macroId}-m`, lessonId: `${microId}-l`, microId, macroId, conceptId, seq, rev: 1, tags: [], order: orderSeq++, prereqMicros: [], ...extra };
}

/** 3 macros × 2 micros × 4 concepts, each concept = 1 card + 1 question. */
function corpus(): IndexEntry[] {
  orderSeq = 0;
  const out: IndexEntry[] = [];
  for (const macro of ['fert', 'pcos', 'nutr']) {
    for (const micro of ['a', 'b']) {
      for (let c = 0; c < 4; c++) {
        const concept = `${macro}.${micro}.c${c}`;
        const tags: IndexEntry['tags'] = macro === 'nutr' ? ['diet'] : [];
        out.push(entry(`${concept}.card`, 'card', macro, `${macro}.${micro}`, concept, c * 2, { tags }));
        out.push(entry(`${concept}.q`, 'question', macro, `${macro}.${micro}`, concept, c * 2 + 1, { tags }));
      }
    }
  }
  return out;
}

const opts = (o: Partial<SessionOptions> = {}): SessionOptions => ({ minutes: 5, scope: { kind: 'all' }, filters: [], mode: 'balanced', ...o });
const cost = (steps: Step[]) => steps.reduce((s, x) => s + STEP_SECONDS[x.mode], 0);
const reviewed = (e: IndexEntry, rating: 'good' | 'again' = 'good', at = earlier) =>
  applyRetrieval(newProgress(e.id, e.kind, e.conceptId, at), rating, 1, at, rating === 'good');
/** Graduated to long-term review (two successful recalls a day apart). */
const graduated = (e: IndexEntry) => applyRetrieval(reviewed(e), 'good', 1, new Date(earlier.getTime() + 86_400_000), true);

function dueProgress(index: IndexEntry[], ids: string[]): Map<string, ItemProgress> {
  return new Map(ids.map((id) => [id, reviewed(index.find((x) => x.id === id)!)]));
}

function assertQuestionsSpaced(steps: Step[]) {
  steps.forEach((s, i) => {
    if (s.mode !== 'question') return;
    const card = steps.findIndex((p) => p.conceptId === s.conceptId && p.mode === 'learn');
    if (card !== -1) expect(i - card).toBeGreaterThan(MIN_GAP);
  });
}

describe('buildSession', () => {
  it('with no reviews, starts new content in curricular order and fits the budget', () => {
    const steps = buildSession({ index: corpus(), progress: new Map(), options: opts(), now, seed: 1 });
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.every((s) => s.mode === 'learn' || s.mode === 'question')).toBe(true);
    expect(cost(steps)).toBeLessThanOrEqual(5 * 60 + 20);
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

  it('ARCH-001: a card that was only read comes back for first recall, not as new', () => {
    const index = corpus();
    const card = index.find((e) => e.id === 'fert.a.c0.card')!;
    const read = applyExposure(newProgress(card.id, 'card', card.conceptId, earlier), earlier);
    const progress = new Map([[card.id, read]]);
    const balanced = buildSession({ index, progress, options: opts({ minutes: 15 }), now, seed: 3 });
    expect(balanced.find((s) => s.itemId === card.id)?.mode).toBe('review');
    const review = buildSession({ index, progress, options: opts({ mode: 'review' }), now, seed: 3 });
    expect(review.map((s) => s.itemId)).toEqual([card.id]);
  });

  it('ARCH-001: right after reading, the card is not yet due for recall', () => {
    const index = corpus();
    const card = index[0]!;
    const justRead = new Map([[card.id, applyExposure(newProgress(card.id, 'card', card.conceptId, now), now)]]);
    expect(buildSession({ index, progress: justRead, options: opts({ mode: 'review' }), now, seed: 3 })).toEqual([]);
  });

  it('ARCH-002: concentrated review debt fills the whole budget instead of being truncated', () => {
    orderSeq = 0;
    const index: IndexEntry[] = [];
    for (let i = 0; i < 40; i++) index.push(entry(`x.c${i}`, 'card', 'pcos', 'pcos.one', `x.k${i}`, i));
    for (let i = 0; i < 4; i++) index.push(entry(`y.c${i}`, 'card', 'fert', 'fert.two', `y.k${i}`, i));
    const progress = dueProgress(index, index.map((e) => e.id));
    const steps = buildSession({ index, progress, options: opts({ minutes: 15, mode: 'review' }), now, seed: 4 });
    expect(cost(steps)).toBeGreaterThanOrEqual(15 * 60 - STEP_SECONDS.review);
  });

  it('ARCH-005: suspended items never appear, even without progress', () => {
    const index = corpus();
    const target = index.find((e) => e.kind === 'card')!;
    const steps = buildSession({ index, progress: new Map(), suspended: new Set([target.id]), options: opts({ minutes: 15 }), now, seed: 5 });
    expect(steps.some((s) => s.itemId === target.id)).toBe(false);
    const p = new Map([[target.id, suspend(reviewed(target), earlier)]]);
    expect(buildSession({ index, progress: p, options: opts({ mode: 'review' }), now, seed: 5 })).toEqual([]);
  });

  it('ARCH-006: new material follows authored order, not alphabetical ids, and soft prerequisites', () => {
    orderSeq = 0;
    const index = [
      entry('zz-intro.card', 'card', 'pcos', 'pcos.intro', 'k1', 0),
      entry('aa-advanced.card', 'card', 'pcos', 'pcos.adv', 'k2', 0, { prereqMicros: ['pcos.intro'] }),
    ];
    const seq = buildSession({ index, progress: new Map(), options: opts({ scope: { kind: 'macro', macroId: 'pcos', mix: false } }), now, seed: 6 });
    expect(seq[0]!.itemId).toBe('zz-intro.card');
    const mix = buildSession({ index, progress: new Map(), options: opts({ scope: { kind: 'macro', macroId: 'pcos', mix: true } }), now, seed: 6 });
    expect(mix.map((s) => s.itemId)).toEqual(['zz-intro.card']);
  });

  it('ARCH-007: a new question never lands right after its card, even in tiny micros', () => {
    orderSeq = 0;
    const index = [entry('k.card', 'card', 'pcos', 'pcos.tiny', 'k', 0), entry('k.q', 'question', 'pcos', 'pcos.tiny', 'k', 1)];
    const steps = buildSession({ index, progress: new Map(), options: opts({ scope: { kind: 'micro', microId: 'pcos.tiny' } }), now, seed: 7 });
    expect(steps.map((s) => s.itemId)).toEqual(['k.card']);
    for (let seed = 1; seed < 20; seed++) {
      assertQuestionsSpaced(buildSession({ index: corpus(), progress: new Map(), options: opts({ minutes: 15 }), now, seed }));
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

  it('gives priority macros (fertility) a larger share of new material', () => {
    let fert = 0;
    let total = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const steps = buildSession({ index: corpus(), progress: new Map(), options: opts({ minutes: 15 }), now, seed });
      fert += steps.filter((s) => s.microId.startsWith('fert')).length;
      total += steps.length;
    }
    expect(fert / total).toBeGreaterThan(1 / 3);
  });

  it('ARCH-011: "mistakes" means active mistakes; a failure later mastered is not one', () => {
    const index = corpus();
    const failed = index.find((e) => e.id === 'pcos.a.c1.q')!;
    const fixed = index.find((e) => e.id === 'pcos.a.c2.q')!;
    const recent = new Date('2026-10-10T10:00:00Z');
    const progress = new Map<string, ItemProgress>([
      [failed.id, applyRetrieval(newProgress(failed.id, 'question', failed.conceptId, recent), 'again', 1, recent, false)],
      [fixed.id, applyRetrieval(reviewed(fixed, 'again'), 'good', 1, recent, true)],
    ]);
    const steps = buildSession({ index, progress, options: opts({ scope: { kind: 'mistakes' } }), now, seed: 6 });
    expect(steps.map((s) => s.itemId)).toEqual([failed.id]);
  });

  it('ARCH-011: recent failures in relearning come before long overdue reviews', () => {
    const index = corpus();
    const progress = new Map(index.filter((e) => e.kind === 'card').slice(0, 20).map((e) => [e.id, graduated(e)] as const));
    const lapsed = index.find((e) => e.id === 'nutr.b.c3.q')!;
    const t = new Date(now.getTime() - 15 * 60_000);
    progress.set(lapsed.id, applyRetrieval(graduated(lapsed), 'again', 1, t, false));
    const steps = buildSession({ index, progress, options: opts({ minutes: 3, mode: 'review' }), now, seed: 8 });
    expect(steps[0]!.itemId).toBe(lapsed.id);
  });
});

describe('requeueAfterFailure', () => {
  const q: Step[] = ['a', 'b', 'c', 'd', 'e'].map((x) => ({ itemId: x, mode: 'learn', conceptId: x, microId: 'm' }));

  it('after a failed question, brings back the concept card later, not the same question', () => {
    const failed: Step = { itemId: 'qx', mode: 'question', conceptId: 'cx', microId: 'm' };
    const queue = [...q.slice(0, 2), failed, ...q.slice(2)];
    const out = requeueAfterFailure(queue, 2, failed, 'card-cx');
    expect(out.findIndex((s) => s.itemId === 'card-cx')).toBe(6);
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

describe('audit re-verification (ARCH-025/026)', () => {
  it('a prerequisite outside the clinical filter does not lock the filtered material', () => {
    orderSeq = 0;
    const index = [
      entry('base.card', 'card', 'horm', 'horm.base', 'b', 0),
      entry('diet.card', 'card', 'nutr', 'nutr.diet', 'd', 0, { prereqMicros: ['horm.base'], tags: ['diet'] }),
    ];
    const steps = buildSession({ index, progress: new Map(), options: opts({ filters: ['diet'] }), now, seed: 1 });
    expect(steps.map((s) => s.itemId)).toEqual(['diet.card']);
  });

  it('a micro already started stays open when a prerequisite is published later', () => {
    orderSeq = 0;
    const index = [
      entry('pre.card', 'card', 'horm', 'horm.pre', 'p', 0),
      entry('m.c1', 'card', 'fert', 'fert.m', 'k1', 0, { prereqMicros: ['horm.pre'] }),
      entry('m.c2', 'card', 'fert', 'fert.m', 'k2', 1, { prereqMicros: ['horm.pre'] }),
    ];
    const progress = new Map([['m.c1', applyExposure(newProgress('m.c1', 'card', 'k1', now), now)]]);
    const steps = buildSession({ index, progress, options: opts({ minutes: 10 }), now, seed: 2 });
    expect(steps.some((s) => s.itemId === 'm.c2')).toBe(true);
  });

  it('"mistakes" does not re-ask a question failed minutes ago', () => {
    const index = corpus();
    const q = index.find((e) => e.id === 'pcos.a.c1.q')!;
    const justNow = new Date(now.getTime() - 5_000);
    const progress = new Map([[q.id, applyRetrieval(graduated(q), 'again', 1, justNow, false)]]);
    expect(buildSession({ index, progress, options: opts({ scope: { kind: 'mistakes' } }), now, seed: 3 })).toEqual([]);
  });
});

describe('questions mode (multiple-choice practice)', () => {
  it('returns only questions, one per concept, random across topics', () => {
    const index = corpus();
    const steps = buildSession({ index, progress: new Map(), options: opts({ mode: 'questions', onlyStudied: false, minutes: 10 }), now, seed: 7 });
    expect(steps.length).toBe(12); // 10 min / 50 s
    expect(steps.every((s) => s.mode === 'question')).toBe(true);
    expect(new Set(steps.map((s) => s.conceptId)).size).toBe(steps.length);
    expect(new Set(steps.map((s) => s.microId)).size).toBeGreaterThan(2);
  });

  it('by default only asks about concepts already studied, due questions first', () => {
    const index = corpus();
    const card = index.find((e) => e.id === 'pcos.a.c1.card')!;
    const dueQ = index.find((e) => e.id === 'nutr.b.c2.q')!;
    const progress = new Map<string, ItemProgress>([
      [card.id, applyExposure(newProgress(card.id, 'card', card.conceptId, earlier), earlier)],
      [dueQ.id, reviewed(dueQ)],
    ]);
    const steps = buildSession({ index, progress, options: opts({ mode: 'questions' }), now, seed: 1 });
    expect(steps.map((s) => s.itemId)).toEqual(['nutr.b.c2.q', 'pcos.a.c1.q']);
  });
});
