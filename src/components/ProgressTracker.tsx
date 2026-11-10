import { lessons } from '../data/lessons';
import { href } from '../lib/route';
import { pad2 } from '../lib/media';
import { useProgress } from '../lib/useProgress';

/** Seven stops on a thin line. Finished stops fill in; the current one is ringed. */
export function ProgressTracker({ current }: { current?: number }) {
  const { progress } = useProgress();
  const total = lessons.length;
  const done = progress.completed.filter((n) => n <= total).length;

  return (
    <nav className="tracker" aria-label="Course progress">
      <div className="tracker__bar" aria-hidden="true">
        <span style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <ol className="tracker__stops">
        {lessons.map((l) => {
          const complete = progress.completed.includes(l.number);
          const here = current === l.number;
          return (
            <li key={l.number}>
              <a
                href={href.lesson(l.number)}
                className={`tracker__stop${complete ? ' is-complete' : ''}${here ? ' is-current' : ''}`}
                aria-current={here ? 'page' : undefined}
                aria-label={`Lesson ${l.number}: ${l.title}${complete ? ', completed' : ''}`}
                title={`${pad2(l.number)} · ${l.title}`}
              >
                <span aria-hidden="true">{l.number}</span>
              </a>
            </li>
          );
        })}
      </ol>
      <p className="tracker__count">
        <span className="visually-hidden">Completed </span>
        {done}/{total}
      </p>
    </nav>
  );
}
