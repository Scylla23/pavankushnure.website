'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudRain, Mountain, Pause, Play, Trees, Waves } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAmbience } from '@/context/AmbienceContext';
import { SCENES } from '@/data/ambience';
import { SpotifyIcon } from '@/components/ui/SpotifyIcon';

const ICONS = [Trees, Waves, Mountain, CloudRain];

// Swap for your own: open.spotify.com -> Share -> Copy link -> take the id.
// `playlist` also accepts `track` / `album` / `artist`.
const SPOTIFY = 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?theme=0';

const KEY = 'music';
const SCENE_KEY = 'music-scene';
const BARS = 24;

const fmt = (s: number) =>
  Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';

const BackgroundMusic = () => {
  const { isDarkMode } = useTheme();
  const { scene, index, setIndex } = useAmbience();

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const binsRef = useRef<Uint8Array | null>(null);
  const frameRef = useRef<number>();

  const [playing, setPlaying] = useState(false);
  const [spotify, setSpotify] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Only ever called from a click. An AudioContext built without a gesture
  // starts suspended, and once the element is routed through it the audio would
  // stay silent, so resume on every entry. Same-origin file, no CORS taint.
  const connectAnalyser = useCallback(() => {
    if (!audioRef.current) return;
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      ctx.createMediaElementSource(audioRef.current).connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      binsRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const bins = binsRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { width: w, height: h } = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = isDarkMode ? '#a1a1aa' : '#52525b';

    if (analyser && bins) analyser.getByteFrequencyData(bins as Uint8Array<ArrayBuffer>);

    const gap = 2;
    const bw = (w - gap * (BARS - 1)) / BARS;
    // The panel animates open from zero width, so the first frames are narrower
    // than the gaps alone. A negative radius throws and would kill the rAF loop.
    if (bw <= 0) return;

    for (let i = 0; i < BARS; i++) {
      // Low bins carry most of the musical energy; skip the dead top third.
      const level = bins ? bins[Math.floor((i / BARS) * bins.length * 0.7)] / 255 : 0;
      const bh = Math.max(2, level * h);
      ctx.beginPath();
      ctx.roundRect(i * (bw + gap), (h - bh) / 2, bw, bh, Math.min(bw, bh) / 2);
      ctx.fill();
    }
  }, [isDarkMode]);

  // Animate only while playing; a paused player leaves one static frame behind.
  useEffect(() => {
    if (!playing || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw();
      return;
    }
    const loop = () => {
      draw();
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current!);
  }, [playing, draw]);

  // `playing` is the intent; this is the only place that starts the element.
  // Switching scene swaps src on the same element — the analyser graph survives
  // that, but the browser pauses on load, so the same effect restarts it.
  // A rejection means a missing file or a blocked autoplay: drop the intent.
  useEffect(() => {
    if (!playing) return;
    audioRef.current?.play().catch(() => setPlaying(false));
  }, [scene.audio, playing]);

  // Resume for a returning visitor. Autoplay with sound is blocked until a
  // gesture, so fall back to the first pointer event on the page.
  useEffect(() => {
    const saved = Number(localStorage.getItem(SCENE_KEY));
    if (Number.isInteger(saved) && saved >= 0 && saved < SCENES.length) setIndex(saved);

    if (localStorage.getItem(KEY) !== 'on') return;
    setPlaying(true);
    const retry = () => {
      connectAnalyser();
      setPlaying(true);
    };
    document.addEventListener('pointerdown', retry, { once: true });
    return () => document.removeEventListener('pointerdown', retry);
  }, [connectAnalyser, setIndex]);

  const start = () => {
    connectAnalyser();
    setPlaying(true);
    setSpotify(false);
    localStorage.setItem(KEY, 'on');
  };

  const toggle = () => {
    if (!playing) return start();
    audioRef.current?.pause();
    setPlaying(false);
    localStorage.setItem(KEY, 'off');
  };

  // Doubles as the banner switch: picking a scene while paused still restyles
  // the page, so it starts the sound rather than silently changing the source.
  const pick = (i: number) => {
    setIndex(i);
    localStorage.setItem(SCENE_KEY, String(i));
    start();
  };

  // Nothing outside the iframe can observe Spotify's playback state, so the two
  // sources are made exclusive at the point of intent rather than by listening.
  const toggleSpotify = () => {
    if (!spotify && playing) {
      audioRef.current?.pause();
      setPlaying(false);
      localStorage.setItem(KEY, 'off');
    }
    setSpotify(!spotify);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - left) / width) * duration;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={scene.audio}
        loop
        preload="metadata"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {spotify && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-zinc-200 bg-white/80 p-1 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80"
            >
              {/* Mounted only while open — no Spotify request or cookie otherwise. */}
              <iframe
                src={SPOTIFY}
                title="Spotify player"
                height={152}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="w-full rounded-md border-0"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
          className="flex items-center gap-2 overflow-hidden rounded-full border border-zinc-200 bg-white/80 p-2 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80"
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause background music' : 'Play background music'}
            aria-pressed={playing}
            className="!min-h-0 !min-w-0 shrink-0 rounded-full p-2 text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Outside the collapsible block: picking a scene has to stay reachable
              while paused, since it also swaps the banner photo. */}
          <div className="flex shrink-0 items-center gap-0.5">
            {SCENES.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pick(i)}
                  aria-label={`${s.label} ambience`}
                  aria-pressed={i === index}
                  className={`!min-h-0 !min-w-0 rounded-full p-1 transition-colors ${
                    i === index
                      ? 'text-black dark:text-white'
                      : 'text-zinc-400 hover:text-black dark:text-zinc-600 dark:hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                </button>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {playing && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 168 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-xs text-black dark:text-white">{scene.label}</span>
                  <span className="shrink-0 text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500">
                    {fmt(time)}
                  </span>
                </div>

                <canvas ref={canvasRef} className="mt-1 h-5 w-full" aria-hidden />

                <div
                  onClick={seek}
                  role="presentation"
                  className="mt-1 h-[3px] cursor-pointer rounded-full bg-zinc-200 dark:bg-zinc-800"
                >
                  <div
                    className="h-full rounded-full bg-zinc-500 dark:bg-zinc-400"
                    style={{ width: `${duration ? (time / duration) * 100 : 0}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={toggleSpotify}
            aria-label="Toggle Spotify player"
            aria-expanded={spotify}
            className={`!min-h-0 !min-w-0 shrink-0 rounded-full p-2 transition-colors ${
              spotify
                ? 'text-black dark:text-white'
                : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <SpotifyIcon className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default BackgroundMusic;
