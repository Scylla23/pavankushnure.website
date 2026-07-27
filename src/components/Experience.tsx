'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

const experiences = [
  {
    company: "Bravent LLC",
    role: "Lead AI Engineer",
    period: "Mar 2026 - Present",
    location: "Virginia, USA (Remote)",
    description: [
      "Built an LLM API gateway unifying multiple model providers behind one policy-enforced endpoint, with multi-provider routing, per-app API keys, wallet-based billing, and token/cost governance.",
      "Engineered a runtime guardrails engine enforcing 160+ security rails — PII detection and masking, DLP, prompt-injection and token-smuggling blocks, SSRF/egress allow-listing, rate limiting — plus a document PII pre-flight.",
      "Led a governed agentic-workflow platform: visual agent builder, MCP tool integrations, subagent recursion under shared budget/depth caps, human-in-the-loop approval, inbound triggers.",
      "Built an LLM evaluation and observability stack — LLM-judge, exact-match and trajectory scorers, golden-set regression gates, OpenTelemetry, SIEM export."
    ],
    technologies: ["Python", "FastAPI", "TypeScript", "LLMs", "MCP", "Docker", "GitHub Actions"]
  },
  {
    company: "Naya Studio",
    role: "Software Engineer",
    period: "Oct 2023 - May 2026",
    location: "New York, USA (Remote)",
    companyUrl: "https://naya.studio",
    description: [
      "Built universal search over 250K+ files — 50ms keyword via Algolia, 150–200ms semantic via MongoDB Atlas Vector Search.",
      "Shipped Stripe billing pipelines with webhooks, tiered plans and team seats, eliminating ~20 hours/month of manual overhead.",
      "Integrated Onshape and Autodesk CAD via OAuth 2.0, webhooks and cloud translation APIs.",
      "Published an Onshape App Store extension that lifted design-team adoption by 40%.",
      "Added multi-select batch editing and AI asset generation, making those workflows 50% faster.",
      "Built a drag-and-drop dashboard with nested folder uploads, cutting setup time by 70%."
    ],
    technologies: ["React", "Node.js", "Express", "MongoDB", "GCP"]
  },
  {
    company: "Kratin LLC",
    role: "Intern Technologist",
    period: "Jan 2023 - Aug 2023",
    location: "Nagpur, India",
    description: [
      "Built a task management system running at 250K+ tasks, 3K users and 100GB of files.",
      "Optimised the top 10 high-traffic APIs, bringing average response from 1.7s down to 1.2s."
    ],
    technologies: ["ASP.NET Core", "C#", "SQL Server", "IIS"]
  }
];

export default function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="mb-16">
      <h2 id="experience-heading" className="text-lg font-bold mb-6 text-black dark:text-white flex items-center gap-2">
        Experience <span className="text-zinc-400 font-normal">#</span>
      </h2>

      <div className="space-y-4">
        {experiences.map((exp, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              className={`group rounded-lg border transition-colors duration-200 ${isExpanded
                ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50'
                : 'border-transparent hover:border-zinc-100 dark:hover:border-zinc-800'
                }`}
            >
              <Button
                variant="ghost"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="w-full h-auto flex flex-col sm:flex-row sm:items-baseline justify-between p-4 text-left cursor-pointer hover:bg-transparent"
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 transform transition-transform duration-200" style={{ rotate: isExpanded ? "90deg" : "0deg" }}>
                    <ChevronDown size={16} />
                  </span>
                  <h3 className="text-base sm:text-base text-sm font-semibold text-zinc-900 dark:text-zinc-100 whitespace-normal break-words ">
                    {exp.role} <span className="text-zinc-500 font-normal">at</span> {exp.company}
                  </h3>
                </div>
                <span className="text-sm text-zinc-500 font-mono mt-1 sm:mt-0 pl-6 sm:pl-0">{exp.period}</span>
              </Button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pl-10">
                      <p className="text-sm text-zinc-500 font-mono mb-3">{exp.location}</p>

                      <ul className="list-disc space-y-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed marker:text-zinc-300 dark:marker:text-zinc-700 mb-4">
                        {exp.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        {exp.companyUrl && (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors"
                          >
                            Visit {exp.company} <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
