# ask-pavan

Cloudflare Worker for the chat widget and launch film inquiry form on pavankushnure.website.
`POST /ask` streams answers from Gemini and logs questions in D1.
`POST /inquiry` stores an inquiry in D1 before scheduling its email through Resend.
API keys exist only as Worker secrets.

## Layout

| What | Where |
|---|---|
| Entry, CORS, body limit, route dispatch, chat SSE | `src/index.ts` |
| Inquiry validation, storage, hourly limit, email delivery | `src/inquiry.ts` |
| Pavan's brain, imported as text at build time | `knowledge.md` |
| System prompt | top of `src/index.ts` |
| Question log schema | `migrations/0001_init.sql` |
| Inquiry log schema and IP/time index | `migrations/0002_inquiries.sql` |
| Chat smoke test | `scripts/smoke.sh` |
| Inquiry HTTP/D1 smoke test and email boundary checks | `scripts/smoke-inquiry.sh`, `scripts/check-inquiry.mjs` |

Updating the bot's knowledge means editing `knowledge.md` and redeploying only this worker.
No site rebuild is needed.

## One-time setup

Use Node 22, matching the site's `.nvmrc`.

```bash
cd worker
npm install
npx wrangler login
npx wrangler d1 create ask-pavan-log
# Paste the database_id into wrangler.toml's [[d1_databases]].
npx wrangler d1 migrations apply LOG --remote
npx wrangler secret put GEMINI_API_KEY
```

Get a Gemini key at <https://aistudio.google.com/apikey>.

For inquiry emails, create a Resend account with `pavankushnure2000@gmail.com`, then enter its API key interactively:

```bash
npx wrangler secret put RESEND_API_KEY
```

Never put the key in a tracked file, command argument, log, or chat.
The `onboarding@resend.dev` sender delivers only to the Resend account's own address, so `INQUIRY_TO` must be the Gmail used for signup.
The worker uses plain `fetch` with the fields in [Resend's send-email API](https://resend.com/docs/api-reference/emails/send-email), including `reply_to` set to the visitor's email.
Reply in Gmail to answer the visitor directly.

## Deploy

Apply the inquiry migration before deploying the route:

```bash
cd worker
npx wrangler d1 migrations apply LOG --remote
npx wrangler deploy
```

The live worker is `https://ask-pavan.pavankumarkushnure.workers.dev`.
The site inquiry form uses that URL by default; `NEXT_PUBLIC_WORKER_URL` overrides it at site build time for local testing.
The chat widget is wired site-wide from `src/app/layout.tsx`.

## Inquiry route

`POST /inquiry` accepts JSON with string fields `name`, `email`, `product`, `launchDate`, `message`, and the hidden `company` honeypot.
`launchDate` and `company` can be omitted.
Unknown fields are ignored.
Requests must come from an allowed origin and fit within 8 KB.
The worker strips control characters, preserves newlines only in the message, and validates field lengths and email syntax.
A filled honeypot returns `{ "ok": true }` without storing or sending anything.

Accepted inquiries are stored before the response `{ "ok": true }` and background email delivery.
Email failures leave the row intact with `emailed = 0` and log the failure.
Without `RESEND_API_KEY`, local development stores the row and logs that no email was sent.
The hourly limit counts stored inquiries for the hashed IP and is enforced by a single conditional insert.
The route returns 400 for invalid input, 413 for oversized bodies, 403 for foreign origins, 429 for the hourly limit, and 500 if storage fails.

Read the latest inquiries:

```bash
npx wrangler d1 execute LOG --remote --command "SELECT id, datetime(ts/1000,'unixepoch') AS at, name, email, product, launch_date, emailed FROM inquiries ORDER BY ts DESC LIMIT 20"
```

The query displays UTC; notification emails display the time in IST.
To inspect locally, replace `--remote` with `--local`.

## Local dev and smoke tests

```bash
npm run smoke:inquiry
```

This test needs neither API key.
It applies local migrations to isolated temporary state and starts `wrangler dev` with `INQUIRY_LIMIT_PER_HOUR:2` and an explicit empty env file.
It checks preflight, persisted data, honeypot behavior, input validation and sanitization, body size, foreign origins, the third inquiry's 429, and existing chat request handling.
It also checks background email delivery, Resend payload fields, email failures, storage failures, and the subject length using Node's standard assertion library.
Temporary D1 state is removed when the test exits.

The chat test requires a real Gemini key:

```bash
cp .dev.vars.example .dev.vars
# Put a real GEMINI_API_KEY in .dev.vars.
npm run smoke
```

It checks streamed SSE, jailbreak resistance, the chat rate limit, and foreign origins.
It fails explicitly if the Gemini key is missing or a placeholder.

## Tuning

All settings are in `wrangler.toml` under `[vars]`: `MODEL` (default `gemini-3.6-flash`), `RATE_LIMIT_PER_HOUR` (15), `INQUIRY_LIMIT_PER_HOUR` (5), `INQUIRY_TO` (`pavankushnure2000@gmail.com`), and `ALLOWED_ORIGINS`.
`RESEND_API_KEY` and `GEMINI_API_KEY` are secrets, not vars.
