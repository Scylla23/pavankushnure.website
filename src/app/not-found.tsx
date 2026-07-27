import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container-page flex flex-col gap-6 py-24">
      <p className="eyebrow">404</p>
      <h1 className="text-display">That page isn&apos;t here.</h1>
      <p className="max-w-measure text-muted">
        The link is either wrong or the page has moved.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/" className="btn btn-primary">
          Go home <span aria-hidden>→</span>
        </Link>
        <Link href="/work" className="btn btn-ghost">
          See the work
        </Link>
      </div>
    </section>
  )
}
