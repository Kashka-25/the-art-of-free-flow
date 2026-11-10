import type { Lesson } from '../data/lessons';
import { href } from '../lib/route';
import { pad2 } from '../lib/media';

interface Props {
  prev?: Lesson;
  next?: Lesson;
  courseComplete: boolean;
}

export function LessonNavigation({ prev, next, courseComplete }: Props) {
  return (
    <nav className="lesson-nav" aria-label="Lessons">
      {prev ? (
        <a className="lesson-nav__link lesson-nav__link--prev" href={href.lesson(prev.number)}>
          <span className="lesson-nav__dir"><span aria-hidden="true">←</span> Previous</span>
          <span className="lesson-nav__title">
            <span className="lesson-nav__num">{pad2(prev.number)}</span> {prev.title}
          </span>
        </a>
      ) : (
        <a className="lesson-nav__link lesson-nav__link--prev" href={href.home()}>
          <span className="lesson-nav__dir"><span aria-hidden="true">←</span> Back</span>
          <span className="lesson-nav__title">The beginning</span>
        </a>
      )}

      {next ? (
        <a className="lesson-nav__link lesson-nav__link--next" href={href.lesson(next.number)}>
          <span className="lesson-nav__dir">Next <span aria-hidden="true">→</span></span>
          <span className="lesson-nav__title">
            <span className="lesson-nav__num">{pad2(next.number)}</span> {next.title}
          </span>
        </a>
      ) : courseComplete ? (
        <a className="lesson-nav__link lesson-nav__link--next is-finish" href={href.complete()}>
          <span className="lesson-nav__dir">Finish <span aria-hidden="true">→</span></span>
          <span className="lesson-nav__title">Close the circle</span>
        </a>
      ) : (
        <a className="lesson-nav__link lesson-nav__link--next" href={href.lessons()}>
          <span className="lesson-nav__dir">All lessons <span aria-hidden="true">→</span></span>
          <span className="lesson-nav__title">See what's left to explore</span>
        </a>
      )}
    </nav>
  );
}
