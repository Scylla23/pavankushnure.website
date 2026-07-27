import Link from 'next/link'
import { Photo } from '@/components/Photo'
import { Reveal } from '@/components/Reveal'
import { ProjectCard } from '@/components/ProjectCard'
import { GithubHeatmap } from '@/components/GithubHeatmap'
import { hero, about, achievements, site } from '@/data/profile'
import { featuredProjects } from '@/data/projects'

export default function HomePage() {
  return (
    <>
      <section className="container-page grid items-center gap-12 py-24 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 className="text-display">{hero.headline}</h1>
          <p className="max-w-measure text-lede text-cream">{hero.intro}</p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-label uppercase text-muted">
            {hero.proof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/work" className="btn btn-primary">
              See the work <span aria-hidden>→</span>
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[380px] lg:max-w-none">
          <Photo
            name="hero"
            widths={[600, 900, 1200]}
            alt="Pavan Kushnure"
            sizes="(max-width: 1024px) 380px, 40vw"
            width={1728}
            height={2160}
            priority
            className="w-full rounded-card border border-line object-cover"
          />
        </div>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-6">
          <p className="eyebrow">What I do</p>
          <p className="max-w-measure text-lede">{about.lede}</p>
          <p className="max-w-measure">{about.body[2]}</p>
        </Reveal>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div className="flex flex-col gap-4">
              <p className="eyebrow">Selected work</p>
              <h2 className="text-heading">Four systems worth opening up.</h2>
            </div>
            <Link href="/work" className="link-ember text-small font-medium">
              All work <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Reveal>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-8">
          <p className="eyebrow">Along the way</p>
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {achievements.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="text-heading text-ember">{value}</dt>
                <dd className="text-micro uppercase text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-8">
          <p className="eyebrow">Commits</p>
          <GithubHeatmap />
        </Reveal>
      </section>

      <hr className="rule" />

      <section className="container-page py-16">
        <Reveal className="flex flex-wrap items-center justify-between gap-6">
          <p className="text-subheading">Open to opportunities.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
              Get in touch <span aria-hidden>→</span>
            </Link>
            <a href={site.resume} className="btn btn-ghost" download>
              Download resume
            </a>
          </div>
        </Reveal>
      </section>
    </>
  )
}
