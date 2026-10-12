import { BookOpen, ChevronRight, Headphones, LayoutGrid, RefreshCcw, Timer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAppState } from '../../app/AppState.tsx';
import { href } from '../../app/router.ts';
import type { Minutes } from '../../domain/session/selector.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import { withDb, type StoredSession } from '../../storage/db.ts';
import { latestOpenSession } from '../../storage/sessionRepo.ts';
import { Notice, Segmented } from '../../ui/components.tsx';
import { useStartSession } from '../session/useStartSession.ts';
import { computeStats } from './stats.ts';

function greetingKey(d = new Date()) {
  const h = d.getHours();
  return h < 13 ? 'home.greeting.morning' : h < 20 ? 'home.greeting.afternoon' : 'home.greeting.evening';
}

export function HomeScreen() {
  const { t } = useI18n();
  const app = useAppState();
  const { start, empty, starting } = useStartSession();
  const [open, setOpen] = useState<StoredSession | null>(null);
  const minutes = app.prefs.defaultMinutes;
  const stats = useMemo(() => computeStats(app.index, app.progress, app.flags), [app.index, app.progress, app.flags]);
  const topicsWithContent = useMemo(() => new Set(app.index.map((e) => e.macroId)).size, [app.index]);
  const firstTime = app.progress.size === 0;

  useEffect(() => {
    void withDb(latestOpenSession).then((s) => setOpen(s ?? null));
  }, [app.progress]);

  return (
    <div className="stack stack--lg">
      <header className="stack">
        <p className="brand" aria-label="TarjetAlan">Tarjet<span>Alan</span></p>
        <h1 className="screen-title">{t(greetingKey() as 'home.greeting.morning')}</h1>
      </header>

      {firstTime ? <Notice>{t('home.firstTime')}</Notice> : null}

      <div className="stack">
        <button type="button" className="cta" disabled={starting} onClick={() => void start({ minutes, scope: { kind: 'all' }, filters: [], mode: 'balanced' })}>
          <Timer className="icon cta__icon" aria-hidden="true" />
          <span className="cta__text">
            <span className="cta__title">{t('home.study', { min: minutes })}</span>
            <span className="cta__sub">{t('home.study.sub')}</span>
          </span>
          <ChevronRight className="icon" aria-hidden="true" />
        </button>
        <Segmented<Minutes>
          label={t('home.duration')}
          value={minutes}
          onChange={(v) => app.setPrefs({ defaultMinutes: v })}
          options={([3, 5, 10, 15] as const).map((n) => ({ value: n, label: t('minutes', { n }) }))}
        />
        {empty ? <Notice>{t('session.empty')} {t('session.empty.hint')}</Notice> : null}
      </div>

      <ul className="list">
        {open ? (
          <li className="list__item">
            <a className="list__link" href={href({ name: 'session' })}>
              <BookOpen className="icon" aria-hidden="true" />
              <span className="list__text">
                <span className="list__title">{t('home.continue')}</span>
                <span className="list__sub tabular">{t('session.step', { i: open.position + 1, n: open.steps.length })}</span>
              </span>
              <ChevronRight className="icon" aria-hidden="true" />
            </a>
          </li>
        ) : null}
        <li className="list__item">
          <button type="button" className="list__link" disabled={starting} onClick={() => void start({ minutes, scope: { kind: 'all' }, filters: [], mode: 'review' })}>
            <RefreshCcw className="icon" aria-hidden="true" />
            <span className="list__text">
              <span className="list__title">{t('home.review')}</span>
              <span className="list__sub tabular">{stats.due ? t('home.review.due', { n: stats.due }) : t('home.review.none')}</span>
            </span>
            <ChevronRight className="icon" aria-hidden="true" />
          </button>
        </li>
        <li className="list__item">
          <a className="list__link" href={href({ name: 'topics' })}>
            <LayoutGrid className="icon" aria-hidden="true" />
            <span className="list__text">
              <span className="list__title">{t('home.topics')}</span>
              <span className="list__sub">{t('home.topics.sub', { n: topicsWithContent })}</span>
            </span>
            <ChevronRight className="icon" aria-hidden="true" />
          </a>
        </li>
        <li className="list__item">
          <a className="list__link" href={href({ name: 'listen' })}>
            <Headphones className="icon" aria-hidden="true" />
            <span className="list__text">
              <span className="list__title">{t('home.listen')}</span>
              <span className="list__sub">{t('home.listen.sub')}</span>
            </span>
            <ChevronRight className="icon" aria-hidden="true" />
          </a>
        </li>
      </ul>

      {!firstTime ? (
        <section className="stack">
          <h2 className="eyebrow">{t('home.progress')}</h2>
          <p className="tabular">{t('home.progress.detail', { studied: stats.studied, retained: stats.review })}</p>
          <p className="small muted">{t('home.progress.note')}</p>
        </section>
      ) : null}
    </div>
  );
}
