import * as React from "react"

/** Lucide's Instagram glyph, plus the brand gradient as a paint server.
 *
 *  The stroke stays `currentColor` so the icon reads monochrome at rest like
 *  the rest of the row; the caller swaps it to `url(#ig-gradient)` on hover.
 *
 *  ponytail: the gradient id is fixed, not `useId`, because the hover rule has
 *  to name it. Rendering this icon more than once duplicates the <defs> — every
 *  copy is identical and the browser resolves to the first, so it is harmless.
 */
export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="ig-gradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
