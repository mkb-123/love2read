import type { Level } from '../lib/types';

// Seeded into localStorage on first run. After that, the in-app deck editor
// (Parents → Manage decks) is the source of truth.
export const SEED_LEVELS: Level[] = [
  {
    id: 'red',
    label: 'Stage 2',
    order: 1,
    color: 'text-red-500',
    decks: [
      {
        id: 'her-words',
        title: 'Her Words',
        description: 'The words she is learning right now',
        emoji: '💖',
        color: 'bg-rose-500',
        cards: [
          { id: 'red.her-words.the', word: 'the' },
          { id: 'red.her-words.and', word: 'and' },
          { id: 'red.her-words.cat', word: 'cat', emoji: '🐱' },
          { id: 'red.her-words.black', word: 'black', emoji: '⬛' },
          { id: 'red.her-words.blue', word: 'blue', emoji: '🟦' },
          { id: 'red.her-words.pirate', word: 'pirate', emoji: '🏴‍☠️' },
          { id: 'red.her-words.monster', word: 'monster', emoji: '👹' },
          { id: 'red.her-words.kangaroo', word: 'kangaroo', emoji: '🦘' },
        ],
      },
    ],
  },
];

export const DECK_COLORS = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
];
