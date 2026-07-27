import type { Metadata } from 'next'
import { Reveal } from '@/components/Reveal'
import { ProjectCard } from '@/components/ProjectCard'
import { braventProjects, openSourceProjects } from '@/data/projects'
import { caseStudies } from '@/data/profile'

export const metadata: Metadata = {
  title: 'Work — Live AI Products, Vector Search & Federal AI Tools',
  description:
    'Live AI products and the engineering behind them — LLM governance runtimes, hybrid RAG retrieval, document extraction with per-field confidence, feature flags, vector search over 250K+ assets, and CAD API integrations.',
  alternates: { canonical: '/work' },
}

export default function WorkPage() {
  return (
    <>
      <section className="container-page flex flex-col gap-6 py-24">
        <p className="eyebrow">Work</p>
        <h1 className="text-display">Live AI products, and the systems behind them.</h1>
        <p className="max-w-measure text-lede text-muted">
          Ten shipped products across two companies and my own repos. The four with a write-up are
          the ones where the engineering decisions are worth reading.
        </p>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">At Bravent</p>
            <h2 className="text-heading">Governed AI for regulated environments.</h2>
            <p className="max-w-measure text-muted">
              Bravent builds agentic AI for federal and regulated deployments, where every request
              has to be screened, logged and defensible.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {braventProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Reveal>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">Open source</p>
            <h2 className="text-heading">Things I build on my own time.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {openSourceProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Reveal>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">Case studies</p>
            <h2 className="text-heading">
              Work I shipped at{' '}
              <a
                href="https://naya.studio"
                target="_blank"
                rel="noreferrer noopener"
                className="link-ember"
              >
                Naya
              </a>
              .
            </h2>
            <p className="max-w-measure text-muted">
              A proprietary product, so there is no public link and no screenshots. The numbers
              carry it.
            </p>
          </div>

          <div className="flex flex-col">
            {caseStudies.map((study, i) => (
              <div
                key={study.title}
                className={`flex flex-col gap-4 py-8 ${i > 0 ? 'border-t border-dashed border-line' : ''}`}
              >
                <dl className="flex flex-wrap gap-x-12 gap-y-4">
                  {study.metrics.map((m) => (
                    <div key={m.unit} className="flex flex-col gap-1">
                      <dt className="text-heading text-ember">{m.value}</dt>
                      <dd className="text-micro uppercase text-muted">{m.unit}</dd>
                    </div>
                  ))}
                </dl>
                <h3 className="text-subheading">{study.title}</h3>
                <p className="max-w-measure">{study.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  )
}
