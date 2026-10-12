/**
 * IndexedDB schema, migrations and connection lifecycle.
 *
 * Learning data (attempts, progress, flags, sessions) and downloaded content
 * (packs, manifest) live in separate stores: content can be evicted (LRU) or
 * cleared without ever touching learning data.
 */
import { openDB, type DBSchema, type IDBPDatabase, type IDBPTransaction } from 'idb';
import type { Manifest, Pack } from '../domain/content/schema.ts';
import type { ItemProgress, ItemKind, RecallRating } from '../domain/scheduler/scheduler.ts';
import type { SessionOptions, Step } from '../domain/session/selector.ts';

export const DB_NAME = 'tarjetalan';
export const DB_VERSION = 1;

/** One learning event. Immutable; `id` makes writes idempotent. */
export interface Attempt {
  id: string;
  itemId: string;
  kind: ItemKind;
  conceptId: string;
  /** null = exposure (read/listen), never counts as recall. */
  rating: RecallRating | null;
  correct?: boolean;
  optionId?: string;
  contentRev: number;
  sessionId?: string;
  /** Normalized UTC ISO timestamp + the user's IANA zone at the time. */
  at: string;
  tz: string;
}

export interface ItemFlags {
  itemId: string;
  favorite: boolean;
  suspended: boolean;
  updatedAt: string;
}

export interface StoredSession {
  id: string;
  options: SessionOptions;
  steps: Step[];
  /** Index of the next step to show. */
  position: number;
  status: 'active' | 'paused' | 'done';
  seed: number;
  contentVersion: string;
  startedAt: string;
  updatedAt: string;
  /** Optimistic concurrency token (two tabs, resume after crash). */
  rev: number;
}

export interface StoredPack {
  key: string; // `${moduleId}:${locale}`
  moduleId: string;
  locale: Pack['locale'];
  hash: string;
  bytes: number;
  data: Pack;
  storedAt: string;
  lastUsedAt: string;
}

export interface Report {
  id: string;
  itemId: string;
  locale: string;
  reason: 'error' | 'source' | 'translation' | 'unclear' | 'other';
  text: string;
  createdAt: string;
}

export type MetaValue =
  | { key: 'schedulerVersion'; value: number }
  | { key: 'manifest'; value: Manifest }
  | { key: 'preImportBackup'; value: unknown }
  | { key: string; value: unknown };

export interface TarjetAlanDB extends DBSchema {
  meta: { key: string; value: MetaValue };
  attempts: { key: string; value: Attempt; indexes: { byItem: string; byAt: string; bySession: string } };
  progress: { key: string; value: ItemProgress };
  flags: { key: string; value: ItemFlags };
  sessions: { key: string; value: StoredSession; indexes: { byStatus: string; byUpdated: string } };
  packs: { key: string; value: StoredPack; indexes: { byLastUsed: string } };
  reports: { key: string; value: Report };
}

export type DB = IDBPDatabase<TarjetAlanDB>;
/** A readwrite transaction that includes at least the learning stores. */
export type LearningTx = IDBPTransaction<TarjetAlanDB, ArrayLike<'attempts' | 'progress' | 'flags' | 'sessions'>, 'readwrite'>;

type VersionListener = () => void;
const versionListeners = new Set<VersionListener>();
/** UI hook: another tab opened a newer schema. Show "update ready" — never force-reload mid-question. */
export function onNewerVersion(fn: VersionListener): () => void {
  versionListeners.add(fn);
  return () => versionListeners.delete(fn);
}

/**
 * Migrations run in order from the stored version. Add `if (oldVersion < n)` blocks
 * for each bump; never drop learning stores.
 */
export function openDatabase(name = DB_NAME, onLost?: () => void): Promise<DB> {
  return openDB<TarjetAlanDB>(name, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('meta', { keyPath: 'key' });
        const attempts = db.createObjectStore('attempts', { keyPath: 'id' });
        attempts.createIndex('byItem', 'itemId');
        attempts.createIndex('byAt', 'at');
        attempts.createIndex('bySession', 'sessionId');
        db.createObjectStore('progress', { keyPath: 'itemId' });
        db.createObjectStore('flags', { keyPath: 'itemId' });
        const sessions = db.createObjectStore('sessions', { keyPath: 'id' });
        sessions.createIndex('byStatus', 'status');
        sessions.createIndex('byUpdated', 'updatedAt');
        const packs = db.createObjectStore('packs', { keyPath: 'key' });
        packs.createIndex('byLastUsed', 'lastUsedAt');
        db.createObjectStore('reports', { keyPath: 'id' });
      }
    },
    blocking() {
      // This connection blocks a newer schema in another tab: close it and tell the UI.
      onLost?.();
      versionListeners.forEach((fn) => fn());
    },
    terminated() {
      // WebKit can kill the connection (e.g. after backgrounding on iOS): reopen lazily.
      onLost?.();
    },
  });
}

// ---------- Shared connection with automatic reopen ----------

let dbPromise: Promise<DB> | null = null;

export function getDb(): Promise<DB> {
  if (!dbPromise) {
    const p = openDatabase(DB_NAME, () => {
      if (dbPromise === p) dbPromise = null;
      void p.then((d) => d.close()).catch(() => {});
    });
    dbPromise = p;
    p.catch(() => {
      if (dbPromise === p) dbPromise = null;
    });
  }
  return dbPromise;
}

const RETRYABLE = new Set(['InvalidStateError', 'TransactionInactiveError', 'UnknownError', 'AbortError']);

/** Run a DB operation; if the connection died underneath, reopen once and retry. */
export async function withDb<T>(fn: (db: DB) => Promise<T>): Promise<T> {
  try {
    return await fn(await getDb());
  } catch (err) {
    if (!(err instanceof DOMException) || !RETRYABLE.has(err.name)) throw err;
    dbPromise = null;
    return fn(await getDb());
  }
}

export async function getMeta<T>(db: DB, key: string): Promise<T | undefined> {
  return (await db.get('meta', key))?.value as T | undefined;
}

export async function setMeta(db: DB, key: string, value: unknown): Promise<void> {
  await db.put('meta', { key, value });
}
