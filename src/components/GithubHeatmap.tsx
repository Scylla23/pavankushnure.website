'use client'

import { useEffect, useState } from 'react'
import { site } from '@/data/profile'

type Day = { date: string; count: number }

const ENDPOINT = `https://github-contributions-api.jogruber.de/v4/${site.githubUser}?y=last`

/** Local-midnight parse. `new Date('2025-07-27')` is UTC and shifts the weekday west of GMT. */
function weekday(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

/**
 * The API's own `level` is compressed — a 25-commit day comes back as level 1.
 * Quartiles over the non-zero days give a grid that reflects the actual spread.
 */
function levelScale(days: Day[]): (count: number) => number {
  const nonZero = days.filter((d) => d.count > 0).map((d) => d.count).sort((a, b) => a - b)
  if (nonZero.length === 0) return () => 0
  const at = (q: number) => nonZero[Math.min(nonZero.length - 1, Math.floor(nonZero.length * q))]
  const [q1, q2, q3] = [at(0.25), at(0.5), at(0.75)]
  return (count) => {
    if (count <= 0) return 0
    if (count <= q1) return 1
    if (count <= q2) return 2
    if (count <= q3) return 3
    return 4
  }
}

const FILL = [
  'rgba(64,55,46,0.45)', // empty — cork, barely there
  'rgba(220,80,0,0.28)',
  'rgba(220,80,0,0.52)',
  'rgba(220,80,0,0.76)',
  'rgba(255,99,22,1)',
]

export function GithubHeatmap() {
  const [days, setDays] = useState<Day[] | null>(null)
  const [total, setTotal] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const ac = new AbortController()
    fetch(ENDPOINT, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (!Array.isArray(data?.contributions)) throw new Error('unexpected shape')
        setDays(data.contributions)
        setTotal(data?.total?.lastYear ?? null)
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') setFailed(true)
      })
    return () => ac.abort()
  }, [])

  // The only third-party request the site makes. If it fails, the section
  // simply is not there — never a broken box.
  if (failed || !days) return null

  const toLevel = levelScale(days)
  const pad = weekday(days[0].date)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-small text-muted">
          {total !== null && (
            <>
              <span className="font-medium text-cream">{total.toLocaleString()}</span> contributions
              in the last year
            </>
          )}
        </p>
        <a
          href={`https://github.com/${site.githubUser}`}
          target="_blank"
          rel="noreferrer noopener"
          className="link-ember text-small"
        >
          @{site.githubUser} <span aria-hidden>↗</span>
        </a>
      </div>

      <div className="overflow-x-auto pb-2">
        <div
          className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
          role="img"
          aria-label={`GitHub contribution graph: ${total ?? 'many'} contributions in the last year`}
        >
          {Array.from({ length: pad }, (_, i) => (
            <span key={`pad-${i}`} className="h-[11px] w-[11px]" />
          ))}
          {days.map((d) => (
            <span
              key={d.date}
              title={`${d.count} on ${d.date}`}
              className="h-[11px] w-[11px] rounded-[2px]"
              style={{ backgroundColor: FILL[toLevel(d.count)] }}
            />
          ))}
        </div>
      </div>

      <p className="text-micro uppercase text-muted">
        Most of this lands in private work repos, so the public graph runs light
      </p>
    </div>
  )
}
