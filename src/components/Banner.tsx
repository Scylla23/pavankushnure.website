'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SLIDES, SLIDE_MS } from '@/data/banner';

const FADE = 1.2;

export default function Banner() {
  const [i, setI] = useState(0);
  // Also stops the rotation, not just the zoom: auto-advancing content is the
  // thing someone with vestibular trouble wants gone, and it doubles as the
  // pause control this banner has nowhere to put.
  const still = useReducedMotion();

  useEffect(() => {
    if (still) return;
    const id = setInterval(() => setI((n) => (n + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [still]);

  const slide = SLIDES[i];

  return (
    <div className="relative w-full h-[200px] sm:h-[270px] rounded-2xl overflow-hidden mb-[-40px] sm:mb-[-50px] z-0 bg-zinc-900">
      {/* The outgoing slide keeps rendering while it fades, so this is a real
          crossfade rather than a cut to the background. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.photo}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: still ? 1 : 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: FADE },
            // Runs past the hold so the zoom never visibly stops on screen.
            scale: { duration: SLIDE_MS / 1000 + FADE, ease: 'linear' },
          }}
        >
          <Image
            src={slide.photo}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority={i === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Darkest at the top, where the code sits, and again at the foot behind
          the avatar. Every slide has to carry white text. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/40" />

      <div className="absolute left-4 right-4 top-3 sm:left-6 sm:top-4">
        <AnimatePresence mode="wait">
          <motion.code
            key={slide.code}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.4 }}
            className="block truncate font-typewriter text-[10px] sm:text-xs tracking-tight text-white/80 drop-shadow"
          >
            <span className="text-amber-200/80">❯ </span>
            {slide.code}
          </motion.code>
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-base sm:text-xl italic font-serif text-center drop-shadow-md px-4">
          The biggest risk is not taking any risk.
        </p>
      </div>
    </div>
  );
}
