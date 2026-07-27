import Link from 'next/link'
import type { Project } from '@/data/projects'

/** Depth is the canvas→surface step, never a shadow (DESIGN.md §1). */
export function ProjectCard({ project }: { project: Project }) {
  const { slug, name, tagline, description, tech, links, detail } = project

  return (
    <article className="flex h-full flex-col gap-4 rounded-card border border-line bg-surface p-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-subheading">{name}</h3>
        <p className="text-small text-muted">{tagline}</p>
      </div>

      <p className="text-small">{description}</p>

      <ul className="mt-auto flex flex-wrap gap-2 pt-2">
        {tech.map((t) => (
          <li key={t} className="tag">
            {t}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-small">
        {detail && (
          <Link href={`/work/${slug}`} className="link-ember font-medium">
            Read the write-up <span aria-hidden>→</span>
          </Link>
        )}
        {links.live && (
          <a href={links.live} target="_blank" rel="noreferrer noopener" className="link-ember">
            Visit live <span aria-hidden>↗</span>
          </a>
        )}
        {links.repo && (
          <a href={links.repo} target="_blank" rel="noreferrer noopener" className="link-ember">
            Source <span aria-hidden>↗</span>
          </a>
        )}
      </div>
    </article>
  )
}
