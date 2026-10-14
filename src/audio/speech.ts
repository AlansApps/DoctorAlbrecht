/**
 * Browser speech synthesis (no audio files downloaded by default, spec 05).
 * Capabilities vary by platform: on iOS speech may stop when the screen locks,
 * and available voices depend on the device. Callers must offer the text too.
 *
 * Text is spoken sentence by sentence: Chrome cuts long utterances after ~15 s,
 * and native pause/resume is unreliable on Android, so pausing cancels and
 * resuming restarts from the current sentence.
 */
export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

/** Remove citation markers and markup so URLs/refs are never read aloud. */
export function stripForSpeech(text: string): string {
  return text
    .replace(/\[\[ref:[^\]]+\]\]/g, '')
    .replace(/\*\*/g, '')
    .replace(/^- /gm, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/([.!?:])(\s*\.)+/g, '$1') // no ".." when joining sentences (UX-043)
    .replace(/\s+/g, ' ')
    .trim();
}

const MAX_CHUNK = 220;

/** Split into sentences (and long sentences at commas/semicolons) for natural pauses and pausable playback. */
export function splitForSpeech(text: string): string[] {
  // Only punctuation followed by a space ends a sentence, so "1.17.6" or "2,5" stay whole.
  const sentences = text.split(/(?<=[.!?…]["»”)]*)\s+/);
  const out: string[] = [];
  for (const raw of sentences) {
    const s = raw.trim();
    if (!s) continue;
    if (s.length <= MAX_CHUNK) {
      out.push(s);
      continue;
    }
    let buf = '';
    for (const part of s.split(/(?<=[,;:])\s+/)) {
      if (buf && `${buf} ${part}`.length > MAX_CHUNK) {
        out.push(buf);
        buf = part;
      } else buf = buf ? `${buf} ${part}` : part;
    }
    if (buf) out.push(buf);
  }
  return out;
}

type VoiceLike = Pick<SpeechSynthesisVoice, 'name' | 'lang'>;

/** Higher is better: neural/natural voices first, then the regional variant preferred for the locale. */
export function voiceScore(v: VoiceLike, lang: 'es' | 'en'): number {
  const name = v.name.toLowerCase();
  let score = 0;
  if (/natural|neural|online|premium|enhanced|mejorad|siri/.test(name)) score += 100;
  if (/google/.test(name)) score += 40;
  if (/compact|eloquence|espeak/.test(name)) score -= 50;
  const tag = v.lang.toLowerCase().replace('_', '-');
  const regions = lang === 'es' ? ['es-ar', 'es-419', 'es-us', 'es-mx', 'es-es'] : ['en-gb', 'en-us'];
  const i = regions.indexOf(tag);
  if (i >= 0) score += 20 - i * 3;
  return score;
}

export function voicesFor(lang: 'es' | 'en'): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  return speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith(lang))
    .sort((a, b) => voiceScore(b, lang) - voiceScore(a, lang) || a.name.localeCompare(b.name));
}

const REGION_NAMES: Record<string, string> = {
  'es-ar': 'Argentina', 'es-es': 'España', 'es-mx': 'México', 'es-us': 'EE. UU.', 'es-419': 'Latinoamérica',
  'es-co': 'Colombia', 'es-cl': 'Chile', 'es-uy': 'Uruguay', 'en-gb': 'UK', 'en-us': 'US',
};

/** "Elena · Argentina · natural" style label from the platform's voice name. */
export function voiceLabel(v: VoiceLike): string {
  const region = REGION_NAMES[v.lang.toLowerCase().replace('_', '-')] ?? v.lang;
  const natural = /natural|neural|online|premium|enhanced/i.test(v.name);
  const short = v.name
    .replace(/^(Microsoft|Google|Apple)\s+/i, '')
    .replace(/\s*\((natural|neural|online|enhanced|premium|mejorada)\)/gi, '')
    .replace(/\s*-\s*.*$/, '')
    .trim();
  return [short || v.name, region, natural ? 'natural' : null].filter(Boolean).join(' · ');
}

function pickVoice(lang: 'es' | 'en', voiceURI: string | null): SpeechSynthesisVoice | undefined {
  const chosen = voiceURI ? speechSynthesis.getVoices().find((v) => v.voiceURI === voiceURI) : undefined;
  return chosen ?? voicesFor(lang)[0];
}

export interface SpeakOptions {
  lang: 'es' | 'en';
  rate: number;
  voiceURI: string | null;
  /** Start from this sentence (resume after a pause). */
  fromChunk?: number;
  /** Called as each sentence starts, so callers can resume from it. */
  onChunk?: (index: number, total: number) => void;
  /** `finished` is false when the speech failed. Not called after stopSpeaking(). */
  onEnd?: (finished: boolean) => void;
}

/** Bumped on every new speak/stop: callbacks from cancelled speech are ignored. */
let generation = 0;

export function speak(text: string, opts: SpeakOptions): boolean {
  if (!speechSupported() || !text) return false;
  speechSynthesis.cancel();
  const gen = ++generation;
  const chunks = splitForSpeech(text);
  const voice = pickVoice(opts.lang, opts.voiceURI);
  const next = (i: number) => {
    if (gen !== generation) return;
    if (i >= chunks.length) {
      opts.onEnd?.(true);
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks[i]!);
    u.lang = voice?.lang ?? (opts.lang === 'es' ? 'es-AR' : 'en-GB');
    if (voice) u.voice = voice;
    u.rate = opts.rate;
    u.onstart = () => {
      if (gen === generation) opts.onChunk?.(i, chunks.length);
    };
    u.onend = () => next(i + 1);
    u.onerror = (e) => {
      if (gen !== generation) return;
      // 'interrupted'/'canceled' come from our own cancel; anything else ends the speech.
      if (e.error !== 'interrupted' && e.error !== 'canceled') opts.onEnd?.(false);
    };
    speechSynthesis.speak(u);
  };
  next(Math.max(0, Math.min(opts.fromChunk ?? 0, chunks.length)));
  return true;
}

export function stopSpeaking(): void {
  generation++;
  if (speechSupported()) speechSynthesis.cancel();
}
