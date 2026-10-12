/**
 * Content packs and manifest, stored in IndexedDB (the service worker does not
 * cache `content/`, so nothing is stored twice).
 *
 * Download pipeline: fetch → SHA-256 check against the manifest → schema
 * validation → atomic put → available. Eviction (LRU) only ever touches packs,
 * never learning data.
 */
import { Manifest, Pack, type Locale } from '../domain/content/schema.ts';
import { notifyOtherTabs } from './channel.ts';
import { getMeta, setMeta, type DB, type StoredPack } from './db.ts';

export type ContentErrorCode = 'offline' | 'integrity' | 'invalid' | 'quota' | 'http';
export class ContentError extends Error {
  readonly code: ContentErrorCode;
  constructor(code: ContentErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Latest manifest: network first (fresh), stored copy as a safe fallback. */
export async function loadManifest(db: DB, baseUrl: string, fetcher: Fetcher = fetch): Promise<{ manifest: Manifest; fresh: boolean } | null> {
  try {
    const res = await fetcher(`${baseUrl}content/manifest.json`, { cache: 'no-cache' });
    if (!res.ok) throw new ContentError('http', `manifest ${res.status}`);
    const manifest = Manifest.parse(await res.json());
    await setMeta(db, 'manifest', manifest);
    return { manifest, fresh: true };
  } catch {
    const stored = await getMeta<unknown>(db, 'manifest');
    const parsed = Manifest.safeParse(stored);
    return parsed.success ? { manifest: parsed.data, fresh: false } : null;
  }
}

const key = (moduleId: string, locale: Locale) => `${moduleId}:${locale}`;

/** Returns a validated pack, downloading it if missing or outdated. */
export async function ensurePack(
  db: DB, manifest: Manifest, moduleId: string, locale: Locale, baseUrl: string, now: Date, fetcher: Fetcher = fetch,
): Promise<Pack> {
  const entry = manifest.modules.find((m) => m.id === moduleId)?.packs[locale];
  if (!entry) throw new ContentError('invalid', `No pack for ${moduleId}/${locale}`);
  const stored = await db.get('packs', key(moduleId, locale));
  // Stored packs were fully validated before being saved; a cheap shape check catches corruption.
  if (stored && stored.hash === entry.hash && looksLikePack(stored.data, moduleId, locale)) {
    await db.put('packs', { ...stored, lastUsedAt: now.toISOString() });
    return stored.data;
  }

  let text: string;
  try {
    const res = await fetcher(`${baseUrl}content/${entry.file}`);
    if (!res.ok) throw new ContentError('http', `${entry.file}: HTTP ${res.status}`);
    text = await res.text();
  } catch (err) {
    if (err instanceof ContentError) throw err;
    // Stale but valid copy is better than nothing while offline.
    if (stored && looksLikePack(stored.data, moduleId, locale)) return stored.data;
    throw new ContentError('offline', `${moduleId} requires a connection`);
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ContentError('invalid', `${entry.file}: corrupt JSON`);
  }
  const parsed = Pack.safeParse(json);
  if (!parsed.success) throw new ContentError('invalid', `${entry.file}: invalid pack`);
  const hash = parsed.data.hash;
  const computed = (await sha256Hex(JSON.stringify(stripHash(json)))).slice(0, hash.length);
  if (hash !== entry.hash || computed !== entry.hash) throw new ContentError('integrity', `${entry.file}: hash mismatch`);

  const record: StoredPack = {
    key: key(moduleId, locale), moduleId, locale, hash, bytes: new TextEncoder().encode(text).byteLength, data: parsed.data,
    storedAt: now.toISOString(), lastUsedAt: now.toISOString(),
  };
  await putWithQuota(db, record);
  notifyOtherTabs({ type: 'content' });
  return parsed.data;
}

/** The builder hashes the pack body without its `hash` field, in authored key order. */
function stripHash(json: unknown): unknown {
  const { hash: _h, ...rest } = json as Record<string, unknown>;
  return rest;
}

function looksLikePack(data: unknown, moduleId: string, locale: Locale): data is Pack {
  const d = data as Partial<Pack> | undefined;
  return !!d && d.moduleId === moduleId && d.locale === locale && Array.isArray(d.items) && Array.isArray(d.lessons) && typeof d.references === 'object';
}

const isQuota = (err: unknown) => err instanceof DOMException && err.name === 'QuotaExceededError';

/** On quota errors, evict least-recently-used packs one at a time until the new one fits. */
async function putWithQuota(db: DB, record: StoredPack): Promise<void> {
  for (;;) {
    try {
      await db.put('packs', record);
      return;
    } catch (err) {
      if (!isQuota(err)) throw err;
      const victims = (await db.getAllFromIndex('packs', 'byLastUsed')).filter((p) => p.key !== record.key);
      if (!victims[0]) throw new ContentError('quota', 'Not enough storage for this module');
      await db.delete('packs', victims[0].key);
    }
  }
}

/** Evict least-recently-used packs until total bytes ≤ maxBytes. Never touches learning data. */
export async function evictPacks(db: DB, maxBytes: number, keep: ReadonlySet<string> = new Set()): Promise<number> {
  const packs = await db.getAllFromIndex('packs', 'byLastUsed');
  let total = packs.reduce((s, p) => s + p.bytes, 0);
  let removed = 0;
  for (const p of packs) {
    if (total <= maxBytes) break;
    if (keep.has(p.key)) continue;
    await db.delete('packs', p.key);
    total -= p.bytes;
    removed++;
  }
  return removed;
}

export async function clearDownloads(db: DB): Promise<void> {
  await db.clear('packs');
  notifyOtherTabs({ type: 'content' });
}

export async function downloadedPacks(db: DB): Promise<Array<Pick<StoredPack, 'key' | 'moduleId' | 'locale' | 'bytes' | 'lastUsedAt'>>> {
  const packs = await db.getAll('packs');
  return packs.map(({ key: k, moduleId, locale, bytes, lastUsedAt }) => ({ key: k, moduleId, locale, bytes, lastUsedAt }));
}

export async function storageEstimate(): Promise<{ usage?: number; quota?: number; persisted?: boolean }> {
  const out: { usage?: number; quota?: number; persisted?: boolean } = {};
  try {
    if (navigator.storage?.estimate) {
      const e = await navigator.storage.estimate();
      if (e.usage !== undefined) out.usage = e.usage;
      if (e.quota !== undefined) out.quota = e.quota;
    }
    if (navigator.storage?.persisted) out.persisted = await navigator.storage.persisted();
  } catch {
    /* unsupported */
  }
  return out;
}

/** Ask the browser not to evict our storage. Not a guarantee (Safari may still clear it). */
export async function requestPersistence(): Promise<boolean> {
  try {
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}
