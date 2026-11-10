/**
 * Builds a smooth wave path that repeats exactly every `width` units, drawn
 * across two widths so it can slide left forever without a seam.
 * Each component has a whole number of periods per width, which is what makes it loop.
 */
export interface WaveSpec {
  y: number;
  /** [amplitude, periods per width, phase in radians] */
  parts: Array<[number, number, number]>;
}

export function wavePath(width: number, spec: WaveSpec, steps = 160): string {
  const total = width * 2;
  let d = '';
  for (let i = 0; i <= steps * 2; i++) {
    const x = (i / (steps * 2)) * total;
    let y = spec.y;
    for (const [amp, periods, phase] of spec.parts) {
      y += amp * Math.sin((x / width) * periods * Math.PI * 2 + phase);
    }
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

/** Small deterministic random generator, so a lesson's art is the same every visit. */
export function seeded(seed: number) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
