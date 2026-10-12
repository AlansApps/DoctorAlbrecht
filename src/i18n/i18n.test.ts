import { describe, expect, it } from 'vitest';
import { en } from './en.ts';
import { es } from './es.ts';
import { interpolate } from './i18n.tsx';

/** Every placeholder name used in a template, including plural forms {n|one|other}. */
function placeholders(template: string): string[] {
  return [...template.matchAll(/\{(\w+)(?:\|[^}]*)?\}/g)].map((m) => m[1]!);
}

describe('interface strings', () => {
  it('EN has exactly the same keys as ES', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort());
  });

  it('no template braces survive interpolation, for counts 0, 1 and 2, in both languages', () => {
    for (const table of [es, en] as Record<string, string>[]) {
      for (const [key, template] of Object.entries(table)) {
        for (const n of [0, 1, 2]) {
          const vars = Object.fromEntries(placeholders(template).map((p) => [p, n]));
          const out = interpolate(template, vars);
          expect(out, `${key} with ${n}`).not.toMatch(/[{}]/);
        }
      }
    }
  });

  it('picks singular and plural forms', () => {
    expect(interpolate('{n} {n|pendiente|pendientes} hoy', { n: 1 })).toBe('1 pendiente hoy');
    expect(interpolate('{n} {n|pendiente|pendientes} hoy', { n: 3 })).toBe('3 pendientes hoy');
    expect(interpolate('{n} {n|pendiente|pendientes} hoy', { n: 0 })).toBe('0 pendientes hoy');
  });
});
