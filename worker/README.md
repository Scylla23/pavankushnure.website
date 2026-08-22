# ask-pavan — "Ask my AI" backend

Cloudflare Worker that powers the chat widget on pavankushnure.website. Streams
answers from the Gemini API and keeps rate-limit counts + question logs in D1.
The Gemini key exists only as a Worker secret.

## Layout

| What | Where |
|---|---|
| Worker entry (CORS, validation, rate limit, SSE proxy) | `src/index.ts` |
| Pavan's brain, imported as text at build time | `knowledge.md` |
| System prompt (verbatim) | top of `src/index.ts` |
| Rate-limit + question log schema | `migrations/0001_init.sql` |
| Smoke test | `scripts/smoke.sh` |

Updating the bot's knowledge = edit `knowledge.md`, then redeploy this worker
only. No site rebuild needed.

## One-time setup

```bash
cd worker
npm install

npx wrangler login
npx wrangler d1 create ask-pavan-log
#   → paste the printed database_id into wrangler.toml ([[d1_databases]])

npx wrangler d1 migrations apply LOG --remote
npx wrangler secret put GEMINI_API_KEY     # paste the Gemini API key
```

Get a key at <https://aistudio.google.com/apikey>.

## Deploy

```bash
cd worker
npx wrangler deploy
#   → prints https://ask-pavan.<your-subdomain>.workers.dev
```

Paste that URL into `public/ask-pavan.js` (`WORKER_URL`) if it changed, commit,
and push — GitHub Actions publishes the site. The widget is already wired
site-wide from `src/app/layout.tsx`.

## Local dev / smoke test

```bash
cp .dev.vars.example .dev.vars      # then put a real GEMINI_API_KEY in it
npm run smoke                       # migrations, wrangler dev, 4 assertions
```

The script asserts: a valid question streams SSE, a jailbreak leaks nothing,
12 rapid requests hit the rate limit (cap forced to 3 for the test), and
foreign origins are rejected.

## Tuning

All in `wrangler.toml` `[vars]`: `MODEL` (default gemini-3.6-flash),
`RATE_LIMIT_PER_HOUR` (default 15 per IP), `ALLOWED_ORIGINS`.
