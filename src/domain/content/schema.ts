/**
 * Content schemas. Shared by the build script (authoring → packs) and the app
 * (validating downloaded packs before marking a module available).
 */
import { z } from 'zod';

export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

const id = z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, 'id: lowercase, kebab/dot separated');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const bi = z.object({ es: z.string().min(1), en: z.string().min(1) });

export const EVIDENCE_LABELS = [
  'guideline', // recomendado por guías
  'limited', // evidencia clínica limitada/emergente
  'mechanistic', // hipótesis mecanística/preclínica
  'insufficient', // respaldo insuficiente
  'not-recommended', // no recomendado/potencialmente perjudicial
  'association', // evidencia observacional: asociación
] as const;
export type EvidenceLabel = (typeof EVIDENCE_LABELS)[number];

/** Editorial pipeline. Only `ai-audited` and `needs-human-review` ship in stable builds. */
export const EDITORIAL_STATUS = ['draft', 'sources-verified', 'ai-audited', 'needs-human-review'] as const;
export type EditorialStatus = (typeof EDITORIAL_STATUS)[number];

export const CARD_TYPES = [
  'concept', 'mechanism', 'diagram', 'comparison', 'case', 'lab', 'diet', 'supplement',
  'myth', 'what-i-would-do', 'what-i-would-not-order', 'patient-phrase', 'active-recall',
] as const;

export const CLINICAL_TAGS = ['hormones', 'diet', 'gut', 'supplements', 'habits', 'reproduction'] as const;

const editorial = z.object({
  status: z.enum(EDITORIAL_STATUS),
  reviewedAt: isoDate, // fecha visible de revisión
  notes: z.string().optional(),
});

// ---------- Authoring (bilingual, one file per module) ----------

export const AuthorReference = z.object({
  id,
  title: z.string().min(1),
  authors: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  url: z.url(),
  doi: z.string().regex(/^10\.\d{4,9}\/\S+$/).optional(),
  type: z.enum(['guideline', 'systematic-review', 'rct', 'cohort', 'case-control', 'cross-sectional', 'narrative-review', 'fact-sheet', 'consensus', 'other']),
  population: bi,
  finding: bi,
  limitations: bi,
  accessed: isoDate,
});
export type AuthorReference = z.infer<typeof AuthorReference>;

const visual = z.object({
  kind: z.literal('flow'),
  /** Simple, exact flow diagram: rows of [marker, text]. No invented curves. */
  rows: z.array(z.object({ mark: z.enum(['node', 'yes', 'no', 'arrow', 'note']), text: bi })).min(1),
  alt: bi,
});

export const AuthorCard = z.object({
  id,
  kind: z.literal('card'),
  type: z.enum(CARD_TYPES),
  conceptId: id,
  rev: z.number().int().min(1), // material revision; bump when meaning changes
  tags: z.array(z.enum(CLINICAL_TAGS)).default([]),
  title: bi,
  core: bi,
  body: bi,
  visual: visual.optional(),
  application: bi.optional(),
  pearl: bi.optional(),
  deepDive: bi.optional(),
  evidence: z.object({ label: z.enum(EVIDENCE_LABELS), note: bi }),
  /** Recall prompt shown before revealing the card in review mode. */
  recall: bi,
  editorial,
});

export const AuthorQuestion = z.object({
  id,
  kind: z.literal('question'),
  conceptId: id,
  rev: z.number().int().min(1),
  difficulty: z.number().int().min(1).max(3),
  tags: z.array(z.enum(CLINICAL_TAGS)).default([]),
  stem: bi,
  options: z
    .array(z.object({ id: z.string().regex(/^[a-z]$/), text: bi, correct: z.boolean(), why: bi }))
    .min(3)
    .max(5),
  explanation: bi,
  refIds: z.array(id).min(1),
  editorial,
});

export const AuthorCase = z.object({
  id,
  kind: z.literal('case'),
  conceptId: id,
  rev: z.number().int().min(1),
  tags: z.array(z.enum(CLINICAL_TAGS)).default([]),
  title: bi,
  /** Progressive disclosure: each step reveals more, optionally with a question id. */
  steps: z.array(z.object({ id, text: bi, questionId: id.optional() })).min(2),
  refIds: z.array(id).min(1),
  editorial,
});

export const AuthorItem = z.discriminatedUnion('kind', [AuthorCard, AuthorQuestion, AuthorCase]);
export type AuthorItem = z.infer<typeof AuthorItem>;

export const AuthorLesson = z.object({
  id,
  microId: id,
  title: bi,
  objective: bi,
  closing: bi,
  prerequisites: z.array(id).default([]),
  level: z.enum(['base', 'intermediate', 'advanced']),
  itemIds: z.array(id).min(1),
});

export const AuthorModule = z.object({
  id,
  macroId: id,
  title: bi,
  lessons: z.array(AuthorLesson).min(1),
  items: z.array(AuthorItem).min(1),
});
export type AuthorModule = z.infer<typeof AuthorModule>;

export const AuthorCurriculum = z.object({
  macros: z.array(
    z.object({
      id,
      order: z.number().int(),
      title: bi,
      priority: z.boolean().default(false),
      micros: z.array(z.object({ id, title: bi, aliases: z.array(z.string()).default([]) })),
    }),
  ),
});
export type AuthorCurriculum = z.infer<typeof AuthorCurriculum>;

// ---------- Runtime (single-locale packs + manifest) ----------

/** Citation markers inside text: [[ref:some-id]] */
export const CITATION_RE = /\[\[ref:([a-z0-9.-]+)\]\]/g;

export const PackReference = AuthorReference.extend({
  population: z.string(),
  finding: z.string(),
  limitations: z.string(),
});
export type PackReference = z.infer<typeof PackReference>;

const flowRow = z.object({ mark: z.enum(['node', 'yes', 'no', 'arrow', 'note']), text: z.string() });

export const PackCard = z.object({
  id, kind: z.literal('card'), type: z.enum(CARD_TYPES), conceptId: id, rev: z.number().int(),
  tags: z.array(z.enum(CLINICAL_TAGS)), title: z.string(), core: z.string(), body: z.string(),
  visual: z.object({ kind: z.literal('flow'), rows: z.array(flowRow), alt: z.string() }).optional(),
  application: z.string().optional(), pearl: z.string().optional(), deepDive: z.string().optional(),
  evidence: z.object({ label: z.enum(EVIDENCE_LABELS), note: z.string() }),
  recall: z.string(), refIds: z.array(id), editorial,
});
export type PackCard = z.infer<typeof PackCard>;

export const PackQuestion = z.object({
  id, kind: z.literal('question'), conceptId: id, rev: z.number().int(), difficulty: z.number().int(),
  tags: z.array(z.enum(CLINICAL_TAGS)), stem: z.string(),
  options: z.array(z.object({ id: z.string(), text: z.string(), correct: z.boolean(), why: z.string() })),
  explanation: z.string(), refIds: z.array(id), editorial,
});
export type PackQuestion = z.infer<typeof PackQuestion>;

export const PackCase = z.object({
  id, kind: z.literal('case'), conceptId: id, rev: z.number().int(), tags: z.array(z.enum(CLINICAL_TAGS)),
  title: z.string(), steps: z.array(z.object({ id, text: z.string(), questionId: id.optional() })),
  refIds: z.array(id), editorial,
});
export type PackCase = z.infer<typeof PackCase>;

export const PackItem = z.discriminatedUnion('kind', [PackCard, PackQuestion, PackCase]);
export type PackItem = z.infer<typeof PackItem>;

export const Pack = z.object({
  schema: z.literal(1),
  moduleId: id,
  locale: z.enum(LOCALES),
  hash: z.string(),
  lessons: z.array(z.object({
    id, microId: id, title: z.string(), objective: z.string(), closing: z.string(),
    prerequisites: z.array(id), level: z.enum(['base', 'intermediate', 'advanced']), itemIds: z.array(id),
  })),
  items: z.array(PackItem),
  references: z.record(z.string(), PackReference),
});
export type Pack = z.infer<typeof Pack>;

/** Language-neutral index entry used by the session selector without downloading packs. */
export const IndexEntry = z.object({
  id, kind: z.enum(['card', 'question', 'case']), moduleId: id, lessonId: id, microId: id, macroId: id,
  conceptId: id, seq: z.number().int(), rev: z.number().int(), tags: z.array(z.enum(CLINICAL_TAGS)),
});
export type IndexEntry = z.infer<typeof IndexEntry>;

export const Manifest = z.object({
  schema: z.literal(1),
  contentVersion: z.string(),
  generatedAt: z.string(),
  macros: z.array(z.object({
    id, order: z.number().int(), title: bi, priority: z.boolean(),
    micros: z.array(z.object({ id, title: bi, aliases: z.array(z.string()), available: z.boolean() })),
  })),
  modules: z.array(z.object({
    id, macroId: id, title: bi,
    packs: z.object({ es: z.object({ file: z.string(), hash: z.string(), bytes: z.number() }), en: z.object({ file: z.string(), hash: z.string(), bytes: z.number() }) }),
  })),
  index: z.array(IndexEntry),
});
export type Manifest = z.infer<typeof Manifest>;
