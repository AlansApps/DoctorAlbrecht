/**
 * Content build: validates the bilingual authoring files and emits one pack per
 * module and locale plus a manifest with a language-neutral index.
 *
 *   node scripts/build-content.ts            build into public/content
 *   node scripts/build-content.ts --check    validate only
 *
 * Drafts are excluded unless CONTENT_INCLUDE_DRAFTS=1 (local development).
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  AuthorCurriculum, AuthorModule, AuthorReference, extractCitations, LOCALES,
  type AuthorItem, type EditorialStatus, type IndexEntry, type Locale, type Manifest, type Pack, type PackItem,
} from '../src/domain/content/schema.ts';

const ROOT = 'content';
const OUT = join('public', 'content');
const SHIPPED: EditorialStatus[] = ['ai-audited', 'needs-human-review'];

export interface BuildResult {
  errors: string[];
  warnings: string[];
  manifest?: Manifest;
  packs: { file: string; json: string }[];
}

type Bi = { es: string; en: string };

function citationsIn(text: string): string[] {
  return extractCitations(text);
}

function biTexts(item: AuthorItem): Bi[] {
  switch (item.kind) {
    case 'card':
      return [item.core, item.body, item.application, item.pearl, item.deepDive, item.evidence.note].filter((x): x is Bi => !!x);
    case 'question':
      return [item.stem, item.explanation, ...item.options.flatMap((o) => [o.text, o.why])];
    case 'case':
      return item.steps.map((s) => s.text);
  }
}

export function buildContent(files: {
  curriculum: unknown;
  references: unknown;
  modules: { name: string; data: unknown }[];
}, includeDrafts: boolean, generatedAt: string): BuildResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const packs: BuildResult['packs'] = [];

  const cur = AuthorCurriculum.safeParse(files.curriculum);
  if (!cur.success) return { errors: [`curriculum.json: ${cur.error.message}`], warnings, packs };
  const refsParsed = AuthorReference.array().safeParse(files.references);
  if (!refsParsed.success) return { errors: [`references.json: ${refsParsed.error.message}`], warnings, packs };

  const refs = new Map<string, AuthorReference>();
  for (const r of refsParsed.data) {
    if (refs.has(r.id)) errors.push(`references.json: duplicate id ${r.id}`);
    refs.set(r.id, r);
  }

  const micros = new Map<string, string>(); // microId → macroId
  const microOrder = new Map<string, number>(); // position within its macro
  for (const m of cur.data.macros) m.micros.forEach((mi, pos) => {
    if (micros.has(mi.id)) errors.push(`curriculum.json: duplicate micro ${mi.id}`);
    micros.set(mi.id, m.id);
    microOrder.set(mi.id, pos);
  });

  const seen = new Set<string>();
  const usedRefs = new Set<string>();
  const index: IndexEntry[] = [];
  const manifestModules: Manifest['modules'] = [];
  const availableMicros = new Set<string>();

  const microPrereqs = new Map<string, Set<string>>();
  for (const [moduleIdx, { name, data }] of files.modules.entries()) {
    const parsed = AuthorModule.safeParse(data);
    if (!parsed.success) {
      errors.push(`${name}: ${parsed.error.message}`);
      continue;
    }
    const mod = parsed.data;
    if (mod.lessons.length > 99) errors.push(`${name}: more than 99 lessons`);
    for (const l of mod.lessons) {
      if (l.itemIds.length > 99) errors.push(`${name} › ${l.id}: more than 99 items`);
      const set = microPrereqs.get(l.microId) ?? new Set<string>();
      l.prerequisites.forEach((m) => set.add(m));
      microPrereqs.set(l.microId, set);
    }
    const where = (id: string) => `${name} › ${id}`;
    if (!cur.data.macros.some((m) => m.id === mod.macroId)) errors.push(`${name}: unknown macro ${mod.macroId}`);

    for (const id of [mod.id, ...mod.lessons.map((l) => l.id), ...mod.items.map((i) => i.id)]) {
      if (seen.has(id)) errors.push(`${where(id)}: duplicate id`);
      seen.add(id);
    }

    const items = new Map(mod.items.map((i) => [i.id, i]));
    const inLesson = new Set<string>();
    for (const l of mod.lessons) {
      if (micros.get(l.microId) !== mod.macroId) errors.push(`${where(l.id)}: micro ${l.microId} not in macro ${mod.macroId}`);
      for (const p of l.prerequisites) if (!micros.has(p)) errors.push(`${where(l.id)}: unknown prerequisite ${p}`);
      for (const iid of l.itemIds) {
        if (!items.has(iid)) errors.push(`${where(l.id)}: unknown item ${iid}`);
        inLesson.add(iid);
      }
    }

    for (const item of mod.items) {
      if (!inLesson.has(item.id)) errors.push(`${where(item.id)}: not referenced by any lesson`);
      const texts = biTexts(item);
      for (const t of texts) {
        for (const loc of LOCALES) for (const c of citationsIn(t[loc])) {
          if (!refs.has(c)) errors.push(`${where(item.id)}: unknown citation ${c} (${loc})`);
        }
        const esCites = citationsIn(t.es).sort().join();
        const enCites = citationsIn(t.en).sort().join();
        if (esCites !== enCites) errors.push(`${where(item.id)}: ES/EN citations differ`);
        if (t.es.length > 40 && t.es === t.en) warnings.push(`${where(item.id)}: EN identical to ES (untranslated?)`);
      }
      if (item.kind === 'card') {
        const cites = [item.core, item.body].flatMap((b) => citationsIn(b.es));
        if (cites.length === 0) errors.push(`${where(item.id)}: card makes no cited claim in core/body`);
      }
      if (item.kind === 'question') {
        const correct = item.options.filter((o) => o.correct).length;
        if (correct !== 1) errors.push(`${where(item.id)}: needs exactly one correct option (has ${correct})`);
        if (new Set(item.options.map((o) => o.id)).size !== item.options.length) errors.push(`${where(item.id)}: duplicate option ids`);
      }
      if (item.kind !== 'card') for (const r of item.refIds) if (!refs.has(r)) errors.push(`${where(item.id)}: unknown ref ${r}`);
      if (item.kind === 'case') for (const s of item.steps) if (s.questionId && !items.has(s.questionId)) errors.push(`${where(item.id)}: unknown step question ${s.questionId}`);
    }

    // ---- Shipping filter
    const shipped = new Set(mod.items.filter((i) => includeDrafts || SHIPPED.includes(i.editorial.status)).map((i) => i.id));
    const lessons = mod.lessons
      .map((l) => ({ ...l, itemIds: l.itemIds.filter((id) => shipped.has(id)) }))
      .filter((l) => l.itemIds.length > 0);
    if (lessons.length === 0) {
      warnings.push(`${name}: nothing shippable yet (all items are drafts)`);
      continue;
    }

    const packFiles = {} as Manifest['modules'][number]['packs'];
    for (const loc of LOCALES) {
      const packItems: PackItem[] = mod.items.filter((i) => shipped.has(i.id)).map((i) => localizeItem(i, loc));
      const refIds = new Set(packItems.flatMap((i) => i.refIds));
      refIds.forEach((r) => usedRefs.add(r));
      const references: Pack['references'] = {};
      for (const r of [...refIds].sort()) {
        const ref = refs.get(r);
        if (ref) references[r] = { ...ref, population: ref.population[loc], finding: ref.finding[loc], limitations: ref.limitations[loc] };
      }
      const body = {
        schema: 1 as const, moduleId: mod.id, locale: loc,
        lessons: lessons.map((l) => ({ id: l.id, microId: l.microId, title: l.title[loc], objective: l.objective[loc], closing: l.closing[loc], prerequisites: l.prerequisites, level: l.level, itemIds: l.itemIds })),
        items: packItems, references,
      };
      const hash = createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0, 10);
      const json = JSON.stringify({ ...body, hash } satisfies Pack);
      const file = `packs/${mod.id}.${loc}.${hash}.json`;
      packs.push({ file, json });
      packFiles[loc] = { file, hash, bytes: Buffer.byteLength(json) };
    }
    manifestModules.push({ id: mod.id, macroId: mod.macroId, title: mod.title, packs: packFiles });

    lessons.forEach((l, lessonIdx) => {
      availableMicros.add(l.microId);
      const macroOrder = cur.data.macros.find((m) => m.id === mod.macroId)?.order ?? 99;
      const microPos = microOrder.get(l.microId) ?? 999;
      l.itemIds.forEach((id, seq) => {
        const it = items.get(id)!;
        index.push({
          id, kind: it.kind, moduleId: mod.id, lessonId: l.id, microId: l.microId, macroId: mod.macroId,
          conceptId: it.conceptId, seq, rev: it.rev, tags: it.tags,
          // macro (≤99) · micro (≤999) · module (≤99) · lesson (≤99) · seq (≤99): no collisions
          order: (((macroOrder * 1000 + microPos) * 100 + moduleIdx) * 100 + lessonIdx) * 100 + seq,
          prereqMicros: l.prerequisites,
        });
      });
    });
  }

  // Prerequisite cycles between micros would lock both forever.
  const visiting = new Set<string>();
  const done = new Set<string>();
  const visit = (m: string, path: string[]): void => {
    if (done.has(m)) return;
    if (visiting.has(m)) {
      errors.push(`prerequisite cycle: ${[...path, m].join(' → ')}`);
      return;
    }
    visiting.add(m);
    for (const n of microPrereqs.get(m) ?? []) if (n !== m) visit(n, [...path, m]);
    visiting.delete(m);
    done.add(m);
  };
  for (const m of microPrereqs.keys()) visit(m, []);

  for (const r of refs.keys()) if (!usedRefs.has(r)) warnings.push(`references.json: ${r} not cited by any shipped item`);
  if (errors.length) return { errors, warnings, packs: [] };

  const contentVersion = createHash('sha256').update(packs.map((p) => p.file).join('|')).digest('hex').slice(0, 12);
  const manifest: Manifest = {
    schema: 1, contentVersion, generatedAt,
    macros: cur.data.macros.map((m) => ({
      id: m.id, order: m.order, title: m.title, priority: m.priority,
      micros: m.micros.map((mi) => ({ id: mi.id, title: mi.title, aliases: mi.aliases, available: availableMicros.has(mi.id) })),
    })),
    modules: manifestModules,
    index,
  };
  return { errors, warnings, manifest, packs };
}

function localizeItem(i: AuthorItem, loc: Locale): PackItem {
  switch (i.kind) {
    case 'card': {
      const refIds = [...new Set(biTexts(i).flatMap((t) => citationsIn(t.es)))];
      return {
        id: i.id, kind: 'card', type: i.type, conceptId: i.conceptId, rev: i.rev, tags: i.tags,
        title: i.title[loc], core: i.core[loc], body: i.body[loc], recall: i.recall[loc],
        ...(i.visual ? { visual: { kind: 'flow' as const, rows: i.visual.rows.map((r) => ({ mark: r.mark, text: r.text[loc] })), alt: i.visual.alt[loc] } } : {}),
        ...(i.application ? { application: i.application[loc] } : {}),
        ...(i.pearl ? { pearl: i.pearl[loc] } : {}),
        ...(i.deepDive ? { deepDive: i.deepDive[loc] } : {}),
        evidence: { label: i.evidence.label, note: i.evidence.note[loc] },
        refIds, editorial: i.editorial,
      };
    }
    case 'question':
      return {
        id: i.id, kind: 'question', conceptId: i.conceptId, rev: i.rev, difficulty: i.difficulty, tags: i.tags,
        stem: i.stem[loc], options: i.options.map((o) => ({ id: o.id, text: o.text[loc], correct: o.correct, why: o.why[loc] })),
        explanation: i.explanation[loc], refIds: i.refIds, editorial: i.editorial,
      };
    case 'case':
      return {
        id: i.id, kind: 'case', conceptId: i.conceptId, rev: i.rev, tags: i.tags, title: i.title[loc],
        steps: i.steps.map((s) => ({ id: s.id, text: s.text[loc], ...(s.questionId ? { questionId: s.questionId } : {}) })),
        refIds: i.refIds, editorial: i.editorial,
      };
  }
}

// ---------- CLI ----------
/** Shared registry plus one optional file per module (content/references/*.json): parallel authoring without conflicts. */
function readReferences(): unknown[] {
  const shared = readJson(join(ROOT, 'references.json')) as unknown[];
  const dir = join(ROOT, 'references');
  const extra = existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith('.json')).sort().flatMap((f) => readJson(join(dir, f)) as unknown[])
    : [];
  return [...shared, ...extra];
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function main() {
  const check = process.argv.includes('--check');
  const includeDrafts = process.env.CONTENT_INCLUDE_DRAFTS === '1';
  const modDir = join(ROOT, 'modules');
  const modules = existsSync(modDir)
    ? readdirSync(modDir).filter((f) => f.endsWith('.json')).sort().map((f) => ({ name: `modules/${f}`, data: readJson(join(modDir, f)) }))
    : [];
  const res = buildContent(
    { curriculum: readJson(join(ROOT, 'curriculum.json')), references: readReferences(), modules },
    includeDrafts,
    new Date().toISOString(),
  );
  for (const w of res.warnings) console.warn(`warn  ${w}`);
  for (const e of res.errors) console.error(`error ${e}`);
  if (res.errors.length) process.exit(1);
  const items = res.manifest!.index.length;
  console.log(`content ok: ${res.manifest!.modules.length} modules, ${items} items, ${res.packs.length} packs${includeDrafts ? ' (drafts included)' : ''}`);
  if (check) return;
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(join(OUT, 'packs'), { recursive: true });
  for (const p of res.packs) writeFileSync(join(OUT, p.file), p.json);
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(res.manifest));
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, '/')}` || process.argv[1]?.endsWith('build-content.ts')) main();
