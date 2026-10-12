import { useState } from 'react';
import { useAppState } from '../../app/AppState.tsx';
import { useI18n } from '../../i18n/i18n.tsx';
import type { MessageKey } from '../../i18n/es.ts';
import { withDb, type Report } from '../../storage/db.ts';
import { Button, Notice, Sheet } from '../../ui/components.tsx';

const REASONS: Report['reason'][] = ['error', 'source', 'translation', 'unclear', 'other'];

/** Local, exportable problem report. Nothing is sent anywhere (spec 05). */
export function ReportSheet({ open, onClose, itemId }: { open: boolean; onClose: () => void; itemId: string }) {
  const { t } = useI18n();
  const { prefs } = useAppState();
  const [reason, setReason] = useState<Report['reason']>('error');
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  const save = async () => {
    const report: Report = {
      id: crypto.randomUUID(), itemId, locale: prefs.locale, reason, text: text.slice(0, 4000), createdAt: new Date().toISOString(),
    };
    await withDb((db) => db.put('reports', report));
    setSaved(true);
    setText('');
  };

  const close = () => {
    setSaved(false);
    onClose();
  };

  return (
    <Sheet open={open} onClose={close} title={t('report.title')}>
      {saved ? (
        <Notice>{t('report.saved')}</Notice>
      ) : (
        <>
          <p className="small muted">{t('report.note')}</p>
          <label className="field">
            <span className="eyebrow">{t('report.reason')}</span>
            <select id="report-reason" value={reason} onChange={(e) => setReason(e.target.value as Report['reason'])}>
              {REASONS.map((r) => <option key={r} value={r}>{t(`report.reason.${r}` as MessageKey)}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="eyebrow">{t('report.text')}</span>
            <textarea id="report-text" value={text} maxLength={4000} onChange={(e) => setText(e.target.value)} />
          </label>
          <Button variant="primary" block onClick={() => void save()}>{t('report.save')}</Button>
        </>
      )}
    </Sheet>
  );
}
