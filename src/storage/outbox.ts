/**
 * Safety net for answers that could not be written (IndexedDB connection lost,
 * quota, private mode). Pending attempts are kept in localStorage — small and
 * synchronous — and replayed idempotently on the next successful connection.
 */
import type { Attempt, DB } from './db.ts';
import { recordAttempt } from './progressRepo.ts';

const KEY = 'tarjetalan:outbox';
const MAX = 200;

function read(): Attempt[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attempt[]) : [];
  } catch {
    return [];
  }
}

function write(list: Attempt[]): void {
  try {
    if (list.length === 0) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(list.slice(-MAX)));
  } catch {
    /* storage unavailable: nothing more we can do locally */
  }
}

export function enqueue(attempt: Attempt): void {
  const list = read().filter((a) => a.id !== attempt.id);
  list.push(attempt);
  write(list);
}

export function pendingCount(): number {
  return read().length;
}

/** Replays pending attempts; returns how many were saved. Safe to call repeatedly. */
export async function flush(db: DB): Promise<number> {
  const list = read();
  let saved = 0;
  const remaining: Attempt[] = [];
  for (const a of list) {
    try {
      await recordAttempt(db, a);
      saved++;
    } catch {
      remaining.push(a);
    }
  }
  write(remaining);
  return saved;
}
