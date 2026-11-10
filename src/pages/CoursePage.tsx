import { useEffect, useRef, useState } from 'react';
import { lessons } from '../data/lessons';
import { LessonNavigation } from '../components/LessonNavigation';
import { ReflectionJournal } from '../components/ReflectionJournal';
import { VideoPlayer } from '../components/VideoPlayer';
import { isCourseComplete } from '../lib/progress';
import { href } from '../lib/route';
import { mediaUrl, pad2 } from '../lib/media';
import { usePageFocus, useProgress } from '../lib/useProgress';

/** One lesson: the video stage, the lesson notes, the journal and the way on. */
export function CoursePage({ number }: { number: number }) {
  const lesson = lessons.find((l) => l.number === number)!;
  const index = lessons.indexOf(lesson);
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const total = lessons.length;

  const { progress, complete, uncomplete, visit } = useProgress();
  const heading = usePageFocus(number);
  const isComplete = progress.completed.includes(number);
  const courseComplete = isCourseComplete(progress, total);

  // Tell the learner when the whole course has just been finished.
  // Keep keyboard focus on the toggle when it swaps between "mark" and "undo".
  const toggleRef = useRef<HTMLButtonElement>(null);
  const toggled = useRef(false);
  useEffect(() => {
    if (toggled.current) toggleRef.current?.focus();
    toggled.current = false;
  }, [isComplete]);
  const toggleComplete = () => {
    toggled.current = true;
    if (isComplete) uncomplete(number);
    else complete(number);
  };

  const wasComplete = useRef(courseComplete);
  const [justFinished, setJustFinished] = useState(false);
  useEffect(() => {
    if (courseComplete && !wasComplete.current) setJustFinished(true);
    wasComplete.current = courseComplete;
  }, [courseComplete]);

  useEffect(() => {
    visit(number);
    setJustFinished(false);
  }, [number]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main id="main" className="lesson" key={number}>
      <section className="stage" aria-labelledby="lesson-title">
        <div className="stage__inner page-enter">
          <header className="stage__head">
            <p className="eyebrow eyebrow--light">
              Lesson {pad2(number)} <span className="stage__of">of {pad2(total)}</span>
              {lesson.duration && <span className="stage__duration"> · {lesson.duration}</span>}
            </p>
            <h1 id="lesson-title" className="stage__title" ref={heading} tabIndex={-1}>
              {lesson.title}
            </h1>
          </header>
          <VideoPlayer
            src={mediaUrl(lesson.video)!}
            poster={mediaUrl(lesson.thumbnail)}
            label={`Lesson ${number}: ${lesson.title}`}
            onWatched={() => complete(number)}
          />
        </div>
      </section>

      <div className="lesson__body page-enter">
        <div className="lesson__about">
          <p className="lesson__description">{lesson.description}</p>
          <div className="lesson__complete">
            {isComplete ? (
              <>
                <p className="lesson__done" role="status">
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10.5l3.2 3L15 6.5" /></svg>
                  Lesson complete
                </p>
                <button type="button" className="link-button" ref={toggleRef} onClick={toggleComplete}>
                  Mark as not done
                </button>
              </>
            ) : (
              <>
                <button type="button" className="button button--outline" ref={toggleRef} onClick={toggleComplete}>
                  Mark as complete
                </button>
                <p className="lesson__hint">Or just watch to the end; it'll tick itself off.</p>
              </>
            )}
          </div>
          {justFinished && (
            <p className="lesson__finished" role="status">
              That's all seven. <a href={href.complete()}>Close the circle →</a>
            </p>
          )}
        </div>

        <ReflectionJournal lesson={number} prompts={lesson.prompts} />

        <LessonNavigation prev={prev} next={next} courseComplete={courseComplete} />
      </div>
    </main>
  );
}
