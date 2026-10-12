/**
 * Learning data repository. Progress is a cache derived from the immutable
 * attempt log; it can always be rebuilt with `replay`. One event ordering
 * (`compareEvents`) is shared by the incremental path and the replay so both
 * always agree.
 */
import {
  applyExposure, applyRetrieval, newProgress, SCHEDULER_VERSION, suspend, type ItemProgress,
} from '../domain/scheduler/scheduler.ts';
import { compareEvents, normalizeIso } from '../domain/scheduler/time.ts';
import { notifyOtherTabs } from './channel.ts';
import { getMeta, setMeta, type Attempt, type DB, type ItemFlags, type LearningTx } from './db.ts';

export function normalizeAttempt(a: Attempt): Attempt {
  return { ...a, at: normalizeIso(a.at) };
}

function step(p: ItemProgress, a: Attempt): ItemProgress {
  const at = new Date(a.at);
  return a.rating === null ? applyExposure(p, at, a.id) : applyRetrieval(p, a.rating, a.contentRev, at, a.correct, a.id);
}

/** An attempt id is already used by a different learning event: never overwrite it. */
export class AttemptIdConflictError extends Error {
  readonly attemptId: string;
  constructor(attemptId: string) {
    super(`Attempt id ${attemptId} already belongs to another item`);
    this.attemptId = attemptId;
  }
}

/** Suspension applied identically by the incremental path and the replay (ARCH-027). */
function withFlags(p: ItemProgress, flags: ItemFlags | undefined): ItemProgress {
  if (!flags?.suspended) return p;
  const s = p.status === 'suspended' ? p : suspend(p, new Date(flags.updatedAt));
  const updatedAt = s.lastEventAt && s.lastEventAt > flags.updatedAt ? s.lastEventAt : flags.updatedAt;
  return { ...s, updatedAt };
}

export function replay(itemId: string, attempts: Attempt[], flags?: ItemFlags): ItemProgress | undefined {
  const sorted = [...attempts].sort(compareEvents);
  const first = sorted[0];
  if (!first) return undefined;
  let p = newProgress(itemId, first.kind, first.conceptId, new Date(first.at));
  for (const a of sorted) p = step(p, a);
  return withFlags(p, flags);
}

function sameEvent(a: Attempt, b: Attempt): boolean {
  return a.itemId === b.itemId && a.rating === b.rating && a.at === b.at && a.correct === b.correct;
}

/**
 * Apply one attempt inside an existing transaction over attempts/progress/flags.
 * Idempotent: the same event twice is a no-op; a *different* event under an id
 * that is already used throws instead of overwriting history (ARCH-024).
 * In-order events are applied incrementally; anything at or before the last
 * applied event triggers a replay from the log.
 */
export async function applyAttemptInTx(tx: LearningTx, raw: Attempt): Promise<ItemProgress> {
  const attempt = normalizeAttempt(raw);
  const attempts = tx.objectStore('attempts');
  const progress = tx.objectStore('progress');
  const [existing, stored, flags] = await Promise.all([
    attempts.get(attempt.id),
    progress.get(attempt.itemId),
    tx.objectStore('flags').get(attempt.itemId),
  ]);
  if (existing) {
    if (existing.itemId !== attempt.itemId) throw new AttemptIdConflictError(attempt.id);
    if (stored) return stored;
  }
  if (existing && !sameEvent(existing, attempt)) throw new AttemptIdConflictError(attempt.id);

  let result: ItemProgress;
  const inOrder = !stored || compareEvents(attempt, { at: stored.lastEventAt, id: stored.lastEventId }) > 0;
  if (inOrder) {
    const base = stored ?? newProgress(attempt.itemId, attempt.kind, attempt.conceptId, new Date(attempt.at));
    result = withFlags(step(base, attempt), flags);
  } else {
    const all = await attempts.index('byItem').getAll(attempt.itemId);
    result = replay(attempt.itemId, [...all.filter((a) => a.id !== attempt.id), attempt], flags)!;
  }
  await Promise.all([attempts.put(attempt), progress.put(result)]);
  return result;
}

/** Record one attempt atomically and idempotently. */
export async function recordAttempt(db: DB, attempt: Attempt): Promise<ItemProgress> {
  const tx = db.transaction(['attempts', 'progress', 'flags'], 'readwrite');
  const result = await applyAttemptInTx(tx, attempt);
  await tx.done;
  notifyOtherTabs({ type: 'progress', itemIds: [attempt.itemId] });
  return result;
}

export async function loadAllProgress(db: DB): Promise<Map<string, ItemProgress>> {
  const all = await db.getAll('progress');
  return new Map(all.map((p) => [p.itemId, p]));
}

export async function loadFlags(db: DB): Promise<Map<string, ItemFlags>> {
  const all = await db.getAll('flags');
  return new Map(all.map((f) => [f.itemId, f]));
}

export async function setFlags(db: DB, itemId: string, patch: Partial<Pick<ItemFlags, 'favorite' | 'suspended'>>, now: Date): Promise<ItemFlags> {
  const tx = db.transaction(['flags', 'attempts', 'progress'], 'readwrite');
  const current = (await tx.objectStore('flags').get(itemId)) ?? { itemId, favorite: false, suspended: false, updatedAt: now.toISOString() };
  const next: ItemFlags = { ...current, ...patch, updatedAt: now.toISOString() };
  await tx.objectStore('flags').put(next);
  if (patch.suspended !== undefined) {
    const attempts = await tx.objectStore('attempts').index('byItem').getAll(itemId);
    const p = replay(itemId, attempts, next);
    if (p) await tx.objectStore('progress').put(p);
  }
  await tx.done;
  notifyOtherTabs({ type: 'progress', itemIds: [itemId] });
  return next;
}

/** Rebuild the whole progress cache from the attempt log (after import/merge or a scheduler change). */
export async function rebuildProgress(db: DB): Promise<number> {
  const tx = db.transaction(['attempts', 'progress', 'flags', 'meta'], 'readwrite');
  const [attempts, flags] = await Promise.all([tx.objectStore('attempts').getAll(), tx.objectStore('flags').getAll()]);
  const byItem = new Map<string, Attempt[]>();
  for (const a of attempts) {
    const arr = byItem.get(a.itemId);
    if (arr) arr.push(a);
    else byItem.set(a.itemId, [a]);
  }
  const flagMap = new Map(flags.map((f) => [f.itemId, f]));
  await tx.objectStore('progress').clear();
  for (const [itemId, list] of byItem) {
    const p = replay(itemId, list, flagMap.get(itemId));
    if (p) await tx.objectStore('progress').put(p);
  }
  await tx.objectStore('meta').put({ key: 'schedulerVersion', value: SCHEDULER_VERSION });
  await tx.done;
  notifyOtherTabs({ type: 'progress-all' });
  return byItem.size;
}

/** On startup: if the scheduling logic changed since progress was computed, rebuild it from the log. */
export async function ensureSchedulerVersion(db: DB): Promise<boolean> {
  const stored = await getMeta<number>(db, 'schedulerVersion');
  if (stored === SCHEDULER_VERSION) return false;
  if ((await db.count('attempts')) === 0) {
    await setMeta(db, 'schedulerVersion', SCHEDULER_VERSION);
    return false;
  }
  await rebuildProgress(db);
  return true;
}
