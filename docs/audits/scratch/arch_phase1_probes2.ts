// Throwaway probe: micro cap truncates a review session when all debt is in one micro.
import type { IndexEntry } from '../../../src/domain/content/schema.ts';
import { applyRetrieval, newProgress, type ItemProgress } from '../../../src/domain/scheduler/scheduler.ts';
import { buildSession } from '../../../src/domain/session/selector.ts';
const past = new Date('2026-09-01T10:00:00Z'); const now = new Date('2026-10-12T10:00:00Z');
const index: IndexEntry[] = []; const prog = new Map<string, ItemProgress>();
for (let i = 0; i < 40; i++) {
  const it: IndexEntry = { id: `d${i}`, kind: 'card', moduleId: 'm', lessonId: 'l', microId: 'pcos.a', macroId: 'pcos', conceptId: `d${i}`, seq: i, rev: 1, tags: [] };
  index.push(it); prog.set(it.id, applyRetrieval(newProgress(it.id, 'card', it.conceptId, past), 'good', 1, past));
}
for (const scope of [{ kind: 'all' as const }, { kind: 'macro' as const, macroId: 'pcos', mix: true }]) {
  const s = buildSession({ index, progress: prog, options: { minutes: 15, scope, filters: [], mode: 'review' }, now, seed: 1 });
  console.log(scope.kind, 'review 15 min, 40 due in one micro -> steps:', s.length);
}
