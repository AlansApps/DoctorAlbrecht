import { ChevronLeft, ChevronRight, ListChecks, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppState } from '../../app/AppState.tsx';
import { href } from '../../app/router.ts';
import type { Minutes, Scope } from '../../domain/session/selector.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import { Notice, Segmented } from '../../ui/components.tsx';
import { useStartSession } from '../session/useStartSession.ts';

/** Multiple-choice practice only: random questions across all topics or one topic. */
export function QuestionsScreen() {
  const { t, locale } = useI18n();
  const app = useAppState();
  const { start, problem, starting } = useStartSession();
  const [topic, setTopic] = useState<string>('all');
  const [onlyStudied, setOnlyStudied] = useState(true);
  const minutes = app.prefs.defaultMinutes as Minutes;

  // Topics (macros) that have at least one question.
  const topics = useMemo(() => {
    const withQ = new Set(app.index.filter((e) => e.kind === 'question').map((e) => e.macroId));
    return (app.manifest?.macros ?? []).filter((m) => withQ.has(m.id));
  }, [app.index, app.manifest]);

  const scope: Scope = topic === 'all' ? { kind: 'all' } : { kind: 'macro', macroId: topic, mix: true };
  const count = Math.floor((minutes * 60) / 50);

  return (
    <div className="stack stack--lg">
      <a className="backlink" href={href({ name: 'home' })}>
        <ChevronLeft className="icon" aria-hidden="true" /> {t('nav.home')}
      </a>
      <h1 className="screen-title">{t('questions.title')}</h1>
      <p className="muted">{t('questions.intro')}</p>

      <label className="field">
        <span className="eyebrow">{t('questions.topic')}</span>
        <select id="questions-topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="all">{t('questions.topic.all')}</option>
          {topics.map((m) => <option key={m.id} value={m.id}>{m.title[locale]}</option>)}
        </select>
      </label>

      <label className="checkline">
        <input type="checkbox" checked={onlyStudied} onChange={(e) => setOnlyStudied(e.target.checked)} />
        <span>{t('questions.onlyStudied')}</span>
      </label>

      <Segmented<Minutes>
        label={t('home.duration')}
        value={minutes}
        onChange={(v) => app.setPrefs({ defaultMinutes: v })}
        options={([3, 5, 10, 15] as const).map((n) => ({ value: n, label: t('minutes', { n }) }))}
      />

      <button type="button" className="cta" disabled={starting} onClick={() => void start({ minutes, scope, filters: [], mode: 'questions', onlyStudied })}>
        <ListChecks className="icon cta__icon" aria-hidden="true" />
        <span className="cta__text">
          <span className="cta__title">{t('questions.start')}</span>
          <span className="cta__sub tabular">{t('questions.start.sub', { n: count })}</span>
        </span>
        <ChevronRight className="icon" aria-hidden="true" />
      </button>

      <ul className="list">
        <li className="list__item">
          <button type="button" className="list__link" disabled={starting} onClick={() => void start({ minutes, scope: { kind: 'mistakes' }, filters: [], mode: 'questions' })}>
            <RotateCcw className="icon" aria-hidden="true" />
            <span className="list__text">
              <span className="list__title">{t('questions.mistakes')}</span>
              <span className="list__sub">{t('questions.mistakes.sub')}</span>
            </span>
            <ChevronRight className="icon" aria-hidden="true" />
          </button>
        </li>
      </ul>

      {problem ? <Notice>{problem === 'session.empty' ? t(onlyStudied ? 'questions.empty.studied' : 'questions.empty') : t(problem)}</Notice> : null}
    </div>
  );
}
