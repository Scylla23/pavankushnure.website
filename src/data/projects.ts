export interface Project {
  title: string;
  slug: string;
  description: string;
  longDescription: string[];
  features: string[];
  technologies: string[];
  thumbnail?: string;
  images?: string[];
  links: {
    visit?: string;
    source?: string;
  };
}

export const projects: Project[] = [
  {
    title: "GovEngine",
    slug: "govengine",
    description: "AI agents that a person approves before they run. You describe the work in plain English, review the plan GovEngine drafts, and it runs exactly that plan on the tools your team already uses.",
    longDescription: [
      "GovEngine is live at govengine.ai. You describe a task in plain English and it drafts a typed graph of steps, asks about anything missing, and shows every outside action before you approve it. Approval freezes that version, and a deterministic executor runs exactly that graph, either manually, on a schedule or when an event arrives. The model helps design the graph but does not decide what runs.",
      "Agents work through Gmail, Outlook, Teams, Slack, SharePoint, Google Drive and GitHub. Every connector call passes one deny-by-default scope check, and a person can be required to confirm a send or a write before it leaves the system. When a task needs a website that has no API, an agent can drive a real browser in an isolated, encrypted session, and it still asks before acting.",
      "Every model call goes through a gateway that applies one policy across providers (currently OpenAI and Google Gemini), with guardrails for PII and prompt injection and a record of usage and cost. In governed mode, MCPOne adds authorization, tool mediation and output screening, and stores evidence on each run.",
      "Companies can also bring their own products onto GovEngine. A team can publish an API, an MCP server or a single sign-on app, upload an agent package, or have GovEngine host its app as a reviewed Docker container that administrators can start and stop. Every submission is validated and security reviewed before an administrator publishes it to the capability catalog, where organizations can activate it for their people and their agents.",
      "Teams can start from a template library and share agents with each other. Installing a shared agent gives you your own copy wired to your own connections, so the publisher's credentials stay with the publisher. GovEngine also tracks AWS, Azure and GCP VM cost and utilization without holding a cloud credential.",
      "I'm the lead engineer on GovEngine at Bravent, working across the product, the model gateway and production operations."
    ],
    features: [
      "Plain-English request to an inspectable, approved agent graph",
      "Immutable versions and deterministic execution on demand, on a schedule or on events",
      "Gmail, Outlook, Teams, Slack, SharePoint, Drive and GitHub connectors",
      "Human confirmation before sends, writes and browser actions",
      "One model gateway across providers with PII and prompt-injection guardrails",
      "A capability catalog where companies publish APIs, MCP servers, SSO apps and hosted Docker apps",
      "Security review before anything reaches the catalog",
      "Shareable agents and a template library"
    ],
    technologies: ["TypeScript", "Next.js", "PostgreSQL", "Redis", "BullMQ", "MCP", "Docker", "Keycloak"],
    thumbnail: "/thumbnails/govengine.jpg",
    links: {
      visit: "https://govengine.ai"
    }
  },
  {
    title: "MCPOne",
    slug: "mcpone",
    description: "A policy-enforced runtime that screens every AI request before it reaches a model, over REST, gRPC and MCP, with an append-only audit trail.",
    longDescription: [
      "Regulated environments cannot send a prompt to a model and hope for the best. MCPOne sits between the application and the provider, screening every request against policy, and keeping a record that survives an audit.",
      "Requests arrive over REST, gRPC or MCP and pass through inline PII redaction plus prompt-injection and content-safety scans. Everything that happens is written to an append-only, hash-chained audit ledger in PostgreSQL, so a tampered record breaks the chain.",
      "I designed a guardrail enforcement engine that maps a 1,248-rule catalog onto real runtime mechanisms: 36 gateway gates, 42 per-request runtime gates, and 192 infrastructure attestations. An autonomous cron agent adversarially re-tests the live production guardrails every hour across six harm categories, so drift shows up as a failure rather than a surprise.",
      "The multi-tenant SaaS streams over SSE through a five-tier LLM router: bring-your-own-key, then credits, then local Gemma via Ollama, then managed Gemini, then a canned fallback. Auth via next-auth, metered billing via Stripe.",
      "Deployed via GitHub Actions CI — build, typecheck, test, Trivy scan — with Drizzle migrations and PM2 reloads. MCPOne was assessed as Awardable by Tradewinds."
    ],
    features: [
      "Every request screened before it reaches a model",
      "Append-only, hash-chained audit ledger",
      "1,248-rule catalog mapped to mechanisms that actually run",
      "Hourly adversarial re-test of live production guardrails",
      "Five-tier LLM router so cost never blocks a request",
      "Metered billing and multi-tenant auth"
    ],
    technologies: ["TypeScript", "Next.js", "PostgreSQL", "Drizzle", "gRPC", "MCP", "Stripe"],
    thumbnail: "/thumbnails/mcpone.jpg",
    links: {
      visit: "https://mcpone.ai"
    }
  },
  {
    title: "ProposalIQ",
    slug: "proposaliq",
    description: "RAG over federal solicitations that retrieves on meaning and exact identifiers at once, then drafts with every claim cited.",
    longDescription: [
      "Federal solicitations turn on exact identifiers — clause numbers, CLINs, section references. Pure semantic search kept missing them, which is the reason this system is hybrid rather than dense-only.",
      "A production RAG pipeline over Qdrant fuses dense embeddings (text-embedding-3-large, 3072 dimensions) with BM25 sparse retrieval using Reciprocal Rank Fusion at k=60. I chose hybrid after watching semantic search repeatedly miss the exact identifiers the documents hinge on.",
      "Claude, GPT-4o and Gemini sit behind a unified layer with per-model token and cost accounting. Opportunity sourcing is agentic: SAM.gov via MCP tools driven by a Claude tool-use loop, alongside the HigherGov REST feed.",
      "I built an evaluation subsystem for A/B model judgments and weighted rubric scoring across writing quality, completeness and accuracy, surfacing win-rate and tie analytics. Prompt and model changes get compared on results instead of intuition.",
      "React SPA, an Express API with 162 endpoints across 33 data models, and a Python retrieval service. SSE-streamed drafting, real-time collaborative DOCX editing over Socket.IO, 442 automated tests, and CI/CD to Oracle Cloud through GitHub Actions, pm2, Nginx and a Dockerized OnlyOffice."
    ],
    features: [
      "Dense and sparse retrieval, fused with Reciprocal Rank Fusion",
      "Three model providers behind one accounted layer",
      "Agentic opportunity sourcing over SAM.gov via MCP",
      "Model choices decided by measurement, not intuition",
      "Real-time collaborative DOCX editing over Socket.IO",
      "442 automated tests and CI/CD to Oracle Cloud"
    ],
    technologies: ["TypeScript", "Python", "Qdrant", "Redis", "Socket.IO", "Docker", "OCI"],
    thumbnail: "/thumbnails/proposaliq.jpg",
    links: {
      visit: "https://proposaliq.govcom.ai"
    }
  },
  {
    title: "Doc Extractor",
    slug: "doc-extractor",
    description: "Turns messy invoice PDFs into clean JSON where each field carries its own confidence score and a citation back to the page it came from.",
    longDescription: [
      "Finance teams still retype invoices into spreadsheets by hand. This does it in about 30 seconds, and — the part that matters — tells you when not to trust it.",
      "Every extracted field carries a confidence score and a source citation pointing at the page it came from. In the demo it pulls vendor, invoice number, dates, totals and every line item at full confidence, then flags the currency at 67% because it had to infer USD from a dollar sign. You auto-approve the confident majority and only look at the rest.",
      "Hybrid parse-then-LLM routing sends born-digital PDFs through PyMuPDF and scans through Mistral OCR, then into Claude structured outputs. A multi-signal per-field confidence engine drives model-cascade escalation when a score comes back low, and schema self-heal retries catch malformed output.",
      "Extraction is validated against a 50-invoice synthetic eval set with ground truth, reporting per-field precision, recall and F1 alongside straight-through-processing accuracy. A golden-set regression test runs in CI so accuracy cannot quietly rot.",
      "A FastAPI async-job backend behind a two-pane reviewer UI: PDF viewer on one side, editable field ledger on the other. Click a citation to flash its page, select PDF text to set a field, edit anything inline, and corrections PATCH straight back to the API. Deployed on Railway and Vercel."
    ],
    features: [
      "A confidence score and page citation on every field",
      "Parse-then-LLM routing by document type",
      "Model-cascade escalation when confidence comes back low",
      "Validated against a 50-invoice ground-truth eval set",
      "Golden-set regression test in CI",
      "Two-pane reviewer UI built for human correction"
    ],
    technologies: ["Python", "FastAPI", "Claude API", "Mistral OCR", "PyMuPDF", "Pydantic"],
    thumbnail: "/thumbnails/doc-extractor.jpg",
    links: {
      visit: "https://doc-extractor-five.vercel.app",
      source: "https://github.com/Scylla23/doc-extractor"
    }
  },
  {
    title: "FeatureGate",
    slug: "featuregate",
    description: "An open-source feature flag platform with segment targeting, percentage rollouts, and a Node SDK that evaluates locally instead of calling the network.",
    longDescription: [
      "A feature flag check sits in the hot path of every request, so it cannot be a network call. FeatureGate evaluates locally and pushes changes out over SSE.",
      "Segment-based targeting on top of a rule evaluation engine that uses consistent hashing for percentage rollouts, so a user who is in the 10% stays in the 10% as the rollout grows. Flag changes propagate to connected clients over SSE in under 500ms.",
      "The Node.js SDK (packages/sdk-node in the monorepo) caches flags in memory and evaluates locally, putting a check under a millisecond and removing the per-request network call entirely. The developer experience is deliberately LaunchDarkly-compatible so migrating costs nothing.",
      "Runs on an Oracle Cloud VM behind Nginx under PM2. GitHub Actions runs lint, typecheck, build, and tests on every push; a separate deploy workflow rsyncs the release to the VM over SSH and reloads the process."
    ],
    features: [
      "Consistent hashing so percentage rollouts stay stable",
      "Flag changes propagate over SSE in under 500ms",
      "Node SDK evaluates in memory, under a millisecond",
      "LaunchDarkly-compatible developer experience",
      "Oracle Cloud VM behind Nginx, managed by PM2",
      "GitHub Actions CI plus rsync-over-SSH deploys"
    ],
    technologies: ["Node.js", "Express", "React", "MongoDB", "Redis", "Docker", "Nginx", "OCI"],
    thumbnail: "/thumbnails/featuregate.jpg",
    links: {
      // http, not https: the domain serves a *.github.io cert, so https fails to load.
      visit: "http://featuregate.online/",
      source: "https://github.com/Scylla23/featuregate"
    }
  },
  {
    title: "braible.ai",
    slug: "braible",
    description: "A no-code platform that adds AI chatbots, accessibility scanners and compliance tooling to any website through a single script tag.",
    longDescription: [
      "A no-code platform that adds AI chatbots, accessibility scanners and compliance tooling to any website through a single script tag."
    ],
    features: [],
    technologies: ["TypeScript", "React", "LLM APIs"],
    thumbnail: "/thumbnails/braible.jpg",
    links: {
      visit: "https://braible.ai"
    }
  },
  {
    title: "govhub.ai",
    slug: "govhub",
    description: "An agent-operated knowledge hub for federal AI policy, guidance and scored contract opportunities, continuously updated by autonomous agents.",
    longDescription: [
      "An agent-operated knowledge hub for federal AI policy, guidance and scored contract opportunities, continuously updated by autonomous agents."
    ],
    features: [],
    technologies: ["TypeScript", "Agent runtimes", "RAG"],
    thumbnail: "/thumbnails/govhub.jpg",
    links: {
      visit: "https://govhub.ai"
    }
  },
  {
    title: "ModelRouter",
    slug: "modelrouter",
    description: "A Claude Code plugin that picks a model per task, says why in one line, offers a one-command escalate, and learns your routing taste from your corrections.",
    longDescription: [
      "A Claude Code plugin that picks a model per task, says why in one line, offers a one-command escalate, and learns your routing taste from your corrections."
    ],
    features: [],
    technologies: ["Claude Code plugin", "Node.js", "Hooks"],
    thumbnail: "/thumbnails/modelrouter.jpg",
    links: {
      visit: "https://modelrouter-landing.vercel.app",
      source: "https://github.com/Scylla23/modelrouter"
    }
  },
  {
    title: "ModelDuet",
    slug: "modelduet",
    description: "A single skill file that pairs a planning-and-review model with an implementing model in a capped loop on an isolated branch. No server, no proxy.",
    longDescription: [
      "A single skill file that pairs a planning-and-review model with an implementing model in a capped loop on an isolated branch. No server, no proxy."
    ],
    features: [],
    technologies: ["Claude Code skill", "Codex CLI", "Git"],
    thumbnail: "/thumbnails/modelduet.jpg",
    links: {
      source: "https://github.com/Scylla23/modelduet"
    }
  }
];
