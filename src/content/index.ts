import { findDeckIn, loadLevels } from '../lib/deckStore';

export function getAllLevels() {
  return loadLevels().sort((a, b) => a.order - b.order);
}

export function findLevel(id: string) {
  return getAllLevels().find((l) => l.id === id);
}

export function findDeck(levelId: string, deckId: string) {
  return findDeckIn(getAllLevels(), levelId, deckId);
}
