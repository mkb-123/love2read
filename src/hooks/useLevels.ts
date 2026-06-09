import { useCallback, useEffect, useState } from 'react';
import {
  LEVELS_CHANGED_EVENT,
  addCard,
  addDeck,
  loadLevels,
  removeCard,
  removeDeck,
  resetLevels,
  saveLevels,
  updateCard,
  updateDeck,
} from '../lib/deckStore';
import type { Card, Deck, Level } from '../lib/types';

export function useLevels() {
  const [levels, setLevels] = useState<Level[]>(() => loadLevels());

  useEffect(() => {
    const handler = () => setLevels(loadLevels());
    window.addEventListener(LEVELS_CHANGED_EVENT, handler);
    return () => window.removeEventListener(LEVELS_CHANGED_EVENT, handler);
  }, []);

  const persist = useCallback((next: Level[]) => {
    setLevels(next);
    saveLevels(next);
  }, []);

  return {
    levels,
    addDeck: useCallback(
      (
        levelId: string,
        data: { title: string; emoji?: string; kind?: Deck['kind'] },
      ) => persist(addDeck(levels, levelId, data)),
      [levels, persist],
    ),
    updateDeck: useCallback(
      (
        levelId: string,
        deckId: string,
        patch: Partial<Omit<Deck, 'id' | 'cards'>>,
      ) => persist(updateDeck(levels, levelId, deckId, patch)),
      [levels, persist],
    ),
    removeDeck: useCallback(
      (levelId: string, deckId: string) =>
        persist(removeDeck(levels, levelId, deckId)),
      [levels, persist],
    ),
    addCard: useCallback(
      (levelId: string, deckId: string, data: { word: string; emoji?: string }) =>
        persist(addCard(levels, levelId, deckId, data)),
      [levels, persist],
    ),
    updateCard: useCallback(
      (
        levelId: string,
        deckId: string,
        cardId: string,
        patch: Partial<Pick<Card, 'word' | 'emoji'>>,
      ) => persist(updateCard(levels, levelId, deckId, cardId, patch)),
      [levels, persist],
    ),
    removeCard: useCallback(
      (levelId: string, deckId: string, cardId: string) =>
        persist(removeCard(levels, levelId, deckId, cardId)),
      [levels, persist],
    ),
    reset: useCallback(() => {
      resetLevels();
      setLevels(loadLevels());
    }, []),
  };
}
