import { Bookmark, BookmarkCheck, ExternalLink, Flag, Volume2, BookOpen } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { PackCard, PackReference } from '../../domain/content/schema.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import type { MessageKey } from '../../i18n/es.ts';
import { EvidenceBadge, FlowDiagram, RichText, Sheet } from '../../ui/components.tsx';
import { ReportSheet } from './ReportSheet.tsx';
import { speak, speechSupported, stripForSpeech } from '../../audio/speech.ts';
import { useAppState } from '../../app/AppState.tsx';

export function refNumbering(refIds: readonly string[]): Map<string, number> {
  return new Map(refIds.map((id, i) => [id, i + 1]));
}

export function SourcesSheet({ open, onClose, refIds, references, focusId }: {
  open: boolean; onClose: () => void; refIds: readonly string[]; references: Record<string, PackReference>; focusId?: string | null;
}) {
  const { t, formatDate } = useI18n();
  return (
    <Sheet open={open} onClose={onClose} title={t('card.sources')}>
      <ol className="sources">
        {refIds.map((id, i) => {
          const r = references[id];
          if (!r) return null;
          return (
            <li key={id} className={`source${focusId === id ? ' is-focus' : ''}`}>
              <span className="source__n">[{i + 1}]</span>
              <div className="source__body">
                <p className="source__title">{r.title}</p>
                <p className="small">{r.authors} · {r.year} · {t(`source.type.${r.type}` as MessageKey)}{r.doi ? ` · doi:${r.doi}` : ''}</p>
                <dl className="source__meta">
                  <dt>{t('source.population')}</dt><dd>{r.population}</dd>
                  <dt>{t('source.finding')}</dt><dd>{r.finding}</dd>
                  <dt>{t('source.limitations')}</dt><dd>{r.limitations}</dd>
                </dl>
                <p className="small muted">{t('source.accessed', { date: formatDate(r.accessed) })}</p>
                <a className="btn btn--ghost" href={r.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="icon" aria-hidden="true" /><span>{t('source.open')}</span>
                </a>
              </div>
            </li>
          );
        })}
      </ol>
    </Sheet>
  );
}

export type CardMode = 'browse' | 'learn' | 'recall' | 'revealed';

export function CardView({ card, references, lessonTitle, mode, onToggleSave, saved }: {
  card: PackCard; references: Record<string, PackReference>; lessonTitle?: string; mode: CardMode;
  saved: boolean; onToggleSave: () => void;
}) {
  const { t, formatDate } = useI18n();
  const { prefs } = useAppState();
  const [sourceFocus, setSourceFocus] = useState<string | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deepOpen, setDeepOpen] = useState(false);
  const numbers = useMemo(() => refNumbering(card.refIds), [card.refIds]);
  const cite = (id: string) => {
    setSourceFocus(id);
    setSourcesOpen(true);
  };

  const status = card.editorial.status;
  const header = (
    <header className="card__head">
      <div className="row card__meta">
        <span className="chip">{t(`card.type.${card.type}` as MessageKey)}</span>
        {lessonTitle ? <span className="small muted">· {lessonTitle}</span> : null}
      </div>
      <h1 className="card__title" tabIndex={-1}>{card.title}</h1>
    </header>
  );

  if (mode === 'recall') {
    return (
      <article className="card">
        {header}
        <div className="recall">
          <p className="eyebrow">{t('session.recallPrompt')}</p>
          <p className="recall__q">{card.recall}</p>
        </div>
      </article>
    );
  }

  const readAloud = () => {
    const text = [card.title, card.core, card.body, card.application, card.pearl].filter(Boolean).map((s) => stripForSpeech(s!)).join('. ');
    speak(text, { lang: prefs.locale, rate: prefs.audioRate, voiceURI: prefs.voiceURI });
  };

  return (
    <article className="card">
      {header}
      {mode === 'revealed' ? <p className="small muted card__recallq">{card.recall}</p> : null}
      <div className="card__core" tabIndex={-1}><RichText text={card.core} onCite={cite} refNumbers={numbers} /></div>
      <RichText className="card__body" text={card.body} onCite={cite} refNumbers={numbers} />
      {card.visual ? <FlowDiagram rows={card.visual.rows} alt={card.visual.alt} /> : null}
      {card.application ? (
        <section className="card__block">
          <h2 className="eyebrow">{t('card.application')}</h2>
          <RichText text={card.application} onCite={cite} refNumbers={numbers} />
        </section>
      ) : null}
      {card.pearl ? (
        <section className="card__block card__pearl">
          <h2 className="eyebrow">{t('card.pearl')}</h2>
          <RichText text={card.pearl} onCite={cite} refNumbers={numbers} />
        </section>
      ) : null}
      {card.deepDive ? (
        <section className="card__block">
          <button type="button" className="linklike" aria-expanded={deepOpen} onClick={() => setDeepOpen((o) => !o)}>
            <BookOpen className="icon" aria-hidden="true" /> {t('card.deepDive')}
          </button>
          {deepOpen ? <RichText text={card.deepDive} onCite={cite} refNumbers={numbers} /> : null}
        </section>
      ) : null}
      <section className="card__block">
        <h2 className="eyebrow">{t('card.evidence')}</h2>
        <EvidenceBadge label={card.evidence.label} note={card.evidence.note} />
      </section>
      <footer className="card__foot">
        <p className="small muted">
          {t('card.reviewed', { date: formatDate(card.editorial.reviewedAt) })}
          {` · ${t(`card.status.${status}` as MessageKey)}`}
        </p>
        <div className="card__actions">
          <button type="button" className="cardaction" onClick={onToggleSave} aria-pressed={saved}>
            {saved ? <BookmarkCheck className="icon" aria-hidden="true" /> : <Bookmark className="icon" aria-hidden="true" />}
            <span>{saved ? t('card.saved') : t('card.save')}</span>
          </button>
          <button type="button" className="cardaction" onClick={readAloud} disabled={!speechSupported()}>
            <Volume2 className="icon" aria-hidden="true" /><span>{t('card.listen')}</span>
          </button>
          <button type="button" className="cardaction" onClick={() => { setSourceFocus(null); setSourcesOpen(true); }}>
            <ExternalLink className="icon" aria-hidden="true" /><span>{t('card.source')}</span>
          </button>
          <button type="button" className="cardaction" onClick={() => setReportOpen(true)}>
            <Flag className="icon" aria-hidden="true" /><span>{t('card.report')}</span>
          </button>
        </div>
      </footer>
      <SourcesSheet open={sourcesOpen} onClose={() => setSourcesOpen(false)} refIds={card.refIds} references={references} focusId={sourceFocus} />
      <ReportSheet open={reportOpen} onClose={() => setReportOpen(false)} itemId={card.id} />
    </article>
  );
}
