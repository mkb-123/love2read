import type { Level } from '../../lib/types';

// Words my daughter is actually being taught at red book band.
// Not pulled from one specific synthetic-phonics scheme -- her school's mix
// of high-frequency words, colour words and themed book vocabulary. Extend
// freely; the in-app deck editor (coming next) writes to localStorage but the
// canonical seed list lives here.

const PREFIX = 'red';

export const red: Level = {
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
        { word: 'the' },
        { word: 'and' },
        { word: 'cat', emoji: '🐱' },
        { word: 'black', emoji: '⬛' },
        { word: 'blue', emoji: '🟦' },
        { word: 'pirate', emoji: '🏴‍☠️' },
        { word: 'monster', emoji: '👹' },
        { word: 'kangaroo', emoji: '🦘' },
      ].map((c) => ({ ...c, id: `${PREFIX}.her-words.${c.word}` })),
    },
  ],
};
