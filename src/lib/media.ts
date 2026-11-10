/** Turns a path from lessons.ts into a URL: full URLs pass through, local paths get the site base. */
export function mediaUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:') || src.startsWith('blob:')) return src;
  return import.meta.env.BASE_URL + src.replace(/^\.?\//, '');
}

/** 75.4 -> "1:15" */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
