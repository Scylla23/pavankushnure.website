# DESIGN.md — Pavan Kushnure portfolio

One design system, merged from two sources:

- **Brand wins colours + fonts.** No brand kit existed, so we chose these on 2026-07-07
  (see Decision Log D2–D3). They are authoritative — references never override them.
- **References win layout + feel.** Sole reference: **ORYZO** — a warm-dark editorial
  product showcase (full-bleed dark canvas, cream type in generous negative space, hairline
  dashed dividers, uppercase museum-label micro-type). We keep its *feel*, and adapt its
  *components* from a one-product page to a four-page portfolio.

**Theme:** dark · **Voice:** warm, editorial, confident, low-chrome · **Pages:** Home · Work · About · Contact

Any new design decision gets appended to the **Decision Log** at the bottom — that section is the source of truth for "why is it like this."

---

## 1. Colours  *(brand — authoritative)*

Warm near-black canvas, warm cream text, a single ember accent. No pure `#fff`, no pure `#000` in UI.

| Role | Token | Value | Notes |
|------|-------|-------|-------|
| Canvas / background | `--color-canvas` | `#100904` | Warm near-black. Every section sits on this. |
| Text (primary) | `--color-text` | `#ffedd7` | Warm cream. All body + headings. Never `#fff`. |
| Text (muted) | `--color-text-muted` | `#6c5f51` | Driftwood. Meta, captions, secondary labels. |
| Surface (raised) | `--color-surface` | `#382416` | Bark brown. Cards, elevated panels — one step up from canvas. |
| Border / divider | `--color-border` | `#40372e` | Cork. Hairlines, dashed section dividers, card outlines. |
| **Accent / action** | `--color-accent` | `#dc5000` | Ember. **Primary CTAs, links, active states, metric numbers.** See D4. |
| Accent (hover) | `--color-accent-hover` | `#ff6316` | Lighter ember for hover/focus. |

Depth = a **two-step surface stack** (`#100904` canvas → `#382416` surface), never drop shadows. (Feel carried from ORYZO — see D-feel.)

> **Divergence from ORYZO (D4):** the reference reserved ember for editorial credits only and had *no* CTA colour. A portfolio must drive clicks, so ember is promoted to the primary interactive/action colour here.

---

## 2. Typography  *(brand — authoritative)*

**Inter, one family** — weight carries the hierarchy. Free, self-hostable, loads via Google Fonts. Replaces the reference's paid Halyard (D3).

```
Display / headings : Inter 600
Body               : Inter 400
Labels / nav / tags: Inter 500, UPPERCASE
```

### Type scale

| Role | Size (clamp) | Weight | Line height | Tracking | Case |
|------|--------------|--------|-------------|----------|------|
| Display (hero) | `clamp(40px, 6vw, 56px)` | 600 | 0.95 | -0.02em | as written |
| Heading (h1/section) | `clamp(30px, 4vw, 41px)` | 600 | 1.0 | -0.015em | as written |
| Subheading (h2) | 24px | 600 | 1.15 | -0.01em | as written |
| Body | 18px | 400 | 1.6 | normal | sentence |
| Body-small / meta | 14px | 400 | 1.5 | normal | sentence |
| Eyebrow / label / nav | 13px | 500 | 1.2 | +0.1em | UPPERCASE |
| Micro / legal | 12px | 500 | 1.2 | +0.08em | UPPERCASE |

Notes:
- **Body is 18px, not the reference's 29px** (D5) — About and the case studies have real paragraphs; 29px is for two-sentence product blurbs.
- **Display gets -0.02em tracking** (D6) — Inter needs slight tightening at large sizes; Halyard did not.
- Uppercase eyebrow/label type (`+0.1em`, weight 500) is what carries the ORYZO "museum-label" feel into the brand font.
- Two voices, like the reference: **UPPERCASE 500 labels** (nav, eyebrows, tags, metrics-unit) vs **sentence-case 400 body**. The shift signals "label" vs "prose."

---

## 3. Spacing & shape

**Density:** comfortable — generous negative space is the feel (from ORYZO). **8px-based scale** (D7 — normalised from the reference's irregular extracted values).

| Token | Value | Typical use |
|-------|-------|-------------|
| `--space-1` | 4px | icon gaps |
| `--space-2` | 8px | tight stacks |
| `--space-3` | 12px | label→control |
| `--space-4` | 16px | card inner gap |
| `--space-6` | 24px | card padding, element gap |
| `--space-8` | 32px | block spacing |
| `--space-12` | 48px | sub-section gaps |
| `--space-16` | 64px | section padding (inner) |
| `--space-24` | 96px | section padding (vertical rhythm) |
| `--space-32` | 128px | major section breaks |

**Radius vocabulary** (keep it to four): cards `12px` · pill buttons `9999px` · ghost buttons `24px` · inputs/inline `0px`.

**Layout container:** section *backgrounds* are full-bleed (100vw), but content sits in a **max-width `1080px`** column, text measure capped ~68ch (D8 — the reference was fully full-bleed for a single object; portfolio prose needs a reading column). Section vertical padding `--space-24` (96px), tightening to `--space-16` on mobile.

---

## 4. Components

Adapted from ORYZO's vocabulary to portfolio needs. All uppercase micro-type is Inter 500.

### Fixed top navigation
Transparent over the canvas. Left: wordmark **PAVAN KUSHNURE** (13px, 500, uppercase, cream). Right: `WORK · ABOUT · CONTACT` (13px, 500, uppercase, cream), active item gets a 1px dashed ember or cork underline. No background until scrolled; on scroll, fade in canvas at 90% + hairline bottom border.

### Primary button (filled ember)  *(new vs ORYZO — D4)*
Ember `#dc5000` fill, cream text, `14px 24px` padding, weight 500, 15px, pill radius (`9999px`). Hover → `#ff6316`. Used for the page's main action: "See the work", "Visit live". One primary per section.

### Ghost button (outlined)
Transparent fill, 1px cream border, cream text, `12px 22px` padding, 500, radius `24px`. Secondary actions. Hover → border + text shift to ember.

### Text link (underline)
Inline links: ember `#dc5000`, underline on hover, no container. Nav links: cream, uppercase, dashed underline on active.

### Project card *(Work — the 6 Bravent products)*
Surface `#382416`, 12px radius, 1px cork border, `24px` padding. Top: full-bleed sharp-edged screenshot (no rounded mask inside). Then: product name (subheading 24/600), one-liner (body 18/400), a row of tech tags (12px uppercase, muted), and a **"Visit {product} →"** link (ember). No drop shadow — the surface step is the elevation.

### Metric case-study block *(Work — Naya)*
Metric-forward. Big number in ember (`clamp(30px,4vw,41px)`, 600) + unit label (13px uppercase, muted) — e.g. **250K+** ASSETS · **50ms** KEYWORD · **40%** ADOPTION. Then heading + body describing the work. Left-aligned, no image (proprietary).

### Experience entry *(About)*
Row: role + company (subheading, company links to naya.studio where relevant) · dates + location (body-small, muted, right or below) · 2–4 bullets (body, cream). Separated by dashed hairline dividers, not boxes.

### Skill group
Grouped list: group label (eyebrow, uppercase, muted) + wrapped tag chips (12px uppercase, 1px cork border, transparent fill, no radius or `24px` pill — pick one, default pill). AI/LLM group listed first.

### Hero lockup *(Home)*
Full-bleed canvas. Eyebrow "LEAD AI ENGINEER" (uppercase, ember) → display headline (2 lines, cream) → sub-line (body, muted) → proof strip "3+ YEARS · 6 SHIPPED PRODUCTS · REMOTE ACROSS US TIME ZONES" (13px uppercase, muted) → primary button "See the work" + ghost "Get in touch".

### Section divider
1px **dashed** line in cork `#40372e`. Only between content blocks, never decorative. Never solid, never >2px.

### Footer
Minimal: cream wordmark, email (ember link), social row (GitHub · LinkedIn · X · Instagram, uppercase micro), "Open to opportunities" line. No heavy chrome.

*(No contact form / input component — contact is a `mailto:` link + socials, per COPY.md. Skipped deliberately; add an underline-only input later if a form is ever wanted.)*

---

## 5. Imagery

- **Product screenshots** (the 6 Bravent products): sharp-edged, full-bleed within cards, no rounded masks, warm/high-contrast grading to sit on the dark canvas. Placeholders (`[screenshot: …]`) until supplied.
- Naya case studies: **no imagery** (proprietary) — the metrics are the visual.
- No stock photography, no people, no lifestyle imagery. The work is the hero.

---

## 6. Tokens (CSS custom properties)

```css
:root {
  /* Colour */
  --color-canvas:       #100904;
  --color-text:         #ffedd7;
  --color-text-muted:   #6c5f51;
  --color-surface:      #382416;
  --color-border:       #40372e;
  --color-accent:       #dc5000;
  --color-accent-hover: #ff6316;

  /* Type */
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --fw-regular: 400;
  --fw-medium:  500;
  --fw-semibold: 600;

  /* Spacing (8px scale) */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-6: 24px;  --space-8: 32px;  --space-12: 48px; --space-16: 64px;
  --space-24: 96px; --space-32: 128px;

  /* Radius */
  --radius-card: 12px;
  --radius-ghost: 24px;
  --radius-pill: 9999px;
  --radius-input: 0px;

  /* Layout */
  --container-max: 1080px;
}
```

Font load: `Inter` weights 400/500/600 via Google Fonts (or self-host `.woff2`). Latin subset only.

---

## 7. Decision Log

Every design choice, with rationale. Append new rows here as we build — never edit history, add a new dated entry that supersedes.

| # | Date | Decision | Rationale | Status |
|---|------|----------|-----------|--------|
| D1 | 2026-07-07 | Multi-page site: Home · Work · About · Contact | Each page ranks for its own search terms; single-page couldn't. | ✅ locked |
| D2 | 2026-07-07 | Palette = adapted ORYZO warm-dark, adopted as **brand** | No brand kit existed; user loved the ORYZO reference. Coherent with the layout source. | ✅ locked |
| D3 | 2026-07-07 | Fonts = **Inter**, single family (400/500/600) | Free, instant load, self-hostable; the named Halyard substitute. Avoids paid Adobe licensing. | ✅ locked |
| D4 | 2026-07-07 | Promote ember `#dc5000` to primary CTA/interactive accent | ORYZO reserved it for credits only; a portfolio must drive clicks with a clear action colour. | ✅ locked |
| D5 | 2026-07-07 | Body type 18px/1.6 (not the reference's 29px) | About + case studies have real paragraphs; 29px suits two-sentence product blurbs, not prose. | ✅ locked |
| D6 | 2026-07-07 | Display tracking -0.02em at large sizes | Inter needs slight tightening at display scale; Halyard (normal tracking) did not. | ✅ locked |
| D7 | 2026-07-07 | Normalise spacing to an 8px-based scale | Reference's extracted values (9/31/45/68/204) are comp-specific and unmaintainable. | ✅ locked |
| D8 | 2026-07-07 | Full-bleed section backgrounds, content in a 1080px column | Reference was fully full-bleed for one object; portfolio prose needs a capped reading measure. | ✅ locked |
| D9 | 2026-07-07 | Theme = dark | From brand + reference. | ✅ locked |
| D10 | 2026-07-07 | No contact form — `mailto:` + socials only | COPY.md chose email link; a form needs a backend (YAGNI). | ✅ locked |
| D-feel | 2026-07-07 | Keep ORYZO feel: full-bleed dark-on-dark, dashed hairline dividers, uppercase micro-labels, no drop shadows, generous negative space | This is the "references win layout/feel" half of the merge. | ✅ locked |
| D11 | 2026-07-07 | Stack = static HTML + CSS + tiny vanilla JS, four pages; Inter self-hosted as `.woff2` | Portfolio needs no framework/build; self-hosting keeps the "no third-party embeds" rule (no Google Fonts request). | ✅ built |
| D12 | 2026-07-07 | Muted text = `#a3907c` (lifted driftwood); original `#6c5f51` kept for decorative dim only | Original driftwood on canvas failed contrast for body-adjacent text; lifted tone passes AA while staying warm. | ✅ built |
| D13 | 2026-07-07 | One ambient ember radial glow (top-right) as the only "lighting" | Adds warmth/depth without shadows (honours the no-shadow rule); ties to the ember accent. | ✅ built |
| D14 | 2026-07-07 | Scroll-reveal is progressive enhancement — content visible by default, hidden only when `html.js` is set | Never hide copy from no-JS/crawlers; animation is additive. | ✅ built |
| D15 | 2026-07-07 | Product screenshots shown as honest empty framed placeholders (dashed frame + "Screenshot" label) | Hard rule: never invent logos/imagery. Placeholders wait for real screenshots. | ✅ built |
| D16 | 2026-07-07 | Mobile nav = single-row, shrunk type; no hamburger | Three links fit at small widths; a menu toggle would be over-engineering. | ✅ built |
| D17 | 2026-07-28 | Primary button text = canvas `#100904`, not cream — supersedes §4 "cream text" | Measured: cream on ember is 3.53:1 and white 4.05:1, both below AA for 15px. Canvas is 4.88:1, and 6.63:1 against the hover ember. Dark-on-ember is the only pairing that passes in both states. | ✅ built |
| D18 | 2026-07-28 | Rebuilt as Next.js 15 static export; dark-only, no theme provider | Pavan chose the Next.js reference stack over the hand-built static site. The reference's light/dark toggle is dropped because D9 locks the theme to dark, so the provider had one branch. | ✅ built |
| D19 | 2026-07-28 | No animation library; scroll reveal is CSS + IntersectionObserver | framer-motion's default is `initial={{opacity:0}}`, which hides content until JS runs — the exact thing D14 forbids. A 30-line component does the job without the conflict. | ✅ built |
| D20 | 2026-07-28 | Photos on About are captioned with EXIF place + date | Captions describe only what is visible in frame and where it was taken, so nothing about Pavan's life is invented. Family and wedding photos excluded — the site's job is hiring. | ✅ built |
