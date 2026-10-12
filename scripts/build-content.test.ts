import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildContent } from './build-content.ts';
import { Manifest, Pack } from '../src/domain/content/schema.ts';

const load = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const real = () => ({
  curriculum: load('content/curriculum.json'),
  references: load('content/references.json'),
  modules: [{ name: 'fert', data: load('content/modules/fert-ovarian-reserve.json') }],
});
type Mod = { items: Array<Record<string, any>>; lessons: Array<Record<string, any>> };
const mod = (f: ReturnType<typeof real>) => f.modules[0]!.data as Mod;

describe('content build', () => {
  it('builds valid packs and manifest from the real corpus (drafts included)', () => {
    const res = buildContent(real(), true, '2026-10-12T00:00:00Z');
    expect(res.errors).toEqual([]);
    expect(() => Manifest.parse(res.manifest)).not.toThrow();
    for (const p of res.packs) expect(() => Pack.parse(JSON.parse(p.json))).not.toThrow();
  });

  it('stable builds ship only audited items (ai-audited / needs-human-review)', () => {
    const f = real();
    const statuses = new Map(mod(f).items.map((i) => [i.id as string, i.editorial.status as string]));
    const res = buildContent(f, false, 'x');
    expect(res.manifest!.index.length).toBeGreaterThan(0);
    for (const e of res.manifest!.index) expect(['ai-audited', 'needs-human-review']).toContain(statuses.get(e.id));
    const unaudited = [...statuses].filter(([, st]) => st === 'draft' || st === 'sources-verified').map(([id]) => id);
    for (const id of unaudited) expect(res.manifest!.index.some((e) => e.id === id)).toBe(false);
  });

  it('rejects a card without any cited claim', () => {
    const f = real();
    const card = mod(f).items.find((i) => i.kind === 'card')!;
    card.core = { es: 'Sin cita.', en: 'No citation.' };
    card.body = { es: 'Tampoco.', en: 'Neither.' };
    expect(buildContent(f, true, 'x').errors.join()).toMatch(/no cited claim/);
  });

  it('rejects unknown citations and ES/EN citation mismatch', () => {
    const f = real();
    const card = mod(f).items.find((i) => i.kind === 'card')!;
    card.core = { es: 'X [[ref:invented-2024]]', en: 'X [[ref:asrm-2020-ovarian-reserve]]' };
    const errs = buildContent(f, true, 'x').errors.join();
    expect(errs).toMatch(/unknown citation invented-2024/);
    expect(errs).toMatch(/ES\/EN citations differ/);
  });

  it('rejects questions with zero or two correct options', () => {
    const f = real();
    const q = mod(f).items.find((i) => i.kind === 'question')!;
    q.options[1].correct = true;
    q.options[0].correct = true;
    expect(buildContent(f, true, 'x').errors.join()).toMatch(/exactly one correct option/);
  });

  it('rejects duplicate ids and orphan items', () => {
    const f = real();
    const items = mod(f).items;
    items.push({ ...items[0]!, id: 'fert-or.orphan' });
    items.push({ ...items[1]! });
    const errs = buildContent(f, true, 'x').errors.join();
    expect(errs).toMatch(/not referenced by any lesson/);
    expect(errs).toMatch(/duplicate id/);
  });

  it('rejects lessons pointing at a micro outside the macro', () => {
    const f = real();
    mod(f).lessons[0]!.microId = 'pcos.diagnosis-criteria';
    expect(buildContent(f, true, 'x').errors.join()).toMatch(/not in macro fert/);
  });
});

describe('ARCH-025/031', () => {
  it('rejects prerequisite cycles between micros', () => {
    const f = real();
    const lessons = mod(f).lessons;
    lessons[0]!.prerequisites = ['fert.age-timing'];
    lessons[1]!.microId = 'fert.age-timing';
    lessons[1]!.prerequisites = ['fert.amh-afc'];
    expect(buildContent(f, true, 'x').errors.join()).toMatch(/prerequisite cycle/);
  });

  it('global order is unique across the corpus', () => {
    const res = buildContent(real(), true, 'x');
    const orders = res.manifest!.index.map((e) => e.order);
    expect(new Set(orders).size).toBe(orders.length);
  });
});
