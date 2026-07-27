import type { Metadata } from 'next'
import { inter } from '@/lib/fonts'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { site, socials, experience } from '@/data/profile'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Pavan Kushnure — AI Engineer for Remote US Startups',
    template: '%s | Pavan Kushnure',
  },
  description:
    'AI engineer building AI-powered SaaS — 3+ years, from LLM gateways and runtime guardrails to RAG and vector search. Working remotely with US startups.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: site.url,
    title: 'Pavan Kushnure — AI Engineer for Remote US Startups',
    description:
      'AI engineer building AI-powered SaaS — 3+ years, from LLM gateways and runtime guardrails to RAG and vector search.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Pavan Kushnure — Lead AI Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@pavankushnure',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: site.role,
  worksFor: { '@type': 'Organization', name: site.company },
  address: { '@type': 'PostalAddress', addressLocality: 'Nagpur', addressCountry: 'IN' },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Shri Guru Gobind Singhji Institute of Engineering and Technology, Nanded',
  },
  knowsAbout: ['AI engineering', 'RAG', 'Vector search', 'LLM guardrails', 'Model Context Protocol', 'React', 'Node.js', 'Python'],
  sameAs: socials.map((s) => s.href),
  hasOccupation: experience.map((job) => ({
    '@type': 'Role',
    roleName: job.role,
    startDate: job.start,
  })),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Sets html.js before paint so the reveal CSS can hide things.
            Without JS the class never lands and all content stays visible (D14). */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js')` }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-ember focus:px-4 focus:py-2 focus:text-small focus:text-white"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="relative z-10 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
