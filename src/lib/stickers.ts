export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  /** Milestone reward, won for an achievement — kept out of the random pool. */
  special?: boolean;
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
  // Special milestone stickers — won for achievements, not at random.
  { id: 'first-word', emoji: '🌟', name: 'First Word', special: true },
  { id: 'ten-words', emoji: '🎓', name: 'Ten Words', special: true },
  { id: 'deck-master', emoji: '🥇', name: 'Deck Master', special: true },
  { id: 'streak-3', emoji: '🔥', name: '3-Day Streak', special: true },
  { id: 'streak-7', emoji: '⚡', name: '7-Day Streak', special: true },
  { id: 'hot-streak', emoji: '🎯', name: 'Hot Streak', special: true },
];

/** Achievements that award a specific special sticker, checked on session end. */
export interface MilestoneContext {
  /** Distinct words mastered (box ≥ 5) across all decks. */
  masteredCount: number;
  /** Word decks where every card is mastered. */
  decksCompleted: number;
  /** Consecutive days played, including today. */
  streakDays: number;
  /** Longest run of correct answers in the session just finished. */
  bestSessionStreak: number;
}

interface Milestone {
  id: string;
  test: (c: MilestoneContext) => boolean;
}

// Order matters: when several are newly earned at once the first is shown.
const MILESTONES: Milestone[] = [
  { id: 'deck-master', test: (c) => c.decksCompleted >= 1 },
  { id: 'streak-7', test: (c) => c.streakDays >= 7 },
  { id: 'ten-words', test: (c) => c.masteredCount >= 10 },
  { id: 'hot-streak', test: (c) => c.bestSessionStreak >= 10 },
  { id: 'streak-3', test: (c) => c.streakDays >= 3 },
  { id: 'first-word', test: (c) => c.masteredCount >= 1 },
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
 * Pick a random sticker to award next: one she doesn't have yet, or a
 * duplicate once the book is full. Special milestone stickers are excluded —
 * those are only won for achievements.
 */
export function pickSticker(
  counts: StickerCounts,
  rand: () => number = Math.random,
): Sticker {
  const random = STICKERS.filter((s) => !s.special);
  const unearned = random.filter((s) => (counts[s.id] ?? 0) === 0);
  const pool = unearned.length > 0 ? unearned : random;
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

/** Newly-earned milestone stickers for a context, given what's already won. */
export function newMilestones(
  ctx: MilestoneContext,
  counts: StickerCounts,
): Sticker[] {
  return MILESTONES.filter(
    (m) => m.test(ctx) && (counts[m.id] ?? 0) === 0,
  )
    .map((m) => STICKERS.find((s) => s.id === m.id))
    .filter((s): s is Sticker => !!s);
}

/**
 * Reward for finishing a session. Awards every milestone newly reached this
 * session (returning the first as the headline); if none, falls back to a
 * random sticker. All awards are persisted.
 */
export function awardForSession(ctx: MilestoneContext): Sticker {
  const counts = loadStickers();
  const milestones = newMilestones(ctx, counts);
  if (milestones.length > 0) {
    let updated = counts;
    for (const m of milestones) updated = addSticker(updated, m.id);
    saveStickers(updated);
    return milestones[0];
  }
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
