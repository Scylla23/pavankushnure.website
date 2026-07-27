/**
 * Static <picture> against the pre-generated files in public/img/.
 *
 * next/image is off the table under `output: 'export'` (no optimizer), so the
 * widths here must match what scripts/build-images.sh actually emits.
 */
export function Photo({
  name,
  widths,
  alt,
  sizes,
  width,
  height,
  className = '',
  priority = false,
}: {
  name: string
  widths: number[]
  alt: string
  sizes: string
  width: number
  height: number
  className?: string
  priority?: boolean
}) {
  const srcset = (format: string) => widths.map((w) => `/img/${name}-${w}.${format} ${w}w`).join(', ')

  return (
    <picture>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      {/* WebP is the <img> src too: universal since Safari 14, so a JPEG tier
          would only ever add files nobody downloads. */}
      <img
        src={`/img/${name}-${widths[0]}.webp`}
        srcSet={srcset('webp')}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        // eslint-disable-next-line @next/next/no-img-element
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  )
}
