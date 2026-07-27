'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { site } from '@/data/profile'

const links = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled ? 'border-b border-line bg-canvas/90 backdrop-blur' : 'border-b border-transparent'
      }`}
    >
      {/* D16: three links fit at 375px, so no hamburger. */}
      <nav aria-label="Primary" className="container-page flex items-center justify-between py-4">
        <Link
          href="/"
          className="whitespace-nowrap text-micro uppercase text-cream no-underline transition-colors hover:text-ember sm:text-label"
        >
          {site.name}
        </Link>
        <ul className="flex items-center gap-4 sm:gap-6">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`whitespace-nowrap text-micro uppercase no-underline transition-colors hover:text-ember sm:text-label ${
                    active
                      ? 'text-ember underline decoration-dashed underline-offset-8'
                      : 'text-cream'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
