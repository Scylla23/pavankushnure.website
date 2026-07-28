'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SpotifyIcon } from '@/components/ui/SpotifyIcon';

// Tycho — Awake. To change it: open.spotify.com -> Share -> Copy link -> take
// the id. `track` also accepts `album`, `playlist` or `artist`.
const TRACK = 'https://open.spotify.com/embed/track/5lB3bZKPhng9s4hKB1sSIe?theme=0';

const SpotifyPlayer = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-zinc-200 bg-white/80 p-1 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80"
          >
            {/* Mounted only while open — no Spotify request or cookie otherwise. */}
            <iframe
              src={TRACK}
              title="Spotify player"
              height={152}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="w-full rounded-md border-0"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Hide the music player' : 'Show the music player'}
        className={`!min-h-0 !min-w-0 rounded-full border border-zinc-200 bg-white/80 p-2.5 backdrop-blur-md transition-colors dark:border-zinc-800 dark:bg-black/80 ${
          open
            ? 'text-black dark:text-white'
            : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
        }`}
      >
        <SpotifyIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SpotifyPlayer;
