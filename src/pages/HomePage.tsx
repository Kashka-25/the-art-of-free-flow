import { CourseOverview } from '../components/CourseOverview';
import { Hero } from '../components/Hero';
import { usePageFocus } from '../lib/useProgress';

export function HomePage({ section }: { section?: string }) {
  const heading = usePageFocus(section ?? 'home');
  return (
    <main id="main" className="page-enter">
      <Hero headingRef={heading} />
      <CourseOverview scrollIntoView={section === 'lessons'} />
    </main>
  );
}
