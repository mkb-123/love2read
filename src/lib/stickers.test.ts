import { describe, expect, it } from 'vitest';
import {
  STICKERS,
  addSticker,
  earnedCount,
  newMilestones,
  pickSticker,
  type MilestoneContext,
} from './stickers';

const NO_MILESTONES: MilestoneContext = {
  masteredCount: 0,
  decksCompleted: 0,
  streakDays: 0,
  bestSessionStreak: 0,
};

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

  it('never awards a special sticker at random', () => {
    // Earn every non-special sticker so only specials remain unearned.
    const counts = Object.fromEntries(
      STICKERS.filter((s) => !s.special).map((s) => [s.id, 1]),
    );
    for (let r = 0; r < 1; r += 0.05) {
      expect(pickSticker(counts, () => r).special).toBeFalsy();
    }
  });

  it('awards milestone stickers only when newly reached', () => {
    expect(newMilestones(NO_MILESTONES, {})).toEqual([]);

    const earned = newMilestones(
      { masteredCount: 1, decksCompleted: 0, streakDays: 3, bestSessionStreak: 0 },
      {},
    ).map((s) => s.id);
    expect(earned).toContain('first-word');
    expect(earned).toContain('streak-3');
    expect(earned).not.toContain('streak-7');

    // Already-won milestones are not handed out again.
    expect(
      newMilestones(
        { masteredCount: 1, decksCompleted: 0, streakDays: 0, bestSessionStreak: 0 },
        { 'first-word': 1 },
      ),
    ).toEqual([]);
  });
});
