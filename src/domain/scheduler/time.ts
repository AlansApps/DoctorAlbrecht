/**
 * Time helpers: event ordering and the local study-day boundary.
 * All timestamps are stored as normalized UTC ISO strings (`Date#toISOString`).
 */

/** Normalize any parseable timestamp to `YYYY-MM-DDTHH:mm:ss.sssZ`; throws on invalid input. */
export function normalizeIso(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new RangeError(`Invalid timestamp: ${value}`);
  return d.toISOString();
}

/** Single ordering for events everywhere (incremental path and replay): time, then id (ordinal). */
export function compareEvents(a: { at: string; id: string }, b: { at: string; id: string }): number {
  const ta = a.at ? Date.parse(a.at) : Number.NEGATIVE_INFINITY;
  const tb = b.at ? Date.parse(b.at) : Number.NEGATIVE_INFINITY;
  if (ta !== tb) return ta < tb ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

export const DAY_CUTOFF_HOUR = 4;

/** Offset (ms) of `timeZone` at instant `date`: local wall clock minus UTC. */
function tzOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** Instant at which the local wall clock in `timeZone` reads y-m-d h:00. Handles DST changes. */
function zonedTime(y: number, m: number, d: number, h: number, timeZone: string): Date {
  const guess = Date.UTC(y, m - 1, d, h);
  let t = guess - tzOffsetMs(new Date(guess), timeZone);
  t = guess - tzOffsetMs(new Date(t), timeZone);
  return new Date(t);
}

/**
 * End of the current local study day: the next DAY_CUTOFF_HOUR:00 in `timeZone`.
 * Studying at 01:30 still belongs to the previous day.
 */
export function studyDayEnd(now: Date, timeZone: string): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit',
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const [y, m, d, h] = [get('year'), get('month'), get('day'), get('hour')];
  if (h < DAY_CUTOFF_HOUR) return zonedTime(y, m, d, DAY_CUTOFF_HOUR, timeZone);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return zonedTime(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), DAY_CUTOFF_HOUR, timeZone);
}

export function currentTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}
