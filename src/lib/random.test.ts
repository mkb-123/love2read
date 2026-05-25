import { describe, expect, it } from 'vitest';
import { sample, shuffle } from './random';

describe('random', () => {
  it('shuffle preserves elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result.sort()).toEqual(arr);
  });

  it('shuffle does not mutate input', () => {
    const arr = [1, 2, 3];
    const before = [...arr];
    shuffle(arr);
    expect(arr).toEqual(before);
  });

  it('sample returns n elements', () => {
    expect(sample([1, 2, 3, 4, 5], 3)).toHaveLength(3);
  });

  it('sample clamps when n > arr.length', () => {
    expect(sample([1, 2], 5)).toHaveLength(2);
  });
});
