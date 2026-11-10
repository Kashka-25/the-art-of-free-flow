import { useEffect, useRef } from 'react';
import { lessons } from '../data/lessons';
import { hasStarted, isCourseComplete, resumeLesson } from '../lib/progress';
import { useProgress } from '../lib/useProgress';
import { LessonCard } from './LessonCard';

export function CourseOverview({ scrollIntoView }: { scrollIntoView: boolean }) {
  const { progress } = useProgress();
  const ref = useRef<HTMLElement>(null);
  const total = lessons.length;
  const done = progress.completed.filter((n) => n <= total).length;
  const next = hasStarted(progress) && !isCourseComplete(progress, total) ? resumeLesson(progress, total) : null;

  useEffect(() => {
    if (!scrollIntoView) return;
    // After the page's own scroll-to-top has run.
    const id = requestAnimationFrame(() => ref.current?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(id);
  }, [scrollIntoView]);

  return (
    <section className="overview" id="lessons" ref={ref} aria-labelledby="overview-title">
      <div className="overview__head">
        <p className="eyebrow">The journey</p>
        <h2 id="overview-title" className="overview__title">Seven lessons, one at a time</h2>
        {done > 0 && (
          <p className="overview__count">
            {done} of {total} complete
          </p>
        )}
      </div>
      <ol className="lesson-grid">
        {lessons.map((l) => (
          <LessonCard key={l.number} lesson={l} completed={progress.completed.includes(l.number)} isNext={next === l.number} />
        ))}
      </ol>
    </section>
  );
}
