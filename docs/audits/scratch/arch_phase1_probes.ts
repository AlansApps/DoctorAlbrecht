// Throwaway audit probes (ARCH phase 1). Run: node docs/audits/scratch/arch_phase1_probes.ts
// Not part of the app or test suite.
import 'fake-indexeddb/auto';
import { z } from 'zod';
import type { IndexEntry } from '../../../src/domain/content/schema.ts';
import { AuthorReference } from '../../../src/domain/content/schema.ts';
import { applyExposure, applyRetrieval, newProgress, type ItemProgress } from '../../../src/domain/scheduler/scheduler.ts';
import { buildSession, type SessionOptions } from '../../../src/domain/session/selector.ts';
import { openDatabase, type Attempt } from '../../../src/storage/db.ts';
import { rebuildProgress, recordAttempt, setFlags } from '../../../src/storage/progressRepo.ts';

const log = (k: string, ok: boolean, detail: unknown) => console.log(`${ok ? 'BUG ' : 'ok  '} ${k}:`, JSON.stringify(detail));
const now = new Date('2026-10-12T10:00:00Z');
const opts = (o: Partial<SessionOptions> = {}): SessionOptions => ({ minutes: 5, scope: { kind: 'all' }, filters: [], mode: 'balanced', ...o });
const e = (id: string, kind: 'card' | 'question', macroId: string, microId: string, conceptId: string, seq: number, lessonId = `${microId}-l`): IndexEntry =>
  ({ id, kind, moduleId: `${macroId}-m`, lessonId, microId, macroId, conceptId, seq, rev: 1, tags: [] });

// A. Exposure-only card: re-served as "learn" forever, never enters review.
{
  const index = [e('c0.card', 'card', 'pcos', 'pcos.a', 'c0', 0), e('c1.card', 'card', 'pcos', 'pcos.a', 'c1', 1)];
  const prog = new Map<string, ItemProgress>([['c0.card', applyExposure(newProgress('c0.card', 'card', 'c0', now), now)]]);
  const later = new Date(now.getTime() + 30 * 86_400_000);
  const s = buildSession({ index, progress: prog, options: opts({ scope: { kind: 'micro', microId: 'pcos.a' } }), now: later, seed: 1 });
  const r = buildSession({ index, progress: prog, options: opts({ mode: 'review' }), now: later, seed: 1 });
  log('A studied card re-learned 30d later / never due', s[0]?.itemId === 'c0.card' && s[0]?.mode === 'learn' && r.length === 0, { first: s[0], reviewSession: r });
}

// B. Suspended never-retrieved item (flag only, no progress row) is still offered as new.
{
  const db = await openDatabase('probe-b');
  await setFlags(db, 'c0.card', { suspended: true }, now);
  const p = await db.get('progress', 'c0.card');
  const index = [e('c0.card', 'card', 'pcos', 'pcos.a', 'c0', 0)];
  const s = buildSession({ index, progress: new Map(), options: opts(), now, seed: 1 });
  log('B suspended (no progress) still selected', p === undefined && s.some((x) => x.itemId === 'c0.card'), { progressRow: p ?? null, steps: s.map((x) => x.itemId) });
}

// C. Equal timestamps: incremental cache != replay (rebuild changes state).
{
  const db = await openDatabase('probe-c');
  const base = { itemId: 'q1', kind: 'question' as const, conceptId: 'c', contentRev: 1, tz: 'Europe/Madrid' };
  await recordAttempt(db, { ...base, id: 'z', rating: 'easy', correct: true, at: '2026-10-12T10:00:00.000Z' });
  await recordAttempt(db, { ...base, id: 'a', rating: 'again', correct: false, at: '2026-10-12T10:00:00.000Z' });
  const inc = await db.get('progress', 'q1');
  await rebuildProgress(db);
  const reb = await db.get('progress', 'q1');
  log('C equal-ts incremental vs rebuild', inc!.fsrs!.due !== reb!.fsrs!.due, { incremental: inc!.fsrs!.due, rebuilt: reb!.fsrs!.due });
}

// D. Mixed ISO formats: late attempt not detected as out-of-order; string ordering wrong.
{
  const db = await openDatabase('probe-d');
  const base = { itemId: 'q2', kind: 'question' as const, conceptId: 'c', contentRev: 1, tz: 'Europe/Madrid' };
  await recordAttempt(db, { ...base, id: 'a1', rating: 'good', correct: true, at: '2026-10-20T10:00:00.500Z' });
  // earlier in time (10:00:00.000) but written without millis -> 'Z' > '.' lexicographically
  await recordAttempt(db, { ...base, id: 'a0', rating: 'again', correct: false, at: '2026-10-20T10:00:00Z' });
  const inc = await db.get('progress', 'q2');
  // and with offset notation
  const db2 = await openDatabase('probe-d2');
  await recordAttempt(db2, { ...base, id: 'b1', rating: 'good', correct: true, at: '2026-10-20T10:00:00.000Z' });
  await recordAttempt(db2, { ...base, id: 'b0', rating: 'again', correct: false, at: '2026-10-20T11:30:00.000+02:00' }); // = 09:30Z, earlier
  const inc2 = await db2.get('progress', 'q2');
  log('D non-normalized `at` breaks ordering', inc!.lastReviewAt === '2026-10-20T10:00:00.000Z' || inc2!.lastReviewAt !== '2026-10-20T10:00:00.000Z',
    { lastReviewAt_millisCase: inc!.lastReviewAt, lastReviewAt_offsetCase: inc2!.lastReviewAt });
}

// E. Per-micro cap (40%) not applied to new material in "all".
{
  const index: IndexEntry[] = [];
  for (const macro of ['fert', 'pcos', 'nutr'])
    for (const micro of ['a', 'b'])
      for (let c = 0; c < 6; c++) index.push(e(`${macro}.${micro}.${c}`, 'card', macro, `${macro}.${micro}`, `${macro}.${micro}.${c}`, c));
  let worst = 0;
  for (let seed = 1; seed <= 50; seed++) {
    const s = buildSession({ index, progress: new Map(), options: opts({ minutes: 15 }), now, seed });
    const counts = new Map<string, number>();
    for (const x of s) counts.set(x.microId, (counts.get(x.microId) ?? 0) + 1);
    worst = Math.max(worst, Math.max(...counts.values()) / s.length);
  }
  log('E max single-micro share in "all" (cap 0.4)', worst > 0.4, { worstShare: worst.toFixed(2) });
}

// F. New-material order uses alphabetical lessonId, not authored lesson order.
{
  const index = [
    e('intro.card', 'card', 'pcos', 'pcos.a', 'k1', 0, 'pcos-intro'), // authored first
    e('amh.card', 'card', 'pcos', 'pcos.a', 'k2', 1, 'pcos-amh'), // authored second
  ];
  const s = buildSession({ index, progress: new Map(), options: opts({ scope: { kind: 'micro', microId: 'pcos.a' } }), now, seed: 1 });
  log('F lesson order alphabetical', s[0]?.itemId === 'amh.card', s.map((x) => x.itemId));
}

// G. Micro with a single concept: question right after the card it tests.
{
  const index = [e('k.card', 'card', 'pcos', 'pcos.z', 'k', 0), e('k.q', 'question', 'pcos', 'pcos.z', 'k', 1)];
  const s = buildSession({ index, progress: new Map(), options: opts({ scope: { kind: 'micro', microId: 'pcos.z' } }), now, seed: 1 });
  log('G question immediately after its card', s.length === 2 && s[1]!.conceptId === s[0]!.conceptId, s.map((x) => `${x.itemId}:${x.mode}`));
}

// H. Rev-bumped items are "due" but ranked last (negative overdue) -> can starve under debt.
{
  const index: IndexEntry[] = [];
  const prog = new Map<string, ItemProgress>();
  const past = new Date('2026-09-01T10:00:00Z');
  for (let i = 0; i < 30; i++) {
    const it = e(`d${i}`, 'card', 'pcos', 'pcos.a', `d${i}`, i);
    index.push(it);
    prog.set(it.id, applyRetrieval(newProgress(it.id, 'card', it.conceptId, past), 'good', 1, past));
  }
  const bumped = { ...e('rev', 'card', 'pcos', 'pcos.b', 'rev', 0), rev: 2 };
  index.push(bumped);
  prog.set('rev', applyRetrieval(newProgress('rev', 'card', 'rev', new Date('2026-10-11T10:00:00Z')), 'easy', 1, new Date('2026-10-11T10:00:00Z')));
  const s = buildSession({ index, progress: prog, options: opts({ mode: 'review', minutes: 3 }), now, seed: 1 });
  log('H revised item starved by review debt', !s.some((x) => x.itemId === 'rev'), { steps: s.length });
}

// I. Reference URL accepts javascript: scheme.
{
  const r = AuthorReference.shape.url.safeParse('javascript:alert(1)');
  log('I z.url accepts javascript:', r.success, { success: r.success });
  void z;
}

// J. Mistakes scope: item failed once then mastered stays a "mistake" forever; freshly failed (not yet due) absent.
{
  const index = [e('q.a', 'question', 'pcos', 'pcos.a', 'a', 0), e('q.b', 'question', 'pcos', 'pcos.a', 'b', 1)];
  let pa = newProgress('q.a', 'question', 'a', now);
  pa = applyRetrieval(pa, 'again', 1, new Date('2026-01-01T10:00:00Z'), false);
  let t = new Date('2026-01-01T10:10:00Z');
  for (let i = 0; i < 6; i++) { pa = applyRetrieval(pa, 'good', 1, t, true); t = new Date(pa.fsrs!.due); }
  const pb = applyRetrieval(newProgress('q.b', 'question', 'b', now), 'again', 1, new Date(now.getTime() - 60_000), false);
  const at = new Date(Math.max(t.getTime(), now.getTime()));
  const s = buildSession({ index, progress: new Map([['q.a', pa], ['q.b', pb]]), options: opts({ scope: { kind: 'mistakes' } }), now: at, seed: 1 });
  log('J mistakes semantics', true, { selected: s.map((x) => x.itemId), qbDue: pb.fsrs!.due, at: at.toISOString() });
}

// K. Same seed -> identical fuzz for items reviewed at same ms with same state (clumping).
{
  const p1 = applyRetrieval(newProgress('x', 'card', 'x', now), 'good', 1, now);
  const p2 = applyRetrieval(newProgress('y', 'card', 'y', now), 'good', 1, now);
  let a = p1, b = p2, tt = now;
  for (let i = 0; i < 5; i++) { a = applyRetrieval(a, 'good', 1, tt); b = applyRetrieval(b, 'good', 1, tt); tt = new Date(a.fsrs!.due); }
  log('K fuzz not per-item (clumping)', a.fsrs!.due === b.fsrs!.due, { a: a.fsrs!.due, b: b.fsrs!.due });
}
const _unused: Attempt | undefined = undefined; void _unused;
