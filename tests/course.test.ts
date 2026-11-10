import { describe, expect, it } from 'vitest';
import { lessons } from '../src/data/lessons';
import {
  emptyProgress,
  isCourseComplete,
  loadProgress,
  markComplete,
  markIncomplete,
  resumeLesson,
  saveProgress,
  setNote,
  STORAGE_KEY,
  visit,
} from '../src/lib/progress';
import { parseRoute } from '../src/lib/route';
import { formatTime } from '../src/lib/media';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => void (data[k] = v),
    removeItem: (k: string) => void delete data[k],
    data,
  };
}

describe('lesson configuration', () => {
  it('has seven lessons numbered 1 to 7 in order', () => {
    expect(lessons.map((l) => l.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('gives every lesson a title, description and video', () => {
    for (const l of lessons) {
      expect(l.title.trim()).not.toBe('');
      expect(l.description.trim()).not.toBe('');
      expect(l.video.trim()).not.toBe('');
    }
  });
});

describe('progress', () => {
  it('marks lessons complete once, in order, and can undo', () => {
    let p = emptyProgress();
    p = markComplete(p, 3);
    p = markComplete(p, 1);
    p = markComplete(p, 3);
    expect(p.completed).toEqual([1, 3]);
    p = markIncomplete(p, 3);
    expect(p.completed).toEqual([1]);
  });

  it('knows when all seven are done', () => {
    let p = emptyProgress();
    for (let n = 1; n <= 6; n++) p = markComplete(p, n);
    expect(isCourseComplete(p, 7)).toBe(false);
    expect(isCourseComplete(markComplete(p, 7), 7)).toBe(true);
  });

  it('continues where the learner left off', () => {
    let p = emptyProgress();
    expect(resumeLesson(p, 7)).toBe(1);
    p = visit(markComplete(p, 1), 2);
    expect(resumeLesson(p, 7)).toBe(2); // on lesson 2, not finished yet
    p = markComplete(p, 2);
    expect(resumeLesson(p, 7)).toBe(3); // finished it, so the next one
    p = visit(markComplete(p, 5), 5);
    expect(resumeLesson(p, 7)).toBe(3); // first gap
  });

  it('keeps and removes notes', () => {
    let p = setNote(emptyProgress(), 2, 'it felt lighter');
    expect(p.notes[2]).toBe('it felt lighter');
    p = setNote(p, 2, '');
    expect(p.notes[2]).toBeUndefined();
  });

  it('round-trips through storage', () => {
    const store = memoryStorage();
    const p = setNote(visit(markComplete(emptyProgress(), 4), 4), 4, 'notes\nacross lines');
    expect(saveProgress(p, store)).toBe(true);
    expect(loadProgress(store)).toEqual(p);
  });

  it('ignores broken or tampered storage', () => {
    expect(loadProgress(memoryStorage({ [STORAGE_KEY]: '{not json' }))).toEqual(emptyProgress());
    const odd = loadProgress(
      memoryStorage({ [STORAGE_KEY]: JSON.stringify({ completed: [2, 'x', -1, 2], last: 'y', notes: { 1: 'ok', 2: 5 } }) }),
    );
    expect(odd).toEqual({ completed: [2], last: null, notes: { 1: 'ok' } });
  });

  it('copes with no storage at all', () => {
    expect(loadProgress(null)).toEqual(emptyProgress());
    expect(saveProgress(emptyProgress(), null)).toBe(false);
  });
});

describe('routes', () => {
  it('reads lesson, journal and completion links', () => {
    expect(parseRoute('', 7)).toEqual({ name: 'home' });
    expect(parseRoute('#/', 7)).toEqual({ name: 'home' });
    expect(parseRoute('#/lessons', 7)).toEqual({ name: 'home', section: 'lessons' });
    expect(parseRoute('#/lesson/4', 7)).toEqual({ name: 'lesson', number: 4 });
    expect(parseRoute('#/lesson/9', 7)).toEqual({ name: 'home' });
    expect(parseRoute('#/journal', 7)).toEqual({ name: 'journal' });
    expect(parseRoute('#/complete/', 7)).toEqual({ name: 'complete' });
  });
});

describe('time', () => {
  it('formats seconds for the player', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(75.4)).toBe('1:15');
    expect(formatTime(3725)).toBe('1:02:05');
    expect(formatTime(NaN)).toBe('0:00');
  });
});
