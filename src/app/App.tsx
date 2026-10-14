import { lazy, Suspense, useEffect } from 'react';
import { useI18n, I18nProvider } from '../i18n/i18n.tsx';
import { BottomNav, Button, Notice } from '../ui/components.tsx';
import { AppStateProvider, useAppState } from './AppState.tsx';
import { useRoute } from './router.ts';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import { HomeScreen } from '../features/home/HomeScreen.tsx';
import { SessionScreen } from '../features/session/SessionScreen.tsx';

// Less frequent screens load on demand to keep the initial bundle small.
const TopicsScreen = lazy(() => import('../features/topics/TopicsScreen.tsx').then((m) => ({ default: m.TopicsScreen })));
const MacroScreen = lazy(() => import('../features/topics/MacroScreen.tsx').then((m) => ({ default: m.MacroScreen })));
const ReviewScreen = lazy(() => import('../features/review/ReviewScreen.tsx').then((m) => ({ default: m.ReviewScreen })));
const SettingsScreen = lazy(() => import('../features/settings/SettingsScreen.tsx').then((m) => ({ default: m.SettingsScreen })));
const ListenScreen = lazy(() => import('../features/listen/ListenScreen.tsx').then((m) => ({ default: m.ListenScreen })));
const CaseScreen = lazy(() => import('../features/case/CaseScreen.tsx').then((m) => ({ default: m.CaseScreen })));
const CardScreen = lazy(() => import('../features/card/CardScreen.tsx').then((m) => ({ default: m.CardScreen })));

function Shell() {
  const route = useRoute();
  const app = useAppState();
  const { t } = useI18n();
  // Screens with a fixed action bar hide the bottom navigation.
  const inSession = route.name === 'session' || route.name === 'case';

  useEffect(() => {
    const section: Record<string, string> = {
      home: t('nav.home'), topics: t('nav.topics'), macro: t('nav.topics'), review: t('nav.review'), card: t('nav.review'),
      settings: t('nav.settings'), listen: t('listen.title'), session: t('session.title'), case: t('case.section'),
    };
    document.title = `${section[route.name] ?? ''} · DoctorAlbrecht`;
  }, [route.name, t]);

  let screen;
  if (app.status === 'loading') screen = <p className="muted">{t('app.loading')}</p>;
  else if (app.status === 'error' || app.status === 'no-content') {
    screen = (
      <Notice tone="warn" action={<Button onClick={app.retry}>{t('app.retry')}</Button>}>
        {app.online ? t('app.error') : t('session.needsConnection')}
      </Notice>
    );
  } else {
    switch (route.name) {
      case 'home': screen = <HomeScreen />; break;
      case 'session': screen = <SessionScreen />; break;
      case 'topics': screen = <TopicsScreen />; break;
      case 'macro': screen = <MacroScreen macroId={route.macroId} />; break;
      case 'review': screen = <ReviewScreen />; break;
      case 'settings': screen = <SettingsScreen />; break;
      case 'listen': screen = <ListenScreen />; break;
      case 'card': screen = <CardScreen itemId={route.itemId} />; break;
      case 'case': screen = <CaseScreen itemId={route.itemId} />; break;
    }
  }

  return (
    <div className="app">
      <main className={`app__main${inSession ? ' app__main--session' : ''}`} id="main">
        {!app.online ? <Notice>{t('app.offline')}</Notice> : null}
        {app.updateReady ? (
          // Never forced mid-session: inside a session the notice has no reload button (spec 04, ARCH-043).
          <Notice action={inSession ? undefined : <Button variant="primary" onClick={app.applyUpdate}>{t('app.updateNow')}</Button>}>{t('app.updateReady')}</Notice>
        ) : null}
        <Suspense fallback={<p className="muted">{t('app.loading')}</p>}>{screen}</Suspense>
      </main>
      {inSession ? null : <BottomNav current={route.name} />}
    </div>
  );
}

function WithLocale() {
  const { prefs } = useAppState();
  return (
    <I18nProvider locale={prefs.locale}>
      <Shell />
    </I18nProvider>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <WithLocale />
      </AppStateProvider>
    </ErrorBoundary>
  );
}
