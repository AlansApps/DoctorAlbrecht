/**
 * Spaced repetition on top of FSRS (ts-fsrs). Pure functions: no I/O, `now` is injected.
 *
 * Exposure (reading or listening) and retrieval (self-rated recall or answering a
 * question) are kept apart: exposure never counts as a successful review.
 */
import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type Grade } from 'ts-fsrs';

export type RecallRating = 'again' | 'hard' | 'good' | 'easy';
export type ItemKind = 'card' | 'question' | 'case';
export type ItemStatus = 'new' | 'studied' | 'learning' | 'review' | 'suspended';

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
  /** null until the first retrieval: reading alone does not start the schedule. */
  fsrs: StoredFsrsCard | null;
  exposures: number;
  lastExposureAt?: string;
  retrievals: number;
  correct: number;
  lastReviewAt?: string;
  /** Material revision of the content at the last retrieval. */
  contentRev: number;
  /** Status to restore when un-suspending. */
  suspendedFrom?: Exclude<ItemStatus, 'suspended'>;
  updatedAt: string;
}

const params = generatorParameters({
  request_retention: 0.9,
  maximum_interval: 365,
  enable_fuzz: true,
  enable_short_term: true,
});
const engine = fsrs(params);

const GRADE: Record<RecallRating, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

/** Objective result → rating. A wrong answer is a lapse; a right one is a normal success. */
export function ratingForAnswer(correct: boolean): RecallRating {
  return correct ? 'good' : 'again';
}

function toStored(card: Card): StoredFsrsCard {
  const { due, last_review, ...rest } = card;
  return { ...rest, due: due.toISOString(), ...(last_review ? { last_review: last_review.toISOString() } : {}) };
}

function fromStored(s: StoredFsrsCard): Card {
  const { due, last_review, ...rest } = s;
  return { ...rest, due: new Date(due), ...(last_review ? { last_review: new Date(last_review) } : {}) };
}

export function newProgress(itemId: string, kind: ItemKind, conceptId: string, now: Date): ItemProgress {
  return {
    itemId, kind, conceptId, status: 'new', fsrs: null, exposures: 0, retrievals: 0, correct: 0,
    contentRev: 0, updatedAt: now.toISOString(),
  };
}

export function applyExposure(p: ItemProgress, now: Date): ItemProgress {
  return {
    ...p,
    status: p.status === 'new' ? 'studied' : p.status,
    exposures: p.exposures + 1,
    lastExposureAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

function statusFromState(state: State): Exclude<ItemStatus, 'suspended'> {
  return state === State.Review ? 'review' : 'learning';
}

export function applyRetrieval(
  p: ItemProgress,
  rating: RecallRating,
  contentRev: number,
  now: Date,
  wasCorrect?: boolean,
): ItemProgress {
  const current = p.fsrs ? fromStored(p.fsrs) : createEmptyCard(now);
  const { card } = engine.next(current, now, GRADE[rating]);
  const success = wasCorrect ?? rating !== 'again';
  const base: ItemProgress = {
    ...p,
    fsrs: toStored(card),
    retrievals: p.retrievals + 1,
    correct: p.correct + (success ? 1 : 0),
    lastReviewAt: now.toISOString(),
    contentRev,
    updatedAt: now.toISOString(),
  };
  // A suspended item keeps its suspension; the schedule still updates for when it is resumed.
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
 * When is the item due? Items whose content changed materially since the last
 * review are due immediately (history is kept, schedule is refreshed).
 */
export function dueAt(p: ItemProgress, currentRev: number): Date | null {
  if (!p.fsrs || p.status === 'suspended') return null;
  if (currentRev > p.contentRev) return new Date(p.lastReviewAt ?? p.updatedAt);
  return new Date(p.fsrs.due);
}

export function isDue(p: ItemProgress, currentRev: number, now: Date): boolean {
  const d = dueAt(p, currentRev);
  return d !== null && d.getTime() <= now.getTime();
}
