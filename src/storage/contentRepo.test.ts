import 'fake-indexeddb/auto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildContent } from '../../scripts/build-content.ts';
import type { Manifest } from '../domain/content/schema.ts';
import { closeChannel } from './channel.ts';
import { openDatabase } from './db.ts';
import { clearDownloads, ContentError, ensurePack, evictPacks, loadManifest, type Fetcher } from './contentRepo.ts';

afterAll(closeChannel);
let n = 0;
const freshDb = () => openDatabase(`content-${++n}`);
const now = new Date('2026-10-12T10:00:00Z');
const load = (p: string) => JSON.parse(readFileSync(p, 'utf8'));

let files: Map<string, string>;
let manifest: Manifest;
beforeAll(() => {
  const res = buildContent({
    curriculum: load('content/curriculum.json'),
    references: load('content/references.json'),
    modules: [{ name: 'fert', data: load('content/modules/fert-ovarian-reserve.json') }],
  }, true, 'x');
  manifest = res.manifest!;
  files = new Map([['content/manifest.json', JSON.stringify(manifest)], ...res.packs.map((p) => [`content/${p.file}`, p.json] as const)]);
});

const serve = (overrides: Record<string, string> = {}): Fetcher => async (url) => {
  const path = url.replace('/base/', '');
  const body = overrides[path] ?? files.get(path);
  return body === undefined ? new Response('nf', { status: 404 }) : new Response(body, { status: 200 });
};
const offline: Fetcher = async () => {
  throw new TypeError('Failed to fetch');
};

describe('content repository', () => {
  it('downloads, verifies and caches a pack; works offline afterwards', async () => {
    const db = await freshDb();
    const m = await loadManifest(db, '/base/', serve());
    expect(m!.fresh).toBe(true);
    const pack = await ensurePack(db, m!.manifest, 'fert-ovarian-reserve', 'es', '/base/', now, serve());
    expect(pack.items.length).toBeGreaterThan(0);
    const offM = await loadManifest(db, '/base/', offline);
    expect(offM!.fresh).toBe(false);
    const again = await ensurePack(db, offM!.manifest, 'fert-ovarian-reserve', 'es', '/base/', now, offline);
    expect(again.hash).toBe(pack.hash);
  });

  it('rejects a tampered pack (hash mismatch) and does not store it', async () => {
    const db = await freshDb();
    const entry = manifest.modules[0]!.packs.es;
    const tampered = files.get(`content/${entry.file}`)!.replace('AMH', 'XMH');
    await expect(
      ensurePack(db, manifest, 'fert-ovarian-reserve', 'es', '/base/', now, serve({ [`content/${entry.file}`]: tampered })),
    ).rejects.toMatchObject({ code: 'integrity' });
    expect(await db.count('packs')).toBe(0);
  });

  it('offline without a stored copy reports "requires connection"', async () => {
    const db = await freshDb();
    await expect(ensurePack(db, manifest, 'fert-ovarian-reserve', 'en', '/base/', now, offline)).rejects.toBeInstanceOf(ContentError);
  });

  it('LRU eviction and "clear downloads" never touch learning data', async () => {
    const db = await freshDb();
    await db.put('attempts', { id: 'a', itemId: 'x', kind: 'card', conceptId: 'x', rating: 'good', contentRev: 1, at: now.toISOString(), tz: 'UTC' });
    await ensurePack(db, manifest, 'fert-ovarian-reserve', 'es', '/base/', new Date('2026-10-01T00:00:00Z'), serve());
    await ensurePack(db, manifest, 'fert-ovarian-reserve', 'en', '/base/', now, serve());
    expect(await evictPacks(db, 30_000)).toBe(1);
    expect(await db.getAllKeys('packs')).toEqual(['fert-ovarian-reserve:en']);
    await clearDownloads(db);
    expect(await db.count('packs')).toBe(0);
    expect(await db.count('attempts')).toBe(1);
  });
});
