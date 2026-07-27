import { MetadataRoute } from 'next'

// `output: export` has no server to run route handlers on; this emits robots.txt at build.
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://pavankushnure.website/sitemap.xml',
    host: 'https://pavankushnure.website',
  }
}
