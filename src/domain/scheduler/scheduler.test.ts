import { describe, expect, it } from 'vitest';
import { applyExposure, applyRetrieval, dueAt, isDue, newProgress, suspend, unsuspend, ratingForAnswer } from './scheduler.ts';

const t0 = new Date('2026-10-12T10:00:00Z');
const days = (n: number) => new Date(t0.getTime() + n * 86_400_000);
const fresh = () => newProgress('c1', 'card', 'concept-1', t0);

describe('scheduler', () => {
  it('reading a card is exposure, not a review', () => {
    const p = applyExposure(fresh(), t0);
    expect(p.status).toBe('studied');
    expect(p.fsrs).toBeNull();
    expect(p.retrievals).toBe(0);
    expect(dueAt(p, 1)).toBeNull();
  });

  it('a failed recall comes back sooner than a successful one', () => {
    const failed = applyRetrieval(fresh(), 'again', 1, t0);
    const passed = applyRetrieval(fresh(), 'good', 1, t0);
    expect(dueAt(failed, 1)!.getTime()).toBeLessThan(dueAt(passed, 1)!.getTime());
    expect(failed.status).toBe('learning');
  });

  it('spaced successes widen the interval and never retire the item', () => {
    let p = fresh();
    let now = t0;
    const intervals: number[] = [];
    for (let i = 0; i < 12; i++) {
      p = applyRetrieval(p, 'good', 1, now);
      const due = dueAt(p, 1)!;
      intervals.push(due.getTime() - now.getTime());
      now = due;
    }
    expect(p.status).toBe('review');
    expect(intervals.at(-1)!).toBeGreaterThan(intervals[2]!);
    // capped at maximum_interval (365 d) plus fuzz margin: always comes back
    expect(intervals.at(-1)!).toBeLessThanOrEqual(400 * 86_400_000);
  });

  it('a lapse after long success shortens the next interval', () => {
    let p = fresh();
    let now = t0;
    for (let i = 0; i < 5; i++) {
      p = applyRetrieval(p, 'good', 1, now);
      now = dueAt(p, 1)!;
    }
    const goodNext = dueAt(applyRetrieval(p, 'good', 1, now), 1)!.getTime() - now.getTime();
    const lapseNext = dueAt(applyRetrieval(p, 'again', 1, now), 1)!.getTime() - now.getTime();
    expect(lapseNext).toBeLessThan(goodNext / 10);
  });

  it('a material content revision makes the item due again without losing history', () => {
    const p = applyRetrieval(fresh(), 'easy', 1, t0);
    expect(isDue(p, 1, days(1))).toBe(false);
    expect(isDue(p, 2, days(1))).toBe(true);
    expect(p.retrievals).toBe(1);
  });

  it('suspended items are never due and restore their previous status', () => {
    const p = applyRetrieval(fresh(), 'good', 1, t0);
    const s = suspend(p, t0);
    expect(isDue(s, 1, days(400))).toBe(false);
    expect(unsuspend(s, t0).status).toBe(p.status);
  });

  it('maps answers to ratings', () => {
    expect(ratingForAnswer(false)).toBe('again');
    expect(ratingForAnswer(true)).toBe('good');
  });
});
