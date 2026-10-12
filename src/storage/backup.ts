/**
 * Versioned JSON backup of learning data (attempt log, flags, reports).
 * Progress is not exported: it is rebuilt from the log after import, so a merge
 * is simply "union of attempts by id + latest flag wins + rebuild".
 */
import { z } from 'zod';
import { normalizeIso } from '../domain/scheduler/time.ts';
import type { DB } from './db.ts';
import { rebuildProgress } from './progressRepo.ts';

export const BACKUP_FORMAT = 'tarjetalan-backup';
export const BACKUP_VERSION = 1;

const isoTs = z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'invalid timestamp');

export const AttemptSchema = z.object({
  id: z.string().min(1).max(200),
  itemId: z.string().min(1).max(200),
  kind: z.enum(['card', 'question', 'case']),
  conceptId: z.string().min(1).max(200),
  rating: z.enum(['again', 'hard', 'good', 'easy']).nullable(),
  correct: z.boolean().exactOptional(),
  optionId: z.string().max(10).exactOptional(),
  contentRev: z.number().int().min(0),
  sessionId: z.string().max(200).exactOptional(),
  at: isoTs,
  tz: z.string().max(64),
});

const FlagsSchema = z.object({ itemId: z.string().min(1).max(200), favorite: z.boolean(), suspended: z.boolean(), updatedAt: isoTs });
const ReportSchema = z.object({
  id: z.string().min(1).max(200), itemId: z.string().max(200), locale: z.string().max(5),
  reason: z.enum(['error', 'source', 'translation', 'unclear', 'other']), text: z.string().max(4000), createdAt: isoTs,
});

export const BackupSchema = z.object({
  format: z.literal(BACKUP_FORMAT),
  version: z.literal(BACKUP_VERSION),
  exportedAt: isoTs,
  appVersion: z.string().max(50),
  attempts: z.array(AttemptSchema).max(500_000),
  flags: z.array(FlagsSchema).max(100_000),
  reports: z.array(ReportSchema).max(10_000),
});
export type Backup = z.infer<typeof BackupSchema>;

export async function exportBackup(db: DB, appVersion: string, now: Date): Promise<Backup> {
  const [attempts, flags, reports] = await Promise.all([db.getAll('attempts'), db.getAll('flags'), db.getAll('reports')]);
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: now.toISOString(), appVersion, attempts, flags, reports };
}

export type ParseResult = { ok: true; backup: Backup } | { ok: false; error: string };

export function parseBackup(text: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: 'not-json' };
  }
  const res = BackupSchema.safeParse(json);
  if (!res.success) {
    const fmt = (json as { format?: unknown })?.format;
    return { ok: false, error: fmt !== BACKUP_FORMAT ? 'not-a-backup' : 'invalid' };
  }
  const backup = res.data;
  backup.attempts = backup.attempts.map((a) => ({ ...a, at: normalizeIso(a.at) }));
  return { ok: true, backup };
}

export interface ImportPreview {
  attempts: number;
  newAttempts: number;
  duplicateAttempts: number;
  flags: number;
  reports: number;
  firstAt?: string;
  lastAt?: string;
}

export async function previewImport(db: DB, backup: Backup): Promise<ImportPreview> {
  const existing = new Set(await db.getAllKeys('attempts'));
  const dup = backup.attempts.filter((a) => existing.has(a.id)).length;
  const times = backup.attempts.map((a) => a.at).sort();
  return {
    attempts: backup.attempts.length, newAttempts: backup.attempts.length - dup, duplicateAttempts: dup,
    flags: backup.flags.length, reports: backup.reports.length,
    ...(times[0] ? { firstAt: times[0] } : {}), ...(times.at(-1) ? { lastAt: times.at(-1)! } : {}),
  };
}

/**
 * merge: union of attempts by id (duplicates ignored), flags last-write-wins, reports union.
 * replace: a safety copy of current data is kept in `meta.preImportBackup` first.
 * Progress is rebuilt from the resulting log in both cases.
 */
export async function importBackup(db: DB, backup: Backup, mode: 'merge' | 'replace', appVersion: string, now: Date): Promise<number> {
  if (mode === 'replace') {
    const safety = await exportBackup(db, appVersion, now);
    await db.put('meta', { key: 'preImportBackup', value: safety });
  }
  const tx = db.transaction(['attempts', 'flags', 'reports', 'sessions'], 'readwrite');
  if (mode === 'replace') {
    await Promise.all([tx.objectStore('attempts').clear(), tx.objectStore('flags').clear(), tx.objectStore('reports').clear(), tx.objectStore('sessions').clear()]);
  }
  const attempts = tx.objectStore('attempts');
  for (const a of backup.attempts) {
    if (mode === 'replace' || !(await attempts.getKey(a.id))) await attempts.put(a);
  }
  const flags = tx.objectStore('flags');
  for (const f of backup.flags) {
    const cur = await flags.get(f.itemId);
    if (!cur || Date.parse(f.updatedAt) > Date.parse(cur.updatedAt)) await flags.put(f);
  }
  const reports = tx.objectStore('reports');
  for (const r of backup.reports) if (!(await reports.getKey(r.id))) await reports.put(r);
  await tx.done;
  return rebuildProgress(db);
}

/** Restore the safety copy taken before the last "replace" import. */
export async function restorePreImport(db: DB, appVersion: string, now: Date): Promise<boolean> {
  const safety = (await db.get('meta', 'preImportBackup'))?.value;
  const parsed = BackupSchema.safeParse(safety);
  if (!parsed.success) return false;
  await importBackup(db, parsed.data, 'replace', appVersion, now);
  return true;
}

/** "Erase all progress": learning data only; downloaded content and preferences are kept. */
export async function eraseLearningData(db: DB): Promise<void> {
  const tx = db.transaction(['attempts', 'progress', 'flags', 'sessions'], 'readwrite');
  await Promise.all([
    tx.objectStore('attempts').clear(),
    tx.objectStore('progress').clear(),
    tx.objectStore('flags').clear(),
    tx.objectStore('sessions').clear(),
  ]);
  await tx.done;
}
