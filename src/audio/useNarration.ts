import { useCallback, useEffect, useRef, useState } from 'react';
import { speak, stopSpeaking } from './speech.ts';

export type NarrationState = 'idle' | 'playing' | 'paused';

/**
 * Play / pause / stop for one text. Pause remembers the current sentence and
 * resume continues from it; stop goes back to the beginning. Speech stops when
 * the component unmounts or the text changes (e.g. the next card).
 */
export function useNarration(text: string, opts: { lang: 'es' | 'en'; rate: number; voiceURI: string | null }) {
  const [state, setState] = useState<NarrationState>('idle');
  const chunk = useRef(0);

  const start = useCallback((from: number) => {
    const ok = speak(text, {
      ...opts,
      fromChunk: from,
      onChunk: (i) => { chunk.current = i; },
      onEnd: () => { chunk.current = 0; setState('idle'); },
    });
    setState(ok ? 'playing' : 'idle');
  }, [text, opts.lang, opts.rate, opts.voiceURI]);

  const play = useCallback(() => start(state === 'paused' ? chunk.current : 0), [start, state]);
  const pause = useCallback(() => {
    stopSpeaking();
    setState('paused');
  }, []);
  const stop = useCallback(() => {
    stopSpeaking();
    chunk.current = 0;
    setState('idle');
  }, []);

  useEffect(() => () => {
    stopSpeaking();
    chunk.current = 0;
    setState('idle');
  }, [text]);

  return { state, play, pause, stop };
}
