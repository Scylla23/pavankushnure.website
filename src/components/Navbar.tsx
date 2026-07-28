'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/** Display order, which now matches the order the sections appear down the page. */
const LINKS = [
  { id: 'home', href: '/', label: 'home' },
  { id: 'stack', href: '/#stack', label: 'skills' },
  { id: 'projects', href: '/#projects', label: 'projects' },
  { id: 'contact', href: '/#contact', label: 'contact' },
];

/** The scanned sections in DOCUMENT order, so the sightline scan and the
 *  bottom-of-page rule both read top to bottom. Keep this in page order even
 *  if LINKS is ever reshuffled again. */
const SPY_ORDER = ['stack', 'projects', 'contact'];

/** Where down the viewport a section has to reach to count as the one you are on. */
const SIGHTLINE = 0.45;

const Navbar = () => {
  // Only the home page renders this bar; /projects and /projects/[slug] carry
  // their own back link. So the active item comes from scroll position alone.
  const [active, setActive] = useState('home');

  // A click is a statement of intent, so it wins outright over the geometry
  // below until its smooth scroll comes to rest. Without this, clicking a
  // section that cannot reach the sightline — on a window tall enough to show
  // the whole tail of the page at once — immediately re-derives to a different
  // one, and the rule appears to jump to a link you did not press.
  const clickedRef = useRef(false);
  const settleRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const els = SPY_ORDER.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!els.length) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      const doc = document.documentElement;

      // The last section can never reach the sightline: at max scroll there is
      // not a viewport of content below it, so on a tall window it comes to rest
      // underneath the line and the spy used to hold whatever came before it.
      // Hitting the bottom of the page always means the last section.
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        setActive(SPY_ORDER[SPY_ORDER.length - 1]);
        return;
      }

      const line = window.innerHeight * SIGHTLINE;
      const hit = els.find((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        return top <= line && bottom > line;
      });

      // Nothing crosses the line: the hero up top, or a gap between two
      // sections. Near the top that is home; anywhere else hold what we passed.
      setActive((prev) => hit?.id ?? (window.scrollY < 240 ? 'home' : prev));
    };

    const onScroll = () => {
      // Hold off while a clicked jump is still travelling; release once the
      // scroll has been quiet briefly, which covers any distance or duration.
      if (clickedRef.current) {
        clearTimeout(settleRef.current);
        settleRef.current = setTimeout(() => {
          clickedRef.current = false;
        }, 150);
        return;
      }
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(settleRef.current);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="sticky top-0 z-50 flex items-center gap-4 sm:gap-6 py-3 tracking-wide text-[13px] sm:text-[15px] bg-background/80 backdrop-blur-md"
    >
      {LINKS.map(({ id, href, label }) => {
        const isActive = id === active;
        return (
          <Link
            key={id}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              clickedRef.current = true;
              setActive(id);
            }}
            // globals.css forces a 48px tap target onto every <a> under 640px,
            // which would triple the height of this bar.
            className={`!min-h-0 !min-w-0 group relative inline-block rounded-sm py-1 transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 ${
              isActive
                ? 'text-black dark:text-white'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {label}
            {/* The accent rides here alone now. The label stays ink, so its text
                contrast is the same as the body copy. */}
            <span
              aria-hidden="true"
              className={`absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-[hsl(var(--accent-ink))] transition-transform duration-300 ease-out motion-reduce:transition-none ${
                isActive ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
