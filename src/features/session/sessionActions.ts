/**
 * Starting and answering sessions: glue between the pure selector/scheduler and
 * the storage repositories. No React here, so it is testable and reusable.
 */
import type { IndexEntry, Manifest } from '../../domain/content/schema.ts';
import type { ItemProgress, RecallRating } from '../../domain/scheduler/scheduler.ts';
import { currentTimeZone, studyDayEnd } from '../../domain/scheduler/time.ts';
import { buildSession, requeueAfterFailure, type SessionOptions, type Step } from '../../domain/session/selector.ts';
import { downloadedPacks } from '../../storage/contentRepo.ts';
import { withDb, type Attempt, type ItemFlags, type StoredSession } from '../../storage/db.ts';
import { loadAllProgress, loadFlags } from '../../storage/progressRepo.ts';
import { enqueue } from '../../storage/outbox.ts';
import { answerStep, attemptIdFor, createSession, SessionConflictError } from '../../storage/sessionRepo.ts';

export interface PlanInput {
  manifest: Manifest;
  index: IndexEntry[];
  progress: ReadonlyMap<string, ItemProgress>;
  flags: ReadonlyMap<string, ItemFlags>;
  options: SessionOptions;
  /** Modules whose content can be loaded now; offline this is the downloaded packs only. */
  available?: ReadonlySet<string>;
  seed: number;
  now: Date;
}

/** Single place that turns state + options into steps (used by sessions and Listen). */
export function planSteps(input: PlanInput): Step[] {
  const index = input.available ? input.index.filter((e) => input.available!.has(e.moduleId)) : input.index;
  return buildSession({
    index,
    progress: input.progress,
    suspended: new Set([...input.flags.values()].filter((f) => f.suspended).map((f) => f.itemId)),
    priorityMacros: input.manifest.macros.filter((m) => m.priority).map((m) => m.id),
    options: input.options,
    now: input.now,
    dayEnd: studyDayEnd(input.now, currentTimeZone()),
    seed: input.seed,
  });
}

/** Fresh learning state + what can be loaded right now (ARCH-036/037). */
export async function currentPlanState(locale: 'es' | 'en', online: boolean) {
  return withDb(async (db) => {
    const [progress, flags] = await Promise.all([loadAllProgress(db), loadFlags(db)]);
    if (online) return { progress, flags };
    const available: ReadonlySet<string> = new Set((await downloadedPacks(db)).filter((p) => p.locale === locale).map((p) => p.moduleId));
    return { progress, flags, available };
  });
}

export async function startSession(input: { manifest: Manifest; index: IndexEntry[]; options: SessionOptions; locale: 'es' | 'en'; online: boolean }): Promise<StoredSession | null> {
  const now = new Date();
  const seed = Math.floor(Math.random() * 2 ** 31);
  const state = await currentPlanState(input.locale, input.online);
  const steps = planSteps({ ...input, ...state, seed, now });
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
    if (attempt) enqueue({ ...attempt, id: attemptIdFor(session.id, session.position), sessionId: session.id }, session.position, steps);
    return { status: 'pending' };
  }
}
