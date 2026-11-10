/**
 * Learning progress, kept only in this browser (localStorage).
 * No accounts, no server. Pure functions so they are easy to test.
 */

export interface Progress {
  /** Lesson numbers the learner has finished. */
  completed: number[];
  /** The lesson the learner opened most recently. */
  last: number | null;
  /** Journal notes, keyed by lesson number. */
  notes: Record<number, string>;
}

export const STORAGE_KEY = 'art-of-free-flow:v1';

export const emptyProgress = (): Progress => ({ completed: [], last: null, notes: {} });

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function defaultStorage(): StorageLike | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null; // private windows and blocked storage can throw
  }
}

/** Reads saved progress, ignoring anything malformed. */
export function loadProgress(storage: StorageLike | null = defaultStorage()): Progress {
  if (!storage) return emptyProgress();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const data = JSON.parse(raw) as Partial<Progress>;
    const completed = Array.isArray(data.completed)
      ? [...new Set(data.completed.filter((n): n is number => Number.isInteger(n) && n > 0))].sort((a, b) => a - b)
      : [];
    const last = Number.isInteger(data.last) && (data.last as number) > 0 ? (data.last as number) : null;
    const notes: Record<number, string> = {};
    if (data.notes && typeof data.notes === 'object') {
      for (const [k, v] of Object.entries(data.notes)) {
        const n = Number(k);
        if (Number.isInteger(n) && n > 0 && typeof v === 'string') notes[n] = v;
      }
    }
    return { completed, last, notes };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress, storage: StorageLike | null = defaultStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(storage: StorageLike | null = defaultStorage()): void {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
}

export function markComplete(p: Progress, lesson: number): Progress {
  if (p.completed.includes(lesson)) return p;
  return { ...p, completed: [...p.completed, lesson].sort((a, b) => a - b) };
}

export function markIncomplete(p: Progress, lesson: number): Progress {
  if (!p.completed.includes(lesson)) return p;
  return { ...p, completed: p.completed.filter((n) => n !== lesson) };
}

export function visit(p: Progress, lesson: number): Progress {
  return p.last === lesson ? p : { ...p, last: lesson };
}

export function setNote(p: Progress, lesson: number, text: string): Progress {
  if ((p.notes[lesson] ?? '') === text) return p;
  const notes = { ...p.notes };
  if (text) notes[lesson] = text;
  else delete notes[lesson];
  return { ...p, notes };
}

export function isCourseComplete(p: Progress, total: number): boolean {
  for (let n = 1; n <= total; n++) if (!p.completed.includes(n)) return false;
  return true;
}

/**
 * Where "continue" should take the learner: the lesson they were last on if
 * it isn't finished, otherwise the first unfinished lesson, otherwise lesson 1.
 */
export function resumeLesson(p: Progress, total: number): number {
  if (p.last && p.last <= total && !p.completed.includes(p.last)) return p.last;
  for (let n = 1; n <= total; n++) if (!p.completed.includes(n)) return n;
  return 1;
}

export const hasStarted = (p: Progress) => p.last !== null || p.completed.length > 0;
