// Single source of truth for everything about Pavan.
// Facts come from resume.tex, the LinkedIn profile export, and CONTEXT.md.
// Two conflicts were resolved deliberately:
//   - Naya ended May 2026 (LinkedIn). resume.tex still says "Present" and is stale.
//   - LinkedIn vanity URL is /in/pavankushnure, not the old /in/pavan-kushnure-97274b1a3.

export const site = {
  domain: 'pavankushnure.website',
  url: 'https://pavankushnure.website',
  name: 'Pavan Kushnure',
  role: 'Lead AI Engineer',
  company: 'Bravent',
  location: 'Greater Nagpur Area, India',
  locationNote: 'Remote, across US time zones',
  email: 'pavankushnure2000@gmail.com',
  resume: '/pavan-kushnure-resume.pdf',
  githubUser: 'Scylla23',
} as const

export const socials = [
  { label: 'GitHub', href: 'https://github.com/Scylla23', handle: 'Scylla23' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/pavankushnure', handle: 'pavankushnure' },
  { label: 'X', href: 'https://x.com/pavankushnure', handle: 'pavankushnure' },
  { label: 'Instagram', href: 'https://instagram.com/pavankushnure', handle: 'pavankushnure' },
] as const

export const hero = {
  eyebrow: 'Lead AI Engineer',
  headline: 'I build AI-powered SaaS products, end to end.',
  intro:
    "I'm Pavan Kushnure, a Lead AI Engineer working remotely with US startups. Over the last 3+ years I've shipped production systems — LLM gateways and guardrails, agentic workflows, RAG pipelines, sub-100ms hybrid search, enterprise CAD integrations, and Stripe billing — owning each one from architecture to deployment.",
  proof: ['3+ years', '10 shipped products', 'Remote across US time zones'],
} as const

export const about = {
  lede:
    "I'm a full-stack engineer with a deep bench in AI. On the frontend I build React microfrontends; on the backend, Node.js, Express and Python/FastAPI on Postgres, MongoDB and GCP. Around that I've built the AI pieces teams actually rely on: policy-enforced LLM gateways, runtime guardrails, RAG document pipelines, vector search, Stripe billing, and enterprise integrations.",
  body: [
    'For nearly three years I shipped features end to end at Naya, owning everything from architecture decisions to production deployments across time zones. I now lead AI engineering at Bravent, building governed agentic systems for regulated federal environments.',
    'I like problems I can dive straight into and stay with for a long time. I work best when the deadline is real and the scope is mine to own.',
    "If you're a founder or hiring team who needs someone to own features end to end and ship them, that's the work I do best.",
  ],
} as const

export type Job = {
  role: string
  company: string
  companyUrl?: string
  start: string
  end: string
  location: string
  stack: string
  bullets: string[]
}

export const experience: Job[] = [
  {
    role: 'Lead AI Engineer',
    company: 'Bravent LLC',
    start: 'Mar 2026',
    end: 'Present',
    location: 'Chantilly, VA (remote)',
    stack: 'Python, FastAPI, TypeScript, LLMs, MCP, Docker, GitHub Actions',
    bullets: [
      'Built an LLM API gateway unifying multiple model providers behind one policy-enforced endpoint, with multi-provider routing, per-app API keys, wallet-based billing, and token and cost governance (budget alerts, prompt-cache enforcement, context-budget truncation).',
      'Engineered a runtime guardrails engine enforcing 160+ security rails — PII detection and masking, DLP, prompt-injection and token-smuggling blocks, SSRF and egress allow-listing, rate limiting — plus a document PII pre-flight that extracts, scans and masks uploads before they reach a model.',
      'Led development of a governed agentic-workflow platform: a visual agent builder, MCP-based tool integrations, and a governed runtime with subagent recursion under shared budget and depth caps, human-in-the-loop approval, and inbound triggers (webhooks, Slack, email, event polling).',
      'Built an LLM evaluation and observability stack (LLM-judge, exact-match and trajectory scorers with golden-set regression gates, OpenTelemetry tracing, SIEM event export, real-time alerting) and shipped it to production via Dockerized GitHub Actions CI/CD.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Naya Studio',
    companyUrl: 'https://naya.studio',
    start: 'Oct 2023',
    end: 'May 2026',
    location: 'Boston, MA (remote)',
    stack: 'React, Node.js, Express, MongoDB, GCP',
    bullets: [
      'Designed and built a universal search system indexing 250K+ files (images, PDFs, videos, 3D models, links), delivering 50ms keyword search via Algolia and 150–200ms semantic retrieval via MongoDB Atlas Vector Search.',
      'Architected Stripe billing pipelines with automated webhooks, tiered subscription plans and team-seat management, eliminating ~20 hours/month of manual billing overhead.',
      'Integrated Onshape and Autodesk CAD rendering via OAuth 2.0, webhooks and cloud translation APIs, enabling real-time 3D model sync and unlocking enterprise client adoption.',
      'Shipped an Onshape App Store extension enabling direct project import/export between Onshape and Naya, increasing design-team adoption by 40%.',
      'Built a multi-select interaction system for batch editing and AI-powered asset generation (image, text and 3D model generation via LLM APIs), reducing multi-asset workflow time by 50%.',
      'Re-architected the project dashboard into a drag-and-drop, card-based workspace with nested folder uploads, reducing manual asset setup time by 70%.',
    ],
  },
  {
    role: 'Intern Technologist',
    company: 'Kratin LLC',
    start: 'Jan 2023',
    end: 'Aug 2023',
    location: 'Nagpur, India',
    stack: 'ASP.NET Core, C#, SQL Server, IIS',
    bullets: [
      'Built and scaled a task management system handling 250K+ tasks, 3K users and 100GB of files, improving tracking and real-time collaboration.',
      'Optimized the top 10 high-traffic APIs by improving SQL queries and minimizing database calls, cutting average response time from 1.7s to 1.2s.',
    ],
  },
]

export const skills = [
  {
    group: 'GenAI & LLM',
    items: [
      'LLM API integration (Anthropic, OpenAI, Gemini, Groq)',
      'RAG',
      'Agentic workflows',
      'MCP',
      'Embeddings',
      'Hybrid search',
      'Reranking',
      'Prompt engineering',
      'LLM guardrails & evaluation',
      'LangChain',
      'LlamaIndex',
      'LangGraph',
    ],
  },
  {
    group: 'Frontend',
    items: ['React', 'Next.js', 'Redux', 'Recoil', 'Micro-frontends', 'Tailwind CSS'],
  },
  {
    group: 'Backend',
    items: ['Node.js', 'Express', 'FastAPI', 'REST APIs', 'WebSockets', 'Webhooks', 'gRPC', 'Pub/Sub messaging'],
  },
  {
    group: 'Databases',
    items: ['MongoDB', 'PostgreSQL', 'Redis', 'Algolia', 'Pinecone', 'Weaviate', 'Qdrant'],
  },
  {
    group: 'Cloud & DevOps',
    items: ['AWS', 'GCP', 'OCI', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Nginx'],
  },
  {
    group: 'Tools & Services',
    items: ['Git', 'Postman', 'Swagger', 'Apache JMeter', 'Stripe API', 'PM2', 'OAuth 2.0'],
  },
] as const

export const education = [
  {
    school: 'Shri Guru Gobind Singhji Institute of Engineering and Technology, Nanded',
    qualification: 'B.Tech, Computer Science and Engineering',
    detail: 'CGPA 9.02',
    period: '2019 – 2023',
  },
  {
    school: 'Jawahar Navodaya Vidyalaya, Wardha',
    qualification: 'Class XII (PCM) & Class X',
    detail: '94% & CGPA 10',
    period: '2011 – 2018',
  },
] as const

export const achievements = [
  { value: '9.02', label: 'B.Tech CGPA' },
  { value: '500+', label: 'LeetCode solved' },
  { value: '200+', label: 'Day streak' },
  { value: '300+', label: 'GFG problems' },
  { value: 'GATE', label: "Qualified '23 & '24" },
] as const

// Naya work is proprietary, so the numbers are the visual — no screenshots (DESIGN.md §5).
export const caseStudies = [
  {
    title: 'Universal search over 250K+ assets',
    metrics: [
      { value: '250K+', unit: 'Assets indexed' },
      { value: '50ms', unit: 'Keyword search' },
      { value: '150–200ms', unit: 'Semantic retrieval' },
    ],
    body: 'I designed and built a universal search system across images, PDFs, videos, 3D models and links. Keyword search runs through Algolia; semantic retrieval runs through MongoDB Atlas Vector Search on a custom embedding pipeline.',
  },
  {
    title: 'Onshape & Autodesk CAD integrations',
    metrics: [{ value: '40%', unit: 'Design-team adoption' }],
    body: 'I built enterprise CAD integrations using OAuth 2.0, webhooks and cloud translation APIs for real-time 3D model sync, then shipped an Onshape App Store extension for direct project import and export.',
  },
  {
    title: 'Stripe billing pipeline',
    metrics: [{ value: '~20 hrs', unit: 'Saved per month' }],
    body: 'I architected Stripe billing with automated webhooks, tiered subscription plans and team-seat management, which removed the manual billing overhead entirely.',
  },
  {
    title: 'Workflow automation',
    metrics: [
      { value: '70%', unit: 'Less setup time' },
      { value: '50%', unit: 'Faster multi-asset work' },
    ],
    body: 'I re-architected the project dashboard into a drag-and-drop, card-based workspace with nested folder uploads, and added a multi-select system for batch editing and AI-powered asset generation.',
  },
] as const
