'use client';

import { useState } from 'react';
import { Mail, Github, Linkedin, Check, Copy, FileText } from 'lucide-react';
import { XIcon } from '@/components/ui/XIcon';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { Button } from "@/components/ui/button";
import Link from 'next/link';


export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "pavankushnure2000@gmail.com";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Same rest/hover treatment as the header row — see Header.tsx.
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/pavankushnure',
      icon: <Linkedin className="w-5 h-5" />,
      hover: 'hover:text-[#0a66c2] dark:hover:text-[#70b5f9]',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Scylla23',
      icon: <Github className="w-5 h-5" />,
      hover: 'hover:text-[#181717] dark:hover:text-white',
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/pavankushnure',
      icon: <XIcon className="w-5 h-5" />,
      hover: 'hover:text-black dark:hover:text-white',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/pavankushnure',
      icon: (
        <InstagramIcon className="w-5 h-5 group-hover:[stroke:url(#ig-gradient)]" />
      ),
      hover: 'hover:text-[#dc2743] dark:hover:text-[#dc2743]',
    },
  ];

  // The #contact id lives on the wrapper in page.tsx, which owns scroll-mt.
  return (
    <section className="mb-12 mt-8">
      <h2 id="contact-heading" className="text-3xl font-serif italic text-black dark:text-white mb-6">
        Get in Touch
      </h2>

      <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg leading-relaxed text-base sm:text-lg">
        I work remotely from India for US teams and usually reply within a day.
        Reach out about roles, contract work, or anything you are building with LLMs.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-8">
        <Button
          className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6"
          asChild
        >
          <a href={`mailto:${email}`}>
            <Mail className="w-4 h-4 mr-2" />
            Say Hello
          </a>
        </Button>

        <Button
          variant="outline"
          className="rounded-full px-6 gap-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={onCopy}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Email</span>
            </>
          )}
        </Button>

        <Button
          asChild
          variant="ghost"
          className="rounded-full px-6 text-zinc-600 dark:text-zinc-400 hover:text-[#fb923c] dark:hover:text-[#fb923c]"
        >
          <a
            href="/pavan-kushnure-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText className="w-4 h-4 mr-2" />
            Resume
          </a>
        </Button>
      </div>

      <div className="flex gap-4">
        {socialLinks.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            target="_blank"
            className={`group p-2 rounded-full transition-colors text-zinc-600 dark:text-zinc-400 ${link.hover}`}
            aria-label={link.name}
          >
            {link.icon}
          </Link>
        ))}
      </div>
    </section>
  );
}
