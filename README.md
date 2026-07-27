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
| Name, socials, bio, banner quote | `src/components/Header.tsx` |
| Experience | `src/components/Experience.tsx` |
| Education | `src/components/Education.tsx` |
| Skills | `src/components/Stack.tsx` |
| Contact copy and links | `src/components/Contact.tsx` |
| Projects, including per-project write-ups | `src/data/projects.ts` |

The home page shows `projects.slice(0, 3)`; `/projects` shows all of them, and
every project also gets its own page at `/projects/<slug>`.

## Images

`public/avatar.jpg` is cropped from `photos/` (gitignored originals):

```bash
./scripts/build-images.sh          # needs ImageMagick
```

`public/thumbnails/*.jpg` are live screenshots of each project, captured with:

```bash
playwright screenshot --viewport-size=1440,900 --wait-for-timeout=6000 <url> <out.png>
```

Three projects have no usable screenshot (ProposalIQ sits behind auth, docsyntra
has no public site, ModelDuet is a repo) and use a generated typographic card
instead.

## Deploying

Push to `main`. The workflow typechecks, builds, and publishes `out/`.

Static export on Pages depends on all of these:

- `output: 'export'` — no Node server on Pages
- `images: { unoptimized: true }` — required by export; sizes are pre-generated
- `trailingSlash: true` — `/projects` resolves to `/projects/index.html`
- `export const dynamic = 'force-static'` in `src/app/robots.ts` and `sitemap.ts`
- `public/.nojekyll` — without it Pages strips `_next/` and every asset 404s
- `public/CNAME` — holds the custom domain

## Design

Layout, type and components are a direct port of
<https://github.com/punyajain1/Portfolio_PJ> with the content swapped. Match that
reference before changing anything visual.
