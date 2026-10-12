import 'fake-indexeddb/auto';
import { afterAll, describe, expect, it } from 'vitest';
import type { Step } from '../domain/session/selector.ts';
import { closeChannel } from './channel.ts';
import { openDatabase } from './db.ts';
import { answerStep, createSession, latestOpenSession, SessionConflictError, summarizeSession } from './sessionRepo.ts';

afterAll(closeChannel);
let n = 0;
const freshDb = () => openDatabase(`session-${++n}`);
const now = new Date('2026-10-12T10:00:00Z');
const steps: Step[] = [
  { itemId: 'c1', mode: 'learn', conceptId: 'k1', microId: 'm' },
  { itemId: 'q2', mode: 'question', conceptId: 'k2', microId: 'm' },
];
const init = { id: 's1', options: { minutes: 5 as const, scope: { kind: 'all' as const }, filters: [], mode: 'balanced' as const }, steps, seed: 1, contentVersion: 'v1' };
const read = { itemId: 'c1', kind: 'card' as const, conceptId: 'k1', rating: null, contentRev: 1, at: now.toISOString(), tz: 'Europe/Madrid' };

describe('sessions', () => {
  it('answer records the attempt and advances in one step; resume continues where it stopped', async () => {
    const db = await freshDb();
    const s = await createSession(db, init, now);
    const r = await answerStep(db, { sessionId: s.id, expectedRev: 0, attempt: read, now });
    expect(r.session.position).toBe(1);
    expect(r.progress!.status).toBe('studied');
    const resumed = await latestOpenSession(db);
    expect(resumed!.id).toBe('s1');
    expect(resumed!.steps[resumed!.position]!.itemId).toBe('q2');
  });

  it('ARCH-008: retrying a step after a crash or from a stale tab never double counts', async () => {
    const db = await freshDb();
    const s = await createSession(db, init, now);
    await answerStep(db, { sessionId: s.id, expectedRev: 0, attempt: read, now });
    await expect(answerStep(db, { sessionId: s.id, expectedRev: 0, attempt: read, now })).rejects.toBeInstanceOf(SessionConflictError);
    expect(await db.count('attempts')).toBe(1);
    expect((await db.get('sessions', 's1'))!.position).toBe(1);
  });

  it('finishing the last step marks the session done; summary derives from the log', async () => {
    const db = await freshDb();
    const s = await createSession(db, init, now);
    const a = await answerStep(db, { sessionId: s.id, expectedRev: 0, attempt: read, now });
    const q = { itemId: 'q2', kind: 'question' as const, conceptId: 'k2', rating: 'again' as const, correct: false, optionId: 'b', contentRev: 1, at: now.toISOString(), tz: 'UTC' };
    const b = await answerStep(db, { sessionId: s.id, expectedRev: a.session.rev, attempt: q, now });
    expect(b.session.status).toBe('done');
    expect(await latestOpenSession(db)).toBeUndefined();
    expect(await summarizeSession(db, 's1')).toEqual({ read: 1, recalled: 0, forgotten: 0, correct: 0, incorrect: 1 });
  });

  it('starting a new session pauses the previous open one', async () => {
    const db = await freshDb();
    await createSession(db, init, now);
    await createSession(db, { ...init, id: 's2' }, new Date(now.getTime() + 1000));
    expect((await db.get('sessions', 's1'))!.status).toBe('paused');
    expect((await latestOpenSession(db))!.id).toBe('s2');
  });
});

describe('ARCH-024: pending answers never overwrite another step', () => {
  it('rejects an answer for an item that is not the current step, and a finished session', async () => {
    const db = await freshDb();
    const s = await createSession(db, init, now);
    const wrong = { ...read, itemId: 'q2', kind: 'question' as const, conceptId: 'k2', rating: 'good' as const, correct: true };
    await expect(answerStep(db, { sessionId: s.id, expectedRev: 0, attempt: wrong, now })).rejects.toBeInstanceOf(SessionConflictError);
    expect(await db.count('attempts')).toBe(0);
  });

  it('outbox flush advances the session it belongs to, then later steps get their own ids', async () => {
    const { enqueue, flush, pendingCount } = await import('./outbox.ts');
    const db = await freshDb();
    const s = await createSession(db, init, now);
    // the DB failed while answering step 0: the UI parked it in the outbox and did NOT advance
    expect(enqueue({ ...read, id: 's1:0', sessionId: s.id }, 0)).toBe(true);
    expect(await flush(db)).toBe(1);
    expect(pendingCount()).toBe(0);
    const after = await db.get('sessions', 's1');
    expect(after!.position).toBe(1);
    const q = { itemId: 'q2', kind: 'question' as const, conceptId: 'k2', rating: 'good' as const, correct: true, contentRev: 1, at: now.toISOString(), tz: 'UTC' };
    await answerStep(db, { sessionId: s.id, expectedRev: after!.rev, attempt: q, now });
    expect((await db.getAllKeys('attempts')).sort()).toEqual(['s1:0', 's1:1']);
  });

  it('a stale pending copy for a slot already answered is discarded, not written over it', async () => {
    const { enqueue, flush } = await import('./outbox.ts');
    const db = await freshDb();
    const s = await createSession(db, init, now);
    await answerStep(db, { sessionId: s.id, expectedRev: 0, attempt: read, now });
    enqueue({ ...read, id: 's1:0', sessionId: s.id, at: new Date(now.getTime() + 5000).toISOString() }, 0);
    await flush(db);
    expect((await db.get('attempts', 's1:0'))!.at).toBe(now.toISOString());
  });
});
