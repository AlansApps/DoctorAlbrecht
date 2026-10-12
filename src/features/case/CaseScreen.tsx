import { ChevronLeft } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppState, type LoadedItem } from '../../app/AppState.tsx';
import { href } from '../../app/router.ts';
import type { PackCase } from '../../domain/content/schema.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import { ActionBar, Button, Notice, RichText } from '../../ui/components.tsx';
import { SourcesSheet } from '../card/CardView.tsx';
import { QuestionView } from '../session/SessionScreen.tsx';
import { currentTimeZone } from '../../domain/scheduler/time.ts';
import { ratingForAnswer } from '../../domain/scheduler/scheduler.ts';
import { withDb } from '../../storage/db.ts';
import { recordAttempt } from '../../storage/progressRepo.ts';

/**
 * Progressive clinical case: one step at a time, with its linked questions inline.
 * Questions answered here are real retrieval practice and are recorded like in a
 * session (ARCH-052), so a normal session won't re-ask them minutes later.
 */
export function CaseScreen({ itemId }: { itemId: string }) {
  const { t } = useI18n();
  const app = useAppState();
  const [items, setItems] = useState<Map<string, LoadedItem> | null>(null);
  const [failed, setFailed] = useState(false);
  const [shown, setShown] = useState(1);
  const [answers, setAnswers] = useState<Record<string, { choice: string | null; checked: boolean }>>({});
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const lastRef = useRef<HTMLLIElement>(null);
  const entry = app.indexById.get(itemId);
  const runId = useMemo(() => crypto.randomUUID(), [itemId]);

  const check = (stepId: string, questionId: string, choice: string) => {
    setAnswers((a) => ({ ...a, [stepId]: { choice, checked: true } }));
    // Land on the feedback, not on <body> (UX-060).
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-step="${CSS.escape(stepId)}"] .feedback`)?.focus());
    const q = items?.get(questionId)?.item;
    const e = app.indexById.get(questionId);
    if (!q || q.kind !== 'question' || !e) return;
    const correct = q.options.find((o) => o.correct)?.id === choice;
    void withDb((db) => recordAttempt(db, {
      id: `case:${runId}:${questionId}`, itemId: questionId, kind: 'question', conceptId: e.conceptId,
      rating: ratingForAnswer(correct), correct, optionId: choice, contentRev: e.rev, at: new Date().toISOString(), tz: currentTimeZone(),
    })).then(() => app.refresh(), () => {});
  };

  useEffect(() => {
    if (app.status !== 'ready') return;
    setFailed(false);
    app.loadItems([itemId]).then(async (m) => {
      const c = m.get(itemId)?.item;
      if (!c || c.kind !== 'case') return setFailed(true);
      const qs = c.steps.map((s) => s.questionId).filter((x): x is string => !!x);
      const more = qs.length ? await app.loadItems(qs) : new Map<string, LoadedItem>();
      setItems(new Map([...m, ...more]));
    }, () => setFailed(true));
  }, [app.status, app.prefs.locale, itemId]);

  useEffect(() => {
    lastRef.current?.querySelector<HTMLElement>('.casestep__text')?.focus();
  }, [shown]);

  const loaded = items?.get(itemId);
  const kase = loaded?.item.kind === 'case' ? (loaded.item as PackCase) : null;
  const backTo = entry ? href({ name: 'macro', macroId: entry.macroId }) : href({ name: 'topics' });

  return (
    <div className="session">
      <a className="backlink" href={backTo}>
        <ChevronLeft className="icon" aria-hidden="true" /> {t('case.back')}
      </a>
      {failed ? <Notice tone="warn">{navigator.onLine ? t('app.error') : t('session.needsConnection')}</Notice> : null}
      {kase ? (
        <>
          <header className="stack">
            <h1 className="card__title">{kase.title}</h1>
            <p className="small muted">{t('case.fictional')}</p>
          </header>
          <ol className="casesteps">
            {kase.steps.slice(0, shown).map((step, i) => {
              const q = step.questionId ? items?.get(step.questionId)?.item : undefined;
              const st = answers[step.id] ?? { choice: null, checked: false };
              return (
                <li key={step.id} className="casestep" data-step={step.id} ref={i === shown - 1 ? lastRef : undefined}>
                  <span className="eyebrow tabular">{t('case.step', { i: i + 1, n: kase.steps.length })}</span>
                  <div className="casestep__text" tabIndex={-1}><RichText text={step.text} /></div>
                  {q && q.kind === 'question' ? (
                    <div className="stack">
                      <QuestionView
                        q={q}
                        references={items!.get(step.questionId!)!.references}
                        choice={st.choice}
                        checked={st.checked}
                        onChoose={(id) => setAnswers((a) => ({ ...a, [step.id]: { choice: id, checked: false } }))}
                        heading="h2"
                      />
                      {!st.checked ? (
                        <Button disabled={!st.choice} onClick={() => check(step.id, step.questionId!, st.choice!)}>{t('session.check')}</Button>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
          {shown >= kase.steps.length ? (
            <div className="stack">
              <p className="eyebrow">{t('case.done')}</p>
              <button type="button" className="linklike" onClick={() => setSourcesOpen(true)}>{t('card.sources')}</button>
              <a className="btn btn--primary btn--block" href={backTo}>{t('case.back')}</a>
            </div>
          ) : null}
          <SourcesSheet open={sourcesOpen} onClose={() => setSourcesOpen(false)} refIds={kase.refIds} references={loaded!.references} />
          {shown < kase.steps.length ? (
            <ActionBar>
              <Button variant="primary" block onClick={() => setShown((n) => n + 1)}>{t('case.nextStep')}</Button>
            </ActionBar>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
