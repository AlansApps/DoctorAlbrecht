import { ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAppState } from '../../app/AppState.tsx';
import { href } from '../../app/router.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import { Button, Notice } from '../../ui/components.tsx';
import { computeStats } from '../home/stats.ts';
import { useStartSession } from '../session/useStartSession.ts';

export function ReviewScreen() {
  const { t } = useI18n();
  const app = useAppState();
  const { start, empty, starting } = useStartSession();
  const stats = useMemo(() => computeStats(app.index, app.progress, app.flags), [app.index, app.progress, app.flags]);
  const saved = useMemo(
    () => [...app.flags.values()].filter((f) => f.favorite && app.indexById.get(f.itemId)?.kind === 'card').map((f) => f.itemId),
    [app.flags, app.indexById],
  );
  const minutes = app.prefs.defaultMinutes;

  return (
    <div className="stack stack--lg">
      <h1 className="screen-title">{t('review.title')}</h1>

      <dl className="statgrid">
        <div><dt>{t('review.dueToday')}</dt><dd className="tabular">{stats.due}</dd></div>
        <div><dt>{t('review.stats.studied')}</dt><dd className="tabular">{stats.studied}</dd></div>
        <div><dt>{t('review.stats.learning')}</dt><dd className="tabular">{stats.learning}</dd></div>
        <div><dt>{t('review.stats.review')}</dt><dd className="tabular">{stats.review}</dd></div>
      </dl>

      {stats.due > 0 ? (
        <Button variant="primary" block disabled={starting} onClick={() => void start({ minutes, scope: { kind: 'all' }, filters: [], mode: 'review' })}>
          {t('review.start')}
        </Button>
      ) : (
        <Notice>{t('review.empty')}</Notice>
      )}

      <section className="stack">
        <h2 className="eyebrow">{t('review.mistakes')}</h2>
        <p className="small muted">{t('review.mistakes.sub')}</p>
        <Button block disabled={starting || stats.mistakes === 0} onClick={() => void start({ minutes, scope: { kind: 'mistakes' }, filters: [], mode: 'review' })}>
          {t('review.mistakes')} <span className="tabular">({stats.mistakes})</span>
        </Button>
        {empty ? <Notice>{t('session.empty')}</Notice> : null}
      </section>

      <section className="stack">
        <h2 className="eyebrow">{t('review.saved')}</h2>
        {saved.length === 0 ? (
          <p className="small muted">{t('review.saved.empty')}</p>
        ) : (
          <SavedList ids={saved} />
        )}
      </section>
    </div>
  );
}

function SavedList({ ids }: { ids: string[] }) {
  const app = useAppState();
  const { locale } = useI18n();
  const [titles, setTitles] = useState<Map<string, string>>(new Map());
  useEffect(() => {
    app.loadItems(ids).then((m) => setTitles(new Map([...m].map(([id, it]) => [id, it.item.kind === 'case' ? it.item.title : it.item.kind === 'card' ? it.item.title : it.item.stem]))), () => {});
  }, [ids.join('|'), app.prefs.locale]);
  return (
    <ul className="list">
      {ids.map((id) => {
        const e = app.indexById.get(id)!;
        const micro = app.manifest?.macros.flatMap((m) => m.micros).find((m) => m.id === e.microId);
        return (
          <li key={id} className="list__item">
            <a className="list__link" href={href({ name: 'card', itemId: id })}>
              <span className="list__text">
                <span className="list__title">{titles.get(id) ?? micro?.title[locale] ?? id}</span>
                {titles.has(id) && micro ? <span className="list__sub">{micro.title[locale]}</span> : null}
              </span>
              <ChevronRight className="icon" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
