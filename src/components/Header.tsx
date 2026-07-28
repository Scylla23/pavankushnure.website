'use client';


import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, Github, Linkedin, FileText } from 'lucide-react';
import { XIcon } from '@/components/ui/XIcon';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Banner from '@/components/Banner';
import RotatingText from '@/components/RotatingText';

const ROLES = [
  'Lead AI Engineer @ Bravent LLC',
  'on the daily grind',
  'building in public',
  'LLM gateways, guardrails, agents',
];

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Monochrome at rest, brand colour on hover. LinkedIn keeps its lighter
  // dark-mode blue (#70b5f9) because #0a66c2 disappears against black.
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/Scylla23",
      icon: <Github className="w-full h-full" />,
      hover: "hover:text-[#181717] dark:hover:text-white",
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/pavankushnure",
      icon: <XIcon className="w-full h-full" />,
      hover: "hover:text-black dark:hover:text-white",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/pavankushnure",
      icon: <Linkedin className="w-full h-full" />,
      hover: "hover:text-[#0a66c2] dark:hover:text-[#70b5f9]",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/pavankushnure",
      // Stroke goes to the brand gradient on hover; the text colour still
      // drives the glow, which currentColor cannot read off a paint server.
      icon: (
        <InstagramIcon className="w-full h-full group-hover:[stroke:url(#ig-gradient)]" />
      ),
      hover: "hover:text-[#dc2743]",
    }
  ];

  const actionButtons = (
    <>
      {socialLinks.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="icon"
          asChild
          className={`group rounded-full text-zinc-600 dark:text-zinc-400 hover:drop-shadow-[0_0_6px_currentColor] ${link.hover}`}
        >
          <Link
            href={link.url}
            target="_blank"
            aria-label={link.name}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {link.icon}
            </div>
          </Link>
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="rounded-full text-zinc-600 dark:text-zinc-400 hover:text-[#ef4444] hover:drop-shadow-[0_0_6px_currentColor]"
      >
        {/* Plain <a>: next/link would prefetch the PDF as an RSC route and 404. */}
        <a
          href="/pavan-kushnure-resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Resume"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <FileText className="w-full h-full" />
          </div>
        </a>
      </Button>
      <Button
        onClick={toggleDarkMode}
        variant="ghost"
        size="icon"
        className="rounded-full text-zinc-600 dark:text-zinc-400 hover:text-[#fbbf24] hover:drop-shadow-[0_0_6px_currentColor]"
        aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </div>
      </Button>
    </>
  );

  return (
    <motion.header
      className="mb-14 mt-0 sm:mt-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Banner />

      {/* Profile and Info */}
      <div className="relative z-10 px-4 sm:px-6">
        <div className="flex justify-between items-end">
          {/* Profile Picture */}
          {/* One portrait per theme: outdoors on the light background, studio on
              the dark. Both stay mounted and swap on opacity, so the toggle
              crossfades instead of popping a half-loaded image in. */}
          <div
            role="img"
            aria-label="Pavan Kushnure — Lead AI Engineer based in Maharashtra, India"
            className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-background bg-zinc-100 dark:bg-zinc-800 overflow-hidden transform translate-y-2"
          >
            <Image
              src="/avatar-light.jpg"
              alt=""
              fill
              className="object-cover transition-opacity duration-300 dark:opacity-0"
              sizes="(max-width: 640px) 96px, 128px"
              priority
            />
            <Image
              src="/avatar.jpg"
              alt=""
              fill
              className="object-cover opacity-0 transition-opacity duration-300 dark:opacity-100"
              sizes="(max-width: 640px) 96px, 128px"
              priority
            />
          </div>

          {/* Social Links - Desktop Only */}
          <div className="hidden sm:flex items-center gap-1 mb-2">
            {actionButtons}
          </div>
        </div>

        <div className="mt-3">
          {/* One line at every width: the name shrinks, the location truncates. */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <h1 className="shrink-0 text-lg sm:text-4xl font-bold italic text-black dark:text-white font-[family-name:var(--font-instrument-serif)] tracking-wide whitespace-nowrap">
              Pavan Kushnure
            </h1>

            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="shrink-0 text-blue-500 w-4 h-4 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"></path>
            </svg>

            <div className="truncate text-[10px] sm:text-base font-[family-name:var(--font-instrument-serif)] tracking-normal sm:tracking-wide dark:text-zinc-400 text-zinc-600 font-light">
              | Wardha, India 🇮🇳
            </div>
          </div>

          <div className="mt-2">
            <div className="overflow-hidden text-zinc-600 dark:text-zinc-400 font-[family-name:var(--font-instrument-serif)] tracking-wider text-sm h-6 leading-6">
              <RotatingText items={ROLES} />
            </div>
          </div>
        </div>

        {/* Social Links - Mobile Only */}
        <div className="flex flex-wrap sm:hidden items-center gap-1 mt-2">
          {actionButtons}
        </div>
      </div>


      {/* Bio */}
      <div className="mt-2 px-1 sm:px-0">
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-base sm:text-lg">
          Full-stack engineer with 3+ years building SaaS products that real teams depend on daily. React micro-frontends, Node.js and FastAPI services, MongoDB and PostgreSQL, GCP and OCI. Lately that means LLM gateways, runtime guardrails, and agentic workflow platforms — owned from architecture decision to production deploy, across time zones.
        </p>
      </div>
    </motion.header>
  );
}
