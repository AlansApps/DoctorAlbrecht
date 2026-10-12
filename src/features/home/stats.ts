import type { IndexEntry } from '../../domain/content/schema.ts';
import { isDue, type ItemProgress } from '../../domain/scheduler/scheduler.ts';
import { currentTimeZone, studyDayEnd } from '../../domain/scheduler/time.ts';
import type { ItemFlags } from '../../storage/db.ts';

export interface Stats {
  due: number;
  studied: number;
  learning: number;
  review: number;
  suspended: number;
  mistakes: number;
}

/** Learning stats for the shipped index. "Read" and "retained" are counted separately (spec 05). */
export function computeStats(
  index: IndexEntry[], progress: ReadonlyMap<string, ItemProgress>, flags: ReadonlyMap<string, ItemFlags>, now = new Date(),
): Stats {
  const dayEnd = studyDayEnd(now, currentTimeZone());
  const s: Stats = { due: 0, studied: 0, learning: 0, review: 0, suspended: 0, mistakes: 0 };
  for (const e of index) {
    const p = progress.get(e.id);
    if (flags.get(e.id)?.suspended || p?.status === 'suspended') {
      s.suspended++;
      continue;
    }
    if (!p) continue;
    if (p.exposures > 0 || p.retrievals > 0) s.studied++;
    if (p.status === 'learning') s.learning++;
    if (p.status === 'review') s.review++;
    if (p.lastResult === 'fail') s.mistakes++;
    if (isDue(p, e.rev, now, dayEnd)) s.due++;
  }
  return s;
}
