'use client';

import { useEffect, useRef, useState } from 'react';
import { SpotifyIcon } from '@/components/ui/SpotifyIcon';

// Tycho — Awake. To change it: open.spotify.com -> Share -> Copy link -> take
// the id. `track` also accepts `album`, `playlist` or `artist`.
const TRACK_ID = '5lB3bZKPhng9s4hKB1sSIe';
const TRACK_NAME = 'Tycho — Awake';

const API = 'https://open.spotify.com/embed/iframe-api/v1';
const KEY = 'music';

type Playback = { isPaused: boolean; position: number; duration: number }

type Controller = {
  play: () => void
  togglePlay: () => void
  seek: (seconds: number) => void
  addListener: (event: string, cb: (e: { data: Playback }) => void) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: {
      createController: (
        el: HTMLElement,
        opts: { uri: string; width: number; height: number },
        cb: (controller: Controller) => void,
      ) => void
    }) => void
  }
}

const SpotifyPlayer = () => {
  const slotRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // The callback has to exist before the script runs, so load the script here
    // rather than through next/script — that way there is no ordering to lose.
    window.onSpotifyIframeApiReady = (api) => {
      if (controllerRef.current || !slotRef.current) return;

      // createController swaps this node for the iframe. React must not own it,
      // or the next render finds a child that is no longer the one it wrote.
      const host = document.createElement('div');
      slotRef.current.appendChild(host);

      api.createController(
        host,
        { uri: `spotify:track:${TRACK_ID}`, width: 300, height: 152 },
        (controller) => {
          controllerRef.current = controller;
          controller.addListener('playback_update', (e) => {
            const { isPaused, position, duration } = e.data;
            setPlaying(!isPaused);
            // At the end the embed goes silent but still reports isPaused
            // false, so the only signal is the position, and the end is 30s
            // for anyone not signed in to Spotify — that is all an anonymous
            // embed is given. Send it back to the start so the page keeps its
            // soundtrack instead of going quiet after one play.
            if (duration > 0 && position >= duration) {
              controller.seek(0);
              controller.play();
            }
          });
          // Default on. Only a visitor who pressed pause last time stays quiet.
          if (localStorage.getItem(KEY) !== 'off') controller.play();
        },
      );
    };

    const script = document.createElement('script');
    script.src = API;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Autoplay with sound is blocked until the visitor has interacted with the
  // page, so the play() above is a request, not a guarantee. Ask again on the
  // first pointer down. Nothing arms while it is already playing, and a
  // deliberate pause writes 'off' before this re-runs.
  useEffect(() => {
    if (playing || localStorage.getItem(KEY) === 'off') return;
    const retry = () => controllerRef.current?.play();
    document.addEventListener('pointerdown', retry, { once: true });
    return () => document.removeEventListener('pointerdown', retry);
  }, [playing]);

  const toggle = () => {
    localStorage.setItem(KEY, playing ? 'off' : 'on');
    controllerRef.current?.togglePlay();
  };

  return (
    <>
      {/* The embed only keeps playing while it stays mounted, and Chrome never
          even initialises a cross-origin iframe parked off-screen — measured:
          no ready event in 12s at left:-9999px. So it stays inside the viewport
          and is clipped to a pixel instead. */}
      <div ref={slotRef} className="pointer-events-none fixed bottom-4 right-4 h-px w-px overflow-hidden opacity-0" aria-hidden />

      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 py-1.5 pl-2 pr-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? `Pause ${TRACK_NAME}` : `Play ${TRACK_NAME}`}
          className={`!min-h-0 !min-w-0 rounded-full p-1 transition-colors ${
            playing ? 'text-[#1db954]' : 'text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white'
          }`}
        >
          <SpotifyIcon className="h-4 w-4" />
        </button>

        <a
          href={`https://open.spotify.com/track/${TRACK_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          {TRACK_NAME}
        </a>
      </div>
    </>
  );
};

export default SpotifyPlayer;
