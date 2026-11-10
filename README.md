# The Art of Free Flow

A free, seven-part freestyle course. No accounts, no backend: progress and journal notes stay in the visitor's browser.

## Run it

```bash
npm install
npm run dev      # http://localhost:5300
npm test         # progress, routes, lesson config
npm run build    # static site in dist/
```

## Add your seven videos

Put the files here, with these exact names:

```
public/videos/lesson-01.mp4
public/videos/lesson-02.mp4
...
public/videos/lesson-07.mp4
```

Different names? Change the `video:` line for that lesson in `src/data/lessons.ts`.
Hosting a video elsewhere? Put the full address there instead, e.g. `video: 'https://…/lesson-03.mp4'`.

Until a file exists, that lesson shows "This lesson's video is on its way."

Tips: export as MP4 (H.264 + AAC) with "fast start" / "web optimised" ticked, so playback can begin before the whole file downloads. GitHub refuses files over 100 MB; host bigger videos elsewhere and use the URL.

## Change lesson titles, descriptions and prompts

Everything lives in **`src/data/lessons.ts`**: one block per lesson with `title`, `description`, `video`, optional `thumbnail` and `duration`, and the `prompts` shown above the journal.
The landing and completion words are in **`src/data/course.ts`**.

Optional thumbnails go in `public/thumbnails/` (e.g. `thumbnail: 'thumbnails/lesson-01.jpg'`). Without one, each lesson gets its own drawn pattern.

## How it's built

Vite + React + TypeScript, no router or UI library. Hash links (`#/lesson/3`, `#/journal`, `#/complete`) so the built `dist/` works as a single link on any static host (GitHub Pages, Netlify).

- `src/components/`: Hero, CourseOverview, LessonCard, VideoPlayer, ProgressTracker, ReflectionJournal, LessonNavigation, CompletionScreen
- `src/pages/`: HomePage, CoursePage (one lesson), JournalPage
- `src/lib/progress.ts`: saved progress (localStorage key `art-of-free-flow:v1`)
- `src/styles/course.css`: all styling; colours are variables at the top

A lesson counts as complete when the video reaches 95%, or when the learner presses "Mark as complete".
Player keys (with the player focused): Space/K play, ←/→ 5 seconds, ↑/↓ volume, M mute, F full screen.
