import 'fake-indexeddb/auto';
import { afterAll, describe, expect, it } from 'vitest';
import { closeChannel } from './channel.ts';
import { openDatabase, type Attempt } from './db.ts';
import { exportBackup, importBackup, parseBackup, previewImport, restorePreImport } from './backup.ts';
import { recordAttempt, setFlags } from './progressRepo.ts';

afterAll(closeChannel);
let n = 0;
const freshDb = () => openDatabase(`backup-${++n}`);
const now = new Date('2026-10-12T10:00:00Z');
const att = (id: string, itemId: string, iso: string, rating: Attempt['rating'] = 'good'): Attempt => ({
  id, itemId, kind: 'card', conceptId: itemId, rating, contentRev: 1, at: iso, tz: 'UTC',
});

describe('backup', () => {
  it('round-trips through JSON and rejects foreign files', async () => {
    const db = await freshDb();
    await recordAttempt(db, att('a1', 'x', '2026-10-01T10:00:00Z'));
    const text = JSON.stringify(await exportBackup(db, '0.1.0', now));
    const parsed = parseBackup(text);
    expect(parsed.ok).toBe(true);
    expect(parseBackup('{"hello":1}')).toEqual({ ok: false, error: 'not-a-backup' });
    expect(parseBackup('nope')).toEqual({ ok: false, error: 'not-json' });
  });

  it('merge combines two devices without duplicates and rebuilds progress', async () => {
    const phone = await freshDb();
    const tablet = await freshDb();
    await recordAttempt(phone, att('p1', 'x', '2026-10-01T10:00:00Z'));
    await recordAttempt(phone, att('shared', 'y', '2026-10-02T10:00:00Z'));
    await recordAttempt(tablet, att('t1', 'x', '2026-10-03T10:00:00Z', 'again'));
    await recordAttempt(tablet, att('shared', 'y', '2026-10-02T10:00:00Z'));
    const b = parseBackup(JSON.stringify(await exportBackup(tablet, '0.1.0', now)));
    if (!b.ok) throw new Error('parse');
    const preview = await previewImport(phone, b.backup);
    expect(preview).toMatchObject({ attempts: 2, newAttempts: 1, duplicateAttempts: 1 });
    await importBackup(phone, b.backup, 'merge', '0.1.0', now);
    expect(await phone.count('attempts')).toBe(3);
    const x = await phone.get('progress', 'x');
    expect(x!.retrievals).toBe(2);
    expect(x!.lastResult).toBe('fail');
  });

  it('merge keeps the most recent flag', async () => {
    const a = await freshDb();
    const b = await freshDb();
    await setFlags(a, 'x', { favorite: true }, new Date('2026-10-05T00:00:00Z'));
    await setFlags(b, 'x', { favorite: false }, new Date('2026-10-01T00:00:00Z'));
    const bk = parseBackup(JSON.stringify(await exportBackup(b, '0.1.0', now)));
    if (!bk.ok) throw new Error('parse');
    await importBackup(a, bk.backup, 'merge', '0.1.0', now);
    expect((await a.get('flags', 'x'))!.favorite).toBe(true);
  });

  it('replace keeps a safety copy that can be restored', async () => {
    const db = await freshDb();
    await recordAttempt(db, att('mine', 'x', '2026-10-01T10:00:00Z'));
    const other = await freshDb();
    await recordAttempt(other, att('theirs', 'z', '2026-10-01T10:00:00Z'));
    const bk = parseBackup(JSON.stringify(await exportBackup(other, '0.1.0', now)));
    if (!bk.ok) throw new Error('parse');
    await importBackup(db, bk.backup, 'replace', '0.1.0', now);
    expect(await db.getAllKeys('attempts')).toEqual(['theirs']);
    expect(await restorePreImport(db, '0.1.0', now)).toBe(true);
    expect(await db.getAllKeys('attempts')).toEqual(['mine']);
  });
});

describe('ARCH-050: exported backups always re-import', () => {
  it('an attempt with an explicit undefined optional key still round-trips', async () => {
    const { openDatabase } = await import('./db.ts');
    const { exportBackup, parseBackup } = await import('./backup.ts');
    const db = await openDatabase('backup-arch050');
    await db.put('attempts', { id: 'a1', itemId: 'c1', kind: 'card', conceptId: 'k', rating: null, contentRev: 1, at: '2026-10-14T10:00:00.000Z', tz: 'UTC', sessionId: undefined } as never);
    const backup = await exportBackup(db, '0.1.0', new Date('2026-10-14T11:00:00Z'));
    expect(parseBackup(JSON.stringify(backup)).ok).toBe(true);
  });
});
