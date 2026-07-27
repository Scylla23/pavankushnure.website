import type { MetadataRoute } from 'next'
import { site } from '@/data/profile'
import { detailedProjects } from '@/data/projects'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/work', '/about', '/contact']
  const details = detailedProjects.map((p) => `/work/${p.slug}`)

  return [...pages, ...details].map((path) => ({
    url: `${site.url}${path}/`.replace(/\/+$/, '/'),
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))
}
