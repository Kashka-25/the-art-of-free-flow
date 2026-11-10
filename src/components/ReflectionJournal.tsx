import { useEffect, useRef, useState } from 'react';
import { useProgress } from '../lib/useProgress';

interface Props {
  lesson: number;
  prompts: string[];
}

const SAVE_DELAY_MS = 500;

/** A private page of notes for each lesson, kept in this browser only. */
export function ReflectionJournal({ lesson, prompts }: Props) {
  const { progress, setNote, canSave } = useProgress();
  const saved = progress.notes[lesson] ?? '';
  const [text, setText] = useState(saved);
  const [status, setStatus] = useState<'idle' | 'typing' | 'saved'>('idle');
  const area = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // Text typed but not yet saved, so leaving the page never loses it.
  const pending = useRef<string | null>(null);
  const saveRef = useRef(setNote);
  saveRef.current = setNote;

  // Another lesson: show what's saved for it. (Reads the saved note only when the lesson changes.)
  const savedRef = useRef(saved);
  savedRef.current = saved;
  useEffect(() => {
    setText(savedRef.current);
    setStatus('idle');
  }, [lesson]);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      if (pending.current !== null) saveRef.current(lesson, pending.current);
    },
    [lesson],
  );

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 180)}px`;
  }, [text]);

  const write = (value: string) => {
    setText(value);
    setStatus('typing');
    pending.current = value;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      pending.current = null;
      setNote(lesson, value);
      setStatus('saved');
    }, SAVE_DELAY_MS);
  };

  // Save straight away if the learner leaves mid-thought.
  const flush = () => {
    if (pending.current === null) return;
    window.clearTimeout(timer.current);
    setNote(lesson, pending.current);
    pending.current = null;
    setStatus('saved');
  };

  const addPrompt = (prompt: string) => {
    const joiner = text.trim() ? (text.endsWith('\n') ? '\n' : '\n\n') : '';
    const next = `${text}${joiner}${prompt}\n`;
    area.current?.focus();
    write(next);
    requestAnimationFrame(() => area.current?.setSelectionRange(next.length, next.length));
  };

  const id = `journal-${lesson}`;

  return (
    <section className="journal" aria-labelledby={`${id}-title`}>
      <div className="journal__head">
        <p className="eyebrow">Reflection &amp; practice</p>
        <h2 id={`${id}-title`} className="journal__title">Your journal</h2>
        <p className="journal__intro">
          Optional, and just for you. Try the exercise, then jot down whatever came up. No right answers.
        </p>
      </div>

      {prompts.length > 0 && (
        <div className="journal__prompts">
          <p className="journal__prompts-label" id={`${id}-prompts`}>A few places to start</p>
          <ul aria-labelledby={`${id}-prompts`}>
            {prompts.map((p) => (
              <li key={p}>
                <button type="button" className="prompt-chip" onClick={() => addPrompt(p)}>
                  {p}
                  <span className="visually-hidden"> (add to your notes)</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="journal__page">
        <label htmlFor={id} className="visually-hidden">
          Notes for this lesson
        </label>
        <textarea
          id={id}
          ref={area}
          className="journal__area"
          value={text}
          onChange={(e) => write(e.target.value)}
          onBlur={flush}
          placeholder="Write freely. Nobody else will see this…"
          spellCheck
        />
      </div>
      <p className="journal__status" role="status" aria-live="polite">
        {!canSave
          ? "This browser isn't letting the page save. Your notes will be lost when you leave."
          : status === 'typing'
            ? 'Writing…'
            : status === 'saved'
              ? 'Saved in this browser'
              : 'Notes save automatically, privately, in this browser.'}
      </p>
    </section>
  );
}
