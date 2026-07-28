'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/** Display order. Three of the four are real page anchors, so the leading `#`
 *  is literal, not decoration — it mirrors the trailing `#` on section headings. */
const LINKS = [
  { id: 'home', href: '/', label: 'home' },
  { id: 'projects', href: '/#projects', label: 'projects' },
  { id: 'stack', href: '/#stack', label: 'skills' },
  { id: 'contact', href: '/#contact', label: 'contact' },
];

/** The same sections in DOCUMENT order, which is not the display order above.
 *  Ties (two sections in the band at once) resolve to the higher one. */
const SPY_ORDER = ['stack', 'projects', 'contact'];

const Navbar = () => {
  // Only the home page renders this bar; /projects and /projects/[slug] carry
  // their own back link. So the active item comes from scroll position alone.
  const [active, setActive] = useState('home');

  // Highlight whatever section is crossing the middle of the viewport. The old
  // pathname check could never match a `/#hash`, so `home` was permanently lit.
  useEffect(() => {
    const els = SPY_ORDER.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!els.length) return;

    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id);
          else inBand.delete(e.target.id);
        }
        const hit = SPY_ORDER.find((id) => inBand.has(id));
        // Nothing in the band means either the hero up top or a gap between
        // sections. Near the top that is home; anywhere else hold the last one.
        // ponytail: scrollY threshold, swap for a hero sentinel if it ever drifts.
        setActive((prev) => hit ?? (window.scrollY < 240 ? 'home' : prev));
      },
      // Shrink the root to a band across the viewport's middle third.
      { rootMargin: '-40% 0px -50% 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
            // globals.css forces a 48px tap target onto every <a> under 640px,
            // which would triple the height of this bar.
            className={`!min-h-0 !min-w-0 group inline-flex items-baseline rounded-sm py-1 transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 ${
              isActive
                ? 'text-black dark:text-white'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {/* The accent lands here and on the rule only — never on the label,
                which stays ink so the text contrast is the same as the body. */}
            <span
              aria-hidden="true"
              className={`transition-opacity duration-300 motion-reduce:transition-none ${
                isActive
                  ? 'text-[hsl(var(--accent-ink))] opacity-100'
                  : 'opacity-50 group-hover:opacity-100'
              }`}
            >
              #
            </span>
            <span className="relative inline-block transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:translate-x-px">
              {label}
              {/* Active only. Hover already lifts the colour and the `#`, so
                  underlining on hover too made the two states identical. */}
              <span
                aria-hidden="true"
                className={`absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-[hsl(var(--accent-ink))] transition-transform duration-300 ease-out motion-reduce:transition-none ${
                  isActive ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
