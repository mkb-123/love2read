import type { Deck, Level } from '../lib/types';

// Short sentences built from her Stage 2 words. Added to existing
// installs by a one-off migration in deckStore.
export const SENTENCES_DECK: Deck = {
  id: 'little-sentences',
  title: 'Little Sentences',
  description: 'Read a whole sentence!',
  emoji: '📖',
  color: 'bg-emerald-500',
  kind: 'sentences',
  cards: [
    { id: 'red.little-sentences.cat', word: 'The cat is black.' },
    { id: 'red.little-sentences.dragon', word: 'A little red dragon.' },
    { id: 'red.little-sentences.bear', word: 'The bear is little.' },
    { id: 'red.little-sentences.pirate', word: 'I can see a pirate.' },
    { id: 'red.little-sentences.monster', word: 'The monster is green.' },
    { id: 'red.little-sentences.kangaroo', word: 'A little blue kangaroo.' },
    { id: 'red.little-sentences.sun', word: 'Look at the yellow sun.' },
    { id: 'red.little-sentences.dog', word: 'The cat and the dog.' },
  ],
};

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
          { id: 'red.her-words.red', word: 'red' },
          { id: 'red.her-words.giant', word: 'giant' },
          { id: 'red.her-words.cat', word: 'cat' },
          { id: 'red.her-words.in', word: 'in' },
          { id: 'red.her-words.kangaroo', word: 'kangaroo' },
          { id: 'red.her-words.yellow', word: 'yellow' },
          { id: 'red.her-words.the', word: 'the' },
          { id: 'red.her-words.monster', word: 'monster' },
          { id: 'red.her-words.my', word: 'my' },
          { id: 'red.her-words.black', word: 'black' },
          { id: 'red.her-words.dog', word: 'dog' },
          { id: 'red.her-words.i', word: 'I' },
          { id: 'red.her-words.went', word: 'went' },
          { id: 'red.her-words.green', word: 'green' },
          { id: 'red.her-words.like', word: 'like' },
          { id: 'red.her-words.new', word: 'new' },
          { id: 'red.her-words.am', word: 'am' },
          { id: 'red.her-words.a', word: 'a' },
          { id: 'red.her-words.pirates', word: 'pirates' },
          { id: 'red.her-words.elephant', word: 'elephant' },
          { id: 'red.her-words.bear', word: 'bear' },
          { id: 'red.her-words.blue', word: 'blue' },
          { id: 'red.her-words.pig', word: 'pig' },
          { id: 'red.her-words.little', word: 'little' },
          { id: 'red.her-words.dragon', word: 'dragon' },
          { id: 'red.her-words.and', word: 'and' },
        ],
      },
      SENTENCES_DECK,
    ],
  },
  {
    id: 'blue',
    label: 'Blue — Stage 4',
    order: 2,
    color: 'text-blue-500',
    decks: [
      {
        id: 'tricky-words',
        title: 'Tricky Words',
        description: 'Learn these by heart',
        emoji: '⭐',
        color: 'bg-blue-600',
        cards: [
          { id: 'blue.tricky-words.they', word: 'they' },
          { id: 'blue.tricky-words.on', word: 'on' },
          { id: 'blue.tricky-words.said', word: 'said' },
          { id: 'blue.tricky-words.is', word: 'is' },
          { id: 'blue.tricky-words.want', word: 'want' },
          { id: 'blue.tricky-words.look', word: 'look' },
          { id: 'blue.tricky-words.we', word: 'we' },
          { id: 'blue.tricky-words.he', word: 'he' },
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
