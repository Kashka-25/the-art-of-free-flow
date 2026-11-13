import { course } from '../data/course';

/** A quiet, no-pressure note: an optional donation, and an invitation to Cassidy's portfolio. */
export function SupportNote() {
  const s = course.support;
  return (
    <section className="support" aria-labelledby="support-title">
      <div className="support__inner">
        <p className="eyebrow">No pressure</p>
        <h2 id="support-title" className="support__title">{s.heading}</h2>
        <div className="support__columns">
          {s.donationUrl && (
            <div className="support__item">
              <p>{s.donationText}</p>
              <a className="button button--primary" href={s.donationUrl} target="_blank" rel="noopener noreferrer">
                {s.donationLabel}
              </a>
            </div>
          )}
          <div className="support__item">
            <p>{s.portfolioText}</p>
            <a className="button button--outline" href={s.portfolioUrl} target="_blank" rel="noopener noreferrer">
              {s.portfolioLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
