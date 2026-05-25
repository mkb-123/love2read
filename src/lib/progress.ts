import type { Box, CardProgress, ProgressMap } from './types';

const KEY = 'love2read.progress.v2';
const NAME_KEY = 'love2read.childName';
const DAYS_KEY = 'love2read.activeDays.v1';

const INTERVAL_DAYS: Record<Box, number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
  6: 30,
};

const FAST_MS = 3000;
const RECENT_TIME_LIMIT = 10;

const EMPTY: CardProgress = {
  seen: 0,
  correct: 0,
  box: 0,
  nextDue: '',
  lastSeen: '',
  recentTimes: [],
};

function clampBox(n: number): Box {
  if (n < 0) return 0;
  if (n > 6) return 6;
  return n as Box;
}

function dueDate(box: Box, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + INTERVAL_DAYS[box]);
  return d.toISOString();
}

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveProgress(p: ProgressMap): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

function bump(prev: CardProgress | undefined, partial: Partial<CardProgress>): CardProgress {
  const base = prev ?? EMPTY;
  return { ...base, ...partial };
}

function appendTime(times: number[], elapsedMs: number | undefined): number[] {
  if (elapsedMs === undefined) return times;
  const next = [...times, elapsedMs];
  return next.length > RECENT_TIME_LIMIT
    ? next.slice(next.length - RECENT_TIME_LIMIT)
    : next;
}

export function markCorrect(
  p: ProgressMap,
  id: string,
  opts: { elapsedMs?: number; weight?: 1 | 2 } = {},
): ProgressMap {
  const cur = p[id] ?? EMPTY;
  const weight = opts.weight ?? 1;
  const fast = opts.elapsedMs !== undefined && opts.elapsedMs < FAST_MS;
  const bumpBy = weight === 2 ? 2 : fast ? 2 : 1;
  const box = clampBox(cur.box + bumpBy);
  const now = new Date();
  return {
    ...p,
    [id]: bump(cur, {
      seen: cur.seen + 1,
      correct: cur.correct + 1,
      box,
      nextDue: dueDate(box, now),
      lastSeen: now.toISOString(),
      recentTimes: appendTime(cur.recentTimes, opts.elapsedMs),
    }),
  };
}

export function markWrong(
  p: ProgressMap,
  id: string,
  opts: { elapsedMs?: number } = {},
): ProgressMap {
  const cur = p[id] ?? EMPTY;
  const box = clampBox(cur.box - 1);
  const now = new Date();
  return {
    ...p,
    [id]: bump(cur, {
      seen: cur.seen + 1,
      box,
      nextDue: dueDate(box, now),
      lastSeen: now.toISOString(),
      recentTimes: appendTime(cur.recentTimes, opts.elapsedMs),
    }),
  };
}

export function markSeen(p: ProgressMap, id: string): ProgressMap {
  const cur = p[id] ?? EMPTY;
  const now = new Date();
  return {
    ...p,
    [id]: bump(cur, {
      seen: cur.seen + 1,
      lastSeen: now.toISOString(),
    }),
  };
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(DAYS_KEY);
  } catch {
    /* ignore */
  }
}

export function loadChildName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveChildName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    /* ignore */
  }
}

function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function recordActiveDay(): void {
  try {
    const raw = localStorage.getItem(DAYS_KEY);
    const days: string[] = raw ? JSON.parse(raw) : [];
    const today = todayKey();
    if (!days.includes(today)) {
      days.push(today);
      localStorage.setItem(DAYS_KEY, JSON.stringify(days));
    }
  } catch {
    /* ignore */
  }
}

export function loadActiveDays(): string[] {
  try {
    const raw = localStorage.getItem(DAYS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function currentStreak(): number {
  const days = new Set(loadActiveDays());
  let streak = 0;
  const d = new Date();
  while (days.has(todayKey(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function isDue(progress: ProgressMap, cardId: string, now: Date = new Date()): boolean {
  const p = progress[cardId];
  if (!p || !p.nextDue) return true;
  return new Date(p.nextDue).getTime() <= now.getTime();
}

export function selectSession(
  cardIds: string[],
  progress: ProgressMap,
  opts: { sessionSize?: number; newPerSession?: number } = {},
): string[] {
  const size = opts.sessionSize ?? 10;
  const maxNew = opts.newPerSession ?? 3;
  const now = new Date();

  const due: string[] = [];
  const fresh: string[] = [];
  for (const id of cardIds) {
    const p = progress[id];
    if (!p) {
      fresh.push(id);
    } else if (isDue(progress, id, now)) {
      due.push(id);
    }
  }
  due.sort((a, b) => (progress[a]?.box ?? 0) - (progress[b]?.box ?? 0));

  const newPick = fresh.slice(0, maxNew);
  const combined = [...due, ...newPick].slice(0, size);
  return combined.length === 0 ? cardIds.slice(0, size) : combined;
}

export function avgResponseTime(p: CardProgress | undefined): number | null {
  if (!p || p.recentTimes.length === 0) return null;
  return Math.round(p.recentTimes.reduce((a, b) => a + b, 0) / p.recentTimes.length);
}
