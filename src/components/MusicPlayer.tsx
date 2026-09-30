'use client';

import { useRef, useState } from 'react';
import { SpotifyIcon } from '@/components/ui/SpotifyIcon';

// Local file, not a Spotify embed: an anonymous embed only serves a 30 second
// preview and cannot be started without a gesture inside its own iframe. The
// Spotify link is the credit and the place to hear the whole thing.
const SRC = '/music/vienna.mp3';
const TRACK_NAME = 'Billy Joel - Vienna';
const TRACK_URL = 'https://open.spotify.com/track/4U45aEWtQhrm8A5mxPaFZ7';

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <>
      {/* Fetch the track only when the visitor presses play. */}
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
