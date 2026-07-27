export type Project = {
  slug: string
  name: string
  tagline: string
  context: 'Bravent' | 'Open source'
  description: string
  tech: string[]
  links: { live?: string; repo?: string }
  featured?: boolean
  /** Present only where there is enough substance for a page of its own. */
  detail?: {
    intro: string
    sections: { heading: string; body: string }[]
  }
}

export const projects: Project[] = [
  {
    slug: 'mcpone',
    name: 'MCPOne',
    tagline: 'LLM governance runtime for regulated federal workloads',
    context: 'Bravent',
    description:
      'A policy-enforced runtime that screens every AI request before it reaches a model, over REST, gRPC and MCP, with an append-only audit trail.',
    tech: ['TypeScript', 'Next.js', 'PostgreSQL', 'Drizzle', 'gRPC', 'MCP', 'Stripe'],
    links: { live: 'https://mcpone.ai' },
    featured: true,
    detail: {
      intro:
        'Regulated environments cannot send a prompt to a model and hope for the best. MCPOne sits between the application and the provider, screening every request against policy, and keeping a record that survives an audit.',
      sections: [
        {
          heading: 'Every request is screened before it reaches a model',
          body: 'Requests arrive over REST, gRPC or MCP and pass through inline PII redaction plus prompt-injection and content-safety scans. Everything that happens is written to an append-only, hash-chained audit ledger in PostgreSQL, so a tampered record breaks the chain.',
        },
        {
          heading: 'A rule catalog mapped to mechanisms that actually run',
          body: 'I designed a guardrail enforcement engine that maps a 1,248-rule catalog onto real runtime mechanisms: 36 gateway gates, 42 per-request runtime gates, and 192 infrastructure attestations. An autonomous cron agent adversarially re-tests the live production guardrails every hour across six harm categories, so drift shows up as a failure rather than a surprise.',
        },
        {
          heading: 'A five-tier router so cost never blocks a request',
          body: 'The multi-tenant SaaS streams over SSE through a five-tier LLM router: bring-your-own-key, then credits, then local Gemma via Ollama, then managed Gemini, then a canned fallback. Auth via next-auth, metered billing via Stripe.',
        },
        {
          heading: 'Shipped through a gated pipeline',
          body: 'Deployed via GitHub Actions CI — build, typecheck, test, Trivy scan — with Drizzle migrations and PM2 reloads. MCPOne was assessed as Awardable by Tradewinds.',
        },
      ],
    },
  },
  {
    slug: 'proposaliq',
    name: 'ProposalIQ',
    tagline: 'Federal proposal intelligence, built on hybrid retrieval',
    context: 'Bravent',
    description:
      'RAG over federal solicitations that retrieves on meaning and exact identifiers at once, then drafts with every claim cited.',
    tech: ['TypeScript', 'Python', 'Qdrant', 'Redis', 'Socket.IO', 'Docker', 'OCI'],
    links: { live: 'https://proposaliq.govcom.ai' },
    featured: true,
    detail: {
      intro:
        'Federal solicitations turn on exact identifiers — clause numbers, CLINs, section references. Pure semantic search kept missing them, which is the reason this system is hybrid rather than dense-only.',
      sections: [
        {
          heading: 'Dense and sparse retrieval, fused',
          body: 'A production RAG pipeline over Qdrant fuses dense embeddings (text-embedding-3-large, 3072 dimensions) with BM25 sparse retrieval using Reciprocal Rank Fusion at k=60. I chose hybrid after watching semantic search repeatedly miss the exact identifiers the documents hinge on.',
        },
        {
          heading: 'Three providers behind one accounted layer',
          body: 'Claude, GPT-4o and Gemini sit behind a unified layer with per-model token and cost accounting. Opportunity sourcing is agentic: SAM.gov via MCP tools driven by a Claude tool-use loop, alongside the HigherGov REST feed.',
        },
        {
          heading: 'Model choices decided by measurement',
          body: 'I built an evaluation subsystem for A/B model judgments and weighted rubric scoring across writing quality, completeness and accuracy, surfacing win-rate and tie analytics. Prompt and model changes get compared on results instead of intuition.',
        },
        {
          heading: 'The whole platform, end to end',
          body: 'React SPA, an Express API with 162 endpoints across 33 data models, and a Python retrieval service. SSE-streamed drafting, real-time collaborative DOCX editing over Socket.IO, 442 automated tests, and CI/CD to Oracle Cloud through GitHub Actions, pm2, Nginx and a Dockerized OnlyOffice.',
        },
      ],
    },
  },
  {
    slug: 'doc-extractor',
    name: 'Doc Extractor',
    tagline: 'Invoice PDFs to validated JSON, with a confidence score on every field',
    context: 'Open source',
    description:
      'Turns messy invoice PDFs into clean JSON where each field carries its own confidence score and a citation back to the page it came from.',
    tech: ['Python', 'FastAPI', 'Claude API', 'Mistral OCR', 'PyMuPDF', 'Pydantic'],
    links: {
      live: 'https://doc-extractor-five.vercel.app',
      repo: 'https://github.com/Scylla23/doc-extractor',
    },
    featured: true,
    detail: {
      intro:
        'Finance teams still retype invoices into spreadsheets by hand. This does it in about 30 seconds, and — the part that matters — tells you when not to trust it.',
      sections: [
        {
          heading: 'The confidence flag is the feature',
          body: 'Every extracted field carries a confidence score and a source citation pointing at the page it came from. In the demo it pulls vendor, invoice number, dates, totals and every line item at full confidence, then flags the currency at 67% because it had to infer USD from a dollar sign. You auto-approve the confident majority and only look at the rest.',
        },
        {
          heading: 'Route by document, not by default',
          body: 'Hybrid parse-then-LLM routing sends born-digital PDFs through PyMuPDF and scans through Mistral OCR, then into Claude structured outputs. A multi-signal per-field confidence engine drives model-cascade escalation when a score comes back low, and schema self-heal retries catch malformed output.',
        },
        {
          heading: 'Measured, not assumed',
          body: 'Extraction is validated against a 50-invoice synthetic eval set with ground truth, reporting per-field precision, recall and F1 alongside straight-through-processing accuracy. A golden-set regression test runs in CI so accuracy cannot quietly rot.',
        },
        {
          heading: 'Built to be reviewed by a human',
          body: 'A FastAPI async-job backend behind a two-pane reviewer UI: PDF viewer on one side, editable field ledger on the other. Click a citation to flash its page, select PDF text to set a field, edit anything inline, and corrections PATCH straight back to the API. Deployed on Railway and Vercel.',
        },
      ],
    },
  },
  {
    slug: 'featuregate',
    name: 'FeatureGate',
    tagline: 'Self-hosted feature flags with a sub-millisecond SDK',
    context: 'Open source',
    description:
      'An open-source feature flag platform with segment targeting, percentage rollouts, and a Node SDK that evaluates locally instead of calling the network.',
    tech: ['Node.js', 'Express', 'React', 'MongoDB', 'Redis', 'Docker', 'Terraform', 'GCP'],
    links: {
      live: 'https://featuregate.online',
      repo: 'https://github.com/Scylla23/featuregate',
    },
    featured: true,
    detail: {
      intro:
        'A feature flag check sits in the hot path of every request, so it cannot be a network call. FeatureGate evaluates locally and pushes changes out over SSE.',
      sections: [
        {
          heading: 'Rules that roll out predictably',
          body: 'Segment-based targeting on top of a rule evaluation engine that uses consistent hashing for percentage rollouts, so a user who is in the 10% stays in the 10% as the rollout grows. Flag changes propagate to connected clients over SSE in under 500ms.',
        },
        {
          heading: 'An SDK that does not call the network',
          body: 'The Node.js SDK on npm caches flags in memory and evaluates locally, putting a check under a millisecond and removing the per-request network call entirely. The developer experience is deliberately LaunchDarkly-compatible so migrating costs nothing.',
        },
        {
          heading: 'Infrastructure as part of the project',
          body: 'Multi-stage Docker builds deployed to GCP Cloud Run through a four-stage GitHub Actions pipeline — lint, test, build, deploy — against Terraform-provisioned infrastructure including Memorystore for Redis and Cloud Run auto-scaling.',
        },
      ],
    },
  },
  {
    slug: 'govengine',
    name: 'GovEngine',
    tagline: 'Plain English in, an approved agent out',
    context: 'Bravent',
    description:
      'A federal agentic-AI platform that turns a plain-English request into a deterministic agent, running once or on a schedule, behind a draft-and-approve flow.',
    tech: ['TypeScript', 'Agent orchestration', 'OCI', 'Nginx', 'GitHub Actions'],
    links: { live: 'https://govengine.ai' },
  },
  {
    name: 'braible.ai',
    slug: 'braible',
    tagline: 'AI chat and compliance for any site, in one script tag',
    context: 'Bravent',
    description:
      'A no-code platform that adds AI chatbots, accessibility scanners and compliance tooling to any website through a single script tag.',
    tech: ['TypeScript', 'React', 'LLM APIs'],
    links: { live: 'https://braible.ai' },
  },
  {
    slug: 'govhub',
    name: 'govhub.ai',
    tagline: 'A federal AI knowledge commons, kept current by agents',
    context: 'Bravent',
    description:
      'An agent-operated knowledge hub for federal AI policy, guidance and scored contract opportunities, continuously updated by autonomous agents.',
    tech: ['TypeScript', 'Agent runtimes', 'RAG'],
    links: { live: 'https://govhub.ai' },
  },
  {
    slug: 'docsyntra',
    name: 'docsyntra',
    tagline: 'Legacy documents to structured DITA XML',
    context: 'Bravent',
    description:
      'Converts legacy PDFs, Word and HTML into structured DITA XML for federal agencies, so decades of documentation becomes machine-readable.',
    tech: ['Python', 'Document AI', 'DITA XML'],
    links: {},
  },
  {
    slug: 'modelrouter',
    name: 'ModelRouter',
    tagline: 'Route each task to the cheapest model that can handle it',
    context: 'Open source',
    description:
      'A Claude Code plugin that picks a model per task, says why in one line, offers a one-command escalate, and learns your routing taste from your corrections.',
    tech: ['Claude Code plugin', 'Node.js', 'Hooks'],
    links: {
      live: 'https://modelrouter-landing.vercel.app',
      repo: 'https://github.com/Scylla23/modelrouter',
    },
  },
  {
    slug: 'modelduet',
    name: 'ModelDuet',
    tagline: 'Two models, one build loop',
    context: 'Open source',
    description:
      'A single skill file that pairs a planning-and-review model with an implementing model in a capped loop on an isolated branch. No server, no proxy.',
    tech: ['Claude Code skill', 'Codex CLI', 'Git'],
    links: { repo: 'https://github.com/Scylla23/modelduet' },
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const detailedProjects = projects.filter((p) => p.detail)
export const braventProjects = projects.filter((p) => p.context === 'Bravent')
export const openSourceProjects = projects.filter((p) => p.context === 'Open source')

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
