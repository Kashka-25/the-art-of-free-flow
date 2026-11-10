import { useMemo } from 'react';
import { wavePath, type WaveSpec } from '../lib/waves';

const W = 1200;
const H = 400;

interface Line extends WaveSpec {
  stroke: string;
  width: number;
  opacity: number;
  /** seconds for one full drift */
  speed: number;
  reverse?: boolean;
}

// Movement, rhythm and breath: a loose bundle of lines drifting at different tempos.
const LINES: Line[] = [
  { y: 200, parts: [[46, 2, 0], [14, 5, 1.2]], stroke: 'var(--clay)', width: 2.2, opacity: 0.9, speed: 70 },
  { y: 214, parts: [[40, 2, 0.5], [10, 6, 0.3]], stroke: 'var(--ochre)', width: 1.4, opacity: 0.85, speed: 90 },
  { y: 186, parts: [[52, 2, -0.4], [8, 7, 2.1]], stroke: 'var(--ink)', width: 0.9, opacity: 0.55, speed: 110, reverse: true },
  { y: 230, parts: [[30, 3, 1.4], [12, 4, 0]], stroke: 'var(--sage)', width: 1.2, opacity: 0.8, speed: 80 },
  { y: 172, parts: [[36, 3, 2.6], [6, 9, 0.8]], stroke: 'var(--clay)', width: 0.8, opacity: 0.5, speed: 120, reverse: true },
  { y: 248, parts: [[22, 2, 3.0], [16, 5, 1.9]], stroke: 'var(--ink)', width: 0.6, opacity: 0.35, speed: 100 },
  { y: 156, parts: [[26, 4, 0.9], [10, 3, 0.2]], stroke: 'var(--ochre)', width: 0.7, opacity: 0.6, speed: 140 },
];

export function FlowLines({ className = '' }: { className?: string }) {
  const paths = useMemo(() => LINES.map((l) => wavePath(W, l)), []);
  return (
    <svg
      className={`flow-lines ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {LINES.map((l, i) => (
        <g
          key={i}
          className="flow-lines__drift"
          style={{ animationDuration: `${l.speed}s`, animationDirection: l.reverse ? 'reverse' : 'normal' }}
        >
          <path
            d={paths[i]}
            fill="none"
            stroke={l.stroke}
            strokeWidth={l.width}
            strokeLinecap="round"
            opacity={l.opacity}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </svg>
  );
}
