import { course } from '../data/course';
import { lessons } from '../data/lessons';
import { href } from '../lib/route';
import { isCourseComplete, resumeLesson } from '../lib/progress';
import { usePageFocus, useProgress } from '../lib/useProgress';
import { pad2 } from '../lib/media';
import { FlowLines } from './FlowLines';

export function CompletionScreen() {
  const { progress } = useProgress();
  const heading = usePageFocus('complete');
  const total = lessons.length;
  const done = isCourseComplete(progress, total);

  if (!done) {
    const next = resumeLesson(progress, total);
    return (
      <main id="main" className="completion completion--early page-enter">
        <div className="completion__inner">
          <p className="eyebrow">Not quite yet</p>
          <h1 className="completion__title completion__title--small" ref={heading} tabIndex={-1}>
            This page waits at the end of lesson {pad2(total)}.
          </h1>
          <p className="completion__message">There's no rush. Pick up where you left off whenever you're ready.</p>
          <div className="completion__actions">
            <a className="button button--primary" href={href.lesson(next)}>Go to lesson {pad2(next)}</a>
            <a className="button button--quiet" href={href.lessons()}>All lessons</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="completion page-enter">
      <FlowLines className="completion__lines" />
      <div className="completion__inner">
        <p className="eyebrow rise">Seven of seven</p>
        <h1 className="completion__title rise" ref={heading} tabIndex={-1}>
          {course.completion.heading}
        </h1>
        <p className="completion__message rise">{course.completion.message}</p>
        <div className="completion__actions rise">
          <a className="button button--primary" href={href.journal()}>Keep practising with your journal</a>
          <a className="button button--quiet" href={href.lessons()}>Revisit the lessons</a>
        </div>
      </div>
    </main>
  );
}
