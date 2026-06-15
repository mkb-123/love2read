import { useEffect, useRef, useState } from 'react';
import {
  awardForSession,
  type MilestoneContext,
  type Sticker,
} from '../lib/stickers';
import { currentStreak, loadProgress } from '../lib/progress';
import { getAllLevels } from '../content';

function sessionContext(bestSessionStreak: number): MilestoneContext {
  const progress = loadProgress();
  const wordDecks = getAllLevels().flatMap((l) =>
    l.decks.filter((d) => d.kind !== 'sentences'),
  );
  const masteredIds = new Set<string>();
  let decksCompleted = 0;
  for (const deck of wordDecks) {
    if (deck.cards.length === 0) continue;
    let allMastered = true;
    for (const c of deck.cards) {
      if ((progress[c.id]?.box ?? 0) >= 5) masteredIds.add(c.id);
      else allMastered = false;
    }
    if (allMastered) decksCompleted += 1;
  }
  return {
    masteredCount: masteredIds.size,
    decksCompleted,
    streakDays: currentStreak(),
    bestSessionStreak,
  };
}

/**
 * Awards a sticker each time `done` flips to true (e.g. session complete).
 * Prefers a milestone sticker when one is newly earned, otherwise a random
 * one. Pass the session's best correct-answer streak for the "Hot Streak".
 */
export function useSessionSticker(
  done: boolean,
  opts: { sessionStreak?: number } = {},
): Sticker | null {
  const [sticker, setSticker] = useState<Sticker | null>(null);
  const awarded = useRef(false);
  const streakRef = useRef(0);
  streakRef.current = opts.sessionStreak ?? 0;

  useEffect(() => {
    if (done && !awarded.current) {
      awarded.current = true;
      setSticker(awardForSession(sessionContext(streakRef.current)));
    } else if (!done && awarded.current) {
      awarded.current = false;
      setSticker(null);
    }
  }, [done]);

  return sticker;
}
