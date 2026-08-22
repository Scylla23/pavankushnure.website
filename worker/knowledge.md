# Pavan Kushnure — knowledge brief

## Identity

Pavankumar "Pavan" Kushnure. Full-stack AI engineer with 3+ years shipping production LLM systems.
Lives in Wardha, Maharashtra, India (IST). Works remotely with US teams.

## Current role

**Lead AI Engineer at Bravent LLC** — Virginia, USA (remote), Mar 2026 – present.
Python, FastAPI, TypeScript, LLMs, MCP, Docker, GitHub Actions.

- Built an LLM API gateway unifying multiple model providers behind one policy-enforced endpoint:
  multi-provider routing, per-app API keys, wallet-based billing, and token/cost governance
  (budget alerts, prompt-cache enforcement, context-budget truncation).
- Engineered a runtime guardrails engine enforcing 160+ security rails — PII detection and masking,
  DLP, prompt-injection and token-smuggling blocks, SSRF/egress allow-listing, rate limiting — plus a
  document PII pre-flight that extracts, scans, and masks uploads before they reach a model.
- Led development of a governed agentic-workflow platform: visual agent builder, MCP-based tool
  integrations, subagent recursion under shared budget/depth caps, human-in-the-loop approval,
  and inbound triggers (webhooks, Slack, email, event polling).
- Built an LLM evaluation and observability stack — LLM-judge / exact-match / trajectory scorers,
  golden-set regression gates, OpenTelemetry tracing, SIEM export, real-time alerting — shipped via
  Dockerized GitHub Actions CI/CD.

## Past roles

- **Naya Studio**, New York, USA (remote) — Software Engineer, Oct 2023 – May 2026.
  React, Node.js, Express, MongoDB, GCP. Universal search over 250K+ files (50 ms keyword via Algolia,
  ~150–200 ms semantic via MongoDB Atlas Vector Search); Stripe billing pipelines with tiered plans and
  team seats; Onshape/Autodesk CAD integrations over OAuth 2.0; an Onshape App Store extension;
  AI-powered multi-select asset generation; drag-and-drop dashboard re-architecture.
- **Kratin LLC**, Nagpur, India — Intern Technologist, Jan 2023 – Aug 2023.
  ASP.NET Core, C#, SQL Server. Task management system handling 250K+ tasks, 3K users, 100 GB of files;
  cut average response time of the top 10 APIs from 1.7 s to 1.2 s.

## Education

- B.Tech in Computer Science and Engineering, Shri Guru Gobind Singhji Institute of Engineering and
  Technology (SGGS), Nanded — June 2023, CGPA 9.02.
- Jawahar Navodaya Vidyalaya Wardha, Class XII (PCM) 94% and Class X CGPA 10, 2011–2018.

## Skills by theme

- **GenAI & LLM**: provider integrations (Anthropic, OpenAI, Gemini, Groq), RAG, agentic workflows,
  MCP (Model Context Protocol), embeddings, hybrid search, reranking, prompt engineering, LLM
  guardrails and evaluation, LangChain, LlamaIndex, LangGraph.
- **Frontend**: React.js, Next.js, Redux, Recoil, micro-frontends.
- **Backend**: Node.js, Express.js, FastAPI, REST APIs, WebSockets, webhooks, pub/sub messaging.
- **Databases**: MongoDB, PostgreSQL, Algolia, vector databases (Pinecone, Weaviate, Qdrant).
- **Cloud & DevOps**: AWS, GCP, Docker, Kubernetes, Terraform, Nginx, CI/CD.
- **Also**: Git, Postman, Swagger, Apache JMeter, Zapier, Stripe API, PM2.

## Notable projects

- **GovEngine** (govengine.ai) — governed agent platform: plain-English requests become inspectable,
  approvable agent graphs executed deterministically; 300-template catalog, AWS/Azure/GCP VM cost
  monitoring, MCPOne-guarded mode with human approval for side effects.
- **MCPOne** (mcpone.ai) — policy-enforced runtime screening every AI request before it reaches a
  model, over REST/gRPC/MCP, with an append-only hash-chained audit ledger; maps a 1,248-rule catalog
  to real enforcement mechanisms and re-tests live guardrails hourly; assessed Awardable by Tradewinds.
- **ProposalIQ** (proposaliq.govcom.ai) — RAG for US federal proposals: dense + sparse retrieval fused
  by Reciprocal Rank Fusion so exact clause numbers are not missed; three LLM providers behind one
  accounted layer; agentic SAM.gov opportunity sourcing; cited drafting with collaborative DOCX editing.

Also live: Doc Extractor (invoice PDFs to validated JSON with per-field confidence),
FeatureGate (open-source feature flags), braible.ai, govhub.ai.

## How he works

Remote-first; has worked with US teams in Virginia and New York across time zones from IST.
Available for freelance work.

## Contact

Email pavankushnure2000@gmail.com · GitHub github.com/Scylla23 ·
LinkedIn linkedin.com/in/pavankushnure · X x.com/pavankushnure · Website pavankushnure.website
