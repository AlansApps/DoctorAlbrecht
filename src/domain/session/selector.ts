/**
 * Builds a finite study session (3/5/10/15 min) from the content index and local progress.
 * Pure and deterministic: `now`, `dayEnd` and `seed` are injected.
 *
 * Rules (spec 05, audit ARCH-001…014):
 * - due items first: short-term (first recall after reading, FSRS (re)learning) before long-term reviews;
 * - one item per concept per session (variants are not stacked);
 * - micro diversity is a preference, never a cut: capped micros are used when nothing else is left;
 * - new material follows curricular order and soft prerequisites; priority macros (fertility) get a boost;
 * - a new question only after its concept was read, and never within MIN_GAP steps of that card;
 * - suspended items never appear.
 */
import type { IndexEntry } from '../content/schema.ts';
import { dueAt, inShortTerm, isDue, type ItemProgress } from '../scheduler/scheduler.ts';

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
const BUDGET_TOLERANCE = 20;
const REVIEW_SHARE_BALANCED = 0.6;
const MAX_MICRO_SHARE = 0.4;
const PRIORITY_PICK = 0.4;
/** Minimum steps between a card and a question on the same concept. */
export const MIN_GAP = 2;
/** A failure counts as an "active mistake" for this long unless answered right since. */
const ACTIVE_MISTAKE_DAYS = 30;

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

export interface SelectorInput {
  index: IndexEntry[];
  progress: ReadonlyMap<string, ItemProgress>;
  /** Item ids suspended by the user (also those with no progress yet). */
  suspended?: ReadonlySet<string>;
  /** Macros that get priority in whole-programme sessions (from the manifest). */
  priorityMacros?: readonly string[];
  options: SessionOptions;
  now: Date;
  /** End of the local study day (see studyDayEnd). Defaults to `now`. */
  dayEnd?: Date;
  seed: number;
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

export function isActiveMistake(p: ItemProgress, now: Date): boolean {
  if (p.lastResult !== 'fail' || !p.lastReviewAt) return false;
  return now.getTime() - new Date(p.lastReviewAt).getTime() <= ACTIVE_MISTAKE_DAYS * 86_400_000;
}

export function buildSession(input: SelectorInput): Step[] {
  const { index, progress, options, now, seed } = input;
  const dayEnd = input.dayEnd ?? now;
  const suspended = input.suspended ?? new Set<string>();
  const priority = new Set(input.priorityMacros ?? [FERTILITY_MACRO]);
  const random = rng(seed);
  const budget = options.minutes * 60;
  const scope = options.scope;

  const pool = index.filter(
    (e) =>
      e.kind !== 'case' &&
      inScope(e, scope) &&
      (options.filters.length === 0 || e.tags.some((t) => options.filters.includes(t))) &&
      !suspended.has(e.id) &&
      progress.get(e.id)?.status !== 'suspended',
  );

  // ---- Candidates for retrieval
  type Due = { e: IndexEntry; p: ItemProgress };
  let due: Due[];
  if (scope.kind === 'mistakes') {
    due = pool
      .map((e) => ({ e, p: progress.get(e.id) }))
      .filter((x): x is Due => !!x.p && isActiveMistake(x.p, now))
      .sort((a, b) => (b.p.lastReviewAt ?? '').localeCompare(a.p.lastReviewAt ?? ''));
  } else {
    const all = pool
      .map((e) => ({ e, p: progress.get(e.id) }))
      .filter((x): x is Due => !!x.p && isDue(x.p, x.e.rev, now, dayEnd));
    const short = all.filter((x) => inShortTerm(x.p)).sort((a, b) => due0(a) - due0(b));
    const long = all.filter((x) => !inShortTerm(x.p)).sort((a, b) => overdue(b.p, b.e.rev, now) - overdue(a.p, a.e.rev, now));
    due = [...short, ...long];
  }

  // ---- New material: never seen, curricular order, soft prerequisites.
  const studiedMicros = new Set<string>();
  const seenConcepts = new Set<string>();
  for (const e of index) {
    const p = progress.get(e.id);
    if (p && p.status !== 'new' && (p.exposures > 0 || p.retrievals > 0)) {
      studiedMicros.add(e.microId);
      if (e.kind === 'card') seenConcepts.add(e.conceptId);
    }
  }
  const microsWithContent = new Set(index.map((e) => e.microId));
  const conceptsWithCard = new Set(index.filter((e) => e.kind === 'card').map((e) => e.conceptId));
  const enforcePrereqs = scope.kind === 'all' || scope.kind === 'fertility' || (scope.kind === 'macro' && scope.mix);
  const prereqsMet = (e: IndexEntry) =>
    !enforcePrereqs || e.prereqMicros.every((m) => studiedMicros.has(m) || !microsWithContent.has(m) || m === e.microId);

  const fresh =
    scope.kind === 'mistakes' || options.mode === 'review'
      ? []
      : pool
          .filter((e) => {
            const p = progress.get(e.id);
            return !p || p.status === 'new';
          })
          .filter(prereqsMet)
          .sort((a, b) => a.order - b.order);

  const reviewBudget = options.mode === 'review' ? budget : options.mode === 'new' ? 0 : fresh.length ? budget * REVIEW_SHARE_BALANCED : budget;

  const steps: Step[] = [];
  const usedConcepts = new Set<string>();
  const microCount = new Map<string, number>();
  let spent = 0;

  const fits = (mode: StepMode, limit: number) => spent + STEP_SECONDS[mode] <= limit + BUDGET_TOLERANCE;
  const overCap = (microId: string) =>
    scope.kind === 'all' && steps.length >= 4 && ((microCount.get(microId) ?? 0) + 1) / (steps.length + 1) > MAX_MICRO_SHARE;
  const push = (e: IndexEntry, mode: StepMode) => {
    steps.push({ itemId: e.id, mode, conceptId: e.conceptId, microId: e.microId });
    usedConcepts.add(e.conceptId);
    microCount.set(e.microId, (microCount.get(e.microId) ?? 0) + 1);
    spent += STEP_SECONDS[mode];
  };

  // Reviews: diversity pass, then a second pass without the cap (never truncate).
  const reviewMode = (e: IndexEntry): StepMode => (e.kind === 'question' ? 'question' : 'review');
  for (const pass of [true, false]) {
    for (const { e } of due) {
      if (steps.some((s) => s.itemId === e.id) || usedConcepts.has(e.conceptId)) continue;
      if (!fits(reviewMode(e), reviewBudget)) continue;
      if (pass && overCap(e.microId)) continue;
      push(e, reviewMode(e));
    }
  }

  // New material, interleaved by source; priority macros boosted in the whole programme.
  const queues = groupNew(fresh, scope);
  const deferred: IndexEntry[] = [];
  const tryNew = (e: IndexEntry, respectCap: boolean): boolean => {
    if (usedConcepts.has(e.conceptId) && e.kind === 'question' && steps.some((s) => s.conceptId === e.conceptId && s.mode === 'question')) return false;
    if (respectCap && overCap(e.microId)) return false;
    if (e.kind === 'question') {
      const readHere = steps.some((s) => s.conceptId === e.conceptId && s.mode === 'learn');
      const ready = seenConcepts.has(e.conceptId) || readHere || !conceptsWithCard.has(e.conceptId);
      if (!ready || !fits('question', budget)) return false;
      push(e, 'question');
      return true;
    }
    if (usedConcepts.has(e.conceptId) || !fits('learn', budget)) return false;
    push(e, 'learn');
    return true;
  };
  while (queues.size > 0 && spent < budget) {
    const key = pickQueue(queues, scope, priority, random);
    const q = queues.get(key)!;
    const e = q.shift()!;
    if (q.length === 0) queues.delete(key);
    if (!tryNew(e, true)) deferred.push(e);
  }
  for (const e of deferred) if (spent < budget) tryNew(e, false);

  return spreadConcepts(steps);
}

function due0(x: { e: IndexEntry; p: ItemProgress }): number {
  return dueAt(x.p, x.e.rev)?.getTime() ?? 0;
}

function overdue(p: ItemProgress, rev: number, now: Date): number {
  const d = dueAt(p, rev);
  if (!d) return 0;
  const interval = Math.max(p.fsrs?.scheduled_days ?? 1, 1);
  return (now.getTime() - d.getTime()) / 86_400_000 / interval;
}

function groupNew(fresh: IndexEntry[], scope: Scope): Map<string, IndexEntry[]> {
  const key = (e: IndexEntry) =>
    (scope.kind === 'macro' && !scope.mix) || scope.kind === 'micro' ? 'seq' : scope.kind === 'all' ? e.macroId : e.microId;
  const m = new Map<string, IndexEntry[]>();
  for (const e of fresh) {
    const k = key(e);
    const arr = m.get(k);
    if (arr) arr.push(e);
    else m.set(k, [e]);
  }
  return m;
}

function pickQueue(queues: Map<string, IndexEntry[]>, scope: Scope, priority: ReadonlySet<string>, random: () => number): string {
  const keys = [...queues.keys()];
  if (scope.kind === 'all') {
    const prio = keys.filter((k) => priority.has(k));
    if (prio.length && random() < PRIORITY_PICK) return prio[Math.floor(random() * prio.length)]!;
  }
  return keys[Math.floor(random() * keys.length)]!;
}

/**
 * Keep same-concept steps apart. A question that cannot be placed at least MIN_GAP
 * steps after the card of its concept is dropped (it will come in a later session),
 * so recognising the option never passes for understanding.
 */
function spreadConcepts(steps: Step[]): Step[] {
  const out: Step[] = [];
  const pending = [...steps];
  while (pending.length) {
    const recent = out.slice(-MIN_GAP);
    let idx = pending.findIndex((s) => {
      if (recent.some((o) => o.conceptId === s.conceptId)) return false;
      // a question never before the card that introduces its concept
      return !(s.mode === 'question' && pending.some((p) => p !== s && p.conceptId === s.conceptId && p.mode === 'learn'));
    });
    if (idx === -1) {
      // Nothing can be separated: keep cards/reviews, drop new questions that would be adjacent.
      idx = pending.findIndex((s) => s.mode !== 'question' && !(recent.at(-1)?.conceptId === s.conceptId));
      if (idx === -1) {
        const dropped = pending.findIndex((s) => s.mode === 'question');
        if (dropped !== -1) {
          pending.splice(dropped, 1);
          continue;
        }
        idx = 0;
      }
    }
    out.push(pending.splice(idx, 1)[0]!);
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
