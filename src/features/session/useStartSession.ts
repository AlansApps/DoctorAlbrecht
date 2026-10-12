import { useCallback, useState } from 'react';
import { useAppState } from '../../app/AppState.tsx';
import { navigate } from '../../app/router.ts';
import type { SessionOptions } from '../../domain/session/selector.ts';
import { startSession } from './sessionActions.ts';

/** Builds a session for the given options and opens it; reports when nothing matches. */
export function useStartSession() {
  const app = useAppState();
  const [empty, setEmpty] = useState(false);
  const [starting, setStarting] = useState(false);

  const start = useCallback(
    async (options: SessionOptions) => {
      if (!app.manifest || starting) return;
      setStarting(true);
      setEmpty(false);
      try {
        const s = await startSession({ manifest: app.manifest, index: app.index, progress: app.progress, flags: app.flags, options });
        if (!s) setEmpty(true);
        else navigate({ name: 'session' });
      } finally {
        setStarting(false);
      }
    },
    [app, starting],
  );

  return { start, empty, starting, clearEmpty: () => setEmpty(false) };
}
