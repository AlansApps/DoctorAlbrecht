/**
 * Small user preferences in localStorage (spec 04: no cookies, nothing medical here).
 * Validated on read; falls back to defaults if storage is unavailable or corrupt.
 */
import { z } from 'zod';

export const Prefs = z.object({
  locale: z.enum(['es', 'en']).catch('es'),
  theme: z.enum(['system', 'light', 'dark']).catch('system'),
  textScale: z.union([z.literal(1), z.literal(1.125), z.literal(1.25), z.literal(1.375)]).catch(1),
  defaultMinutes: z.union([z.literal(3), z.literal(5), z.literal(10), z.literal(15)]).catch(5),
  /** Slightly slower than the platform default: explanations are dense. */
  audioRate: z.number().min(0.6).max(1.6).catch(0.9),
  voiceURI: z.string().max(300).nullable().catch(null),
  /** Upper bound for automatically kept downloads (MB); larger downloads only on request. */
  downloadLimitMB: z.number().int().min(5).max(500).catch(25),
  /** Preferences format; 2 = Spanish by default and calmer default speech rate. */
  v: z.literal(2).catch(2),
});
export type Prefs = z.infer<typeof Prefs>;

const KEY = 'tarjetalan:prefs';

/** Spanish is the default for everyone; English is chosen in Settings. */
export function loadPrefs(): Prefs {
  let raw: unknown = {};
  try {
    raw = JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    raw = {};
  }
  const base: Record<string, unknown> = typeof raw === 'object' && raw ? { ...(raw as Record<string, unknown>) } : {};
  // v1 picked the language from the browser and spoke at 1×: move once to the new defaults.
  if (base.v !== 2) {
    delete base.locale;
    if (base.audioRate === 1) delete base.audioRate;
  }
  return Prefs.parse({ locale: 'es', ...base });
}

export function savePrefs(p: Prefs): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode or storage blocked: preferences live for this visit only */
  }
}

export function applyPrefsToDocument(p: Prefs): void {
  const root = document.documentElement;
  if (p.theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', p.theme);
  root.style.setProperty('--text-scale', String(p.textScale));
}
