import type { Metadata } from 'next'
import Link from 'next/link'
import { Photo } from '@/components/Photo'
import { Reveal } from '@/components/Reveal'
import { about, experience, skills, education, site } from '@/data/profile'

export const metadata: Metadata = {
  title: 'About — Full-Stack & AI Engineer (React, Node, Python, GCP)',
  description:
    'Pavan Kushnure is a full-stack and AI engineer with 3+ years building SaaS on React, Node.js, Python/FastAPI and GCP. Open to remote AI and SaaS work with US teams.',
  alternates: { canonical: '/about' },
}

const lifePhotos = [
  { name: 'life-surf', alt: 'Pavan with a surfboard on the beach at Mulki' },
  { name: 'life-trek', alt: 'Pavan on a monsoon trek in front of a waterfall' },
  { name: 'life-rest', alt: 'Pavan resting in a hammock' },
]

export default function AboutPage() {
  return (
    <>
      <section className="container-page flex flex-col gap-6 py-24">
        <p className="eyebrow">About</p>
        <h1 className="text-display">About Pavan Kushnure</h1>
        <p className="max-w-measure text-lede">{about.lede}</p>
        {about.body.map((para) => (
          <p key={para} className="max-w-measure">
            {para}
          </p>
        ))}
        <p className="text-label uppercase text-muted">
          {site.location} · {site.locationNote}
        </p>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-8">
          <p className="eyebrow">Away from the screen</p>
          <p className="max-w-measure text-muted">
            I run three mornings a week, lift six days, and spend as much leave as I can on the
            coast or in the hills. Surfing at Mulki and monsoon treks are the current habit.
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {lifePhotos.map((photo) => (
              <Photo
                key={photo.name}
                name={photo.name}
                widths={[480, 800]}
                alt={photo.alt}
                sizes="(max-width: 640px) 30vw, 320px"
                width={800}
                height={1000}
                className="w-full rounded-card border border-line object-cover"
              />
            ))}
          </div>
        </Reveal>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-8">
          <p className="eyebrow">Experience</p>
          <div className="flex flex-col">
            {experience.map((job, i) => (
              <div
                key={`${job.company}-${job.start}`}
                className={`flex flex-col gap-4 py-8 ${i > 0 ? 'border-t border-dashed border-line' : ''}`}
              >
                <div className="flex flex-col gap-1">
                  <h2 className="text-subheading">
                    {job.role} —{' '}
                    {job.companyUrl ? (
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="link-ember"
                      >
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </h2>
                  <p className="text-small text-muted">
                    {job.start} – {job.end} · {job.location}
                  </p>
                  <p className="text-micro uppercase text-muted">{job.stack}</p>
                </div>
                <ul className="flex max-w-measure list-none flex-col gap-3">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className="relative pl-5 before:absolute before:left-0 before:text-ember before:content-['—']">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-8">
          <p className="eyebrow">Skills</p>
          <div className="flex flex-col gap-8">
            {skills.map((group) => (
              <div key={group.group} className="flex flex-col gap-3">
                <h2 className="text-label uppercase text-muted">{group.group}</h2>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="tag">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <hr className="rule" />

      <section className="container-page py-24">
        <Reveal className="flex flex-col gap-8">
          <p className="eyebrow">Education</p>
          <div className="flex flex-col">
            {education.map((entry, i) => (
              <div
                key={entry.school}
                className={`flex flex-col gap-1 py-6 ${i > 0 ? 'border-t border-dashed border-line' : ''}`}
              >
                <h2 className="text-subheading">{entry.qualification}</h2>
                <p className="text-small">{entry.school}</p>
                <p className="text-small text-muted">
                  {entry.period} · {entry.detail}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <hr className="rule" />

      <section className="container-page flex flex-wrap items-center justify-between gap-6 py-16">
        <p className="text-subheading">The short version is a PDF.</p>
        <div className="flex flex-wrap gap-3">
          <a href={site.resume} className="btn btn-primary" download>
            Download resume
          </a>
          <Link href="/contact" className="btn btn-ghost">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
