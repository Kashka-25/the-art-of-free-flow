import { useEffect, useState } from 'react';

/**
 * Hash routes, so the whole course works from a single link on any static host:
 *   #/            landing
 *   #/lesson/3    a lesson
 *   #/journal     all your notes
 *   #/complete    the completion screen
 */
export type Route =
  | { name: 'home'; section?: string }
  | { name: 'lesson'; number: number }
  | { name: 'journal' }
  | { name: 'complete' };

export function parseRoute(hash: string, total: number): Route {
  const path = hash.replace(/^#\/?/, '').replace(/\/$/, '');
  const lesson = /^lesson\/(\d+)$/.exec(path);
  if (lesson) {
    const n = Number(lesson[1]);
    if (n >= 1 && n <= total) return { name: 'lesson', number: n };
    return { name: 'home' };
  }
  if (path === 'journal') return { name: 'journal' };
  if (path === 'complete') return { name: 'complete' };
  if (path === 'lessons') return { name: 'home', section: 'lessons' };
  return { name: 'home' };
}

export const href = {
  home: () => '#/',
  lessons: () => '#/lessons',
  lesson: (n: number) => `#/lesson/${n}`,
  journal: () => '#/journal',
  complete: () => '#/complete',
};

export function go(to: string) {
  if (window.location.hash === to) return;
  window.location.hash = to;
}

export function useRoute(total: number): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash, total));
  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.hash, total));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, [total]);
  return route;
}
