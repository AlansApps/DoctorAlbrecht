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
