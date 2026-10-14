/**
 * App-wide state: content manifest/index, learning progress, flags, preferences,
 * connectivity and service-worker updates. Screens read from here; writes go
 * through the storage repositories and then refresh this state.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { IndexEntry, Locale, Manifest, Pack, PackItem, PackReference } from '../domain/content/schema.ts';
import type { ItemProgress } from '../domain/scheduler/scheduler.ts';
import { onTabMessage } from '../storage/channel.ts';
import { ContentError, ensurePack, evictPacks, loadManifest, requestPersistence } from '../storage/contentRepo.ts';
import { getDb, onNewerVersion, withDb, type ItemFlags } from '../storage/db.ts';
import { clearOutbox, flush as flushOutbox } from '../storage/outbox.ts';
import { applyPrefsToDocument, loadPrefs, savePrefs, type Prefs } from '../storage/prefs.ts';
import { ensureSchedulerVersion, loadAllProgress, loadFlags } from '../storage/progressRepo.ts';
import { latestOpenSession } from '../storage/sessionRepo.ts';

export const BASE_URL = import.meta.env.BASE_URL;
export const APP_VERSION = '0.1.0';

export interface LoadedItem {
  item: PackItem;
  moduleId: string;
  lessonTitle: string;
  references: Record<string, PackReference>;
}

type Status = 'loading' | 'ready' | 'no-content' | 'error';

interface AppStateValue {
  status: Status;
  manifest: Manifest | null;
  index: IndexEntry[];
  indexById: ReadonlyMap<string, IndexEntry>;
  progress: ReadonlyMap<string, ItemProgress>;
  flags: ReadonlyMap<string, ItemFlags>;
  prefs: Prefs;
  setPrefs: (patch: Partial<Prefs>) => void;
  online: boolean;
  updateReady: boolean;
  applyUpdate: () => void;
  refresh: () => Promise<void>;
  loadItems: (ids: readonly string[], locale?: Locale) => Promise<Map<string, LoadedItem>>;
  retry: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [progress, setProgress] = useState<ReadonlyMap<string, ItemProgress>>(new Map());
  const [flags, setFlags] = useState<ReadonlyMap<string, ItemFlags>>(new Map());
  const [prefs, setPrefsState] = useState<Prefs>(() => loadPrefs());
  const [online, setOnline] = useState(() => navigator.onLine);
  const [updateReady, setUpdateReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const packCache = useRef(new Map<string, Pack>());
  const waitingWorker = useRef<ServiceWorker | null>(null);
  /** Only a tab that asked for the update reloads on controllerchange (ARCH-035). */
  const updateRequested = useRef(false);
  /** Another tab already activated the new worker: this tab only needs a reload (ARCH-048). */
  const controllerChanged = useRef(false);

  useEffect(() => applyPrefsToDocument(prefs), [prefs]);

  const setPrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefsState((p) => {
      const next = { ...p, ...patch };
      savePrefs(next);
      return next;
    });
  }, []);

  const refresh = useCallback(async () => {
    const [p, f] = await withDb((db) => Promise.all([loadAllProgress(db), loadFlags(db)]));
    setProgress(p);
    setFlags(f);
  }, []);

  // ---- Boot
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const db = await getDb();
        await ensureSchedulerVersion(db);
        await flushOutbox(db);
        const m = await loadManifest(db, BASE_URL);
        if (!alive) return;
        await refresh();
        setManifest(m?.manifest ?? null);
        setStatus(m ? (m.manifest.index.length ? 'ready' : 'no-content') : 'error');
        void requestPersistence();
      } catch {
        if (alive) setStatus('error');
      }
    })();
    return () => {
      alive = false;
    };
  }, [refresh, attempt]);

  // ---- Other tabs / connectivity / newer schema
  useEffect(() => {
    const off = onTabMessage((msg) => {
      if (msg.type === 'erased') clearOutbox(); // another tab erased progress: drop our pending copies (ARCH-040)
      if (msg.type === 'progress' || msg.type === 'progress-all' || msg.type === 'erased') void refresh();
    });
    const up = () => {
      setOnline(true);
      void withDb(flushOutbox).then((n) => {
        if (n) void refresh();
      });
    };
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    const offVersion = onNewerVersion(() => setUpdateReady(true));
    return () => {
      off();
      offVersion();
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, [refresh]);

  // ---- Service worker: register; a waiting worker is applied only on request (never mid-question).
  useEffect(() => {
    if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // First install (clients.claim) and updates requested by other tabs never reload this one.
      if (updateRequested.current && !reloading) {
        reloading = true;
        location.reload();
      } else {
        controllerChanged.current = true;
      }
    });
    void navigator.serviceWorker.register(`${BASE_URL}sw.js`).then((reg) => {
      const track = (w: ServiceWorker | null) => {
        if (!w) return;
        w.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) {
            waitingWorker.current = w;
            setUpdateReady(true);
          }
        });
      };
      if (reg.waiting && navigator.serviceWorker.controller) {
        waitingWorker.current = reg.waiting;
        setUpdateReady(true);
      }
      reg.addEventListener('updatefound', () => track(reg.installing));
    });
  }, []);

  const applyUpdate = useCallback(() => {
    updateRequested.current = true;
    if (controllerChanged.current || waitingWorker.current?.state === 'activated') location.reload();
    else if (waitingWorker.current) waitingWorker.current.postMessage({ type: 'SKIP_WAITING' });
    else location.reload();
  }, []);

  const index = useMemo(() => manifest?.index ?? [], [manifest]);
  const indexById = useMemo(() => new Map(index.map((e) => [e.id, e])), [index]);

  const loadItems = useCallback(
    async (ids: readonly string[], locale: Locale = prefs.locale) => {
      if (!manifest) throw new ContentError('offline', 'no manifest');
      const modules = [...new Set(ids.map((id) => indexById.get(id)?.moduleId).filter((m): m is string => !!m))];
      const now = new Date();
      const packs = await Promise.all(
        modules.map(async (moduleId) => {
          const entry = manifest.modules.find((m) => m.id === moduleId)?.packs[locale];
          const cacheKey = `${moduleId}:${locale}:${entry?.hash}`;
          const cached = packCache.current.get(cacheKey);
          if (cached) return cached;
          const pack = await withDb((db) => ensurePack(db, manifest, moduleId, locale, BASE_URL, now));
          packCache.current.set(cacheKey, pack);
          return pack;
        }),
      );
      // Keep downloads within the configured budget; packs in use now are never evicted (ARCH-044).
      void withDb(async (db) => {
        // Never evict what this screen uses nor what the open (possibly paused) session needs (ARCH-049).
        const open = await latestOpenSession(db);
        const openModules = (open?.steps ?? []).map((s) => indexById.get(s.itemId)?.moduleId).filter((m): m is string => !!m);
        const inUse = new Set([...modules, ...openModules].map((m) => `${m}:${locale}`));
        return evictPacks(db, prefs.downloadLimitMB * 1024 * 1024, inUse);
      }).catch(() => {});
      const out = new Map<string, LoadedItem>();
      for (const pack of packs) {
        for (const item of pack.items) {
          if (!ids.includes(item.id)) continue;
          const lesson = pack.lessons.find((l) => l.itemIds.includes(item.id));
          out.set(item.id, { item, moduleId: pack.moduleId, lessonTitle: lesson?.title ?? '', references: pack.references });
        }
      }
      return out;
    },
    [manifest, indexById, prefs.locale, prefs.downloadLimitMB],
  );

  const value: AppStateValue = {
    status, manifest, index, indexById, progress, flags, prefs, setPrefs, online, updateReady, applyUpdate, refresh, loadItems,
    retry: () => {
      setStatus('loading');
      setAttempt((a) => a + 1);
    },
  };
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const v = useContext(AppStateContext);
  if (!v) throw new Error('useAppState outside provider');
  return v;
}

