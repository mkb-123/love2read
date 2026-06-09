export interface Sticker {
  id: string;
  emoji: string;
  name: string;
}

export type StickerCounts = Record<string, number>;

const KEY = 'love2read.stickers.v1';

export const STICKERS: Sticker[] = [
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow' },
  { id: 'puppy', emoji: '🐶', name: 'Puppy' },
  { id: 'kitten', emoji: '🐱', name: 'Kitten' },
  { id: 'bunny', emoji: '🐰', name: 'Bunny' },
  { id: 'fox', emoji: '🦊', name: 'Fox' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'koala', emoji: '🐨', name: 'Koala' },
  { id: 'lion', emoji: '🦁', name: 'Lion' },
  { id: 'tiger', emoji: '🐯', name: 'Tiger' },
  { id: 'penguin', emoji: '🐧', name: 'Penguin' },
  { id: 'owl', emoji: '🦉', name: 'Owl' },
  { id: 'butterfly', emoji: '🦋', name: 'Butterfly' },
  { id: 'ladybird', emoji: '🐞', name: 'Ladybird' },
  { id: 'bee', emoji: '🐝', name: 'Bee' },
  { id: 'dolphin', emoji: '🐬', name: 'Dolphin' },
  { id: 'whale', emoji: '🐳', name: 'Whale' },
  { id: 'octopus', emoji: '🐙', name: 'Octopus' },
  { id: 'turtle', emoji: '🐢', name: 'Turtle' },
  { id: 'dinosaur', emoji: '🦕', name: 'Dinosaur' },
  { id: 'dragon', emoji: '🐉', name: 'Dragon' },
  { id: 'fairy', emoji: '🧚', name: 'Fairy' },
  { id: 'mermaid', emoji: '🧜‍♀️', name: 'Mermaid' },
  { id: 'crown', emoji: '👑', name: 'Crown' },
  { id: 'castle', emoji: '🏰', name: 'Castle' },
  { id: 'rocket', emoji: '🚀', name: 'Rocket' },
  { id: 'shooting-star', emoji: '🌠', name: 'Shooting Star' },
  { id: 'moon', emoji: '🌙', name: 'Moon' },
  { id: 'sun', emoji: '🌞', name: 'Sunshine' },
  { id: 'flower', emoji: '🌸', name: 'Blossom' },
  { id: 'sunflower', emoji: '🌻', name: 'Sunflower' },
  { id: 'four-leaf', emoji: '🍀', name: 'Lucky Clover' },
  { id: 'strawberry', emoji: '🍓', name: 'Strawberry' },
  { id: 'ice-cream', emoji: '🍦', name: 'Ice Cream' },
  { id: 'cupcake', emoji: '🧁', name: 'Cupcake' },
  { id: 'lollipop', emoji: '🍭', name: 'Lollipop' },
  { id: 'balloon', emoji: '🎈', name: 'Balloon' },
  { id: 'present', emoji: '🎁', name: 'Present' },
  { id: 'teddy', emoji: '🧸', name: 'Teddy' },
  { id: 'gem', emoji: '💎', name: 'Gem' },
  { id: 'trophy', emoji: '🏆', name: 'Trophy' },
  { id: 'medal', emoji: '🏅', name: 'Medal' },
];

export function loadStickers(): StickerCounts {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StickerCounts) : {};
  } catch {
    return {};
  }
}

export function saveStickers(counts: StickerCounts): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(counts));
  } catch {
    /* ignore */
  }
}

export function earnedCount(counts: StickerCounts): number {
  return STICKERS.filter((s) => (counts[s.id] ?? 0) > 0).length;
}

/**
 * Pick the sticker to award next: a random one she doesn't have yet,
 * or a random duplicate once the book is full.
 */
export function pickSticker(
  counts: StickerCounts,
  rand: () => number = Math.random,
): Sticker {
  const unearned = STICKERS.filter((s) => (counts[s.id] ?? 0) === 0);
  const pool = unearned.length > 0 ? unearned : STICKERS;
  return pool[Math.floor(rand() * pool.length)];
}

export function addSticker(counts: StickerCounts, id: string): StickerCounts {
  return { ...counts, [id]: (counts[id] ?? 0) + 1 };
}

/** Award a sticker and persist it. Returns what was won. */
export function awardSticker(): Sticker {
  const counts = loadStickers();
  const sticker = pickSticker(counts);
  saveStickers(addSticker(counts, sticker.id));
  return sticker;
}

export function resetStickers(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
