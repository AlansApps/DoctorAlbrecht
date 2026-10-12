/**
 * Spaced repetition on top of FSRS (ts-fsrs). Pure functions: no I/O, `now` is injected.
 *
 * Learning cycle of a card (DECISIONS D-008):
 *   new → studied (read/listened: exposure only)
 *       → first recall due FIRST_RECALL_DELAY_MS after reading (reading never counts as success)
 *       → learning / review (FSRS) after the first self-rated recall.
 * Questions start the FSRS schedule on their first answer.
 */
import {
  createEmptyCard, fsrs, generatorParameters, GenSeedStrategyWithCardId, Rating, State, StrategyMode,
  type Card, type Grade,
} from 'ts-fsrs';
import { compareEvents } from './time.ts';

export type RecallRating = 'again' | 'hard' | 'good' | 'easy';
export type ItemKind = 'card' | 'question' | 'case';
export type ItemStatus = 'new' | 'studied' | 'learning' | 'review' | 'suspended';

/** Bump when scheduling logic changes: stored progress is then rebuilt from the attempt log. */
export const SCHEDULER_VERSION = 1;
export const FIRST_RECALL_DELAY_MS = 10 * 60_000;

/** FSRS card with dates serialized as ISO strings (IndexedDB/JSON friendly). */
export interface StoredFsrsCard {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: State;
  last_review?: string;
}

export interface ItemProgress {
  itemId: string;
  kind: ItemKind;
  conceptId: string;
  status: ItemStatus;
  /** null until the first retrieval: reading alone does not start the FSRS schedule. */
  fsrs: StoredFsrsCard | null;
  exposures: number;
  lastExposureAt?: string;
  retrievals: number;
  correct: number;
  lastReviewAt?: string;
  /** Result of the most recent retrieval (for "active mistakes"). */
  lastResult?: 'success' | 'fail';
  /** Latest event applied (exposure or retrieval), to detect out-of-order events. */
  lastEventAt: string;
  lastEventId: string;
  /** Material revision of the content at the last retrieval. */
  contentRev: number;
  /** Status to restore when un-suspending. */
  suspendedFrom?: Exclude<ItemStatus, 'suspended'>;
  updatedAt: string;
}

const engine = fsrs(
  generatorParameters({ request_retention: 0.9, maximum_interval: 365, enable_fuzz: true, enable_short_term: true }),
).useStrategy(StrategyMode.SEED, GenSeedStrategyWithCardId('item_id'));

const GRADE: Record<RecallRating, Grade> = { again: Rating.Again, hard: Rating.Hard, good: Rating.Good, easy: Rating.Easy };

/** Objective result → rating. Wrong = lapse; right but unsure = hard; right = good. */
export function ratingForAnswer(correct: boolean, unsure = false): RecallRating {
  if (!correct) return 'again';
  return unsure ? 'hard' : 'good';
}

type SeededCard = Card & { item_id: string };

function toStored(card: Card): StoredFsrsCard {
  const { due, last_review, stability, difficulty, elapsed_days, scheduled_days, learning_steps, reps, lapses, state } = card;
  return {
    due: due.toISOString(), stability, difficulty, elapsed_days, scheduled_days, learning_steps, reps, lapses, state,
    ...(last_review ? { last_review: last_review.toISOString() } : {}),
  };
}

function fromStored(s: StoredFsrsCard, itemId: string): SeededCard {
  const { due, last_review, ...rest } = s;
  return { ...rest, due: new Date(due), ...(last_review ? { last_review: new Date(last_review) } : {}), item_id: itemId };
}

export function newProgress(itemId: string, kind: ItemKind, conceptId: string, now: Date): ItemProgress {
  return {
    itemId, kind, conceptId, status: 'new', fsrs: null, exposures: 0, retrievals: 0, correct: 0,
    contentRev: 0, lastEventAt: '', lastEventId: '', updatedAt: now.toISOString(),
  };
}

function stamp(p: ItemProgress, now: Date, eventId: string): Pick<ItemProgress, 'lastEventAt' | 'lastEventId' | 'updatedAt'> {
  const at = now.toISOString();
  const later = compareEvents({ at, id: eventId }, { at: p.lastEventAt, id: p.lastEventId }) > 0;
  return later
    ? { lastEventAt: at, lastEventId: eventId, updatedAt: at }
    : { lastEventAt: p.lastEventAt, lastEventId: p.lastEventId, updatedAt: at };
}

export function applyExposure(p: ItemProgress, now: Date, eventId = ''): ItemProgress {
  const iso = now.toISOString();
  const next: ItemProgress = {
    ...p,
    ...stamp(p, now, eventId),
    exposures: p.exposures + 1,
    lastExposureAt: !p.lastExposureAt || p.lastExposureAt < iso ? iso : p.lastExposureAt,
  };
  if (p.status === 'new') return { ...next, status: 'studied' };
  if (p.status === 'suspended' && (p.suspendedFrom ?? 'new') === 'new') return { ...next, suspendedFrom: 'studied' };
  return next;
}

function statusFromState(state: State): 'learning' | 'review' {
  return state === State.Review ? 'review' : 'learning';
}

export function applyRetrieval(
  p: ItemProgress,
  rating: RecallRating,
  contentRev: number,
  now: Date,
  wasCorrect?: boolean,
  eventId = '',
): ItemProgress {
  const current: SeededCard = p.fsrs ? fromStored(p.fsrs, p.itemId) : { ...createEmptyCard(now), item_id: p.itemId };
  const { card } = engine.next(current, now, GRADE[rating]);
  const success = wasCorrect ?? rating !== 'again';
  const base: ItemProgress = {
    ...p,
    ...stamp(p, now, eventId),
    fsrs: toStored(card),
    retrievals: p.retrievals + 1,
    correct: p.correct + (success ? 1 : 0),
    lastResult: success ? 'success' : 'fail',
    lastReviewAt: now.toISOString(),
    contentRev,
  };
  return p.status === 'suspended'
    ? { ...base, suspendedFrom: statusFromState(card.state) }
    : { ...base, status: statusFromState(card.state) };
}

export function suspend(p: ItemProgress, now: Date): ItemProgress {
  if (p.status === 'suspended') return p;
  return { ...p, status: 'suspended', suspendedFrom: p.status, updatedAt: now.toISOString() };
}

export function unsuspend(p: ItemProgress, now: Date): ItemProgress {
  if (p.status !== 'suspended') return p;
  const { suspendedFrom, ...rest } = p;
  return { ...rest, status: suspendedFrom ?? 'new', updatedAt: now.toISOString() };
}

/**
 * When is the item due?
 * - studied card, never recalled: first recall FIRST_RECALL_DELAY_MS after the last reading;
 * - content changed materially since the last review: due now (history kept);
 * - otherwise the FSRS due date.
 */
export function dueAt(p: ItemProgress, currentRev: number): Date | null {
  if (p.status === 'suspended') return null;
  if (!p.fsrs) {
    if (p.kind === 'card' && p.status === 'studied' && p.lastExposureAt) {
      return new Date(new Date(p.lastExposureAt).getTime() + FIRST_RECALL_DELAY_MS);
    }
    return null;
  }
  if (currentRev > p.contentRev) return new Date(p.lastReviewAt ?? p.updatedAt);
  return new Date(p.fsrs.due);
}

/** Short-term (first recall or FSRS (re)learning steps): due to the minute. */
export function inShortTerm(p: ItemProgress): boolean {
  return !p.fsrs || p.fsrs.state === State.Learning || p.fsrs.state === State.Relearning;
}

/**
 * Due check with a local study-day cutoff: long-term reviews count as due for the
 * whole local study day (`dayEnd`), so a card reviewed at 22:00 with a 1-day
 * interval is due the next morning. Short-term steps stay exact to the minute.
 */
export function isDue(p: ItemProgress, currentRev: number, now: Date, dayEnd: Date = now): boolean {
  const d = dueAt(p, currentRev);
  if (d === null) return false;
  const limit = inShortTerm(p) ? now : dayEnd;
  return d.getTime() <= limit.getTime();
}
