import type { PortfolioItem } from "@/types";

/**
 * Portfolio content — the single source of truth for the Homepage
 * "Featured Work" section, the Portfolio Hub, and Portfolio Detail
 * pages. Supersedes the earlier src/data/featured-work.ts (now
 * removed) now that full Portfolio Detail pages exist.
 *
 * Per the Phase 3E content rule: no fabricated client names, no
 * fabricated testimonials, no invented metrics presented as fact.
 * `resultStat` and `result` describe outcomes in qualitative,
 * defensible terms rather than specific unverified numbers.
 * `testimonial` is intentionally omitted on every entry until a real,
 * attributed quote exists — replace via the Portfolio Manager (CMS
 * phase) at that time, the type already supports it.
 */
export const portfolioItems: PortfolioItem[] = [
  {
    slug: "ecommerce-platform-modernization",
    title: "E-commerce Platform Modernization",
    serviceSlugs: ["ecommerce-development", "ui-ux-design"],
    industrySlugs: ["ecommerce-retail"],
    thumbnail: "/images/portfolio/ecommerce-placeholder.jpg",
    resultStat: "Faster checkout, improved mobile conversion",
    challenge:
      "The client's existing storefront was slow on mobile and its checkout flow required too many steps, leading to drop-off before purchase completion.",
    solution:
      "We rebuilt the storefront on a modern, performance-first architecture, redesigned the checkout into a streamlined flow, and optimized product imagery and page weight for mobile networks.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    result:
      "The rebuilt storefront loads significantly faster on mobile, and the simplified checkout reduced the number of steps required to complete a purchase.",
  },
  {
    slug: "operations-workflow-automation",
    title: "Operations Workflow Automation",
    serviceSlugs: ["ai-automation", "cloud-solutions-api-integration"],
    industrySlugs: ["professional-services"],
    thumbnail: "/images/portfolio/automation-placeholder.jpg",
    resultStat: "Reduced manual data-entry hours",
    challenge:
      "The client's operations team was manually re-entering the same data across several disconnected tools every week, consuming hours that could go toward client work.",
    solution:
      "We audited the workflow, identified the highest-impact repetitive steps, and built automation that connects the client's existing tools directly — removing the manual re-entry entirely.",
    technologies: ["Node.js", "Workflow Automation", "REST APIs"],
    result:
      "The team no longer manually re-enters data between systems, freeing up meaningful time each week for higher-value work.",
  },
  {
    slug: "custom-crm-for-real-estate",
    title: "Custom CRM for a Growing Real Estate Team",
    serviceSlugs: ["erp-crm-development"],
    industrySlugs: ["real-estate"],
    thumbnail: "/images/portfolio/crm-placeholder.jpg",
    resultStat: "Centralized lead tracking across teams",
    challenge:
      "The client's agents were tracking leads across a mix of spreadsheets and personal notes, making it difficult for leadership to see pipeline status or hand off leads between agents.",
    solution:
      "We built a custom CRM tailored to the client's actual sales process — from lead intake through closing — with role-based visibility for agents and leadership.",
    technologies: ["Next.js", "PostgreSQL", "Role-Based Access Control"],
    result:
      "Leads are now tracked in one system with clear ownership and status visibility across the whole team.",
  },
];
