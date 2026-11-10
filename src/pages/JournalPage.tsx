import { course } from '../data/course';
import { lessons } from '../data/lessons';
import { href } from '../lib/route';
import { pad2 } from '../lib/media';
import { usePageFocus, useProgress } from '../lib/useProgress';

/** Every note from every lesson on one page, to read back and keep. */
export function JournalPage() {
  const { progress } = useProgress();
  const heading = usePageFocus('journal');
  const withNotes = lessons.filter((l) => progress.notes[l.number]?.trim());

  const download = () => {
    const text = [
      `${course.title} — my journal`,
      '',
      ...lessons.flatMap((l) => {
        const note = progress.notes[l.number]?.trim();
        return note ? [`Lesson ${pad2(l.number)}: ${l.title}`, '', note, '', ''] : [];
      }),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'my-free-flow-journal.txt' });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main id="main" className="journal-page page-enter">
      <header className="journal-page__head">
        <p className="eyebrow">Your notes</p>
        <h1 className="journal-page__title" ref={heading} tabIndex={-1}>
          The journal
        </h1>
        <p className="journal-page__intro">
          Everything you've written along the way. It lives only in this browser. Download a copy if you'd like to
          keep it.
        </p>
        {withNotes.length > 0 && (
          <button type="button" className="button button--outline" onClick={download}>
            Download my journal
          </button>
        )}
      </header>

      <ol className="journal-page__list">
        {lessons.map((l) => {
          const note = progress.notes[l.number]?.trim();
          return (
            <li key={l.number} className={`journal-entry${note ? '' : ' is-empty'}`}>
              <div className="journal-entry__head">
                <span className="journal-entry__num">{pad2(l.number)}</span>
                <h2 className="journal-entry__title">{l.title}</h2>
                <a className="journal-entry__link" href={href.lesson(l.number)}>
                  {note ? 'Open lesson' : 'Write something'}
                  <span className="visually-hidden"> for lesson {l.number}</span>
                </a>
              </div>
              {note ? <p className="journal-entry__note">{note}</p> : <p className="journal-entry__empty">Nothing yet.</p>}
            </li>
          );
        })}
      </ol>
    </main>
  );
}
