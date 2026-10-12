import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppState, type LoadedItem } from '../../app/AppState.tsx';
import { currentTimeZone, studyDayEnd } from '../../domain/scheduler/time.ts';
import { buildSession } from '../../domain/session/selector.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import { speak, speechSupported, stopSpeaking, stripForSpeech, voicesFor } from '../../audio/speech.ts';
import { withDb } from '../../storage/db.ts';
import { recordAttempt } from '../../storage/progressRepo.ts';
import { Button, Notice } from '../../ui/components.tsx';

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
      const opts = item.options.map((o) => `${o.id.toUpperCase()}: ${o.text}`).join('. ');
      out.push({ itemId: item.id, kind: 'question', text: stripForSpeech(`${item.stem} ${opts}. ${t('listen.questionPause')}`), pauseAfter: QUESTION_PAUSE_MS });
      const correct = item.options.find((o) => o.correct)!;
      out.push({ itemId: item.id, kind: 'answer', text: stripForSpeech(`${t('listen.answerIs', { answer: `${correct.id.toUpperCase()}, ${correct.text}` })} ${item.explanation}`), pauseAfter: 800 });
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
  const listenId = useMemo(() => crypto.randomUUID(), []);
  const supported = speechSupported();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!supported) return;
    const update = () => setVoices(voicesFor(app.prefs.locale));
    update();
    speechSynthesis.addEventListener('voiceschanged', update);
    return () => speechSynthesis.removeEventListener('voiceschanged', update);
  }, [supported, app.prefs.locale]);

  // Build a ~10-minute audio set with the regular selector (review + new, fertility first).
  useEffect(() => {
    if (app.status !== 'ready') return;
    const now = new Date();
    const steps = buildSession({
      index: app.index, progress: app.progress,
      suspended: new Set([...app.flags.values()].filter((f) => f.suspended).map((f) => f.itemId)),
      priorityMacros: app.manifest?.macros.filter((m) => m.priority).map((m) => m.id) ?? [],
      options: { minutes: 10, scope: { kind: 'all' }, filters: [], mode: 'balanced' },
      now, dayEnd: studyDayEnd(now, currentTimeZone()), seed: Math.floor(Math.random() * 2 ** 31),
    });
    app.loadItems(steps.map((s) => s.itemId)).then(
      (m) => setSegments(buildScript(steps.map((s) => m.get(s.itemId)).filter((x): x is LoadedItem => !!x), t)),
      () => setError(true),
    );
    return () => {
      stopSpeaking();
      window.clearTimeout(timer.current);
    };
  }, [app.status, app.prefs.locale]); // build once per language

  const play = (i: number) => {
    const seg = segments[i];
    window.clearTimeout(timer.current);
    if (!seg) {
      setPlaying(false);
      speak(t('listen.done'), { lang: app.prefs.locale, rate: app.prefs.audioRate, voiceURI: app.prefs.voiceURI });
      return;
    }
    setPos(i);
    setPlaying(true);
    speak(seg.text, {
      lang: app.prefs.locale, rate: app.prefs.audioRate, voiceURI: app.prefs.voiceURI,
      onEnd: () => {
        // Listening to a card is exposure only (never a successful recall).
        if (seg.kind === 'card') {
          const e = app.indexById.get(seg.itemId);
          if (e) void withDb((db) => recordAttempt(db, {
            id: `listen:${listenId}:${seg.itemId}`, itemId: e.id, kind: e.kind, conceptId: e.conceptId, rating: null,
            contentRev: e.rev, at: new Date().toISOString(), tz: currentTimeZone(),
          })).catch(() => {});
        }
        timer.current = window.setTimeout(() => play(i + 1), seg.pauseAfter);
      },
    });
  };

  const pause = () => {
    stopSpeaking();
    window.clearTimeout(timer.current);
    setPlaying(false);
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
              <Button variant="primary" icon={Play} onClick={() => play(pos)}>{pos === 0 ? t('listen.start') : t('listen.resume')}</Button>
            )}
            <button type="button" className="iconbtn" aria-label={t('listen.next')} onClick={() => play(Math.min(segments.length, pos + 1))}><SkipForward className="icon" aria-hidden="true" /></button>
          </div>
          <p className="small muted tabular" aria-live="polite">{pos + 1} / {segments.length}</p>
          <label className="field">
            <span className="eyebrow">{t('listen.speed')} · <span className="tabular">{app.prefs.audioRate.toFixed(2)}×</span></span>
            <input id="audio-rate" type="range" min={0.7} max={1.4} step={0.05} value={app.prefs.audioRate} onChange={(e) => app.setPrefs({ audioRate: Number(e.target.value) })} />
          </label>
          {voices.length > 1 ? (
            <label className="field">
              <span className="eyebrow">{t('listen.voice')}</span>
              <select id="audio-voice" value={app.prefs.voiceURI ?? ''} onChange={(e) => app.setPrefs({ voiceURI: e.target.value || null })}>
                <option value="">{t('listen.voice.default')}</option>
                {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>)}
              </select>
            </label>
          ) : null}
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
