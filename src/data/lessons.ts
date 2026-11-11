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
 * Covers (optional)
 *   - thumbnail: the wide card image, in public/thumbnails/ (960x540)
 *   - poster: the image in the player before it plays, in public/posters/
 *     (720x1280 for vertical videos). Falls back to the thumbnail.
 *   - The current covers are rockstar Coco, one pose per lesson; see scripts/make-rockstar-covers.py.
 *   - Leave both out and the lesson shows a drawn pattern instead.
 *
 * Shape (optional)
 *   - 'portrait' for vertical (phone) videos, 'landscape' for wide ones (the default).
 *
 * Duration (optional)
 *   - Any short text, e.g. '8 min'. Leave it out if you don't know it yet.
 *
 * Description and notes
 *   - description: one or two lines, shown on the lesson card.
 *   - notes: the full lesson notes, shown under the video. Each item is one of:
 *       'A paragraph of text.'
 *       { heading: 'A small heading' }
 *       { quote: 'A line to set apart' }
 *       { steps: ['First step', 'Second step'] }   (a numbered list)
 *
 * The words are Cassidy's own lesson notes, lightly edited (11 Nov 2026).
 */

export type NoteBlock = string | { heading: string } | { quote: string } | { steps: string[] };

export interface Lesson {
  /** Shown as "Lesson 01". Keep these 1 to 7, in order. */
  number: number;
  title: string;
  /** Short summary for the lesson card. */
  description: string;
  /** The full lesson notes shown under the video. Falls back to the description. */
  notes?: NoteBlock[];
  /** Local path inside public/ (e.g. 'videos/lesson-01.mp4') or a full https:// URL. */
  video: string;
  /** Optional cover for the lesson card (16:9): local path inside public/ or a full URL. */
  thumbnail?: string;
  /** Optional cover shown in the player before it plays. Falls back to the thumbnail. */
  poster?: string;
  /** 'portrait' for vertical phone videos. Default 'landscape' (16:9). */
  shape?: 'portrait' | 'landscape';
  /** Optional, e.g. '9 min'. */
  duration?: string;
  /** Gentle questions shown above the journal. Leave the list empty for none. */
  prompts: string[];
}

export const lessons: Lesson[] = [
  {
    number: 1,
    title: 'Introduction to Free Flow: Light Language',
    description: "Invite sound to leave your body. There's no need to control it.",
    notes: [
      { quote: 'JHSBBFyourSH KJSBHreallyJSKFBI DGcoolSG' },
      { heading: 'The power of light language' },
      "Invite sound to leave your body. There's no need to control it. Simply let noise find its way out of your body, and observe what it's like to let noise come from different parts of you.",
      'Be curious about what your voice can do when it is just making sounds rather than words.',
      'Invite emotion into the equation and see what happens.',
      'Combine this with the lessons that follow, and watch the magic unfurl.',
    ],
    video: 'videos/lesson-01.mp4',
    thumbnail: 'thumbnails/lesson-01.jpg',
    poster: 'posters/lesson-01.jpg',
    shape: 'portrait',
    duration: '3 min',
    prompts: [
      'Which parts of your body did sound want to come from?',
      "What did your voice do when it didn't have to make words?",
      'Which emotion showed up, and what did it sound like?',
      'How did it feel to stop controlling the noise?',
    ],
  },
  {
    number: 2,
    title: 'Adding the Words',
    description: 'Play and have fun. Experiment with different voices, accents and characters.',
    notes: [
      'PLAY and have FUN.',
      'Experiment with different voices, accents, characters and more.',
      'Let your face speak. Let it express itself as the embodiment of the voice.',
      'Invite your body into this dance of expression. Like we did with light language, see what happens when you give different parts of your body permission to be loud… to be seen… to be alive as a human being.',
      "When it's all said and done, remember the first line: PLAY and have FUN! This is your invitation to be silly. You may find a version of yourself you didn't know was there.",
      { quote: 'Wear the costume right around your voice box, and let that voice box wear your whole body as its outfit.' },
    ],
    video: 'videos/lesson-02.mp4',
    thumbnail: 'thumbnails/lesson-02.jpg',
    poster: 'posters/lesson-02.jpg',
    shape: 'portrait',
    duration: '3 min',
    prompts: [
      'Which voice, accent or character surprised you?',
      'What did your face and body want to do as you spoke?',
      'Where did you let yourself be silly?',
      "Did you meet a version of yourself you didn't know was there?",
    ],
  },
  {
    number: 3,
    title: 'Stringing Words Together',
    description: "Let your words do what words do. We're not aiming for perfection; we're aiming for continuation.",
    notes: [
      { quote: 'Let your words do what words do.' },
      "It's not about the rhyme all the time. Sometimes it's more about the message; other times it is about the rhyme. The trick is to let your words flow like conversation.",
      'Commit to speaking with only one rule: keep speaking. Within that, give yourself the space, patience and time you need between words and sentences, so the words themselves can breathe.',
      "Then, when you reach the edge where you feel you need to stop because you don't know what to say, that's when you push off and let whatever comes out come out.",
      "We're not looking for perfection. We're aiming for continuation. Allow yourself to matter. Allow yourself to stutter.",
      { heading: 'Section 2' },
      'Apply the same idea to singing, rapping or expressing yourself with a sense of rhythm. Let it unravel in its mumbo jumbo. Smile at the gold and let go of the stumbles.',
      'Slow down when you need to. Speed up when you want to. Breathe. Then keep going.',
      { quote: 'A young child learns to walk only because they keep going.' },
    ],
    video: 'videos/lesson-03.mp4',
    thumbnail: 'thumbnails/lesson-03.jpg',
    poster: 'posters/lesson-03.jpg',
    shape: 'portrait',
    duration: '3 min',
    prompts: [
      'What happened at the edge, when you felt you had nothing left to say?',
      'Which words or lines felt like gold?',
      'Did the message or the rhyme lead you today?',
      'How did it feel to let the stumbles go and keep going?',
    ],
  },
  {
    number: 4,
    title: 'Putting the Juice Together',
    description: 'Bring your body to life, and watch your voice come alive.',
    notes: [
      { quote: "Freestyle is 'free flow'." },
      "Are you a dancer? A foot tapper? A head nodder? Whatever you are, let your body and your mind express themselves however they feel called to. Don't suppress or oppress yourself.",
      'The whole idea is to get yourself into a trance-like state, where the mind begins to quiet and your voice becomes the one that meditates.',
      { quote: 'Bring your body to life, and watch your voice come alive. After all, the expression of the physical is an extension of the expression of the verbal… and vice versa.' },
    ],
    video: 'videos/lesson-04.mp4',
    thumbnail: 'thumbnails/lesson-04.jpg',
    poster: 'posters/lesson-04.jpg',
    shape: 'portrait',
    duration: '3 min',
    prompts: [
      'Are you a dancer, a foot tapper, a head nodder? How did your body want to move?',
      'Were there moments when your mind went quiet?',
      'How did moving change your voice, and how did your voice change your moving?',
      'Where did you notice yourself holding back?',
    ],
  },
  {
    number: 5,
    title: 'Trusting Your Instincts',
    description: 'Let the emotions drive and the body be the vehicle.',
    notes: [
      'Let the words flow out.',
      'Embrace the breath… the slowness… the stillness… the moments of silence.',
      'Let the emotions drive and the body be the vehicle as you move and become expressive. Let your characters and different voices ignite the fires that lie within you.',
      'And remember… if words feel too hard, sounds are good enough.',
      'These are your moments to discover who you are when you give yourself permission to express yourself unfiltered, with no pressure or restrictions. Just one rule: let it flow, and see what happens.',
      { quote: 'A river has calm days, and some days it roars. If something blocks its way, it keeps going until the obstacle falls.' },
    ],
    video: 'videos/lesson-05.mp4',
    thumbnail: 'thumbnails/lesson-05.jpg',
    poster: 'posters/lesson-05.jpg',
    shape: 'portrait',
    duration: '2 min',
    prompts: [
      'What did you find in the slowness, the stillness and the silences?',
      'Which emotion took the wheel, and where did it drive your body?',
      'When words felt hard, what did the sounds say?',
      'Was today a calm river or a roaring one?',
    ],
  },
  {
    number: 6,
    title: 'Putting It Together: Developing Your Flow',
    description: 'Mix it all together. Slip and fall, stumble and roar.',
    notes: [
      "Instruments are awesome companions when you feel comfortable playing (ideally ones you don't play with your mouth, so it's free for other things). They bring a whole different nature to the freedom of flow, because the body is occupied with its own trance tool.",
      'Background instrumental music of your choice is another companion to support your expression.',
      {
        steps: [
          'PLAY and have FUN.',
          'Break the ice with your wonderful sounds.',
          'Bring in your accents, characters and different personalities, and combine them.',
          'Gradually bring in words when you start to hear them forming from the sounds. Try the words out. You can always go back to sounds to keep the ice melting.',
          'Try different volumes, different paces, different styles. Get curious and playful with it.',
          'See if you can tap into the emotions that are present, and give them the keys to your voice and body.',
          "Take moments to slow down and listen to your expression. Try not to judge it. If you find the deep blue demon of self-judgement tearing you down, tell it you're done dimming your light and staying small. It's your time to rise and be a star in your sky.",
          'Mix it all together. Slip and fall, stumble and roar. As you do, bring those walls down with you; they cage you no more.',
        ],
      },
    ],
    video: 'videos/lesson-06.mp4',
    thumbnail: 'thumbnails/lesson-06.jpg',
    poster: 'posters/lesson-06.jpg',
    shape: 'portrait',
    duration: '4 min',
    prompts: [
      'Which companion helped your flow today: an instrument, music, or neither?',
      'When did words start forming out of the sounds?',
      'Which emotions did you hand the keys to?',
      'If self-judgement showed up, what did you tell it?',
    ],
  },
  {
    number: 7,
    title: 'Anchors of Freedom',
    description: 'Writing lyrics, poems and journals fills your freestyle cabinet with usable tools.',
    notes: [
      "Writing lyrics, poems or a journal is a great exercise for filling your freestyle cabinet with usable tools. If you practise these kinds of writing, you'll find your freestyles naturally bring out pieces of what you have written.",
      'Written lyrics offer great anchors to come back to. They bring their own emotional theme, which also helps your flow make sense.',
      'Repetition makes it easier to explore what your voice can do and wants to do. It also gives you a place to pick back up from if you feel lost.',
    ],
    video: 'videos/lesson-07.mp4',
    thumbnail: 'thumbnails/lesson-07.jpg',
    poster: 'posters/lesson-07.jpg',
    shape: 'portrait',
    duration: '4 min',
    prompts: [
      "What have you written before that you'd like to bring into your flow?",
      'Which line or phrase could be an anchor to come back to?',
      'What did repetition open up in your voice?',
      'What theme or feeling did your written words carry into the freestyle?',
    ],
  },
];
