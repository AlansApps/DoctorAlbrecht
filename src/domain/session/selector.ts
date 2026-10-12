/**
 * Builds a finite study session (3/5/10/15 min) from the content index and local progress.
 * Pure and deterministic: `now` and `seed` are injected.
 */
import type { IndexEntry } from '../content/schema.ts';
import { isDue, type ItemProgress } from '../scheduler/scheduler.ts';

export type Minutes = 3 | 5 | 10 | 15;
export type ClinicalTag = IndexEntry['tags'][number];

export type Scope =
  | { kind: 'all' }
  | { kind: 'macro'; macroId: string; mix: boolean }
  | { kind: 'micro'; microId: string }
  | { kind: 'fertility' }
  | { kind: 'mistakes' };

export type SessionMode = 'balanced' | 'review' | 'new';

export interface SessionOptions {
  minutes: Minutes;
  scope: Scope;
  filters: ClinicalTag[];
  mode: SessionMode;
}

export type StepMode = 'learn' | 'review' | 'question';
export interface Step {
  itemId: string;
  mode: StepMode;
  conceptId: string;
  microId: string;
  /** Inserted during the session after a failure (consolidation step). */
  requeued?: true;
}

export const FERTILITY_MACRO = 'fert';

/** Approximate seconds per step; estimates are indicative only. */
export const STEP_SECONDS: Record<StepMode, number> = { learn: 75, review: 25, question: 50 };
const REVIEW_SHARE_BALANCED = 0.6;
const MAX_MICRO_SHARE = 0.4;

/** mulberry32: tiny seeded PRNG so sessions are reproducible in tests. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function inScope(e: IndexEntry, scope: Scope): boolean {
  switch (scope.kind) {
    case 'all':
    case 'mistakes':
      return true;
    case 'macro':
      return e.macroId === scope.macroId;
    case 'micro':
      return e.microId === scope.microId;
    case 'fertility':
      return e.macroId === FERTILITY_MACRO || e.tags.includes('reproduction');
  }
}

function passesFilters(e: IndexEntry, filters: ClinicalTag[]): boolean {
  return filters.length === 0 || e.tags.some((t) => filters.includes(t));
}

export interface SelectorInput {
  index: IndexEntry[];
  progress: ReadonlyMap<string, ItemProgress>;
  options: SessionOptions;
  now: Date;
  seed: number;
}

export function buildSession({ index, progress, options, now, seed }: SelectorInput): Step[] {
  const random = rng(seed);
  const budget = options.minutes * 60;
  const pool = index.filter((e) => e.kind !== 'case' && inScope(e, options.scope) && passesFilters(e, options.filters));

  // ---- Due reviews: most overdue first; in "mistakes" scope, only items with lapses.
  const due = pool
    .map((e) => ({ e, p: progress.get(e.id) }))
    .filter((x): x is { e: IndexEntry; p: ItemProgress } => !!x.p && isDue(x.p, x.e.rev, now))
    .filter((x) => options.scope.kind !== 'mistakes' || x.p.retrievals > x.p.correct)
    .sort((a, b) => overdue(b.p, now) - overdue(a.p, now));

  // ---- New material: never retrieved, in lesson order.
  const seenConcepts = new Set<string>();
  for (const p of progress.values()) if (p.kind === 'card' && p.status !== 'new') seenConcepts.add(p.conceptId);

  const fresh = options.scope.kind === 'mistakes' || options.mode === 'review' ? [] : pool
    .filter((e) => {
      const p = progress.get(e.id);
      return !p || (p.retrievals === 0 && p.status !== 'suspended');
    })
    .sort((a, b) => a.moduleId.localeCompare(b.moduleId) || a.lessonId.localeCompare(b.lessonId) || a.seq - b.seq);

  const reviewBudget =
    options.mode === 'review' ? budget : options.mode === 'new' ? 0 : fresh.length ? budget * REVIEW_SHARE_BALANCED : budget;

  const steps: Step[] = [];
  const usedConcepts = new Set<string>();
  const microCount = new Map<string, number>();
  let spent = 0;

  const microCapped = (microId: string) =>
    options.scope.kind === 'all' && steps.length >= 5 && (microCount.get(microId) ?? 0) / steps.length >= MAX_MICRO_SHARE;

  const push = (e: IndexEntry, mode: StepMode) => {
    steps.push({ itemId: e.id, mode, conceptId: e.conceptId, microId: e.microId });
    usedConcepts.add(e.conceptId);
    microCount.set(e.microId, (microCount.get(e.microId) ?? 0) + 1);
    spent += STEP_SECONDS[mode];
  };

  // Reviews: one item per concept per session (variants are not stacked).
  for (const { e } of due) {
    if (spent >= reviewBudget) break;
    if (usedConcepts.has(e.conceptId) || microCapped(e.microId)) continue;
    push(e, e.kind === 'question' ? 'question' : 'review');
  }

  // New: interleave sources; in "all", the fertility track gets priority.
  const queues = groupNew(fresh, options.scope);
  while (spent < budget && queues.size > 0) {
    const key = pickQueue(queues, options.scope, random);
    const q = queues.get(key)!;
    const e = q.shift()!;
    if (q.length === 0) queues.delete(key);
    if (spent + STEP_SECONDS[e.kind === 'question' ? 'question' : 'learn'] > budget + 30) continue;
    if (e.kind === 'question') {
      // A new question only after its concept has been read (earlier or in this session),
      // and never right after the card it tests.
      const conceptReady = seenConcepts.has(e.conceptId) || steps.some((s) => s.conceptId === e.conceptId && s.mode === 'learn');
      if (!conceptReady) continue;
      push(e, 'question');
    } else {
      if (usedConcepts.has(e.conceptId) && steps.some((s) => s.conceptId === e.conceptId && s.mode !== 'learn')) continue;
      push(e, 'learn');
    }
  }

  return spreadConcepts(steps);
}

function overdue(p: ItemProgress, now: Date): number {
  if (!p.fsrs) return 0;
  const interval = Math.max(p.fsrs.scheduled_days, 1);
  return (now.getTime() - new Date(p.fsrs.due).getTime()) / 86_400_000 / interval;
}

function groupNew(fresh: IndexEntry[], scope: Scope): Map<string, IndexEntry[]> {
  const key = (e: IndexEntry) =>
    scope.kind === 'macro' && !scope.mix ? 'seq' : scope.kind === 'micro' ? 'seq' : scope.kind === 'all' ? e.macroId : e.microId;
  const m = new Map<string, IndexEntry[]>();
  for (const e of fresh) {
    const k = key(e);
    const arr = m.get(k);
    if (arr) arr.push(e);
    else m.set(k, [e]);
  }
  return m;
}

function pickQueue(queues: Map<string, IndexEntry[]>, scope: Scope, random: () => number): string {
  const keys = [...queues.keys()];
  if (scope.kind === 'all' && queues.has(FERTILITY_MACRO) && random() < 0.4) return FERTILITY_MACRO;
  return keys[Math.floor(random() * keys.length)]!;
}

/**
 * Keep steps of the same concept apart (at least 2 steps in between) so that a
 * question never immediately follows the card it tests.
 */
function spreadConcepts(steps: Step[]): Step[] {
  const out: Step[] = [];
  const pending = [...steps];
  while (pending.length) {
    const idx = pending.findIndex((s) => !out.slice(-2).some((o) => o.conceptId === s.conceptId));
    const pick = idx === -1 ? 0 : idx;
    // Never move a question before the card that introduces its concept.
    const s = pending[pick]!;
    if (s.mode === 'question' && pending.slice(0, pick).some((p) => p.conceptId === s.conceptId && p.mode === 'learn')) {
      out.push(pending.splice(0, 1)[0]!);
      continue;
    }
    out.push(pending.splice(pick, 1)[0]!);
  }
  return out;
}

/**
 * After a failure inside a session, schedule a short consolidation later in the
 * same session: the concept's card (not the same question, to avoid answer recall),
 * at least `gap` steps ahead, at most once per concept.
 */
export function requeueAfterFailure(
  queue: Step[],
  position: number,
  failed: Step,
  conceptCardId: string | undefined,
  gap = 3,
): Step[] {
  const target = failed.mode === 'question' ? conceptCardId : failed.itemId;
  if (!target || failed.requeued) return queue; // consolidate once, never loop
  if (queue.some((s, i) => i !== position && s.itemId === target && s.requeued)) return queue;
  if (queue.slice(position + 1).some((s) => s.itemId === target)) return queue;
  const insertAt = Math.min(position + 1 + gap, queue.length);
  const step: Step = { itemId: target, mode: 'review', conceptId: failed.conceptId, microId: failed.microId, requeued: true };
  return [...queue.slice(0, insertAt), step, ...queue.slice(insertAt)];
}
