import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAppState } from '../../app/AppState.tsx';
import { href } from '../../app/router.ts';
import { CLINICAL_TAGS } from '../../domain/content/schema.ts';
import type { ClinicalTag } from '../../domain/session/selector.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import type { MessageKey } from '../../i18n/es.ts';
import { Button, Notice } from '../../ui/components.tsx';
import { useStartSession } from '../session/useStartSession.ts';

export function MacroScreen({ macroId }: { macroId: string }) {
  const { t, locale } = useI18n();
  const app = useAppState();
  const { start, empty, starting } = useStartSession();
  const [filters, setFilters] = useState<ClinicalTag[]>([]);
  const macro = app.manifest?.macros.find((m) => m.id === macroId);
  if (!macro) return <Notice>{t('app.error')}</Notice>;
  const minutes = app.prefs.defaultMinutes;
  const anyAvailable = macro.micros.some((m) => m.available);
  const toggle = (tag: ClinicalTag) => setFilters((f) => (f.includes(tag) ? f.filter((x) => x !== tag) : [...f, tag]));

  return (
    <div className="stack stack--lg">
      <a className="backlink" href={href({ name: 'topics' })}>
        <ChevronLeft className="icon" aria-hidden="true" /> {t('topics.back')}
      </a>
      <h1 className="screen-title">{macro.title[locale]}</h1>

      {anyAvailable ? (
        <>
          <fieldset className="tagfilter">
            <legend className="eyebrow">{t('topics.filters')}</legend>
            <div className="tagfilter__opts">
              {CLINICAL_TAGS.map((tag) => (
                <label key={tag} className={`tagfilter__opt${filters.includes(tag) ? ' is-on' : ''}`}>
                  <input type="checkbox" checked={filters.includes(tag)} onChange={() => toggle(tag)} />
                  <span>{t(`tag.${tag}` as MessageKey)}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="stack">
            <Button variant="primary" block disabled={starting} onClick={() => void start({ minutes, scope: { kind: 'macro', macroId, mix: false }, filters, mode: 'balanced' })}>
              {t('topics.studyAll')}
            </Button>
            <Button block disabled={starting} onClick={() => void start({ minutes, scope: { kind: 'macro', macroId, mix: true }, filters, mode: 'balanced' })}>
              {t('topics.studyMix')}
            </Button>
            {empty ? <Notice>{t('session.empty')} {t('session.empty.hint')}</Notice> : null}
          </div>
        </>
      ) : (
        <Notice>{t('topics.pending')}</Notice>
      )}

      <ul className="list">
        {macro.micros.map((mi) => (
          <li key={mi.id} className="list__item">
            {mi.available ? (
              <button type="button" className="list__link" disabled={starting} onClick={() => void start({ minutes, scope: { kind: 'micro', microId: mi.id }, filters: [], mode: 'balanced' })}>
                <span className="list__text">
                  <span className="list__title">{mi.title[locale]}</span>
                  <span className="list__sub">{t('topics.studyMicro')}</span>
                </span>
                <ChevronRight className="icon" aria-hidden="true" />
              </button>
            ) : (
              <div className="list__link" aria-disabled="true">
                <span className="list__text">
                  <span className="list__title">{mi.title[locale]}</span>
                  <span className="list__sub">{t('topics.pending')}</span>
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
