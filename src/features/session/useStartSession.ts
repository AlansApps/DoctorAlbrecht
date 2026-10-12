import { useCallback, useState } from 'react';
import { useAppState } from '../../app/AppState.tsx';
import { navigate } from '../../app/router.ts';
import type { SessionOptions } from '../../domain/session/selector.ts';
import type { MessageKey } from '../../i18n/es.ts';
import { startSession } from './sessionActions.ts';

/** Builds a session for the given options and opens it; reports "nothing to study" or a failure. */
export function useStartSession() {
  const app = useAppState();
  const [problem, setProblem] = useState<MessageKey | null>(null);
  const [starting, setStarting] = useState(false);

  const start = useCallback(
    async (options: SessionOptions) => {
      if (!app.manifest || starting) return;
      setStarting(true);
      setProblem(null);
      try {
        const s = await startSession({ manifest: app.manifest, index: app.index, options, locale: app.prefs.locale, online: app.online });
        if (!s) setProblem(app.online ? 'session.empty' : 'session.needsConnection');
        else navigate({ name: 'session' });
      } catch {
        setProblem('app.error');
      } finally {
        setStarting(false);
      }
    },
    [app, starting],
  );

  return { start, problem, starting };
}
