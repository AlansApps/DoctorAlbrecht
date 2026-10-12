import type { IndexEntry } from '../../domain/content/schema.ts';
import { isDue, type ItemProgress } from '../../domain/scheduler/scheduler.ts';
import { currentTimeZone, studyDayEnd } from '../../domain/scheduler/time.ts';
import { isActiveMistake } from '../../domain/session/selector.ts';
import type { ItemFlags } from '../../storage/db.ts';

export interface Stats {
  due: number;
  studied: number;
  /** Recalled (self-rated or answered) at least once: the honest "learnt" signal. */
  recalled: number;
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
  const s: Stats = { due: 0, studied: 0, recalled: 0, learning: 0, review: 0, suspended: 0, mistakes: 0 };
  for (const e of index) {
    const p = progress.get(e.id);
    if (flags.get(e.id)?.suspended || p?.status === 'suspended') {
      s.suspended++;
      continue;
    }
    if (!p) continue;
    if (p.exposures > 0 || p.retrievals > 0) s.studied++;
    if (p.retrievals > 0) s.recalled++;
    if (p.status === 'learning') s.learning++;
    if (p.status === 'review') s.review++;
    if (isActiveMistake(p, now)) s.mistakes++; // same definition as the "mistakes" session
    if (isDue(p, e.rev, now, dayEnd)) s.due++;
  }
  return s;
}
