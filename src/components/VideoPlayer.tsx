import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { formatTime } from '../lib/media';

interface Props {
  src: string;
  poster?: string;
  /** Used for accessible labels, e.g. "Lesson 3: Finding Your Rhythm". */
  label: string;
  /** Fires once, when the learner reaches the last few percent or the end. */
  onWatched?: () => void;
}

const WATCHED_AT = 0.95;
const HIDE_AFTER_MS = 2600;

type FsVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * A quiet custom player around the native <video> element.
 * Never autoplays. Loads only metadata until the learner presses play.
 * Keys (when the player has focus): Space/K play, ←/→ 5s, ↑/↓ volume, M mute, F fullscreen.
 */
export function VideoPlayer({ src, poster, label, onWatched }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<FsVideo>(null);
  const watchedFired = useRef(false);
  const hideTimer = useRef<number | undefined>(undefined);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [missing, setMissing] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [idle, setIdle] = useState(false);

  // A new lesson: start fresh.
  useEffect(() => {
    watchedFired.current = false;
    setPlaying(false);
    setStarted(false);
    setCurrent(0);
    setDuration(0);
    setBuffered(0);
    setMissing(false);
    setWaiting(false);
  }, [src]);

  useEffect(() => {
    const onFs = () => setFullscreen(document.fullscreenElement === wrap.current);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const wake = useCallback(() => {
    setIdle(false);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setIdle(true), HIDE_AFTER_MS);
  }, []);

  const toggle = useCallback(() => {
    const v = video.current;
    if (!v || missing) return;
    if (v.paused) void v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [missing]);

  const seekBy = (delta: number) => {
    const v = video.current;
    if (!v || !duration) return;
    v.currentTime = Math.min(duration, Math.max(0, v.currentTime + delta));
  };

  const changeVolume = (next: number) => {
    const v = video.current;
    if (!v) return;
    const vol = Math.min(1, Math.max(0, next));
    v.volume = vol;
    v.muted = vol === 0;
  };

  const toggleMute = () => {
    const v = video.current;
    if (!v) return;
    if (v.muted && v.volume === 0) v.volume = 0.6;
    v.muted = !v.muted;
  };

  const toggleFullscreen = () => {
    const el = wrap.current;
    const v = video.current;
    if (!el || !v) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (el.requestFullscreen) void el.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.(); // iPhone
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== wrap.current) return; // buttons and sliders keep their own keys
    const keys: Record<string, () => void> = {
      ' ': toggle,
      k: toggle,
      ArrowLeft: () => seekBy(-5),
      ArrowRight: () => seekBy(5),
      ArrowUp: () => changeVolume((video.current?.volume ?? 1) + 0.1),
      ArrowDown: () => changeVolume((video.current?.volume ?? 1) - 0.1),
      m: toggleMute,
      f: toggleFullscreen,
    };
    const fn = keys[e.key.length === 1 ? e.key.toLowerCase() : e.key];
    if (fn) {
      e.preventDefault();
      fn();
      wake();
    }
  };

  const fireWatched = () => {
    if (watchedFired.current) return;
    watchedFired.current = true;
    onWatched?.();
  };

  const onTimeUpdate = () => {
    const v = video.current;
    if (!v) return;
    setCurrent(v.currentTime);
    if (v.duration && v.currentTime / v.duration >= WATCHED_AT) fireWatched();
  };

  const onProgress = () => {
    const v = video.current;
    if (!v || !v.duration || !v.buffered.length) return;
    setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
  };

  const played = duration ? current / duration : 0;
  const showControls = !playing || !idle;

  return (
    <div
      ref={wrap}
      className={`player${playing ? ' is-playing' : ''}${showControls ? ' show-controls' : ''}${fullscreen ? ' is-fullscreen' : ''}`}
      tabIndex={0}
      role="region"
      aria-label={`Video player: ${label}`}
      aria-keyshortcuts="Space K ArrowLeft ArrowRight ArrowUp ArrowDown M F"
      onKeyDown={onKeyDown}
      onMouseMove={wake}
      onMouseLeave={() => playing && setIdle(true)}
      onFocusCapture={wake}
    >
      <video
        key={src}
        ref={video}
        className="player__video"
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
          wake();
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          fireWatched();
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={onTimeUpdate}
        onProgress={onProgress}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onVolumeChange={(e) => {
          setVolume(e.currentTarget.volume);
          setMuted(e.currentTarget.muted);
        }}
        onError={() => setMissing(true)}
      >
        Your browser can't play this video.
      </video>

      {missing && (
        <div className="player__missing" role="status">
          <span className="player__missing-mark" aria-hidden="true">~</span>
          <p className="player__missing-title">This lesson's video is on its way.</p>
          {import.meta.env.DEV && (
            <p className="player__missing-hint">
              Expected at <code>{src}</code>. Add the file, or change the path in <code>src/data/lessons.ts</code>.
            </p>
          )}
        </div>
      )}

      {!missing && !started && (
        <button type="button" className="player__big-play" onClick={toggle} aria-label={`Play ${label}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
        </button>
      )}

      {!missing && waiting && playing && <div className="player__spinner" aria-hidden="true" />}

      {!missing && (
        <div className="player__controls">
          <button type="button" className="player__btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
            )}
          </button>

          <span className="player__time" aria-hidden="true">
            {formatTime(current)} <span className="player__time-sep">/</span> {formatTime(duration)}
          </span>

          <input
            type="range"
            className="player__seek"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            disabled={!duration}
            onChange={(e) => {
              const v = video.current;
              if (v) v.currentTime = Number(e.target.value);
            }}
            aria-label="Playback position"
            aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
            style={{ '--played': `${played * 100}%`, '--buffered': `${buffered * 100}%` } as CSSProperties}
          />

          <div className="player__volume">
            <button type="button" className="player__btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
                {muted || volume === 0 ? (
                  <path d="M16 9.5l5 5M21 9.5l-5 5" className="stroke" />
                ) : (
                  <>
                    <path d="M15.5 9a4 4 0 010 6" className="stroke" />
                    {volume > 0.5 && <path d="M18 6.5a7.5 7.5 0 010 11" className="stroke" />}
                  </>
                )}
              </svg>
            </button>
            <input
              type="range"
              className="player__volume-slider"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)}%`}
              style={{ '--played': `${(muted ? 0 : volume) * 100}%` } as CSSProperties}
            />
          </div>

          <button
            type="button"
            className="player__btn"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
          >
            {fullscreen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path className="stroke" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path className="stroke" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
