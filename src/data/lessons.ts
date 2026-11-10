/**
 * THE COURSE CONFIGURATION — edit this file to change the lessons.
 *
 * Every lesson on the site is built from this list. Change a title, a
 * description, a video or a prompt here and the whole site follows.
 *
 * Videos
 *   - Local file:  put it in  public/videos/  and write  'videos/lesson-01.mp4'
 *   - Hosted file: write the full address, e.g. 'https://example.com/lesson-01.mp4'
 *
 * Thumbnails (optional)
 *   - Put an image in  public/thumbnails/  and write  'thumbnails/lesson-01.jpg'
 *   - Leave it out and the lesson shows a drawn pattern instead.
 *
 * Duration (optional)
 *   - Any short text, e.g. '8 min'. Leave it out if you don't know it yet.
 *
 * NOTE: the titles and descriptions below are PLACEHOLDERS until the real
 * lesson details are written in.
 */

export interface Lesson {
  /** Shown as "Lesson 01". Keep these 1 to 7, in order. */
  number: number;
  title: string;
  description: string;
  /** Local path inside public/ (e.g. 'videos/lesson-01.mp4') or a full https:// URL. */
  video: string;
  /** Optional poster image: local path inside public/ or a full URL. */
  thumbnail?: string;
  /** Optional, e.g. '9 min'. */
  duration?: string;
  /** Gentle questions shown above the journal. Leave the list empty for none. */
  prompts: string[];
}

const PLACEHOLDER = 'Placeholder description. The real words for this lesson will go here.';

const DEFAULT_PROMPTS = [
  'What did you notice?',
  'What felt natural?',
  'What challenged you?',
  'What happened when you stopped overthinking?',
];

export const lessons: Lesson[] = [
  {
    number: 1,
    title: 'Introduction to Free Flow',
    description: PLACEHOLDER,
    video: 'videos/lesson-01.mp4',
    prompts: DEFAULT_PROMPTS,
  },
  {
    number: 2,
    title: 'Letting Go of the Mind',
    description: PLACEHOLDER,
    video: 'videos/lesson-02.mp4',
    prompts: DEFAULT_PROMPTS,
  },
  {
    number: 3,
    title: 'Finding Your Rhythm',
    description: PLACEHOLDER,
    video: 'videos/lesson-03.mp4',
    prompts: DEFAULT_PROMPTS,
  },
  {
    number: 4,
    title: 'Overcoming the Inner Critic',
    description: PLACEHOLDER,
    video: 'videos/lesson-04.mp4',
    prompts: DEFAULT_PROMPTS,
  },
  {
    number: 5,
    title: 'Trusting Your Instincts',
    description: PLACEHOLDER,
    video: 'videos/lesson-05.mp4',
    prompts: DEFAULT_PROMPTS,
  },
  {
    number: 6,
    title: 'Developing Your Flow',
    description: PLACEHOLDER,
    video: 'videos/lesson-06.mp4',
    prompts: DEFAULT_PROMPTS,
  },
  {
    number: 7,
    title: 'Freestyle in Practice',
    description: PLACEHOLDER,
    video: 'videos/lesson-07.mp4',
    prompts: DEFAULT_PROMPTS,
  },
];
