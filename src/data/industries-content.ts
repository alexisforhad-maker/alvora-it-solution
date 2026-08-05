import type { IndustryDetail } from "@/types";

/**
 * Full content for every Industry Detail page, keyed by slug —
 * mirrors the pattern established in services-content.ts. Challenges
 * are described as general, defensible industry patterns (not claims
 * about specific clients), per the content-authenticity rule.
 */
export const industriesContent: Record<string, IndustryDetail> = {
  "ecommerce-retail": {
    slug: "ecommerce-retail",
    name: "E-commerce & Retail",
    relevanceStatement: "Storefronts and back-office systems built to handle real sales volume.",
    icon: "ecommerce-retail",
    challenges: [
      { title: "Slow, dated storefronts", description: "Legacy platforms often can't keep pace with modern performance and UX expectations." },
      { title: "Disconnected inventory", description: "Sales, inventory, and fulfillment systems that don't talk to each other create manual reconciliation work." },
      { title: "Checkout friction", description: "Complicated checkout flows quietly cost conversions that are hard to notice without close analysis." },
    ],
    relatedServiceSlugs: ["ecommerce-development", "ui-ux-design", "ai-automation"],
  },
  healthcare: {
    slug: "healthcare",
    name: "Healthcare",
    relevanceStatement: "Secure, compliant systems for patient-facing and clinical operations.",
    icon: "healthcare",
    challenges: [
      { title: "Data security requirements", description: "Patient and clinical data demand a higher security and access-control bar than typical business software." },
      { title: "Fragmented systems", description: "Scheduling, records, and billing often live in separate systems that don't share data cleanly." },
      { title: "Patient-facing usability", description: "Portals and apps need to be usable by a wide range of patients, not just tech-comfortable staff." },
    ],
    relatedServiceSlugs: ["custom-software-development", "cloud-solutions-api-integration", "maintenance-technical-support"],
  },
  "real-estate": {
    slug: "real-estate",
    name: "Real Estate",
    relevanceStatement: "Listings platforms and CRM tools built for property teams.",
    icon: "real-estate",
    challenges: [
      { title: "Lead tracking across agents", description: "Without a shared system, leads get tracked inconsistently across spreadsheets and personal notes." },
      { title: "Listings management", description: "Keeping listing data accurate and current across a website and third-party portals takes real coordination." },
      { title: "Client communication", description: "Buyers and sellers expect timely updates, which is hard to sustain manually at scale." },
    ],
    relatedServiceSlugs: ["erp-crm-development", "website-design-development", "ai-automation"],
  },
  "logistics-supply-chain": {
    slug: "logistics-supply-chain",
    name: "Logistics & Supply Chain",
    relevanceStatement: "Visibility and automation across complex supply chains.",
    icon: "logistics-supply-chain",
    challenges: [
      { title: "Limited shipment visibility", description: "Without integrated systems, tracking a shipment's status often means checking multiple tools manually." },
      { title: "Manual coordination", description: "Coordinating between suppliers, warehouses, and carriers by phone or email doesn't scale." },
      { title: "Data silos", description: "Inventory, orders, and fulfillment data living in separate systems makes reporting unreliable." },
    ],
    relatedServiceSlugs: ["cloud-solutions-api-integration", "ai-automation", "custom-software-development"],
  },
  education: {
    slug: "education",
    name: "Education",
    relevanceStatement: "Learning platforms and administrative systems for modern institutions.",
    icon: "education",
    challenges: [
      { title: "Outdated administrative tools", description: "Many institutions rely on aging systems that weren't built for how students and staff work today." },
      { title: "Disconnected learning tools", description: "Course content, grading, and communication often live in separate, poorly integrated platforms." },
      { title: "Accessibility requirements", description: "Educational platforms need to be usable by a genuinely diverse range of learners." },
    ],
    relatedServiceSlugs: ["custom-software-development", "ui-ux-design", "it-consulting-digital-transformation"],
  },
  "finance-fintech": {
    slug: "finance-fintech",
    name: "Finance & FinTech",
    relevanceStatement: "Secure, reliable systems for regulated financial operations.",
    icon: "finance-fintech",
    challenges: [
      { title: "Regulatory and security demands", description: "Financial systems carry a higher bar for security, auditability, and reliability than most software." },
      { title: "Legacy infrastructure", description: "Older financial systems are often difficult and risky to modernize incrementally." },
      { title: "Integration complexity", description: "Connecting to banking rails, payment processors, and compliance tools takes careful engineering." },
    ],
    relatedServiceSlugs: ["cloud-solutions-api-integration", "custom-software-development", "maintenance-technical-support"],
  },
  "travel-hospitality": {
    slug: "travel-hospitality",
    name: "Travel & Hospitality",
    relevanceStatement: "Booking and guest-experience platforms that scale with demand.",
    icon: "travel-hospitality",
    challenges: [
      { title: "Seasonal demand spikes", description: "Booking systems need to stay fast and reliable during peak periods, not just average traffic." },
      { title: "Multi-channel booking", description: "Guests expect a consistent experience whether booking via website, app, or third-party platforms." },
      { title: "Guest communication", description: "Manual coordination for confirmations, changes, and support doesn't scale with growth." },
    ],
    relatedServiceSlugs: ["mobile-app-development", "website-design-development", "cloud-solutions-api-integration"],
  },
  manufacturing: {
    slug: "manufacturing",
    name: "Manufacturing",
    relevanceStatement: "Operational software that connects the floor to the front office.",
    icon: "manufacturing",
    challenges: [
      { title: "Disconnected floor and office systems", description: "Production data often doesn't reach the systems planning and sales rely on in real time." },
      { title: "Manual reporting", description: "Compiling production and inventory reports manually is slow and error-prone." },
      { title: "Legacy ERP constraints", description: "Older ERP systems can be rigid and expensive to extend as operations evolve." },
    ],
    relatedServiceSlugs: ["erp-crm-development", "cloud-solutions-api-integration", "ai-automation"],
  },
  "professional-services": {
    slug: "professional-services",
    name: "Professional Services",
    relevanceStatement: "Client and project management systems built around your workflow.",
    icon: "professional-services",
    challenges: [
      { title: "Inconsistent project tracking", description: "Without a shared system, project status and client communication can vary widely by team member." },
      { title: "Manual time and billing", description: "Tracking billable time and generating invoices manually takes time away from client work." },
      { title: "Client-facing visibility", description: "Clients increasingly expect visibility into project status, not just periodic updates." },
    ],
    relatedServiceSlugs: ["erp-crm-development", "ai-automation", "it-consulting-digital-transformation"],
  },
};
