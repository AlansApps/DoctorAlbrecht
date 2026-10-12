import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppState, type LoadedItem } from '../../app/AppState.tsx';
import { href } from '../../app/router.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import { Notice } from '../../ui/components.tsx';
import { CardView } from './CardView.tsx';
import { useFlagToggle } from './useFlagToggle.ts';

/** A single card opened from "Saved" or a deep link. Browsing is exposure-free: nothing is recorded. */
export function CardScreen({ itemId }: { itemId: string }) {
  const { t } = useI18n();
  const app = useAppState();
  const toggle = useFlagToggle();
  const [loaded, setLoaded] = useState<LoadedItem | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (app.status !== 'ready') return;
    setFailed(false);
    app.loadItems([itemId]).then((m) => {
      const it = m.get(itemId);
      if (it) setLoaded(it);
      else setFailed(true);
    }, () => setFailed(true));
  }, [app.status, app.prefs.locale, itemId]); // reload when language changes

  return (
    <div className="stack stack--lg">
      <a className="backlink" href={href({ name: 'review' })}>
        <ChevronLeft className="icon" aria-hidden="true" /> {t('review.back')}
      </a>
      {failed ? <Notice tone="warn">{navigator.onLine ? t('app.error') : t('session.needsConnection')}</Notice> : null}
      {loaded && loaded.item.kind === 'card' ? (
        <CardView
          card={loaded.item}
          references={loaded.references}
          lessonTitle={loaded.lessonTitle}
          mode="browse"
          saved={app.flags.get(itemId)?.favorite ?? false}
          onToggleSave={() => void toggle(itemId, !(app.flags.get(itemId)?.favorite ?? false))}
        />
      ) : null}
    </div>
  );
}
