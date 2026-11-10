import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  clearProgress,
  emptyProgress,
  loadProgress,
  markComplete,
  markIncomplete,
  saveProgress,
  setNote,
  STORAGE_KEY,
  visit,
  type Progress,
} from './progress';

interface ProgressApi {
  progress: Progress;
  /** False when the browser refuses storage (e.g. some private windows). */
  canSave: boolean;
  complete: (lesson: number) => void;
  uncomplete: (lesson: number) => void;
  visit: (lesson: number) => void;
  setNote: (lesson: number, text: string) => void;
  reset: () => void;
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [canSave, setCanSave] = useState(true);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setCanSave(saveProgress(progress));
  }, [progress]);

  // Keep two open tabs in step.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setProgress(loadProgress());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const api = useMemo<ProgressApi>(
    () => ({
      progress,
      canSave,
      complete: (n) => setProgress((p) => markComplete(p, n)),
      uncomplete: (n) => setProgress((p) => markIncomplete(p, n)),
      visit: (n) => setProgress((p) => visit(p, n)),
      setNote: (n, text) => setProgress((p) => setNote(p, n, text)),
      reset: () => {
        clearProgress();
        first.current = true; // don't immediately write the empty state back
        setProgress(emptyProgress());
      },
    }),
    [progress, canSave],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressApi {
  const api = useContext(Ctx);
  if (!api) throw new Error('useProgress must be used inside <ProgressProvider>');
  return api;
}

/** Moves focus to the page heading and scrolls to the top when a page opens. */
export function usePageFocus(key: unknown) {
  const ref = useRef<HTMLHeadingElement>(null);
  const focus = useCallback(() => {
    window.scrollTo({ top: 0 });
    ref.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    focus();
  }, [key, focus]);
  return ref;
}
