/**
 * Safety net for answers that could not be written (IndexedDB connection lost,
 * quota, private mode). Pending answers are kept in localStorage — small and
 * synchronous — together with their session position, and are replayed through
 * the same guarded path as a normal answer (ARCH-024):
 *  - if the session still waits on that step, the answer is saved AND the session advances;
 *  - if the session already moved past that step, the slot belongs to whatever was
 *    saved there and the pending copy is discarded (never overwrites history);
 *  - answers outside a session are recorded idempotently.
 * The UI must not advance past a step whose answer is pending.
 */
import { z } from 'zod';
import { AttemptSchema } from './backup.ts';
import type { Attempt, DB } from './db.ts';
import { AttemptIdConflictError, recordAttempt } from './progressRepo.ts';
import { answerStep, SessionConflictError } from './sessionRepo.ts';

const KEY = 'tarjetalan:outbox';
const MAX = 1000;

const Entry = z.object({ attempt: AttemptSchema, position: z.number().int().min(0).nullable() });
export type OutboxEntry = z.infer<typeof Entry>;

function read(): OutboxEntry[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((e) => {
      const r = Entry.safeParse(e);
      return r.success ? [r.data] : [];
    });
  } catch {
    return [];
  }
}

function write(list: OutboxEntry[]): boolean {
  try {
    if (list.length === 0) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

/** Returns false when the safety net itself is unavailable or full (UI must say so). */
export function enqueue(attempt: Attempt, position: number | null): boolean {
  const list = read().filter((e) => e.attempt.id !== attempt.id);
  if (list.length >= MAX) return false;
  list.push({ attempt, position });
  return write(list);
}

export function pendingCount(): number {
  return read().length;
}

export function pendingFor(sessionId: string, position: number): Attempt | undefined {
  return read().find((e) => e.attempt.sessionId === sessionId && e.position === position)?.attempt;
}

/** Replays pending answers; returns how many were saved. Safe to call repeatedly. */
export async function flush(db: DB): Promise<number> {
  const list = read();
  let saved = 0;
  const remaining: OutboxEntry[] = [];
  for (const entry of list) {
    const { attempt, position } = entry;
    try {
      if (attempt.sessionId && position !== null) {
        const session = await db.get('sessions', attempt.sessionId);
        if (session && session.position === position && session.status !== 'done') {
          const { id: _id, sessionId: _s, ...event } = attempt;
          await answerStep(db, { sessionId: session.id, expectedRev: session.rev, attempt: event, now: new Date() });
          saved++;
          continue;
        }
        if (session && session.position > position) continue; // slot already answered: discard copy
      }
      await recordAttempt(db, attempt);
      saved++;
    } catch (err) {
      if (err instanceof AttemptIdConflictError || err instanceof SessionConflictError) continue;
      remaining.push(entry);
    }
  }
  write(remaining);
  return saved;
}
