# pavankushnure.website

Personal site. Next.js static export, deployed to GitHub Pages on push to `main`.

Live: <https://pavankushnure.website>

## Run it

```bash
nvm use          # Node 22, per .nvmrc
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run typecheck
npm run build    # writes out/
npx serve out    # preview the real static output
```

## Where things live

| What | Where |
|---|---|
| All bio, experience, skills, education content | `src/data/profile.ts` |
| All projects, including per-project write-ups | `src/data/projects.ts` |
| Design tokens | `src/app/globals.css` (`:root`) and `tailwind.config.ts` |

Nothing is hardcoded in components — to change copy, edit the data files.

A project gets its own page at `/work/<slug>` if and only if it has a `detail`
block. Adding one is enough; the route, the sitemap entry, and the card's
"Read the write-up" link all follow from it.

## Images

Sources live in `photos/` (gitignored — they are large originals). The
committed derivatives in `public/img/` are produced by:

```bash
./scripts/build-images.sh          # needs ImageMagick
```

Run it only when a source photo changes. It is deliberately not in CI: the
output is committed and the runner has no ImageMagick.

The Open Graph card is rendered from `scripts/og.html` with the real site fonts:

```bash
playwright screenshot --viewport-size=1200,630 --wait-for-timeout=1200 \
  "file://$PWD/scripts/og.html" public/og.png
```

## Deploying

Push to `main`. The workflow typechecks, builds, and publishes `out/`.

Three things make the static export work on Pages, all in `next.config.mjs`
and `public/`:

- `output: 'export'` — no Node server on Pages
- `images: { unoptimized: true }` — required by export; sizes are pre-generated
- `trailingSlash: true` — `/work` resolves to `/work/index.html`
- `public/.nojekyll` — without it Pages strips `_next/` and every asset 404s
- `public/CNAME` — holds the custom domain

## Design

The system is documented in `DESIGN.md`, including a decision log explaining
why each choice is what it is. Change the doc before changing the tokens.
