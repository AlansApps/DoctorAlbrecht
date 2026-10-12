/**
 * Browser speech synthesis (no audio files downloaded by default, spec 05).
 * Capabilities vary by platform: on iOS speech may stop when the screen locks,
 * and available voices depend on the device. Callers must offer the text too.
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
    .replace(/\s+/g, ' ')
    .trim();
}

export function voicesFor(lang: string): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  return speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(lang));
}

export interface SpeakOptions {
  lang: 'es' | 'en';
  rate: number;
  voiceURI: string | null;
  /** `finished` is false when the utterance was cancelled or failed. */
  onEnd?: (finished: boolean) => void;
}

export function speak(text: string, opts: SpeakOptions): SpeechSynthesisUtterance | null {
  if (!speechSupported() || !text) return null;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = opts.lang === 'es' ? 'es-ES' : 'en-GB';
  u.rate = opts.rate;
  const voice = opts.voiceURI ? speechSynthesis.getVoices().find((v) => v.voiceURI === opts.voiceURI) : voicesFor(opts.lang)[0];
  if (voice) u.voice = voice;
  if (opts.onEnd) {
    const onEnd = opts.onEnd;
    u.onend = () => onEnd(true);
    u.onerror = () => onEnd(false);
  }
  speechSynthesis.speak(u);
  return u;
}

export function stopSpeaking(): void {
  if (speechSupported()) speechSynthesis.cancel();
}

export function pauseSpeaking(): void {
  if (speechSupported()) speechSynthesis.pause();
}

export function resumeSpeaking(): void {
  if (speechSupported()) speechSynthesis.resume();
}
