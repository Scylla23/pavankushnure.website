import type { Metadata } from 'next'
import { site, socials } from '@/data/profile'
import { socialIcons } from '@/components/Icons'

export const metadata: Metadata = {
  title: 'Contact — Hire a Remote AI Engineer',
  description:
    'Get in touch with Pavan Kushnure, a remote AI and full-stack engineer open to roles and freelance work with US startups. Email, LinkedIn, GitHub and X.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <section className="container-page flex flex-col gap-6 py-24">
        <p className="eyebrow">Contact</p>
        <h1 className="text-display">Let&apos;s talk.</h1>
        <p className="max-w-measure text-lede">
          I&apos;m open to opportunities — SaaS platforms, developer tools, and AI-powered
          workflows, whether that&apos;s a role or freelance.
        </p>
        <p className="max-w-measure">
          I work remotely from India on IST and have shipped across US time zones for the last two
          and a half years, so US hours are no problem.
        </p>

        <div className="pt-4">
          <a
            href={`mailto:${site.email}`}
            className="text-heading text-ember underline-offset-8 hover:underline"
          >
            {site.email}
          </a>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a href={site.resume} className="btn btn-ghost" download>
            Download resume
          </a>
        </div>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <div className="flex flex-col gap-8">
          <p className="eyebrow">Elsewhere</p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {socials.map(({ label, href, handle }) => {
              const Icon = socialIcons[label]
              return (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-4 rounded-card border border-line bg-surface p-6 no-underline transition-colors hover:border-ember"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-ember" />
                    <span className="flex flex-col">
                      <span className="text-label uppercase text-muted">{label}</span>
                      <span className="text-cream">{handle}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
