import localFont from 'next/font/local'

// Self-hosted so the site makes zero third-party requests on load (DESIGN.md D11).
export const inter = localFont({
  src: [
    { path: '../../public/fonts/inter-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/inter-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/inter-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
})
