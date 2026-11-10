import { course } from './data/course';
import { lessons } from './data/lessons';
import { CompletionScreen } from './components/CompletionScreen';
import { ProgressTracker } from './components/ProgressTracker';
import { CoursePage } from './pages/CoursePage';
import { HomePage } from './pages/HomePage';
import { JournalPage } from './pages/JournalPage';
import { hasStarted } from './lib/progress';
import { go, href, useRoute } from './lib/route';
import { useProgress } from './lib/useProgress';
import { mediaUrl } from './lib/media';
import { useEffect } from 'react';

export function App() {
  const route = useRoute(lessons.length);
  const { progress, reset } = useProgress();

  useEffect(() => {
    document.title =
      route.name === 'lesson'
        ? `${lessons[route.number - 1].title} · ${course.title}`
        : route.name === 'journal'
          ? `Journal · ${course.title}`
          : course.title;
  }, [route]);

  const startOver = () => {
    if (window.confirm('Clear your progress and journal notes from this browser? This cannot be undone.')) {
      reset();
      go(href.home());
    }
  };

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => {
        e.preventDefault();
        document.getElementById('main')?.querySelector<HTMLElement>('h1')?.focus();
      }}>
        Skip to content
      </a>

      <div className={`topbar${route.name === 'lesson' ? ' topbar--dark' : ''}`}>
        <a className="topbar__mark" href={href.home()}>
          <span className="topbar__mark-wave" aria-hidden="true">~</span> {course.title}
        </a>
        {route.name === 'lesson' ? (
          <ProgressTracker current={route.number} />
        ) : (
          <nav className="topbar__links" aria-label="Site">
            <a href={href.lessons()}>Lessons</a>
            <a href={href.journal()} aria-current={route.name === 'journal' ? 'page' : undefined}>Journal</a>
          </nav>
        )}
        <img
          className="topbar__mascot"
          src={mediaUrl('coco-mascot.png')}
          alt=""
          title="Coco"
          width={44}
          height={44}
          decoding="async"
        />
      </div>

      {route.name === 'lesson' ? (
        <CoursePage number={route.number} />
      ) : route.name === 'journal' ? (
        <JournalPage />
      ) : route.name === 'complete' ? (
        <CompletionScreen />
      ) : (
        <HomePage section={route.section} />
      )}

      <footer className="footer">
        <p>A free, experimental course. No account needed: your progress and notes stay in this browser.</p>
        {hasStarted(progress) || Object.keys(progress.notes).length ? (
          <button type="button" className="link-button" onClick={startOver}>
            Clear my progress
          </button>
        ) : null}
      </footer>
    </>
  );
}
