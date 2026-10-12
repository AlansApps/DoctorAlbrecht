import { describe, expect, it } from 'vitest';
import { compareEvents, normalizeIso, studyDayEnd } from './time.ts';
import { applyRetrieval, isDue, newProgress } from './scheduler.ts';

describe('studyDayEnd', () => {
  it('ends the Madrid study day at 04:00 local time (summer, UTC+2)', () => {
    expect(studyDayEnd(new Date('2026-07-01T20:00:00Z'), 'Europe/Madrid').toISOString()).toBe('2026-07-02T02:00:00.000Z');
  });
  it('studying at 01:30 local still belongs to the previous day', () => {
    expect(studyDayEnd(new Date('2026-07-01T23:30:00Z'), 'Europe/Madrid').toISOString()).toBe('2026-07-02T02:00:00.000Z');
  });
  it('handles the autumn DST change (25 Oct 2026, Madrid → UTC+1)', () => {
    expect(studyDayEnd(new Date('2026-10-24T20:00:00Z'), 'Europe/Madrid').toISOString()).toBe('2026-10-25T03:00:00.000Z');
  });
  it('handles the spring DST change (29 Mar 2026, Madrid → UTC+2)', () => {
    expect(studyDayEnd(new Date('2026-03-28T20:00:00Z'), 'Europe/Madrid').toISOString()).toBe('2026-03-29T02:00:00.000Z');
  });
  it('works for Buenos Aires (UTC-3, no DST)', () => {
    expect(studyDayEnd(new Date('2026-10-12T15:00:00Z'), 'America/Argentina/Buenos_Aires').toISOString()).toBe('2026-10-13T07:00:00.000Z');
  });
});

describe('event ordering', () => {
  it('normalizes mixed ISO formats so ordering is by instant', () => {
    expect(normalizeIso('2026-10-12T12:00:00+02:00')).toBe('2026-10-12T10:00:00.000Z');
    expect(compareEvents({ at: '2026-10-12T10:00:00Z', id: 'b' }, { at: '2026-10-12T10:00:00.000Z', id: 'a' })).toBe(1);
    expect(compareEvents({ at: '2026-10-12T11:00:00+02:00', id: 'z' }, { at: '2026-10-12T10:00:00Z', id: 'a' })).toBe(-1);
    expect(() => normalizeIso('not a date')).toThrow();
  });
});

describe('local-day due', () => {
  it('a review due tomorrow evening is not due this morning, but one due later today is', () => {
    const t = new Date('2026-10-12T06:00:00Z');
    let p = applyRetrieval(newProgress('x', 'card', 'k', t), 'good', 1, t);
    p = applyRetrieval(p, 'good', 1, new Date(t.getTime() + 10 * 60_000));
    const due = new Date(p.fsrs!.due);
    const morningOfDue = new Date(due.getTime() - 6 * 3_600_000);
    const dayEnd = studyDayEnd(morningOfDue, 'Europe/Madrid');
    expect(isDue(p, 1, morningOfDue)).toBe(false);
    expect(isDue(p, 1, morningOfDue, dayEnd)).toBe(due <= dayEnd);
  });
});
