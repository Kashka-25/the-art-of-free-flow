import type { NoteBlock } from '../data/lessons';

/** The lesson's written notes: paragraphs, small headings, set-apart quotes and numbered steps. */
export function LessonNotes({ notes }: { notes: NoteBlock[] }) {
  return (
    <div className="notes">
      {notes.map((block, i) =>
        typeof block === 'string' ? (
          <p key={i}>{block}</p>
        ) : 'heading' in block ? (
          <h2 key={i} className="notes__heading">{block.heading}</h2>
        ) : 'quote' in block ? (
          <blockquote key={i} className="notes__quote">
            <p>{block.quote}</p>
          </blockquote>
        ) : (
          <ol key={i} className="notes__steps">
            {block.steps.map((step, j) => (
              <li key={j}>{step}</li>
            ))}
          </ol>
        ),
      )}
    </div>
  );
}
