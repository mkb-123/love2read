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

/**
 * Word colour for a card, taken from the level it belongs to. Card ids are
 * level-prefixed (e.g. `red.her-words.the`, `blue.tricky-words.said`), so the
 * level — and its colour — can be derived from the id. Falls back to the
 * default slate when the level can't be resolved.
 */
export function levelColorForCardId(cardId: string): string {
  const levelId = cardId.split('.')[0];
  return findLevel(levelId)?.color ?? 'text-slate-800';
}
