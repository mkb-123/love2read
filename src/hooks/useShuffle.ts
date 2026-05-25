import { useMemo } from 'react';
import { shuffle } from '../lib/random';

export function useShuffle<T>(arr: readonly T[], seed: unknown = 0): T[] {
  return useMemo(() => shuffle(arr), [arr, seed]);
}
