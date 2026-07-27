import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { AmbienceProvider } from '@/context/AmbienceContext'
import { BackgroundMusic } from '@/components'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://pavankushnure.website'),

  title: {
    default: 'Pavan Kushnure | Lead AI Engineer',
    template: '%s | Pavan Kushnure',
  },
  description:
    'Pavan Kushnure — Lead AI Engineer at Bravent LLC. LLM gateways, runtime guardrails, agentic workflow platforms, and full-stack SaaS with TypeScript, Python and Next.js. Remote from Maharashtra, India.',
  keywords: [
    'Pavan Kushnure',
    'Pavankumar Kushnure',
    'pavankushnure.website',
    'portfolio',
    'AI engineer',
    'LLM gateway',
    'LLM guardrails',
    'agentic workflows',
    'MCP',
    'RAG',
    'full-stack developer',
    'Next.js developer',
    'TypeScript developer',
    'Node.js developer',
    'India developer',
  ],
  authors: [{ name: 'Pavan Kushnure', url: 'https://pavankushnure.website' }],
  creator: 'Pavan Kushnure',

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://pavankushnure.website',
    siteName: 'Pavan Kushnure Portfolio',
    title: 'Pavan Kushnure | Lead AI Engineer',
    description:
      'LLM gateways, runtime guardrails, and agentic workflow platforms. Lead AI Engineer at Bravent LLC, remote from India.',
    images: [
      {
        url: '/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Pavan Kushnure — Lead AI Engineer',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Pavan Kushnure | Lead AI Engineer',
    description:
      'LLM gateways, runtime guardrails, and agentic workflow platforms. Lead AI Engineer at Bravent LLC.',
    creator: '@pavankushnure',
    images: ['/banner.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://pavankushnure.website',
  },

  icons: {
    icon: '/avatar.jpg',
    shortcut: '/avatar.jpg',
    apple: '/avatar.jpg',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Pavan Kushnure',
  url: 'https://pavankushnure.website',
  jobTitle: 'Lead AI Engineer',
  description:
    'Full-stack engineer with 3+ years building SaaS products — LLM gateways, runtime guardrails, agentic workflow platforms, and search at scale.',
  image: 'https://pavankushnure.website/avatar.jpg',
  email: 'pavankushnure2000@gmail.com',
  worksFor: {
    '@type': 'Organization',
    name: 'Bravent LLC',
  },
  sameAs: [
    'https://github.com/Scylla23',
    'https://linkedin.com/in/pavankushnure',
    'https://x.com/pavankushnure',
    'https://instagram.com/pavankushnure',
  ],
  knowsAbout: [
    'TypeScript',
    'Python',
    'React',
    'Next.js',
    'Node.js',
    'FastAPI',
    'LLM Guardrails',
    'Agentic Workflows',
    'MCP',
    'RAG',
    'MongoDB',
    'PostgreSQL',
    'GCP',
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Shri Guru Gobind Singhji Institute of Engineering and Technology, Nanded',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Wardha',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen transition-colors duration-200">
        <ThemeProvider>
          <AmbienceProvider>
            {children}
            <BackgroundMusic />
          </AmbienceProvider>
        </ThemeProvider>
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  )
}
