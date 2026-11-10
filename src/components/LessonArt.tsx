import { useMemo } from 'react';
import { seeded, wavePath } from '../lib/waves';

const W = 320;
const H = 180;
const INKS = ['var(--clay)', 'var(--ochre)', 'var(--sage)', 'var(--ink)'];
const GROUNDS = ['#eadcc6', '#e6d6c0', '#e3dccb', '#ead6c4', '#e2d9c4', '#e8d3bd', '#dfd8c6'];

/**
 * A drawn stand-in for a lesson thumbnail. Each lesson gets its own pattern,
 * growing a little denser as the course goes on, like a flow building.
 */
export function LessonArt({ number }: { number: number }) {
  const lines = useMemo(() => {
    const rand = seeded(number * 7 + 3);
    const count = 3 + number;
    return Array.from({ length: count }, (_, i) => {
      const y = H / 2 + (i - count / 2) * (8 + rand() * 6);
      const d = wavePath(W / 2, {
        y,
        parts: [
          [10 + rand() * 18, 1 + Math.floor(rand() * 2), rand() * 6],
          [3 + rand() * 6, 3 + Math.floor(rand() * 3), rand() * 6],
        ],
      }, 60);
      return { d, stroke: INKS[(i + number) % INKS.length], width: 0.6 + rand() * 1.4, opacity: 0.45 + rand() * 0.5 };
    });
  }, [number]);

  return (
    <svg className="lesson-art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width={W} height={H} fill={GROUNDS[(number - 1) % GROUNDS.length]} />
      {lines.map((l, i) => (
        <path key={i} d={l.d} fill="none" stroke={l.stroke} strokeWidth={l.width} opacity={l.opacity} strokeLinecap="round" />
      ))}
    </svg>
  );
}
