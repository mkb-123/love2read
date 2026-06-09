export interface Card {
  id: string;
  word: string;
  emoji?: string;
  imageUrl?: string;
  audioUrl?: string;
  hint?: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  /** 'words' (default) shows flashcards and quiz games; 'sentences' shows guided sentence reading. */
  kind?: 'words' | 'sentences';
  cards: Card[];
}

export interface Level {
  id: string;
  label: string;
  order: number;
  color: string;
  decks: Deck[];
}

export type Box = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CardProgress {
  seen: number;
  correct: number;
  box: Box;
  nextDue: string;
  lastSeen: string;
  recentTimes: number[];
}

export type ProgressMap = Record<string, CardProgress>;
