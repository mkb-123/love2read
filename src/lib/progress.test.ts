import { beforeEach, describe, expect, it } from 'vitest';
import {
  isDue,
  loadProgress,
  markCorrect,
  markWrong,
  resetProgress,
  saveProgress,
  selectSession,
} from './progress';
import type { ProgressMap } from './types';

describe('progress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads empty when nothing stored', () => {
    expect(loadProgress()).toEqual({});
  });

  it('markCorrect bumps seen, correct and box', () => {
    const p = markCorrect({}, 'card.a');
    expect(p['card.a'].seen).toBe(1);
    expect(p['card.a'].correct).toBe(1);
    expect(p['card.a'].box).toBeGreaterThanOrEqual(1);
  });

  it('fast correct bumps box more than slow correct', () => {
    const fast = markCorrect({}, 'a', { elapsedMs: 1000 });
    const slow = markCorrect({}, 'b', { elapsedMs: 8000 });
    expect(fast['a'].box).toBeGreaterThan(slow['b'].box);
  });

  it('markWrong decrements box but never below 0', () => {
    let p = markCorrect({}, 'a');
    p = markCorrect(p, 'a');
    expect(p['a'].box).toBeGreaterThan(0);
    p = markWrong(p, 'a');
    expect(p['a'].box).toBeLessThan(2);

    let fresh = markWrong({}, 'b');
    expect(fresh['b'].box).toBe(0);
    fresh = markWrong(fresh, 'b');
    expect(fresh['b'].box).toBe(0);
  });

  it('records recent response times capped at 10', () => {
    let p: ProgressMap = {};
    for (let i = 0; i < 15; i++) {
      p = markCorrect(p, 'a', { elapsedMs: i * 1000 });
    }
    expect(p['a'].recentTimes).toHaveLength(10);
  });

  it('saves and loads round-trip', () => {
    const p = markCorrect({}, 'card.c');
    saveProgress(p);
    expect(loadProgress()).toEqual(p);
  });

  it('reset clears storage', () => {
    saveProgress(markCorrect({}, 'card.d'));
    resetProgress();
    expect(loadProgress()).toEqual({});
  });

  it('isDue returns true for new cards', () => {
    expect(isDue({}, 'new')).toBe(true);
  });

  it('selectSession picks due cards plus new ones', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const session = selectSession(ids, {}, { sessionSize: 4, newPerSession: 3 });
    expect(session.length).toBeLessThanOrEqual(4);
    expect(session.length).toBeGreaterThan(0);
  });
});
