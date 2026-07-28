export type Slide = {
  /** 1600x600 crop in public/, cut by scripts/build-images.sh. */
  photo: string
  /** Printed over the photo in the header, one line, monospace. */
  code: string
}

// Ground to orbit: his own peacock at dusk, a ridge in cloud, the milky way,
// then the earth from above. The code line over each is a step through the same
// request the gateway serves, so the two arcs land together.
export const SLIDES: Slide[] = [
  { photo: '/banner.jpg', code: 'const reply = await gateway.route(prompt)' },
  { photo: '/img/banner-ridge.jpg', code: 'guardrails.check(reply) ?? fallback()' },
  { photo: '/img/banner-stars.jpg', code: 'for await (const token of agent.stream())' },
  { photo: '/img/banner-orbit.jpg', code: 'deploy --region asia-south1 --wait' },
]

/** How long each slide holds, in ms. */
export const SLIDE_MS = 6000
