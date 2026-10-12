/**
 * Interface translation. Spanish ships in the main bundle; English is a lazy
 * chunk loaded on demand. Content packs are loaded per locale by the content repo.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '../domain/content/schema.ts';
import { es, type MessageKey } from './es.ts';

type Messages = Record<MessageKey, string>;
type T = (key: MessageKey, vars?: Record<string, string | number>) => string;

const loaders: Record<Locale, () => Promise<Messages>> = {
  es: async () => es,
  en: async () => (await import('./en.ts')).en,
};

/** `{n}` inserts a value; `{n|one|other}` picks a form by count (n === 1 → one). */
export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template
    .replace(/\{(\w+)\|([^|}]*)\|([^}]*)\}/g, (m, k: string, one: string, other: string) =>
      k in vars ? (Number(vars[k]) === 1 ? one : other) : m,
    )
    .replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

interface I18nValue {
  locale: Locale;
  t: T;
  formatDate: (iso: string) => string;
  formatNumber: (n: number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [messages, setMessages] = useState<Messages>(es);
  const [loaded, setLoaded] = useState<Locale>('es');

  useEffect(() => {
    let alive = true;
    void loaders[locale]().then((m) => {
      if (alive) {
        setMessages(m);
        setLoaded(locale);
      }
    });
    document.documentElement.lang = locale;
    return () => {
      alive = false;
    };
  }, [locale]);

  const t = useCallback<T>((key, vars) => interpolate(messages[key] ?? es[key] ?? key, vars), [messages]);
  const value = useMemo<I18nValue>(() => {
    const dateFmt = new Intl.DateTimeFormat(loaded === 'es' ? 'es' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const numFmt = new Intl.NumberFormat(loaded === 'es' ? 'es' : 'en-GB');
    return {
      locale: loaded,
      t,
      formatDate: (iso) => {
        const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
        return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
      },
      formatNumber: (n) => numFmt.format(n),
    };
  }, [t, loaded]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const v = useContext(I18nContext);
  if (!v) throw new Error('useI18n outside I18nProvider');
  return v;
}
