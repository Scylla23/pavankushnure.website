'use client';

import { useEffect, useRef, useState } from 'react';
import { SpotifyIcon } from '@/components/ui/SpotifyIcon';

// Local file, not a Spotify embed: an anonymous embed only serves a 30 second
// preview and cannot be started without a gesture inside its own iframe. The
// Spotify link is the credit and the place to hear the whole thing.
const SRC = '/music/vienna.mp3';
const TRACK_NAME = 'Billy Joel — Vienna';
const TRACK_URL = 'https://open.spotify.com/track/4U45aEWtQhrm8A5mxPaFZ7';

const KEY = 'music';

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    // Default on. Only a visitor who pressed pause last time stays quiet.
    if (!audio || localStorage.getItem(KEY) === 'off') return;

    const start = () => void audio.play().catch(() => {});
    start();

    // Autoplay with sound is blocked until the visitor has interacted with the
    // page, so that first call is a request, not a guarantee. Ask again on the
    // first pointer down — but not one on the player itself, since the button
    // is about to say what it wants and starting here would invert it.
    const retry = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) start();
      document.removeEventListener('pointerdown', retry);
    };
    document.addEventListener('pointerdown', retry);
    return () => document.removeEventListener('pointerdown', retry);
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      localStorage.setItem(KEY, 'on');
      void audio.play();
    } else {
      localStorage.setItem(KEY, 'off');
      audio.pause();
    }
  };

  return (
    <>
      {/* preload="none": 3MB is not worth spending on a visitor the browser is
          about to block anyway. play() fetches it when it is actually wanted. */}
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Below 640px this is the icon alone. globals.css gives every a and
          button a 48px tap target there, which the track name cannot honour
          without turning into a three-line block, and a phone has better uses
          for that corner anyway. */}
      <div
        ref={wrapRef}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 p-1 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 sm:py-1.5 sm:pl-2 sm:pr-3"
      >
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? `Pause ${TRACK_NAME}` : `Play ${TRACK_NAME}`}
          className={`!min-h-0 !min-w-0 flex h-11 w-11 items-center justify-center rounded-full transition-colors sm:h-auto sm:w-auto sm:p-1 ${
            playing ? 'text-[#1db954]' : 'text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white'
          }`}
        >
          <SpotifyIcon className="h-5 w-5 sm:h-4 sm:w-4" />
        </button>

        <a
          href={TRACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-xs text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white sm:inline"
        >
          {TRACK_NAME}
        </a>
      </div>
    </>
  );
};

export default MusicPlayer;
