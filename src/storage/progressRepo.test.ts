import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { openDatabase, type Attempt } from './db.ts';
import { rebuildProgress, recordAttempt, replay, setFlags } from './progressRepo.ts';

let n = 0;
const freshDb = () => openDatabase(`test-${++n}`);
const at = (iso: string, id: string, rating: Attempt['rating'], extra: Partial<Attempt> = {}): Attempt => ({
  id, itemId: 'card-1', kind: 'card', conceptId: 'c1', rating, contentRev: 1, at: iso, tz: 'Europe/Madrid', ...extra,
});

describe('recordAttempt', () => {
  it('is idempotent: the same attempt id twice is counted once', async () => {
    const db = await freshDb();
    const a = at('2026-10-12T10:00:00Z', 'a1', 'good');
    await recordAttempt(db, a);
    const p = await recordAttempt(db, a);
    expect(p.retrievals).toBe(1);
    expect(await db.count('attempts')).toBe(1);
  });

  it('keeps exposure and retrieval apart', async () => {
    const db = await freshDb();
    const p = await recordAttempt(db, at('2026-10-12T10:00:00Z', 'e1', null));
    expect(p.status).toBe('studied');
    expect(p.fsrs).toBeNull();
  });

  it('an older event arriving late does not overwrite newer progress', async () => {
    const db = await freshDb();
    await recordAttempt(db, at('2026-10-12T10:00:00Z', 'a1', 'good'));
    await recordAttempt(db, at('2026-10-20T10:00:00Z', 'a3', 'good'));
    const late = await recordAttempt(db, at('2026-10-15T10:00:00Z', 'a2', 'again'));
    const all = await db.getAll('attempts');
    expect(late).toEqual(replay('card-1', all));
    expect(late.lastReviewAt).toBe('2026-10-20T10:00:00.000Z');
    expect(late.retrievals).toBe(3);
  });

  it('two tabs writing concurrently both land', async () => {
    const db1 = await freshDb();
    const name = `test-${n}`;
    const db2 = await openDatabase(name);
    await Promise.all([
      recordAttempt(db1, at('2026-10-12T10:00:00Z', 'x1', 'good')),
      recordAttempt(db2, at('2026-10-12T10:00:01Z', 'x2', 'again')),
    ]);
    const p = await db1.get('progress', 'card-1');
    expect(p!.retrievals).toBe(2);
  });
});

describe('flags and rebuild', () => {
  it('suspending keeps history; rebuilding from the log restores the same state', async () => {
    const db = await freshDb();
    await recordAttempt(db, at('2026-10-12T10:00:00Z', 'a1', 'good'));
    await setFlags(db, 'card-1', { suspended: true }, new Date('2026-10-13T10:00:00Z'));
    const before = await db.get('progress', 'card-1');
    expect(before!.status).toBe('suspended');
    await rebuildProgress(db);
    expect(await db.get('progress', 'card-1')).toEqual(before);
  });
});
