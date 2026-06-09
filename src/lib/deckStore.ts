import type { Card, Deck, Level } from './types';
import { DECK_COLORS, SEED_LEVELS, SENTENCES_DECK } from '../data/seedLevels';

const KEY = 'love2read.levels.v1';
const SENTENCES_MIGRATION_KEY = 'love2read.migration.sentences.v1';
export const LEVELS_CHANGED_EVENT = 'love2read:levels-changed';

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000).toString(36)}`;
}

// One-off: add the seeded sentences deck to installs created before
// sentence decks existed. Guarded by a flag so deleting it sticks.
function migrateSentences(levels: Level[]): Level[] {
  try {
    if (localStorage.getItem(SENTENCES_MIGRATION_KEY)) return levels;
    localStorage.setItem(SENTENCES_MIGRATION_KEY, '1');
  } catch {
    return levels;
  }
  if (levels.some((l) => l.decks.some((d) => d.kind === 'sentences'))) {
    return levels;
  }
  const target = levels.find((l) => l.id === 'red') ?? levels[0];
  const next = levels.map((l) =>
    l.id === target.id ? { ...l, decks: [...l.decks, SENTENCES_DECK] } : l,
  );
  saveLevels(next);
  return next;
}

export function loadLevels(): Level[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Level[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return migrateSentences(parsed);
      }
    }
  } catch {
    /* fall through to seed */
  }
  saveLevels(SEED_LEVELS);
  return SEED_LEVELS;
}

export function saveLevels(levels: Level[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(levels));
    window.dispatchEvent(new Event(LEVELS_CHANGED_EVENT));
  } catch {
    /* ignore */
  }
}

export function resetLevels(): void {
  saveLevels(SEED_LEVELS);
}

function levelFor(levels: Level[], levelId: string): Level | undefined {
  return levels.find((l) => l.id === levelId);
}

export function addDeck(
  levels: Level[],
  levelId: string,
  data: {
    title: string;
    emoji?: string;
    description?: string;
    color?: string;
    kind?: Deck['kind'];
  },
): Level[] {
  const id = newId('deck');
  const color = data.color ?? DECK_COLORS[Math.floor(Math.random() * DECK_COLORS.length)];
  return levels.map((l) =>
    l.id === levelId
      ? {
          ...l,
          decks: [
            ...l.decks,
            {
              id,
              title: data.title.trim() || 'New deck',
              emoji: data.emoji?.trim() || '📚',
              description: data.description?.trim() || '',
              color,
              kind: data.kind ?? 'words',
              cards: [],
            },
          ],
        }
      : l,
  );
}

export function updateDeck(
  levels: Level[],
  levelId: string,
  deckId: string,
  patch: Partial<Omit<Deck, 'id' | 'cards'>>,
): Level[] {
  return levels.map((l) =>
    l.id === levelId
      ? {
          ...l,
          decks: l.decks.map((d) =>
            d.id === deckId ? { ...d, ...patch } : d,
          ),
        }
      : l,
  );
}

export function removeDeck(
  levels: Level[],
  levelId: string,
  deckId: string,
): Level[] {
  return levels.map((l) =>
    l.id === levelId
      ? { ...l, decks: l.decks.filter((d) => d.id !== deckId) }
      : l,
  );
}

export function addCard(
  levels: Level[],
  levelId: string,
  deckId: string,
  data: { word: string; emoji?: string },
): Level[] {
  const word = data.word.trim();
  if (!word) return levels;
  return levels.map((l) =>
    l.id === levelId
      ? {
          ...l,
          decks: l.decks.map((d) =>
            d.id === deckId
              ? {
                  ...d,
                  cards: [
                    ...d.cards,
                    {
                      id: newId(`${deckId}.card`),
                      word,
                      emoji: data.emoji?.trim() || undefined,
                    },
                  ],
                }
              : d,
          ),
        }
      : l,
  );
}

export function updateCard(
  levels: Level[],
  levelId: string,
  deckId: string,
  cardId: string,
  patch: Partial<Pick<Card, 'word' | 'emoji'>>,
): Level[] {
  return levels.map((l) =>
    l.id === levelId
      ? {
          ...l,
          decks: l.decks.map((d) =>
            d.id === deckId
              ? {
                  ...d,
                  cards: d.cards.map((c) =>
                    c.id === cardId
                      ? {
                          ...c,
                          word: patch.word !== undefined ? patch.word.trim() : c.word,
                          emoji:
                            patch.emoji !== undefined
                              ? patch.emoji.trim() || undefined
                              : c.emoji,
                        }
                      : c,
                  ),
                }
              : d,
          ),
        }
      : l,
  );
}

export function removeCard(
  levels: Level[],
  levelId: string,
  deckId: string,
  cardId: string,
): Level[] {
  return levels.map((l) =>
    l.id === levelId
      ? {
          ...l,
          decks: l.decks.map((d) =>
            d.id === deckId
              ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) }
              : d,
          ),
        }
      : l,
  );
}

export function findDeckIn(levels: Level[], levelId: string, deckId: string) {
  const level = levelFor(levels, levelId);
  const deck = level?.decks.find((d) => d.id === deckId);
  return { level, deck };
}
