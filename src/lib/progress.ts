const KEY = 'love2read.progress.v1';
const NAME_KEY = 'love2read.childName';

export interface CardProgress {
  seen: number;
  known: number;
  lastSeen: string;
}

export type Progress = Record<string, CardProgress>;

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

function bump(p: Progress, id: string, knownDelta: number): Progress {
  const cur = p[id] ?? { seen: 0, known: 0, lastSeen: '' };
  return {
    ...p,
    [id]: {
      seen: cur.seen + 1,
      known: cur.known + knownDelta,
      lastSeen: new Date().toISOString(),
    },
  };
}

export function markSeen(p: Progress, id: string): Progress {
  return bump(p, id, 0);
}

export function markKnown(p: Progress, id: string): Progress {
  return bump(p, id, 1);
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(KEY);
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
