import 'fake-indexeddb/auto';
import { afterAll, describe, expect, it } from 'vitest';
import { closeChannel } from './channel.ts';
import { getDb, withDb } from './db.ts';

afterAll(closeChannel);

describe('connection lifecycle (ARCH-003)', () => {
  it('reopens and retries once when the connection was closed underneath (e.g. iOS backgrounding)', async () => {
    const db = await getDb();
    await db.put('meta', { key: 'k', value: 1 });
    db.close(); // simulate WebKit terminating the connection
    const value = await withDb(async (d) => (await d.get('meta', 'k'))?.value);
    expect(value).toBe(1);
  });
});
