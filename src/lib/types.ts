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
  cards: Card[];
}

export interface Level {
  id: string;
  label: string;
  order: number;
  color: string;
  decks: Deck[];
}
