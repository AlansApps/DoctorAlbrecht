import { Check, Pause, X } from 'lucide-react';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useAppState, type LoadedItem } from '../../app/AppState.tsx';
import { navigate } from '../../app/router.ts';
import type { PackQuestion } from '../../domain/content/schema.ts';
import type { RecallRating } from '../../domain/scheduler/scheduler.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import type { MessageKey } from '../../i18n/es.ts';
import { withDb, type StoredSession } from '../../storage/db.ts';
import { flush } from '../../storage/outbox.ts';
import { activateSession, latestOpenSession, setSessionStatus, summarizeSession, type SessionSummary } from '../../storage/sessionRepo.ts';
import { ActionBar, Button, Notice, RichText } from '../../ui/components.tsx';
import { CardView, SourcesSheet } from '../card/CardView.tsx';
import { answerCurrentStep, type StepOutcome } from './sessionActions.ts';
import { useFlagToggle } from '../card/useFlagToggle.ts';

type Phase = { kind: 'loading' } | { kind: 'none' } | { kind: 'error'; offline: boolean } | { kind: 'step' } | { kind: 'summary'; summary: SessionSummary };

const RATINGS: { r: RecallRating; key: MessageKey }[] = [
  { r: 'again', key: 'session.rate.again' },
  { r: 'hard', key: 'session.rate.hard' },
  { r: 'good', key: 'session.rate.good' },
  { r: 'easy', key: 'session.rate.easy' },
];

export function SessionScreen() {
  const { t } = useI18n();
  const app = useAppState();
  const [session, setSession] = useState<StoredSession | null>(null);
  const [items, setItems] = useState<Map<string, LoadedItem>>(new Map());
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' });
  const [revealed, setRevealed] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [unsure, setUnsure] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<MessageKey | null>(null);
  const toggleSave = useFlagToggle();

  const finish = useCallback(async (s: StoredSession) => {
    const summary = await withDb((db) => summarizeSession(db, s.id));
    setPhase({ kind: 'summary', summary });
    void app.refresh();
  }, [app]);

  // Load the open session and the content for its remaining steps.
  const load = useCallback(async (s?: StoredSession | null) => {
    let current = s === undefined ? await withDb(latestOpenSession) : s;
    if (current && current.status === 'paused') current = (await withDb((db) => activateSession(db, current!.id, new Date()))) ?? current;
    if (!current) {
      setPhase({ kind: 'none' });
      return;
    }
    setSession(current);
    if (current.status === 'done' || current.position >= current.steps.length) return finish(current);
    try {
      const ids = current.steps.slice(current.position).map((x) => x.itemId);
      setItems(await app.loadItems(ids));
      setPhase({ kind: 'step' });
    } catch {
      setPhase({ kind: 'error', offline: !navigator.onLine });
    }
  }, [app, finish]);

  useEffect(() => {
    if (app.status === 'ready') void load();
  }, [app.status, app.prefs.locale]);

  const step = session?.steps[session.position];
  const loaded = step ? items.get(step.itemId) : undefined;

  const resetStep = () => {
    setRevealed(false);
    setChoice(null);
    setChecked(false);
    setUnsure(false);
  };

  const advance = async (outcome: StepOutcome) => {
    if (!session || busy) return;
    setBusy(true);
    try {
      // Anything parked earlier goes first, through the same guarded path.
      await withDb(flush).catch(() => 0);
      const res = await answerCurrentStep(session, outcome, app.indexById);
      if (res.status === 'pending') {
        setNotice('app.saveFailed');
        return;
      }
      if (res.status === 'conflict') setNotice('session.conflict');
      else setNotice(null);
      void app.refresh(); // keep counts and the next session's plan in sync (ARCH-036)
      resetStep();
      await load(res.session);
      window.scrollTo(0, 0);
    } finally {
      setBusy(false);
    }
  };

  const pause = async () => {
    if (session) await withDb((db) => setSessionStatus(db, session.id, 'paused', new Date()));
    navigate({ name: 'home' });
  };

  if (phase.kind === 'loading' || app.status === 'loading') return <p className="muted">{t('app.loading')}</p>;
  if (phase.kind === 'none') {
    return (
      <div className="stack stack--lg">
        <Notice>{t('session.empty')} {t('session.empty.hint')}</Notice>
        <Button variant="primary" onClick={() => navigate({ name: 'home' })}>{t('session.summary.home')}</Button>
      </div>
    );
  }
  if (phase.kind === 'error') {
    return (
      <div className="stack stack--lg">
        <Notice tone="warn">{phase.offline ? t('session.needsConnection') : t('app.error')}</Notice>
        <div className="row">
          <Button variant="primary" onClick={() => void load()}>{t('app.retry')}</Button>
          <Button onClick={() => navigate({ name: 'home' })}>{t('session.summary.home')}</Button>
        </div>
      </div>
    );
  }
  if (phase.kind === 'summary') return <Summary summary={phase.summary} />;
  if (!session || !step || !loaded) return <p className="muted">{t('app.loading')}</p>;

  const total = session.steps.length;
  const item = loaded.item;
  const saved = app.flags.get(item.id)?.favorite ?? false;

  let body: ReactNode = null;
  let actions: ReactNode = null;

  if (item.kind === 'card') {
    const mode = step.mode === 'learn' ? 'learn' : revealed ? 'revealed' : 'recall';
    body = (
      <CardView card={item} references={loaded.references} lessonTitle={loaded.lessonTitle} mode={mode} saved={saved} onToggleSave={() => void toggleSave(item.id, !saved)} />
    );
    if (step.mode === 'learn') {
      actions = <Button variant="primary" block disabled={busy} onClick={() => void advance({ kind: 'exposure' })}>{t('session.understood')}</Button>;
    } else if (!revealed) {
      actions = <Button variant="primary" block onClick={() => setRevealed(true)}>{t('session.reveal')}</Button>;
    } else {
      actions = (
        <>
          <p className="eyebrow">{t('session.rate')}</p>
          <div className="rategrid">
            {RATINGS.map(({ r, key }) => (
              <Button key={r} variant={r === 'good' ? 'primary' : 'secondary'} disabled={busy} onClick={() => void advance({ kind: 'recall', rating: r })}>{t(key)}</Button>
            ))}
          </div>
        </>
      );
    }
  } else if (item.kind === 'question') {
    const correct = item.options.find((o) => o.correct)!;
    body = <QuestionView q={item} references={loaded.references} choice={choice} checked={checked} onChoose={(id) => !checked && setChoice(id)} />;
    if (!checked) {
      actions = <Button variant="primary" block disabled={!choice} onClick={() => setChecked(true)}>{t('session.check')}</Button>;
    } else {
      const ok = choice === correct.id;
      actions = (
        <>
          {ok ? (
            <label className="checkline">
              <input type="checkbox" id="unsure" checked={unsure} onChange={(e) => setUnsure(e.target.checked)} />
              <span>{t('session.unsure')}</span>
            </label>
          ) : null}
          <Button variant="primary" block disabled={busy} onClick={() => void advance({ kind: 'answer', correct: ok, optionId: choice!, unsure })}>{t('session.next')}</Button>
        </>
      );
    }
  } else {
    // Cases are browsed outside sessions for now; skip safely.
    actions = <Button variant="primary" block onClick={() => void advance({ kind: 'skip' })}>{t('session.next')}</Button>;
  }

  return (
    <div className="session">
      <div className="session__top">
        <span className="small muted tabular">{t('session.step', { i: session.position + 1, n: total })}</span>
        {step.requeued ? <span className="chip">{t('session.consolidate')}</span> : null}
        <button type="button" className="iconbtn" onClick={() => void pause()} aria-label={t('session.pause')}>
          <Pause className="icon" aria-hidden="true" />
        </button>
      </div>
      <div className="progressbar" aria-hidden="true"><span style={{ width: `${(session.position / total) * 100}%` }} /></div>
      {notice ? <Notice tone={notice === 'app.saveFailed' ? 'warn' : 'info'}>{t(notice)}</Notice> : null}
      {body}
      <ActionBar>{actions}</ActionBar>
    </div>
  );
}

function QuestionView({ q, references, choice, checked, onChoose }: {
  q: PackQuestion; references: LoadedItem['references']; choice: string | null; checked: boolean; onChoose: (id: string) => void;
}) {
  const { t } = useI18n();
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const correctId = q.options.find((o) => o.correct)?.id;
  const wasRight = checked && choice === correctId;
  return (
    <article className="question">
      <h1 className="question__stem">{q.stem}</h1>
      {checked ? (
        <div className={`feedback ${wasRight ? 'feedback--ok' : 'feedback--err'}`} role="status">
          {wasRight ? <Check className="icon" aria-hidden="true" /> : <X className="icon" aria-hidden="true" />}
          <span>{wasRight ? t('session.correct') : t('session.incorrect')}</span>
        </div>
      ) : null}
      <fieldset className="options" disabled={checked}>
        <legend className="visually-hidden">{q.stem}</legend>
        {q.options.map((o) => {
          const isChoice = o.id === choice;
          const isCorrect = o.id === correctId;
          const state = !checked ? (isChoice ? 'selected' : '') : isCorrect ? 'correct' : isChoice ? 'wrong' : 'dim';
          return (
            <label key={o.id} className={`option option--${state || 'idle'}`}>
              <input type="radio" name={`q-${q.id}`} value={o.id} checked={isChoice} onChange={() => onChoose(o.id)} />
              <span className="option__mark" aria-hidden="true">
                {checked && isCorrect ? <Check className="icon" /> : checked && isChoice ? <X className="icon" /> : o.id.toUpperCase()}
              </span>
              <span className="option__body">
                {checked && (isCorrect || isChoice) ? (
                  <span className="option__tag">
                    {isChoice && !isCorrect ? `${t('session.yourAnswer')} · ✗` : null}
                    {isCorrect ? `${isChoice ? `${t('session.yourAnswer')} · ` : ''}${t('session.correctAnswer')} · ✓` : null}
                  </span>
                ) : null}
                <span className="option__text">{o.text}</span>
                {checked ? <span className="option__why">{o.why}</span> : null}
              </span>
            </label>
          );
        })}
      </fieldset>
      {checked ? (
        <div className="question__explain">
          <RichText text={q.explanation} />
          <button type="button" className="linklike" onClick={() => setSourcesOpen(true)}>{t('card.sources')}</button>
        </div>
      ) : null}
      <SourcesSheet open={sourcesOpen} onClose={() => setSourcesOpen(false)} refIds={q.refIds} references={references} />
    </article>
  );
}

function Summary({ summary }: { summary: SessionSummary }) {
  const { t } = useI18n();
  const rows: { key: MessageKey; n: number }[] = [
    { key: 'session.summary.read', n: summary.read },
    { key: 'session.summary.recalled', n: summary.recalled },
    { key: 'session.summary.forgotten', n: summary.forgotten },
    { key: 'session.summary.correct', n: summary.correct },
    { key: 'session.summary.incorrect', n: summary.incorrect },
  ];
  return (
    <div className="stack stack--lg">
      <h1 className="screen-title">{t('session.summary.title')}</h1>
      <dl className="summary">
        {rows.filter((r) => r.n > 0).map((r) => (
          <div key={r.key} className="summary__row"><dt>{t(r.key)}</dt><dd className="tabular">{r.n}</dd></div>
        ))}
      </dl>
      <p className="muted">{t('session.summary.note')}</p>
      <div className="stack">
        <Button variant="primary" block onClick={() => navigate({ name: 'home' })}>{t('session.summary.home')}</Button>
      </div>
    </div>
  );
}
