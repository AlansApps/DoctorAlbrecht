/**
 * Starting and answering sessions: glue between the pure selector/scheduler and
 * the storage repositories. No React here, so it is testable and reusable.
 */
import type { IndexEntry, Manifest } from '../../domain/content/schema.ts';
import type { ItemProgress, RecallRating } from '../../domain/scheduler/scheduler.ts';
import { currentTimeZone, studyDayEnd } from '../../domain/scheduler/time.ts';
import { buildSession, requeueAfterFailure, type SessionOptions, type Step } from '../../domain/session/selector.ts';
import { withDb, type Attempt, type ItemFlags, type StoredSession } from '../../storage/db.ts';
import { enqueue } from '../../storage/outbox.ts';
import { answerStep, attemptIdFor, createSession, SessionConflictError } from '../../storage/sessionRepo.ts';

export interface StartInput {
  manifest: Manifest;
  index: IndexEntry[];
  progress: ReadonlyMap<string, ItemProgress>;
  flags: ReadonlyMap<string, ItemFlags>;
  options: SessionOptions;
  /** Items whose content can actually be loaded now (offline: downloaded packs only). */
  loadable?: (itemId: string) => boolean;
}

export async function startSession(input: StartInput): Promise<StoredSession | null> {
  const now = new Date();
  const suspended = new Set([...input.flags.values()].filter((f) => f.suspended).map((f) => f.itemId));
  const seed = Math.floor(Math.random() * 2 ** 31);
  let steps = buildSession({
    index: input.index,
    progress: input.progress,
    suspended,
    priorityMacros: input.manifest.macros.filter((m) => m.priority).map((m) => m.id),
    options: input.options,
    now,
    dayEnd: studyDayEnd(now, currentTimeZone()),
    seed,
  });
  if (input.loadable) steps = steps.filter((s) => input.loadable!(s.itemId));
  if (steps.length === 0) return null;
  return withDb((db) =>
    createSession(db, { id: crypto.randomUUID(), options: input.options, steps, seed, contentVersion: input.manifest.contentVersion }, now),
  );
}

export type StepOutcome =
  | { kind: 'exposure' }
  | { kind: 'recall'; rating: RecallRating }
  | { kind: 'answer'; correct: boolean; optionId: string; unsure: boolean }
  | { kind: 'skip' };

export type AnswerResult =
  | { status: 'saved'; session: StoredSession }
  | { status: 'conflict'; session: StoredSession }
  | { status: 'pending' };

function ratingFor(outcome: StepOutcome): RecallRating | null {
  switch (outcome.kind) {
    case 'exposure':
    case 'skip':
      return null;
    case 'recall':
      return outcome.rating;
    case 'answer':
      return !outcome.correct ? 'again' : outcome.unsure ? 'hard' : 'good';
  }
}

/**
 * Record the outcome of the current step and advance. On failure (e.g. Safari
 * dropped the IndexedDB connection) the answer is parked in the outbox and the
 * session does NOT advance; the caller shows a "pending" notice and retries.
 */
export async function answerCurrentStep(
  session: StoredSession, outcome: StepOutcome, index: ReadonlyMap<string, IndexEntry>,
): Promise<AnswerResult> {
  const step = session.steps[session.position];
  if (!step) return { status: 'conflict', session };
  const entry = index.get(step.itemId);
  const now = new Date();
  const rating = ratingFor(outcome);
  const failed = rating === 'again';

  let steps: Step[] = session.steps;
  if (failed && entry) {
    const card = [...index.values()].find((e) => e.kind === 'card' && e.conceptId === step.conceptId);
    steps = requeueAfterFailure(session.steps, session.position, step, card?.id);
  }

  const attempt: Omit<Attempt, 'id' | 'sessionId'> | null =
    outcome.kind === 'skip' || !entry
      ? null
      : {
          itemId: step.itemId,
          kind: entry.kind,
          conceptId: entry.conceptId,
          rating,
          contentRev: entry.rev,
          at: now.toISOString(),
          tz: currentTimeZone(),
          ...(outcome.kind === 'answer' ? { correct: outcome.correct, optionId: outcome.optionId } : {}),
        };

  try {
    const res = await withDb((db) => answerStep(db, { sessionId: session.id, expectedRev: session.rev, attempt, steps, now }));
    return { status: 'saved', session: res.session };
  } catch (err) {
    if (err instanceof SessionConflictError) return { status: 'conflict', session: err.current };
    if (attempt) enqueue({ ...attempt, id: attemptIdFor(session.id, session.position), sessionId: session.id }, session.position);
    return { status: 'pending' };
  }
}
