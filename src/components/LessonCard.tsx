import type { Lesson } from '../data/lessons';
import { href } from '../lib/route';
import { mediaUrl, pad2 } from '../lib/media';
import { LessonArt } from './LessonArt';

interface Props {
  lesson: Lesson;
  completed: boolean;
  isNext: boolean;
}

export function LessonCard({ lesson, completed, isNext }: Props) {
  const status = completed ? 'Completed' : isNext ? 'Up next' : null;
  return (
    <li className={`lesson-card${completed ? ' is-complete' : ''}${isNext ? ' is-next' : ''}`}>
      <a className="lesson-card__link" href={href.lesson(lesson.number)}>
        <div className="lesson-card__media">
          {lesson.thumbnail ? (
            <img src={mediaUrl(lesson.thumbnail)} alt="" loading="lazy" decoding="async" />
          ) : (
            <LessonArt number={lesson.number} />
          )}
          {completed && (
            <span className="lesson-card__check" aria-hidden="true">
              <svg viewBox="0 0 20 20"><path d="M5 10.5l3.2 3L15 6.5" /></svg>
            </span>
          )}
        </div>
        <div className="lesson-card__body">
          <p className="lesson-card__meta">
            <span className="lesson-card__number">{pad2(lesson.number)}</span>
            {lesson.duration && <span>{lesson.duration}</span>}
            {status && <span className={`lesson-card__status${completed ? ' is-done' : ''}`}>{status}</span>}
          </p>
          <h3 className="lesson-card__title">{lesson.title}</h3>
          <p className="lesson-card__description">{lesson.description}</p>
        </div>
      </a>
    </li>
  );
}
