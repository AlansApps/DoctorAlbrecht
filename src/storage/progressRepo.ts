/**
 * Learning data repository. Progress is a cache derived from the immutable
 * attempt log; it can always be rebuilt with `replay`.
 */
import { applyExposure, applyRetrieval, newProgress, suspend, type ItemProgress } from '../domain/scheduler/scheduler.ts';
import { notifyOtherTabs } from './channel.ts';
import type { Attempt, DB, ItemFlags } from './db.ts';

export function replay(itemId: string, attempts: Attempt[], flags?: ItemFlags): ItemProgress | undefined {
  const sorted = [...attempts].sort((a, b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id));
  const first = sorted[0];
  if (!first) return undefined;
  let p = newProgress(itemId, first.kind, first.conceptId, new Date(first.at));
  for (const a of sorted) p = step(p, a);
  if (flags?.suspended) p = suspend(p, new Date(flags.updatedAt));
  return p;
}

function step(p: ItemProgress, a: Attempt): ItemProgress {
  const at = new Date(a.at);
  return a.rating === null ? applyExposure(p, at) : applyRetrieval(p, a.rating, a.contentRev, at, a.correct);
}

/**
 * Record one attempt atomically and idempotently: a duplicate id is ignored.
 * The new state is computed inside the transaction from the stored state, so a
 * second tab can never overwrite newer progress with an older snapshot.
 */
export async function recordAttempt(db: DB, attempt: Attempt): Promise<ItemProgress> {
  const tx = db.transaction(['attempts', 'progress', 'flags'], 'readwrite');
  const [existing, stored, flags] = await Promise.all([
    tx.objectStore('attempts').get(attempt.id),
    tx.objectStore('progress').get(attempt.itemId),
    tx.objectStore('flags').get(attempt.itemId),
  ]);
  let result: ItemProgress;
  if (existing && stored) {
    result = stored;
  } else {
    const lastAt = stored ? (stored.lastReviewAt ?? stored.lastExposureAt ?? '') : '';
    if (stored && attempt.at < lastAt) {
      // Out-of-order event (e.g. merged from another tab with clock skew): rebuild from the log.
      const all = await tx.objectStore('attempts').index('byItem').getAll(attempt.itemId);
      result = replay(attempt.itemId, [...all, attempt], flags)!;
    } else {
      const base = stored ?? newProgress(attempt.itemId, attempt.kind, attempt.conceptId, new Date(attempt.at));
      result = step(base, attempt);
    }
    await Promise.all([tx.objectStore('attempts').put(attempt), tx.objectStore('progress').put(result)]);
  }
  await tx.done;
  notifyOtherTabs({ type: 'progress', itemIds: [attempt.itemId] });
  return result;
}

export async function loadAllProgress(db: DB): Promise<Map<string, ItemProgress>> {
  const all = await db.getAll('progress');
  return new Map(all.map((p) => [p.itemId, p]));
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

/** Rebuild the whole progress cache from the attempt log (after import/merge or migration). */
export async function rebuildProgress(db: DB): Promise<number> {
  const tx = db.transaction(['attempts', 'progress', 'flags'], 'readwrite');
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
  await tx.done;
  notifyOtherTabs({ type: 'progress', itemIds: [] });
  return byItem.size;
}
