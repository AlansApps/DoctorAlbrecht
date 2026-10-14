import { Download, HardDrive, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { APP_VERSION, BASE_URL, useAppState } from '../../app/AppState.tsx';
import { useI18n } from '../../i18n/i18n.tsx';
import {
  eraseLearningData, exportBackup, getPreImportSnapshot, importBackup, parseBackup, previewImport, restorePreImport, type Backup, type ImportPreview,
} from '../../storage/backup.ts';
import { clearDownloads, downloadedPacks, ensurePack, requestPersistence, storageEstimate } from '../../storage/contentRepo.ts';
import { withDb } from '../../storage/db.ts';
import { clearOutbox } from '../../storage/outbox.ts';
import { notifyOtherTabs } from '../../storage/channel.ts';
import type { Prefs } from '../../storage/prefs.ts';
import { Button, Notice, Segmented } from '../../ui/components.tsx';
import { VoiceSettings } from './VoiceSettings.tsx';

function formatBytes(n: number | undefined): string {
  if (n === undefined) return '—';
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** Offer a file to save. Works in Safari/iOS (opens the share/save sheet for downloads). */
function saveFile(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function SettingsScreen() {
  const { t, formatDate } = useI18n();
  const app = useAppState();
  const { prefs, setPrefs } = app;

  return (
    <div className="stack stack--lg">
      <h1 className="screen-title">{t('settings.title')}</h1>

      <section className="settings-group">
        <Segmented<Prefs['locale']> label={t('settings.language')} value={prefs.locale} onChange={(v) => setPrefs({ locale: v })}
          options={[{ value: 'es', label: 'Español' }, { value: 'en', label: 'English' }]} />
        <Segmented<Prefs['theme']> label={t('settings.theme')} value={prefs.theme} onChange={(v) => setPrefs({ theme: v })}
          options={[{ value: 'system', label: t('settings.theme.system') }, { value: 'light', label: t('settings.theme.light') }, { value: 'dark', label: t('settings.theme.dark') }]} />
        <Segmented<Prefs['textScale']> label={t('settings.textSize')} value={prefs.textScale} onChange={(v) => setPrefs({ textScale: v })}
          options={([1, 1.125, 1.25, 1.375] as const).map((v) => ({ value: v, label: `${Math.round(v * 100)}%` }))} />
        <Segmented<Prefs['defaultMinutes']> label={t('settings.defaultMinutes')} value={prefs.defaultMinutes} onChange={(v) => setPrefs({ defaultMinutes: v })}
          options={([3, 5, 10, 15] as const).map((n) => ({ value: n, label: t('minutes', { n }) }))} />
      </section>

      <section className="settings-group">
        <h2 className="eyebrow">{t('settings.audio')}</h2>
        <VoiceSettings />
      </section>

      <StorageSection />
      <BackupSection saveFile={saveFile} />
      <ReportsSection saveFile={saveFile} />
      <ResetSection />

      <section className="settings-group">
        <h2 className="eyebrow">{t('settings.install')}</h2>
        <p className="small">{t('settings.install.ios')}</p>
        <p className="small">{t('settings.install.android')}</p>
      </section>

      <section className="settings-group">
        <h2 className="eyebrow">{t('settings.about')}</h2>
        <p className="small">{t('settings.about.text')}</p>
        <p className="small muted tabular">
          {t('settings.about.version', { v: APP_VERSION, c: app.manifest ? `${app.manifest.contentVersion} · ${formatDate(app.manifest.generatedAt)}` : '—' })}
        </p>
      </section>
    </div>
  );
}

function StorageSection() {
  const { t } = useI18n();
  const app = useAppState();
  const [est, setEst] = useState<{ usage?: number; quota?: number; persisted?: boolean }>({});
  const [packs, setPacks] = useState<{ n: number; bytes: number }>({ n: 0, bytes: 0 });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = async () => {
    setEst(await storageEstimate());
    const list = await withDb(downloadedPacks);
    setPacks({ n: list.length, bytes: list.reduce((s, p) => s + p.bytes, 0) });
  };
  useEffect(() => {
    void refresh();
  }, []);

  const totalAll = app.manifest ? app.manifest.modules.reduce((s, m) => s + m.packs[app.prefs.locale].bytes, 0) : 0;

  const downloadAll = async () => {
    if (!app.manifest) return;
    setBusy(true);
    try {
      const now = new Date();
      // An explicit "download everything" raises the kept-downloads budget so it is not evicted later.
      const neededMB = Math.ceil(totalAll / 1024 / 1024) + 5;
      if (neededMB > app.prefs.downloadLimitMB) app.setPrefs({ downloadLimitMB: Math.min(500, neededMB) });
      for (const m of app.manifest.modules) await withDb((db) => ensurePack(db, app.manifest!, m.id, app.prefs.locale, BASE_URL, now));
    } catch {
      setMsg(t('session.needsConnection'));
    } finally {
      setBusy(false);
      void refresh();
    }
  };

  return (
    <section className="settings-group">
      <h2 className="eyebrow">{t('settings.storage')}</h2>
      <p className="small muted">{t('settings.storage.local')}</p>
      <p className="small tabular">
        {est.usage !== undefined && est.quota !== undefined ? t('settings.storage.used', { used: formatBytes(est.usage), quota: formatBytes(est.quota) }) : t('settings.storage.unknown')}
      </p>
      <p className="small tabular">{t('settings.storage.downloads', { n: packs.n, size: formatBytes(packs.bytes) })}</p>
      <Button icon={Download} disabled={busy || !app.online} onClick={() => void downloadAll()}>
        {t('settings.storage.downloadAll', { size: formatBytes(totalAll) })}
      </Button>
      <Button icon={HardDrive} disabled={busy || packs.n === 0} onClick={async () => { await withDb(clearDownloads); void refresh(); }}>
        {t('settings.storage.clear')}
      </Button>
      <p className="small muted">{t('settings.storage.clear.note')}</p>
      {est.persisted ? (
        <p className="small">{t('settings.storage.persisted')}</p>
      ) : (
        <Button variant="ghost" onClick={async () => { await requestPersistence(); void refresh(); }}>{t('settings.storage.persist')}</Button>
      )}
      {msg ? <Notice tone="warn">{msg}</Notice> : null}
    </section>
  );
}

function BackupSection({ saveFile }: { saveFile: (name: string, text: string) => void }) {
  const { t, formatDate } = useI18n();
  const app = useAppState();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ backup: Backup; preview: ImportPreview } | null>(null);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'info' | 'error'; text: string } | null>(null);
  const [snapshotAt, setSnapshotAt] = useState<string | null>(null);
  const [confirmUndo, setConfirmUndo] = useState(false);
  const loadSnapshot = async () => setSnapshotAt((await withDb((db) => getPreImportSnapshot(db, new Date())))?.takenAt ?? null);
  useEffect(() => {
    void loadSnapshot();
  }, []);

  const doExport = async () => {
    const backup = await withDb((db) => exportBackup(db, APP_VERSION, new Date()));
    saveFile(`tarjetalan-respaldo-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(backup));
  };

  const onFile = async (file: File | undefined) => {
    setMsg(null);
    setPending(null);
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setMsg({ tone: 'error', text: t('settings.backup.invalid') });
      return;
    }
    const parsed = parseBackup(await file.text());
    if (!parsed.ok) {
      setMsg({ tone: 'error', text: t('settings.backup.invalid') });
      return;
    }
    try {
      const preview = await withDb((db) => previewImport(db, parsed.backup));
      setPending({ backup: parsed.backup, preview });
    } catch {
      setMsg({ tone: 'error', text: t('app.error') });
    }
  };

  const apply = async (mode: 'merge' | 'replace') => {
    if (!pending) return;
    try {
      await withDb((db) => importBackup(db, pending.backup, mode, APP_VERSION, new Date()));
      setMsg({ tone: 'info', text: t('settings.backup.done') });
    } catch {
      setMsg({ tone: 'error', text: t('app.error') });
    }
    setPending(null);
    setConfirmReplace(false);
    await app.refresh();
    await loadSnapshot();
  };

  return (
    <section className="settings-group">
      <h2 className="eyebrow">{t('settings.backup')}</h2>
      <Button icon={Download} onClick={() => void doExport()}>{t('settings.backup.export')}</Button>
      <Button icon={Upload} onClick={() => fileRef.current?.click()}>{t('settings.backup.import')}</Button>
      <input ref={fileRef} id="backup-file" type="file" accept="application/json,.json" hidden onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ''; }} />
      {pending ? (
        <div className="stack">
          <p className="small tabular">
            {t('settings.backup.preview', {
              attempts: pending.preview.attempts, new: pending.preview.newAttempts, dup: pending.preview.duplicateAttempts,
              from: pending.preview.firstAt ? formatDate(pending.preview.firstAt) : '—', to: pending.preview.lastAt ? formatDate(pending.preview.lastAt) : '—',
            })}
          </p>
          <Button variant="primary" onClick={() => void apply('merge')}>{t('settings.backup.merge')}</Button>
          {confirmReplace ? (
            <>
              <Notice tone="warn">{t('settings.backup.replace.confirm')}</Notice>
              <div className="row">
                <Button variant="danger" onClick={() => void apply('replace')}>{t('settings.confirm')}</Button>
                <Button onClick={() => setConfirmReplace(false)}>{t('settings.cancel')}</Button>
              </div>
            </>
          ) : (
            <Button variant="danger" onClick={() => setConfirmReplace(true)}>{t('settings.backup.replace')}</Button>
          )}
        </div>
      ) : null}
      {snapshotAt ? (
        confirmUndo ? (
          <div className="stack">
            <Notice tone="warn">{t('settings.backup.undo.confirm', { date: formatDate(snapshotAt) })}</Notice>
            <div className="row">
              <Button variant="danger" onClick={async () => {
                const ok = await withDb((db) => restorePreImport(db, APP_VERSION, new Date()));
                setConfirmUndo(false);
                setMsg(ok ? { tone: 'info', text: t('settings.backup.done') } : { tone: 'error', text: t('app.error') });
                await app.refresh();
                await loadSnapshot();
              }}>{t('settings.confirm')}</Button>
              <Button onClick={() => setConfirmUndo(false)}>{t('settings.cancel')}</Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setConfirmUndo(true)}>{t('settings.backup.undo.dated', { date: formatDate(snapshotAt) })}</Button>
        )
      ) : null}
      {msg ? <Notice tone={msg.tone}>{msg.text}</Notice> : null}
    </section>
  );
}

function ReportsSection({ saveFile }: { saveFile: (name: string, text: string) => void }) {
  const { t } = useI18n();
  const [count, setCount] = useState(0);
  useEffect(() => {
    void withDb((db) => db.count('reports')).then(setCount);
  }, []);
  return (
    <section className="settings-group">
      <h2 className="eyebrow">{t('settings.reports')}</h2>
      <p className="small muted">{t('report.note')}</p>
      <Button icon={Download} disabled={count === 0} onClick={async () => {
        const reports = await withDb((db) => db.getAll('reports'));
        saveFile(`tarjetalan-reportes-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ format: 'tarjetalan-reports', version: 1, reports }, null, 2));
      }}>
        {t('settings.reports.export', { n: count })}
      </Button>
    </section>
  );
}

function ResetSection() {
  const { t } = useI18n();
  const app = useAppState();
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState('');
  const [done, setDone] = useState(false);
  const expected = t('settings.reset.word');
  return (
    <section className="settings-group">
      {done ? <Notice>{t('settings.reset.done')}</Notice> : null}
      {!open ? (
        <Button variant="danger" onClick={() => setOpen(true)}>{t('settings.reset')}</Button>
      ) : (
        <div className="stack">
          <label className="field">
            <span className="small">{t('settings.reset.confirm')}</span>
            <input id="reset-word" value={word} onChange={(e) => setWord(e.target.value)} autoComplete="off" autoCapitalize="characters" />
          </label>
          <div className="row">
            <Button variant="danger" disabled={word.trim().toUpperCase() !== expected} onClick={async () => {
              await withDb(eraseLearningData);
              clearOutbox();
              notifyOtherTabs({ type: 'erased' });
              await app.refresh();
              setOpen(false);
              setWord('');
              setDone(true);
            }}>{t('settings.confirm')}</Button>
            <Button onClick={() => { setOpen(false); setWord(''); }}>{t('settings.cancel')}</Button>
          </div>
        </div>
      )}
    </section>
  );
}
