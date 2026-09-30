'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Moon, Sun } from 'lucide-react';
import Footer from '@/components/Footer';
import InquiryForm from '@/components/InquiryForm';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { films, offer, type Film } from '@/data/films';

const LABEL_CLASS = 'text-[10px] sm:text-xs font-mono uppercase tracking-widest text-black dark:text-white';
const INLINE_LINK_CLASS = '!min-h-0 !min-w-0 rounded-sm underline underline-offset-4 transition-colors hover:text-black dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400';

function FilmVideo({ film }: { film: Film }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePlayback = () => {
      if (reducedMotion.matches) {
        video.pause();
      } else {
        video.muted = true;
        // Browser autoplay restrictions can still require using the native controls.
        void video.play().catch(() => {});
      }
    };
    updatePlayback();
    reducedMotion.addEventListener('change', updatePlayback);
    return () => {
      reducedMotion.removeEventListener('change', updatePlayback);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={film.video}
      poster={film.poster}
      width={film.width}
      height={film.height}
      controls
      playsInline
      muted
      loop
      preload="metadata"
      aria-label={`${film.title} launch film, ${film.seconds} seconds`}
      className="aspect-video h-auto w-full rounded-lg border border-zinc-100 bg-zinc-100 dark:border-[#222] dark:bg-[#111]"
    />
  );
}

export default function FilmsPageClient() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 transition-colors duration-200 dark:bg-black dark:text-zinc-100">
      <main className="mx-auto max-w-2xl px-4 pb-20 pt-8">
        <div className="mb-12 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" asChild>
            <Link href="/" aria-label="Back to home"><Home className="size-4" /></Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-10 w-10 rounded-full"
            aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>

        <header className="mb-8 space-y-2">
          <h1 className="font-serif text-3xl italic text-black dark:text-white sm:text-4xl">Launch films</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">20-second launch films for software products, made in code.</p>
        </header>

        <div className="mb-10 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-[#a1a1a1]">
          <p>I&apos;m a software engineer, not a motion designer, so I build launch films the way I build software. Every frame is a web page drawn from code: no After Effects, no video editor.</p>
          <p>Claude Opus writes the script and the animation, and Codex designs the mascot and reviews every draft. The voice drives the picture: each word rises on screen as it&apos;s spoken, and every transition lands on the beat.</p>
        </div>

        <div className="space-y-8">
          {films.map((film) => (
            <article key={film.slug} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm dark:border-[#222] dark:bg-[#0a0a0a] sm:p-6" aria-labelledby={`film-${film.slug}`}>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h2 id={`film-${film.slug}`} className="font-serif text-lg text-zinc-900 dark:text-zinc-100 sm:text-xl">{film.title}</h2>
                <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-zinc-600 dark:border-[#333] dark:bg-[#1a1a1a] dark:text-zinc-400">{film.label}</span>
              </div>
              <FilmVideo film={film} />
              <p className="mb-3 mt-5 text-sm leading-relaxed text-zinc-600 dark:text-[#a1a1a1]">{film.caption}</p>
              <a href={film.link} target="_blank" rel="noopener noreferrer" className={`${INLINE_LINK_CLASS} text-sm text-zinc-600 dark:text-zinc-400`}>{new URL(film.link).hostname.replace(/^www\./, '')}</a>
              <details className="mt-5 border-t border-zinc-100 pt-4 dark:border-[#222]">
                <summary className="cursor-pointer rounded-sm py-1 text-xs text-zinc-600 dark:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400">Transcript</summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-[#a1a1a1]">{film.transcript}</p>
              </details>
            </article>
          ))}
        </div>

        <section className="mt-12" aria-labelledby="tested-heading">
          <h2 id="tested-heading" className={`${LABEL_CLASS} mb-4`}>Tested like code</h2>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-[#a1a1a1]">
            <p>Because it&apos;s code, every film gets tested like code before it ships.</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-zinc-400 dark:marker:text-zinc-600">
              <li>Every word is on screen within 0.1 s of being spoken.</li>
              <li>Every transition lands on the beat.</li>
              <li>Every claim traces back to a source.</li>
            </ul>
            <p>If a check fails, the film doesn&apos;t ship.</p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="process-heading">
          <h2 id="process-heading" className={`${LABEL_CLASS} mb-4`}>How it works</h2>
          <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-zinc-600 marker:font-mono marker:text-zinc-500 dark:text-[#a1a1a1] dark:marker:text-zinc-400">
            <li>You send your product and your launch date.</li>
            <li>I write a short script around the one thing your product does best, and you approve it.</li>
            <li>I build the film: your real UI recreated in code, a voiceover, music, sound design and your own mascot.</li>
            <li>You get a 1080p, 60 fps MP4, ready to post.</li>
          </ol>
        </section>

        <section className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-[#333] dark:bg-[#111] sm:p-6" aria-labelledby="offer-heading">
          <p className={`${LABEL_CLASS} mb-3`}>{offer.month}</p>
          <h2 id="offer-heading" className="font-serif text-xl text-black dark:text-white sm:text-2xl">{offer.slots} launch films at ${offer.price} each</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {offer.slotsLeft === 0
              ? "October is full. Tell me about your launch and I'll quote the next opening."
              : `${offer.slotsLeft} of ${offer.slots} slots left`}
          </p>
          <ul className="my-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 marker:text-zinc-400 dark:text-[#a1a1a1] dark:marker:text-zinc-600">
            <li>20 to 30 seconds, 1080p at 60 fps</li>
            <li>Voiceover, music and sound design</li>
            <li>Your real product, your brand, your own mascot</li>
            <li>Delivered about a day after you approve the script</li>
          </ul>
          <Button className="w-full rounded-full bg-zinc-900 px-6 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto" asChild>
            <a href="#inquiry">Tell me about your launch</a>
          </Button>
        </section>

        <section id="inquiry" className="mt-12 scroll-mt-8" aria-labelledby="inquiry-heading">
          <h2 id="inquiry-heading" className="font-serif text-2xl italic text-black dark:text-white">Tell me about your launch</h2>
          <p className="mb-6 mt-2 text-sm text-zinc-600 dark:text-zinc-400">I usually reply within a day.</p>
          <InquiryForm />
        </section>

        <div className="mt-24 border-t border-zinc-100 pt-8 dark:border-[#333]">
          <Link href="/" className={`${INLINE_LINK_CLASS} inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400`}>
            <ArrowLeft className="size-3.5" aria-hidden="true" /> Back to home
          </Link>
        </div>
        <Footer />
      </main>
    </div>
  );
}
