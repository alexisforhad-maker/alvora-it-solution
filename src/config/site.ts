/**
 * Site-wide configuration for Alvora IT Solution.
 *
 * This file is the single source of truth for content that appears in
 * multiple places (navigation, footer, contact page, structured data).
 * Components should import from here rather than hardcoding strings,
 * so business-level changes (e.g. a new service, a phone number update)
 * happen in one place.
 *
 * Content that is genuinely dynamic (blog posts, portfolio items, team
 * members) lives in the database via Prisma, introduced in a later
 * phase — this file is for structural/static configuration only.
 */

export const siteConfig = {
  name: "Alvora IT Solution",
  shortName: "Alvora",
  domain: "alvoraitsolution.com",
  url: "https://alvoraitsolution.com",
  tagline: "Engineering Trust. Delivering Growth.",
  description:
    "Alvora IT Solution is a premium international IT solutions company based in Bangladesh, delivering custom software, web, mobile, and automation solutions for startups, SMEs, and growing enterprises across the USA, Canada, UK, Europe, Australia, and the Middle East.",
  locale: "en-US",
  themeColor: "#0B3A56",
} as const;

export const contactConfig = {
  email: "hello@alvoraitsolution.com",
  phone: "+880 1997-755006",
  // No separate WhatsApp Business number was provided — using the
  // primary phone number for both until a dedicated one is supplied.
  whatsapp: "+880 1997-755006",
  address: {
    line1: "Uttarkhan, Uttara",
    city: "Dhaka",
    country: "Bangladesh",
  },
  // Response-time expectations shown on the Contact page, per region,
  // supporting the "clear business hours across time zones" requirement.
  businessHours: [
    { region: "USA & Canada", hours: "Overlap window: 8:00 PM – 12:00 AM BDT", responseTime: "Within 1 business day" },
    { region: "UK & Europe", hours: "Overlap window: 1:00 PM – 6:00 PM BDT", responseTime: "Within 1 business day" },
    { region: "Australia", hours: "Overlap window: 9:00 AM – 1:00 PM BDT", responseTime: "Within 1 business day" },
    { region: "Middle East", hours: "Overlap window: 11:00 AM – 5:00 PM BDT", responseTime: "Same business day" },
    { region: "Bangladesh (HQ)", hours: "Sunday–Thursday, 9:00 AM – 6:00 PM BDT", responseTime: "Same business day" },
  ],
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const services = [
  { slug: "custom-software-development", name: "Custom Software Development" },
  { slug: "website-design-development", name: "Website Design & Development" },
  { slug: "ecommerce-development", name: "E-commerce Development" },
  { slug: "mobile-app-development", name: "Mobile App Development" },
  { slug: "ui-ux-design", name: "UI/UX Design" },
  { slug: "ai-automation", name: "AI Automation & Business Process Automation" },
  { slug: "cloud-solutions-api-integration", name: "Cloud Solutions & API Integration" },
  { slug: "erp-crm-development", name: "ERP & CRM System Development" },
  { slug: "it-consulting-digital-transformation", name: "IT Consulting & Digital Transformation" },
  { slug: "maintenance-technical-support", name: "Maintenance & Technical Support" },
] as const;

export const industries = [
  { slug: "ecommerce-retail", name: "E-commerce & Retail" },
  { slug: "healthcare", name: "Healthcare" },
  { slug: "real-estate", name: "Real Estate" },
  { slug: "logistics-supply-chain", name: "Logistics & Supply Chain" },
  { slug: "education", name: "Education" },
  { slug: "finance-fintech", name: "Finance & FinTech" },
  { slug: "travel-hospitality", name: "Travel & Hospitality" },
  { slug: "manufacturing", name: "Manufacturing" },
  { slug: "professional-services", name: "Professional Services" },
] as const;

export const engagementModels = [
  {
    name: "Fixed-Price Projects",
    description: "For clearly defined scopes with milestone-based delivery.",
  },
  {
    name: "Dedicated Development Team",
    description: "A team built around your project for long-term collaboration.",
  },
  {
    name: "Monthly Retainer",
    description: "Ongoing maintenance, support, and continuous development.",
  },
] as const;

export const processSteps = [
  { step: 1, name: "Discovery Call", description: "We learn about your business, goals, and constraints." },
  { step: 2, name: "Requirement Analysis", description: "We turn your goals into clear, documented requirements." },
  { step: 3, name: "Solution Proposal & Estimation", description: "You receive a scoped proposal with transparent estimation." },
  { step: 4, name: "Timeline & Milestone Planning", description: "We agree on a realistic delivery timeline together." },
  { step: 5, name: "Development & Progress Updates", description: "Work begins, with regular, structured progress updates." },
  { step: 6, name: "Quality Assurance & Testing", description: "Every deliverable is tested against the agreed requirements." },
  { step: 7, name: "Deployment & Launch", description: "We deploy to production with a clear go-live plan." },
  { step: 8, name: "Ongoing Maintenance & Support", description: "We stay on as your long-term technology partner." },
] as const;

export const primaryNav: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({
      label: s.name,
      href: `/services/${s.slug}`,
    })),
  },
  {
    label: "Industries",
    href: "/industries",
    children: industries.map((i) => ({
      label: i.name,
      href: `/industries/${i.slug}`,
    })),
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const footerNav = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Industries", href: "/industries" },
    { label: "Blog", href: "/blog" },
    { label: "Process", href: "/process" },
    { label: "Technologies", href: "/technologies" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};
