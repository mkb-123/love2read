import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadProgress,
  markKnown,
  markSeen,
  resetProgress,
  saveProgress,
} from './progress';

describe('progress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads empty when nothing stored', () => {
    expect(loadProgress()).toEqual({});
  });

  it('markSeen increments seen but not known', () => {
    const p = markSeen({}, 'card.a');
    expect(p['card.a'].seen).toBe(1);
    expect(p['card.a'].known).toBe(0);
  });

  it('markKnown increments both', () => {
    const p = markKnown({}, 'card.b');
    expect(p['card.b'].seen).toBe(1);
    expect(p['card.b'].known).toBe(1);
  });

  it('saves and loads round-trip', () => {
    const p = markKnown({}, 'card.c');
    saveProgress(p);
    expect(loadProgress()).toEqual(p);
  });

  it('reset clears storage', () => {
    saveProgress(markKnown({}, 'card.d'));
    resetProgress();
    expect(loadProgress()).toEqual({});
  });
});
