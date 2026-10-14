import { describe, expect, it } from 'vitest';
import { splitForSpeech, voiceLabel, voiceScore } from './speech.ts';

describe('speech helpers', () => {
  it('splits into sentences and breaks very long ones at commas', () => {
    expect(splitForSpeech('Primera frase. Segunda frase? Tercera sin punto')).toEqual(['Primera frase.', 'Segunda frase?', 'Tercera sin punto']);
    expect(splitForSpeech('NICE (1.17.6) dice 2.5 mg. Fin.')).toEqual(['NICE (1.17.6) dice 2.5 mg.', 'Fin.']);
    const long = Array.from({ length: 30 }, (_, i) => `parte ${i}`).join(', ') + '.';
    const chunks = splitForSpeech(long);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((c) => c.length <= 220)).toBe(true);
    expect(chunks.join(' ')).toBe(long);
  });

  it('prefers natural voices, then Argentine Spanish', () => {
    const robot = { name: 'Microsoft Helena - Spanish (Spain)', lang: 'es-ES' };
    const natural = { name: 'Microsoft Elena Online (Natural) - Spanish (Argentina)', lang: 'es-AR' };
    const google = { name: 'Google español', lang: 'es-ES' };
    const sorted = [robot, google, natural].sort((a, b) => voiceScore(b, 'es') - voiceScore(a, 'es'));
    expect(sorted.map((v) => v.lang)).toEqual(['es-AR', 'es-ES', 'es-ES']);
    expect(sorted[1]).toBe(google);
    expect(voiceLabel(natural)).toBe('Elena Online · Argentina · natural');
  });
});

describe('preferences', () => {
  it('Spanish by default, and v1 preferences move once to Spanish and a calmer rate', async () => {
    localStorage.clear();
    const store = { set: (k: string, v: string) => localStorage.setItem(k, v) };
    const { loadPrefs } = await import('../storage/prefs.ts');
    expect(loadPrefs().locale).toBe('es');
    expect(loadPrefs().audioRate).toBe(0.9);
    store.set('tarjetalan:prefs', JSON.stringify({ locale: 'en', audioRate: 1, theme: 'dark' }));
    expect(loadPrefs()).toMatchObject({ locale: 'es', audioRate: 0.9, theme: 'dark', v: 2 });
    store.set('tarjetalan:prefs', JSON.stringify({ locale: 'en', audioRate: 1.1, v: 2 }));
    expect(loadPrefs()).toMatchObject({ locale: 'en', audioRate: 1.1 });
  });
});
