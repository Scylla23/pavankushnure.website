'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { WORKER_URL } from '@/lib/worker';

const EMAIL = 'pavankushnure2000@gmail.com';
const INPUT_CLASS = 'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 dark:border-[#333] dark:bg-[#111] dark:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500';
const EMAIL_LINK_CLASS = '!min-h-0 !min-w-0 break-all underline underline-offset-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400';

export default function InquiryForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'limited'>('idle');
  const [submitted, setSubmitted] = useState<{ name: string; email: string } | null>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const data = new FormData(event.currentTarget);
    const inquiry = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      product: String(data.get('product') ?? ''),
      launchDate: String(data.get('launchDate') ?? ''),
      message: String(data.get('message') ?? ''),
      company: String(data.get('company') ?? ''),
    };
    setStatus('sending');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(`${WORKER_URL}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
        signal: controller.signal,
      });
      if (response.status === 429) {
        setStatus('limited');
        return;
      }
      if (!response.ok || (await response.json()).ok !== true) throw new Error('Inquiry failed');
      setSubmitted({ name: inquiry.name.trim().split(/\s+/)[0], email: inquiry.email.trim() });
    } catch {
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <div>
      <div aria-live="polite" aria-atomic="true">
        {submitted && (
          <p
            ref={successRef}
            tabIndex={-1}
            className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 text-sm leading-relaxed text-zinc-700 dark:border-[#333] dark:bg-[#111] dark:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Thanks, {submitted.name}. I&apos;ll reply to <span className="break-all">{submitted.email}</span>, usually within a day.
          </p>
        )}
      </div>

      {!submitted && (
        <form onSubmit={submit} className="relative space-y-5" aria-labelledby="inquiry-heading" aria-busy={status === 'sending'}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="inquiry-name" className="block text-sm text-zinc-900 dark:text-zinc-100">Your name</label>
              <input id="inquiry-name" name="name" required maxLength={100} autoComplete="name" readOnly={status === 'sending'} className={INPUT_CLASS} />
            </div>
            <div className="space-y-2">
              <label htmlFor="inquiry-email" className="block text-sm text-zinc-900 dark:text-zinc-100">Email</label>
              <input id="inquiry-email" name="email" type="email" required maxLength={254} autoComplete="email" readOnly={status === 'sending'} className={INPUT_CLASS} />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="inquiry-product" className="block text-sm text-zinc-900 dark:text-zinc-100">Product</label>
            <input id="inquiry-product" name="product" required maxLength={300} aria-describedby="inquiry-product-hint" readOnly={status === 'sending'} className={INPUT_CLASS} />
            <p id="inquiry-product-hint" className="text-xs text-zinc-600 dark:text-zinc-400">A link or a name</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="inquiry-launch-date" className="block text-sm text-zinc-900 dark:text-zinc-100">Launch date</label>
            <input id="inquiry-launch-date" name="launchDate" maxLength={60} aria-describedby="inquiry-launch-date-hint" readOnly={status === 'sending'} className={INPUT_CLASS} />
            <p id="inquiry-launch-date-hint" className="text-xs text-zinc-600 dark:text-zinc-400">Optional, e.g. Oct 14 on Product Hunt</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="inquiry-message" className="block text-sm text-zinc-900 dark:text-zinc-100">What should people get in 20 seconds?</label>
            <textarea id="inquiry-message" name="message" required minLength={10} maxLength={2000} rows={5} readOnly={status === 'sending'} className={`${INPUT_CLASS} resize-y`} />
          </div>
          <div aria-hidden="true" className="absolute -left-[10000px] top-0 h-px w-px overflow-hidden">
            <label htmlFor="inquiry-company">Company</label>
            <input id="inquiry-company" name="company" tabIndex={-1} autoComplete="off" readOnly={status === 'sending'} />
          </div>
          <div className="space-y-3">
            <Button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-full bg-zinc-900 px-6 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
            >
              {status === 'sending' ? 'Sending…' : 'Send inquiry'}
            </Button>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">I only use this to reply to you.</p>
            <div aria-live="polite" aria-atomic="true" className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {status === 'sending' && <p>Sending…</p>}
              {status === 'limited' && (
                <p>
                  Too many messages from your network. Try again in an hour, or email{' '}
                  <a href={`mailto:${EMAIL}`} className={EMAIL_LINK_CLASS}>{EMAIL}</a>.
                </p>
              )}
              {status === 'error' && (
                <p>
                  That didn&apos;t send. Email me at{' '}
                  <a href={`mailto:${EMAIL}`} className={EMAIL_LINK_CLASS}>{EMAIL}</a> instead.
                </p>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
