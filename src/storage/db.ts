/**
 * IndexedDB schema and migrations. Learning data (attempts, progress, flags,
 * sessions) and downloaded content packs live in separate stores so content can
 * be evicted (LRU) without ever touching learning data.
 */
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Pack } from '../domain/content/schema.ts';
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
  /** UTC ISO timestamp + the user's IANA zone at the time, for consistent day maths. */
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
  startedAt: string;
  updatedAt: string;
  /** Optimistic concurrency token (two tabs). */
  rev: number;
  results: { correct: number; incorrect: number; recalled: number; forgotten: number; read: number };
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

interface TarjetAlanDB extends DBSchema {
  meta: { key: string; value: { key: string; value: unknown } };
  attempts: { key: string; value: Attempt; indexes: { byItem: string; byAt: string } };
  progress: { key: string; value: ItemProgress };
  flags: { key: string; value: ItemFlags };
  sessions: { key: string; value: StoredSession; indexes: { byStatus: string } };
  packs: { key: string; value: StoredPack; indexes: { byLastUsed: string } };
  reports: { key: string; value: Report };
}

export type DB = IDBPDatabase<TarjetAlanDB>;

/**
 * Migrations run in order from the stored version. Add a new `case` for every
 * version bump; never drop learning stores.
 */
export function openDatabase(name = DB_NAME): Promise<DB> {
  return openDB<TarjetAlanDB>(name, DB_VERSION, {
    upgrade(db, oldVersion) {
      switch (oldVersion) {
        case 0: {
          db.createObjectStore('meta', { keyPath: 'key' });
          const attempts = db.createObjectStore('attempts', { keyPath: 'id' });
          attempts.createIndex('byItem', 'itemId');
          attempts.createIndex('byAt', 'at');
          db.createObjectStore('progress', { keyPath: 'itemId' });
          db.createObjectStore('flags', { keyPath: 'itemId' });
          const sessions = db.createObjectStore('sessions', { keyPath: 'id' });
          sessions.createIndex('byStatus', 'status');
          const packs = db.createObjectStore('packs', { keyPath: 'key' });
          packs.createIndex('byLastUsed', 'lastUsedAt');
          db.createObjectStore('reports', { keyPath: 'id' });
        }
        // falls through to future migrations
      }
    },
    blocking() {
      // Another tab wants a newer schema: close so it can upgrade.
      void dbPromise?.then((d) => d.close());
      dbPromise = null;
    },
  });
}

let dbPromise: Promise<DB> | null = null;
export function getDb(): Promise<DB> {
  dbPromise ??= openDatabase();
  return dbPromise;
}
