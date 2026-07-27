import Link from 'next/link'
import { site, socials } from '@/data/profile'
import { socialIcons } from './Icons'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-dashed border-line">
      <div className="container-page flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-label uppercase text-cream no-underline hover:text-ember">
            {site.name}
          </Link>
          <a href={`mailto:${site.email}`} className="link-ember text-small">
            {site.email}
          </a>
        </div>

        <ul className="flex items-center gap-5">
          {socials.map(({ label, href }) => {
            const Icon = socialIcons[label]
            return (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="block text-muted transition-colors hover:text-ember"
                >
                  <Icon />
                </a>
              </li>
            )
          })}
        </ul>

        <p className="text-micro uppercase text-muted">Open to opportunities</p>
      </div>
    </footer>
  )
}
