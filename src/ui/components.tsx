/**
 * Shared presentational components. Content text is always rendered as React
 * text nodes (never innerHTML): the tiny markup supported is **bold**, paragraphs
 * separated by a blank line, "- " list lines and [[ref:id]] citation markers.
 */
import {
  Ban, BadgeCheck, CircleQuestionMark, FlaskConical, House, LayoutGrid, Link2, Microscope, RefreshCcw, Settings as SettingsIcon,
  Check, X, ArrowRight, CornerDownRight, Info, type LucideIcon,
} from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { splitCitations, type EvidenceLabel } from '../domain/content/schema.ts';
import { href, type Route } from '../app/router.ts';
import { useI18n } from '../i18n/i18n.tsx';
import type { MessageKey } from '../i18n/es.ts';

// ---------- Button ----------
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
export function Button({ variant = 'secondary', block, icon: Icon, children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant; block?: boolean; icon?: LucideIcon;
}) {
  return (
    <button type="button" className={`btn btn--${variant}${block ? ' btn--block' : ''}${className ? ` ${className}` : ''}`} {...rest}>
      {Icon ? <Icon className="icon" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}

export function LinkButton({ to, variant = 'secondary', block, icon: Icon, children }: { to: Route; variant?: Variant; block?: boolean; icon?: LucideIcon; children: ReactNode }) {
  return (
    <a href={href(to)} className={`btn btn--${variant}${block ? ' btn--block' : ''}`}>
      {Icon ? <Icon className="icon" aria-hidden="true" /> : null}
      <span>{children}</span>
    </a>
  );
}

// ---------- Rich text ----------
function inline(text: string, keyBase: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={`${keyBase}-${i}`}>{part.slice(2, -2)}</strong> : <span key={`${keyBase}-${i}`}>{part}</span>,
  );
}

export function RichText({ text, onCite, refNumbers, className }: {
  text: string; onCite?: (refId: string) => void; refNumbers?: ReadonlyMap<string, number>; className?: string;
}) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className={`rich${className ? ` ${className}` : ''}`}>
      {blocks.map((block, bi) => {
        const lines = block.split('\n');
        const renderLine = (line: string, li: number) =>
          splitCitations(line).map((seg, si) =>
            'ref' in seg ? (
              <Cite key={`${bi}-${li}-${si}`} refId={seg.ref} n={refNumbers?.get(seg.ref)} onCite={onCite} />
            ) : (
              <span key={`${bi}-${li}-${si}`}>{inline(seg.text.replace(/\s+$/, ' '), `${bi}-${li}-${si}`)}</span>
            ),
          );
        if (lines.every((l) => l.startsWith('- '))) {
          return <ul key={bi}>{lines.map((l, li) => <li key={li}>{renderLine(l.slice(2), li)}</li>)}</ul>;
        }
        return <p key={bi}>{lines.map((l, li) => <span key={li}>{li > 0 ? <br /> : null}{renderLine(l, li)}</span>)}</p>;
      })}
    </div>
  );
}

function Cite({ refId, n, onCite }: { refId: string; n: number | undefined; onCite: ((id: string) => void) | undefined }) {
  const { t } = useI18n();
  const label = n ? String(n) : '•';
  if (!onCite) return <sup className="cite">[{label}]</sup>;
  return (
    <button type="button" className="cite" onClick={() => onCite(refId)} aria-label={`${t('card.source')} ${label}`}>
      <sup>[{label}]</sup>
    </button>
  );
}

// ---------- Evidence badge (icon + text, never colour alone) ----------
const EVIDENCE_ICON: Record<EvidenceLabel, LucideIcon> = {
  guideline: BadgeCheck,
  limited: FlaskConical,
  association: Link2,
  mechanistic: Microscope,
  insufficient: CircleQuestionMark,
  'not-recommended': Ban,
};

export function EvidenceBadge({ label, note }: { label: EvidenceLabel; note?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const Icon = EVIDENCE_ICON[label];
  return (
    <div className="evidence">
      <div className={`evidence__badge evidence--${label}`}>
        <Icon className="icon" aria-hidden="true" />
        <span>{t(`evidence.${label}` as MessageKey)}</span>
      </div>
      {note ? <p className="evidence__note">{note}</p> : null}
      <button type="button" className="linklike small" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Info className="icon" aria-hidden="true" /> {t('evidence.legend')}
      </button>
      {open ? (
        <div className="stack small">
          <p className="muted">{t('evidence.legend.text')}</p>
          <ul className="evidence__legend">
            {(Object.keys(EVIDENCE_ICON) as EvidenceLabel[]).map((l) => {
              const I = EVIDENCE_ICON[l];
              return (
                <li key={l} className={`evidence--${l}`}>
                  <I className="icon" aria-hidden="true" />
                  <span>{t(`evidence.${l}` as MessageKey)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

// ---------- Flow diagram with text alternative ----------
const MARK: Record<string, { Icon: LucideIcon; cls: string }> = {
  node: { Icon: CornerDownRight, cls: 'node' },
  yes: { Icon: Check, cls: 'yes' },
  no: { Icon: X, cls: 'no' },
  arrow: { Icon: ArrowRight, cls: 'arrow' },
  note: { Icon: Info, cls: 'note' },
};

export function FlowDiagram({ rows, alt }: { rows: { mark: string; text: string }[]; alt: string }) {
  const { t } = useI18n();
  return (
    <figure className="flow" aria-label={`${t('card.diagram')}: ${alt}`}>
      <ol className="flow__rows" aria-hidden="true">
        {rows.map((r, i) => {
          const m = MARK[r.mark] ?? MARK.note!;
          return (
            <li key={i} className={`flow__row flow__row--${m.cls}`}>
              <m.Icon className="icon" />
              <span>{r.text}</span>
            </li>
          );
        })}
      </ol>
      <figcaption className="visually-hidden">{alt}</figcaption>
    </figure>
  );
}

// ---------- Modal sheet (native <dialog>: focus trap, Esc, inert background) ----------
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId(); // unique per sheet: each dialog announces its own title (UX-037)
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const { t } = useI18n();
  return (
    <dialog ref={ref} className="sheet" onClose={onClose} onCancel={onClose} aria-labelledby={titleId}>
      <div className="sheet__head">
        <h2 id={titleId}>{title}</h2>
        <button type="button" className="iconbtn" onClick={onClose} aria-label={t('app.close')}>
          <X className="icon" aria-hidden="true" />
        </button>
      </div>
      <div className="sheet__body">{children}</div>
    </dialog>
  );
}

// ---------- Bottom navigation ----------
const NAV: { route: Route; key: MessageKey; Icon: LucideIcon; match: Route['name'][] }[] = [
  { route: { name: 'home' }, key: 'nav.home', Icon: House, match: ['home', 'listen'] },
  { route: { name: 'topics' }, key: 'nav.topics', Icon: LayoutGrid, match: ['topics', 'macro'] },
  { route: { name: 'review' }, key: 'nav.review', Icon: RefreshCcw, match: ['review', 'card'] },
  { route: { name: 'settings' }, key: 'nav.settings', Icon: SettingsIcon, match: ['settings'] },
];

export function BottomNav({ current }: { current: Route['name'] }) {
  const { t } = useI18n();
  return (
    <nav className="bottomnav" aria-label={t('nav.main')}>
      {NAV.map(({ route, key, Icon, match }) => {
        const active = match.includes(current);
        return (
          <a key={key} href={href(route)} className={`bottomnav__item${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}>
            <Icon className="icon" aria-hidden="true" />
            <span>{t(key)}</span>
          </a>
        );
      })}
    </nav>
  );
}

/**
 * Action bar pinned to the bottom of the viewport (position: sticky) at the end of the
 * screen content: always reachable with one thumb, and because it takes its own
 * space in the flow it can never cover the last content, at any text size (UX-034).
 */
export function ActionBar({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tall, setTall] = useState(false);
  // A very tall bar (large text + four rating buttons) would hide too much of the reading:
  // then it stays at the end of the content instead of pinned (UX-044).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const next = el.offsetHeight > window.innerHeight * 0.28;
    if (next !== tall) setTall(next);
  });
  return <div ref={ref} className={tall ? 'actionbar is-static' : 'actionbar'}><div className="actionbar__inner">{children}</div></div>;
}

export function Notice({ tone = 'info', children, action }: { tone?: 'info' | 'warn' | 'error'; children: ReactNode; action?: ReactNode }) {
  return (
    <div className={`notice notice--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Info className="icon" aria-hidden="true" />
      <div className="notice__body">{children}</div>
      {action}
    </div>
  );
}

export function Segmented<T extends string | number>({ label, options, value, onChange }: {
  label: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <fieldset className="segmented">
      <legend className="eyebrow">{label}</legend>
      <div className="segmented__opts">
        {options.map((o) => (
          <label key={String(o.value)} className={`segmented__opt${o.value === value ? ' is-on' : ''}`}>
            <input type="radio" name={label} checked={o.value === value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
