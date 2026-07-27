'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Scroll reveal as progressive enhancement (DESIGN.md D14).
 *
 * The `.reveal` class only hides anything once `html.js` is set, so no-JS
 * visitors and crawlers get the full page. Nothing here gates content.
 */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
