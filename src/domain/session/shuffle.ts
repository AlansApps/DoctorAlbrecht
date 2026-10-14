import { rng } from './selector.ts';

/** Stable per-seed shuffle of answer options, so the correct answer is not always in the same place. */
export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  const random = rng(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
