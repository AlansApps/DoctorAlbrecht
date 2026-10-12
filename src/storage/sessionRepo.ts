/**
 * Study sessions: create, resume, answer and finish.
 *
 * `answer` records the attempt AND advances the session in ONE transaction,
 * guarded by the session `rev` (compare-and-swap). The attempt id is derived from
 * the session and step position, so retrying after a crash or from a second tab
 * never counts the same answer twice.
 */
import type { ItemProgress } from '../domain/scheduler/scheduler.ts';
import type { SessionOptions, Step } from '../domain/session/selector.ts';
import { notifyOtherTabs } from './channel.ts';
import type { Attempt, DB, StoredSession } from './db.ts';
import { applyAttemptInTx } from './progressRepo.ts';

/** The session moved on (another tab, a retry, or a finished session): reload and continue from `current`. */
export class SessionConflictError extends Error {
  readonly current: StoredSession;
  constructor(current: StoredSession) {
    super('Session changed in another tab');
    this.current = current;
  }
}

export function attemptIdFor(sessionId: string, position: number): string {
  return `${sessionId}:${position}`;
}

export async function createSession(
  db: DB,
  init: { id: string; options: SessionOptions; steps: Step[]; seed: number; contentVersion: string },
  now: Date,
): Promise<StoredSession> {
  const tx = db.transaction('sessions', 'readwrite');
  // Only one open session at a time: older ones are paused (kept for history/resume).
  for (const s of await tx.store.index('byStatus').getAll('active')) {
    await tx.store.put({ ...s, status: 'paused', rev: s.rev + 1, updatedAt: now.toISOString() });
  }
  const session: StoredSession = {
    ...init, position: 0, status: 'active', startedAt: now.toISOString(), updatedAt: now.toISOString(), rev: 0,
  };
  await tx.store.put(session);
  await tx.done;
  return session;
}

/** Most recent unfinished session (active or paused), for "Continue". */
export async function latestOpenSession(db: DB): Promise<StoredSession | undefined> {
  const all = await db.getAll('sessions');
  return all
    .filter((s) => s.status !== 'done' && s.position < s.steps.length)
    .sort((a, b) => Number(b.status === 'active') - Number(a.status === 'active') || Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
}

export interface AnswerInput {
  sessionId: string;
  expectedRev: number;
  /** Learning event for the current step (null for steps that record nothing, e.g. a skipped item). */
  attempt: Omit<Attempt, 'id' | 'sessionId'> | null;
  /** Queue after this step (e.g. with a consolidation step inserted). Defaults to unchanged. */
  steps?: Step[];
  now: Date;
}

export async function answerStep(db: DB, input: AnswerInput): Promise<{ session: StoredSession; progress?: ItemProgress }> {
  const tx = db.transaction(['sessions', 'attempts', 'progress', 'flags'], 'readwrite');
  const sessions = tx.objectStore('sessions');
  const current = await sessions.get(input.sessionId);
  if (!current) throw new Error(`Unknown session ${input.sessionId}`);
  const stepAtPosition = current.steps[current.position];
  const stale =
    current.rev !== input.expectedRev ||
    current.status === 'done' ||
    !stepAtPosition ||
    (input.attempt !== null && input.attempt.itemId !== stepAtPosition.itemId);
  if (stale) {
    tx.abort();
    await tx.done.catch(() => {});
    throw new SessionConflictError(current);
  }
  let progress: ItemProgress | undefined;
  if (input.attempt) {
    try {
      progress = await applyAttemptInTx(tx, {
        ...input.attempt,
        id: attemptIdFor(current.id, current.position),
        sessionId: current.id,
      });
    } catch (err) {
      tx.abort();
      await tx.done.catch(() => {});
      throw err;
    }
  }
  const steps = input.steps ?? current.steps;
  const position = current.position + 1;
  const session: StoredSession = {
    ...current,
    steps,
    position,
    // A paused session stays paused when answered in the background (outbox); never two actives.
    status: position >= steps.length ? 'done' : current.status,
    rev: current.rev + 1,
    updatedAt: input.now.toISOString(),
  };
  await sessions.put(session);
  await tx.done;
  notifyOtherTabs({ type: 'session', sessionId: session.id, rev: session.rev });
  if (input.attempt) notifyOtherTabs({ type: 'progress', itemIds: [input.attempt.itemId] });
  return progress ? { session, progress } : { session };
}

/** Make this the only active session (the one the UI is showing). */
export async function activateSession(db: DB, sessionId: string, now: Date): Promise<StoredSession | undefined> {
  const tx = db.transaction('sessions', 'readwrite');
  const target = await tx.store.get(sessionId);
  if (!target || target.status === 'done') {
    await tx.done;
    return target;
  }
  for (const s of await tx.store.index('byStatus').getAll('active')) {
    if (s.id !== sessionId) await tx.store.put({ ...s, status: 'paused', rev: s.rev + 1, updatedAt: now.toISOString() });
  }
  const next = target.status === 'active' ? target : { ...target, status: 'active' as const, rev: target.rev + 1, updatedAt: now.toISOString() };
  if (next !== target) await tx.store.put(next);
  await tx.done;
  return next;
}

export async function setSessionStatus(db: DB, sessionId: string, status: StoredSession['status'], now: Date): Promise<StoredSession | undefined> {
  const tx = db.transaction('sessions', 'readwrite');
  const s = await tx.store.get(sessionId);
  if (!s) return undefined;
  const next = { ...s, status, rev: s.rev + 1, updatedAt: now.toISOString() };
  await tx.store.put(next);
  await tx.done;
  notifyOtherTabs({ type: 'session', sessionId, rev: next.rev });
  return next;
}

export interface SessionSummary {
  read: number;
  recalled: number;
  forgotten: number;
  correct: number;
  incorrect: number;
}

/** Derived from the attempt log (single source of truth), not from counters. */
export async function summarizeSession(db: DB, sessionId: string): Promise<SessionSummary> {
  const attempts = await db.getAllFromIndex('attempts', 'bySession', sessionId);
  const s: SessionSummary = { read: 0, recalled: 0, forgotten: 0, correct: 0, incorrect: 0 };
  for (const a of attempts) {
    if (a.rating === null) s.read++;
    else if (a.kind === 'question') a.correct ? s.correct++ : s.incorrect++;
    else a.rating === 'again' ? s.forgotten++ : s.recalled++;
  }
  return s;
}
