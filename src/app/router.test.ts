import { describe, expect, it } from 'vitest';
import { href, parseHash } from './router.ts';

describe('router', () => {
  it('round-trips every route', () => {
    for (const r of [{ name: 'home' }, { name: 'topics' }, { name: 'macro', macroId: 'fert' }, { name: 'review' }, { name: 'settings' },
      { name: 'session' }, { name: 'listen' }, { name: 'card', itemId: 'fert-or.c1' }, { name: 'case', itemId: 'fert-or.case1' }] as const) {
      expect(parseHash(href(r))).toEqual(r);
    }
  });
  it('malformed or unknown hashes fall back to home instead of throwing', () => {
    expect(parseHash('#/card/%E0%A4%A')).toEqual({ name: 'home' });
    expect(parseHash('#/nope')).toEqual({ name: 'home' });
    expect(parseHash('')).toEqual({ name: 'home' });
  });
});
