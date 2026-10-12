import { ChevronRight, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppState } from '../../app/AppState.tsx';
import { href } from '../../app/router.ts';
import type { Manifest } from '../../domain/content/schema.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import { Notice } from '../../ui/components.tsx';
import { useStartSession } from '../session/useStartSession.ts';

const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export interface SearchHit {
  macroId: string;
  microId: string;
  title: string;
  macroTitle: string;
  available: boolean;
}

/** Search micro topics by ES/EN titles and aliases (acronyms, historical names). */
export function searchTopics(manifest: Manifest, query: string, locale: 'es' | 'en'): SearchHit[] {
  const q = fold(query.trim());
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const m of manifest.macros) {
    for (const mi of m.micros) {
      const hay = [mi.title.es, mi.title.en, ...mi.aliases].map(fold);
      if (hay.some((h) => h.includes(q))) {
        hits.push({ macroId: m.id, microId: mi.id, title: mi.title[locale], macroTitle: m.title[locale], available: mi.available });
      }
    }
  }
  return hits.sort((a, b) => Number(b.available) - Number(a.available)).slice(0, 30);
}

export function TopicsScreen() {
  const { t, locale } = useI18n();
  const app = useAppState();
  const { start, empty } = useStartSession();
  const [query, setQuery] = useState('');
  const manifest = app.manifest;
  const hits = useMemo(() => (manifest ? searchTopics(manifest, query, locale) : []), [manifest, query, locale]);
  if (!manifest) return null;
  const macros = [...manifest.macros].sort((a, b) => Number(b.priority) - Number(a.priority) || a.order - b.order);

  return (
    <div className="stack stack--lg">
      <h1 className="screen-title">{t('topics.title')}</h1>
      <label className="search">
        <Search className="icon" aria-hidden="true" />
        <span className="visually-hidden">{t('topics.search')}</span>
        <input id="topic-search" type="search" placeholder={t('topics.search')} value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
      </label>

      {query.trim().length >= 2 ? (
        hits.length ? (
          <ul className="list" aria-live="polite">
            {hits.map((h) => (
              <li key={h.microId} className="list__item">
                <button
                  type="button"
                  className="list__link"
                  aria-disabled={!h.available}
                  onClick={() => h.available && void start({ minutes: app.prefs.defaultMinutes, scope: { kind: 'micro', microId: h.microId }, filters: [], mode: 'balanced' })}
                >
                  <span className="list__text">
                    <span className="list__title">{h.title}</span>
                    <span className="list__sub">{h.macroTitle}{h.available ? '' : ` · ${t('topics.pending')}`}</span>
                  </span>
                  {h.available ? <ChevronRight className="icon" aria-hidden="true" /> : null}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted" aria-live="polite">{t('topics.noResults', { q: query.trim() })}</p>
        )
      ) : (
        <>
          <button type="button" className="cta cta--quiet" onClick={() => void start({ minutes: app.prefs.defaultMinutes, scope: { kind: 'fertility' }, filters: [], mode: 'balanced' })}>
            <Sparkles className="icon cta__icon" aria-hidden="true" />
            <span className="cta__text">
              <span className="cta__title">{t('topics.fertilityTrack')}</span>
              <span className="cta__sub">{t('topics.fertilityTrack.sub')}</span>
            </span>
            <ChevronRight className="icon" aria-hidden="true" />
          </button>
          {empty ? <Notice>{t('session.empty')}</Notice> : null}
          <ul className="list">
            {macros.map((m) => {
              const available = m.micros.filter((x) => x.available).length;
              return (
                <li key={m.id} className="list__item">
                  <a className="list__link" href={href({ name: 'macro', macroId: m.id })}>
                    <span className="list__text">
                      <span className="list__title">{m.title[locale]}</span>
                      <span className="list__sub tabular">
                        {m.priority ? `${t('topics.priority')} · ` : ''}
                        {available ? t('topics.microCount', { a: available, b: m.micros.length }) : t('topics.pending')}
                      </span>
                    </span>
                    <ChevronRight className="icon" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
