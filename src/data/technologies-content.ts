import { Code2, Server, Smartphone, Cloud, Database, Bot, type LucideIcon } from "lucide-react";

export type TechGroup = {
  category: string;
  icon: LucideIcon;
  items: string[];
  /** Why this category matters, in business terms — not framework marketing. Used on the full Technologies page. */
  valueStatement: string;
};

/**
 * Technology categories — single source of truth for the Homepage
 * Technologies section and the full /technologies page. Icons
 * represent categories rather than reproducing individual product
 * logos/trademarks, per Design System §7.
 */
export const techGroups: TechGroup[] = [
  {
    category: "Frontend",
    icon: Code2,
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    valueStatement:
      "Fast, accessible interfaces that load quickly and stay maintainable as your product grows.",
  },
  {
    category: "Backend",
    icon: Server,
    items: ["Node.js", "NestJS", "REST & GraphQL APIs"],
    valueStatement:
      "Reliable, well-structured APIs that can handle real traffic and evolve without breaking.",
  },
  {
    category: "Mobile",
    icon: Smartphone,
    items: ["React Native", "Flutter", "Swift", "Kotlin"],
    valueStatement:
      "The right platform approach for your goals — native performance or cross-platform speed.",
  },
  {
    category: "Cloud & DevOps",
    icon: Cloud,
    items: ["AWS", "Vercel", "Docker", "CI/CD Pipelines"],
    valueStatement:
      "Infrastructure that scales with demand and deploys safely, without manual guesswork.",
  },
  {
    category: "Databases",
    icon: Database,
    items: ["PostgreSQL", "MongoDB", "Redis"],
    valueStatement:
      "Data storage chosen for your actual access patterns, not a one-size-fits-all default.",
  },
  {
    category: "AI & Automation",
    icon: Bot,
    items: ["OpenAI API", "Workflow Automation", "Custom ML Pipelines"],
    valueStatement:
      "Practical automation that removes repetitive work, with human oversight where it matters.",
  },
];
