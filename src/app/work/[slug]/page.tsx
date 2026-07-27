import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { detailedProjects, getProject } from '@/data/projects'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return detailedProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}

  return {
    title: `${project.name} — ${project.tagline}`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.name, description: project.description },
  }
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project?.detail) notFound()

  const { name, tagline, context, tech, links, detail } = project

  return (
    <article>
      <section className="container-page flex flex-col gap-6 py-24">
        <Link href="/work" className="text-label uppercase text-muted no-underline hover:text-ember">
          <span aria-hidden>←</span> All work
        </Link>

        <p className="eyebrow">{context}</p>
        <h1 className="text-display">{name}</h1>
        <p className="max-w-measure text-lede text-muted">{tagline}</p>

        <ul className="flex flex-wrap gap-2 pt-2">
          {tech.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>

        {(links.live || links.repo) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {links.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary"
              >
                Visit live <span aria-hidden>↗</span>
              </a>
            )}
            {links.repo && (
              <a
                href={links.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-ghost"
              >
                Source <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        )}
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <p className="max-w-measure text-lede">{detail.intro}</p>

        <div className="flex flex-col">
          {detail.sections.map((section) => (
            <div
              key={section.heading}
              className="flex flex-col gap-3 border-t border-dashed border-line py-8 first:mt-12"
            >
              <h2 className="text-subheading">{section.heading}</h2>
              <p className="max-w-measure">{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule" />

      <section className="container-page flex flex-wrap items-center justify-between gap-6 py-16">
        <p className="text-subheading">Want the rest of it?</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/work" className="btn btn-ghost">
            See all work
          </Link>
          <Link href="/contact" className="btn btn-primary">
            Get in touch <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </article>
  )
}
