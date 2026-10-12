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
  audioRate: z.number().min(0.6).max(1.6).catch(1),
  voiceURI: z.string().max(300).nullable().catch(null),
  /** Upper bound for automatically kept downloads (MB); larger downloads only on request. */
  downloadLimitMB: z.number().int().min(5).max(500).catch(25),
});
export type Prefs = z.infer<typeof Prefs>;

const KEY = 'tarjetalan:prefs';

function defaultLocale(): Prefs['locale'] {
  try {
    return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

export function loadPrefs(): Prefs {
  let raw: unknown = {};
  try {
    raw = JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    raw = {};
  }
  const base = typeof raw === 'object' && raw ? raw : {};
  return Prefs.parse({ locale: defaultLocale(), ...base });
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
