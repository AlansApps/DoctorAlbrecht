import { Pause, Play, SkipBack, SkipForward, Square } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppState, type LoadedItem } from '../../app/AppState.tsx';
import { currentTimeZone } from '../../domain/scheduler/time.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import { speak, speechSupported, stopSpeaking, stripForSpeech } from '../../audio/speech.ts';
import { withDb } from '../../storage/db.ts';
import { recordAttempt } from '../../storage/progressRepo.ts';
import { Button, Notice } from '../../ui/components.tsx';
import { VoiceSettings } from '../settings/VoiceSettings.tsx';
import { currentPlanState, planSteps } from '../session/sessionActions.ts';
import { LETTERS, shuffled } from '../../domain/session/shuffle.ts';

interface Segment {
  itemId: string;
  kind: 'card' | 'question' | 'answer';
  text: string;
  /** Silence after this segment (ms), e.g. to think before the answer. */
  pauseAfter: number;
}

const QUESTION_PAUSE_MS = 6000;

export function buildScript(items: LoadedItem[], t: ReturnType<typeof useI18n>['t']): Segment[] {
  const out: Segment[] = [];
  for (const { item } of items) {
    if (item.kind === 'card') {
      out.push({ itemId: item.id, kind: 'card', text: stripForSpeech([item.title, item.core, item.body, item.pearl].filter(Boolean).join('. ')), pauseAfter: 800 });
    } else if (item.kind === 'question') {
      const order = shuffled(item.options, Math.floor(Math.random() * 2 ** 31));
      const opts = order.map((o, i) => `${LETTERS[i]}: ${o.text}`).join('. ');
      out.push({ itemId: item.id, kind: 'question', text: stripForSpeech(`${item.stem} ${opts}. ${t('listen.questionPause')}`), pauseAfter: QUESTION_PAUSE_MS });
      const correct = item.options.find((o) => o.correct)!;
      out.push({ itemId: item.id, kind: 'answer', text: stripForSpeech(`${t('listen.answerIs', { answer: `${LETTERS[order.indexOf(correct)]}, ${correct.text}` })} ${item.explanation}`), pauseAfter: 800 });
    }
  }
  return out;
}

export function ListenScreen() {
  const { t } = useI18n();
  const app = useAppState();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  /** Bumped on every play/pause/skip: callbacks from a cancelled utterance are ignored (ARCH-038). */
  const generation = useRef(0);
  const listenId = useMemo(() => crypto.randomUUID(), []);
  const supported = speechSupported();
  /** Sentence reached inside the current segment, so pause/resume continues from it. */
  const chunk = useRef(0);

  // A ~10-minute set planned exactly like a study session (review + new, fertility first).
  useEffect(() => {
    if (app.status !== 'ready' || !app.manifest) return;
    let alive = true;
    (async () => {
      try {
        const state = await currentPlanState(app.prefs.locale, app.online);
        const steps = planSteps({
          manifest: app.manifest!, index: app.index, ...state,
          options: { minutes: 10, scope: { kind: 'all' }, filters: [], mode: 'balanced' },
          seed: Math.floor(Math.random() * 2 ** 31), now: new Date(),
        });
        const m = await app.loadItems(steps.map((s) => s.itemId));
        if (alive) setSegments(buildScript(steps.map((s) => m.get(s.itemId)).filter((x): x is LoadedItem => !!x), t));
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => {
      alive = false;
      generation.current++;
      stopSpeaking();
      window.clearTimeout(timer.current);
    };
  }, [app.status, app.prefs.locale]); // build once per language

  const stop = () => {
    generation.current++;
    window.clearTimeout(timer.current);
    stopSpeaking();
  };

  const play = (i: number, fromChunk = 0) => {
    stop();
    const gen = generation.current;
    const seg = segments[i];
    if (!seg) {
      setPlaying(false);
      speak(t('listen.done'), { lang: app.prefs.locale, rate: app.prefs.audioRate, voiceURI: app.prefs.voiceURI });
      return;
    }
    setPos(i);
    setPlaying(true);
    chunk.current = fromChunk;
    speak(seg.text, {
      lang: app.prefs.locale, rate: app.prefs.audioRate, voiceURI: app.prefs.voiceURI, fromChunk,
      onChunk: (c) => { chunk.current = c; },
      onEnd: (finished) => {
        if (gen !== generation.current) return; // paused or skipped: ignore the late event
        // Only a card heard to the end counts, and only as exposure (never a successful recall).
        if (finished && seg.kind === 'card') {
          const e = app.indexById.get(seg.itemId);
          if (e) void withDb((db) => recordAttempt(db, {
            id: `listen:${listenId}:${seg.itemId}`, itemId: e.id, kind: e.kind, conceptId: e.conceptId, rating: null,
            contentRev: e.rev, at: new Date().toISOString(), tz: currentTimeZone(),
          })).then(() => app.refresh(), () => {});
        }
        timer.current = window.setTimeout(() => {
          if (gen === generation.current) play(i + 1);
        }, seg.pauseAfter);
      },
    });
  };

  const pause = () => {
    stop();
    setPlaying(false);
  };

  /** Stop and go back to the beginning. */
  const reset = () => {
    stop();
    setPlaying(false);
    setPos(0);
    chunk.current = 0;
  };

  return (
    <div className="stack stack--lg">
      <h1 className="screen-title">{t('listen.title')}</h1>
      <p className="muted">{t('listen.intro')}</p>
      {!supported ? <Notice tone="warn">{t('listen.unsupported')}</Notice> : <p className="small muted">{t('listen.limits')}</p>}
      {error ? <Notice tone="warn">{t('session.needsConnection')}</Notice> : null}

      {supported && segments.length > 0 ? (
        <div className="player">
          <div className="player__controls">
            <button type="button" className="iconbtn" aria-label={t('listen.prev')} onClick={() => play(Math.max(0, pos - 1))}><SkipBack className="icon" aria-hidden="true" /></button>
            {playing ? (
              <Button variant="primary" icon={Pause} onClick={pause}>{t('listen.pause')}</Button>
            ) : (
              <Button variant="primary" icon={Play} onClick={() => play(pos, chunk.current)}>{pos === 0 && chunk.current === 0 ? t('listen.start') : t('listen.resume')}</Button>
            )}
            <button type="button" className="iconbtn" aria-label={t('listen.stop')} onClick={reset} disabled={!playing && pos === 0 && chunk.current === 0}><Square className="icon" aria-hidden="true" /></button>
            <button type="button" className="iconbtn" aria-label={t('listen.next')} onClick={() => play(Math.min(segments.length, pos + 1))}><SkipForward className="icon" aria-hidden="true" /></button>
          </div>
          <p className="small muted tabular" aria-live="polite">{Math.min(pos + 1, segments.length)} / {segments.length}</p>
          <VoiceSettings />
        </div>
      ) : null}

      {segments.length > 0 ? (
        <section className="stack">
          <h2 className="eyebrow">{t('listen.script')}</h2>
          <ol className="script">
            {segments.map((s, i) => (
              <li key={i} className={i === pos ? 'is-current' : ''} aria-current={i === pos ? 'step' : undefined}>{s.text}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
