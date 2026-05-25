import type { Level } from '../lib/types';
import { red } from './levels/red';
import { blue } from './levels/blue';

export const LEVELS: Level[] = [red, blue].sort((a, b) => a.order - b.order);

export function findLevel(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function findDeck(levelId: string, deckId: string) {
  const level = findLevel(levelId);
  const deck = level?.decks.find((d) => d.id === deckId);
  return { level, deck };
}
