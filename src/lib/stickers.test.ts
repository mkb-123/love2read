import { describe, expect, it } from 'vitest';
import {
  STICKERS,
  addSticker,
  earnedCount,
  pickSticker,
} from './stickers';

describe('stickers', () => {
  it('has unique ids', () => {
    const ids = new Set(STICKERS.map((s) => s.id));
    expect(ids.size).toBe(STICKERS.length);
  });

  it('picks an unearned sticker first', () => {
    const counts = Object.fromEntries(
      STICKERS.slice(1).map((s) => [s.id, 1]),
    );
    const picked = pickSticker(counts, () => 0.99);
    expect(picked.id).toBe(STICKERS[0].id);
  });

  it('falls back to duplicates when the book is full', () => {
    const counts = Object.fromEntries(STICKERS.map((s) => [s.id, 1]));
    const picked = pickSticker(counts, () => 0);
    expect(picked.id).toBe(STICKERS[0].id);
  });

  it('addSticker increments counts and earnedCount tracks distinct stickers', () => {
    let counts = addSticker({}, 'fox');
    counts = addSticker(counts, 'fox');
    counts = addSticker(counts, 'panda');
    expect(counts.fox).toBe(2);
    expect(earnedCount(counts)).toBe(2);
  });
});
