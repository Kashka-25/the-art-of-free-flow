import { course } from '../data/course';
import { lessons } from '../data/lessons';
import { href } from '../lib/route';
import { hasStarted, isCourseComplete, resumeLesson } from '../lib/progress';
import { useProgress } from '../lib/useProgress';
import { mediaUrl, pad2 } from '../lib/media';
import { FlowLines } from './FlowLines';
import type { CSSProperties, Ref } from 'react';

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export function Hero({ headingRef }: { headingRef: Ref<HTMLHeadingElement> }) {
  const { progress } = useProgress();
  const total = lessons.length;
  const started = hasStarted(progress);
  const done = isCourseComplete(progress, total);
  const resume = resumeLesson(progress, total);

  // "The Art of Free Flow" → "The Art of" / "Free Flow", the second half set in italic.
  const [lead, flow] = splitTitle(course.title);

  return (
    <header className="hero">
      <div className="hero__inner">
        <p className="eyebrow hero__eyebrow rise" style={delay(0)}>
          A free course in {numberWord(total)} lessons
        </p>
        <h1 className="hero__title rise" ref={headingRef} tabIndex={-1} style={delay(80)}>
          <span className="hero__title-lead">{lead}</span>
          <span className="hero__title-flow">{flow}</span>
        </h1>
        <p className="hero__subtitle rise" style={delay(160)}>
          {course.subtitle}
        </p>
        <p className="hero__description rise" style={delay(240)}>
          {course.description}
        </p>

        <div className="hero__actions rise" style={delay(320)}>
          {done ? (
            <>
              <a className="button button--primary" href={href.complete()}>See your completion</a>
              <a className="button button--quiet" href={href.lessons()}>Revisit the lessons</a>
            </>
          ) : started ? (
            <>
              <a className="button button--primary" href={href.lesson(resume)}>
                Continue with lesson {pad2(resume)}
              </a>
              <a className="button button--quiet" href={href.lessons()}>See all lessons</a>
            </>
          ) : (
            <>
              <a className="button button--primary" href={href.lesson(1)}>
                {course.beginLabel}
                <span aria-hidden="true" className="button__arrow">→</span>
              </a>
              <a className="button button--quiet" href={href.lessons()}>See the lessons</a>
            </>
          )}
        </div>

        <ul className="hero__facts rise" style={delay(400)}>
          {course.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <img
          className="hero__star rise"
          style={delay(200)}
          src={mediaUrl('coco-rockstar.webp')}
          srcSet={`${mediaUrl('coco-rockstar-small.webp')} 520w, ${mediaUrl('coco-rockstar.webp')} 900w`}
          sizes="(min-width: 960px) 40vw, 80vw"
          alt="Coco, the course's mascot: a chill monkey in an orange beanie and sunglasses, sitting cross-legged on a cloud with a golden microphone, making a peace sign"
          width={900}
          height={1119}
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <FlowLines className="hero__lines" />
    </header>
  );
}

function splitTitle(title: string): [string, string] {
  const i = title.toLowerCase().lastIndexOf(' of ');
  if (i === -1) return ['', title];
  return [title.slice(0, i + 3), title.slice(i + 4)];
}

function numberWord(n: number) {
  return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] ?? String(n);
}
