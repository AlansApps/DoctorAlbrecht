import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppState } from '../../app/AppState.tsx';
import { speak, speechSupported, voiceLabel, voicesFor } from '../../audio/speech.ts';
import { useI18n } from '../../i18n/i18n.tsx';
import { Button } from '../../ui/components.tsx';

/** Voice and speed for read-aloud, shared by Settings and the audio session. */
export function VoiceSettings() {
  const { t } = useI18n();
  const { prefs, setPrefs } = useAppState();
  const supported = speechSupported();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Voices load asynchronously (Chrome/Edge fire 'voiceschanged' later).
  useEffect(() => {
    if (!supported) return;
    const update = () => setVoices(voicesFor(prefs.locale));
    update();
    speechSynthesis.addEventListener('voiceschanged', update);
    return () => speechSynthesis.removeEventListener('voiceschanged', update);
  }, [supported, prefs.locale]);

  if (!supported) return <p className="small muted">{t('listen.unsupported')}</p>;
  const selected = voices.find((v) => v.voiceURI === prefs.voiceURI) ? prefs.voiceURI : '';
  const hasNatural = voices.some((v) => /natural|neural|online|premium|enhanced/i.test(v.name));

  return (
    <div className="stack">
      <label className="field">
        <span className="eyebrow">{t('listen.voice')}</span>
        <select id="audio-voice" value={selected ?? ''} onChange={(e) => setPrefs({ voiceURI: e.target.value || null })}>
          <option value="">{t('listen.voice.auto')}{voices[0] ? ` (${voiceLabel(voices[0])})` : ''}</option>
          {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{voiceLabel(v)}</option>)}
        </select>
      </label>
      <label className="field">
        <span className="eyebrow">{t('listen.speed')} · <span className="tabular">{prefs.audioRate.toFixed(2)}×</span></span>
        <input id="audio-rate" type="range" min={0.6} max={1.3} step={0.05} value={prefs.audioRate} onChange={(e) => setPrefs({ audioRate: Number(e.target.value) })} />
        <span className="small muted row" style={{ justifyContent: 'space-between' }}><span>{t('listen.speed.slow')}</span><span>{t('listen.speed.fast')}</span></span>
      </label>
      <div>
        <Button icon={Play} onClick={() => speak(t('listen.sample'), { lang: prefs.locale, rate: prefs.audioRate, voiceURI: prefs.voiceURI })}>{t('listen.test')}</Button>
      </div>
      <p className="small muted">{hasNatural ? t('listen.voice.hintNatural') : t('listen.voice.hint')}</p>
    </div>
  );
}
