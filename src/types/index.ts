/**
 * Shared domain types for Alvora IT Solution.
 *
 * These describe the content shapes the frontend renders. Once Prisma
 * models are introduced (CMS/Admin phase), these types should be
 * derived from `@prisma/client` generated types instead of hand-kept
 * in sync — this file is the interim contract so component work in
 * Phase 3B/3C isn't blocked on the database schema.
 */

export type ServiceSummary = {
  slug: string;
  name: string;
  shortDescription: string;
  icon: string;
};

export type ServiceDetail = ServiceSummary & {
  problem: string;
  solutionOverview: string;
  included: string[];
  benefits: string[];
  approach: { title: string; description: string }[];
  technologies: string[];
  relatedServiceSlugs: string[];
  relatedIndustrySlugs: string[];
  faqs: { question: string; answer: string }[];
};

export type IndustrySummary = {
  slug: string;
  name: string;
  relevanceStatement: string;
  icon: string;
};

export type IndustryDetail = IndustrySummary & {
  challenges: { title: string; description: string }[];
  relatedServiceSlugs: string[];
};

export type PortfolioItem = {
  slug: string;
  title: string;
  serviceSlugs: string[];
  industrySlugs: string[];
  thumbnail: string;
  resultStat?: string;
  challenge: string;
  solution: string;
  technologies: string[];
  result: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  shortBio: string;
  extendedBio?: string;
  linkedIn?: string;
  email?: string;
  order: number;
};

export type BlogPost = {
  slug: string;
  title: string;
  category: "technology-trends" | "business-automation" | "case-studies" | "company-news";
  status: "Draft" | "Published";
  excerpt: string;
  /** Paragraph-per-entry body content, rendered as <p> tags — avoids raw-HTML injection risk while staying simple for a future rich-text CMS export. */
  content: string[];
  heroImage: string;
  authorId: string;
  publishedAt: string;
  readingTimeMinutes: number;
  relatedServiceSlug?: string;
};

export type QuoteRequestFormData = {
  serviceSlugs: string[];
  projectDescription: string;
  timelineExpectation?: string;
  budgetRange?: string;
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  preferredContactMethod: "email" | "phone" | "whatsapp";
  timeZone: string;
};

export type ContactFormData = {
  fullName: string;
  email: string;
  message: string;
};

export type CareerInterestFormData = {
  fullName: string;
  email: string;
  areaOfExpertise: string;
  resumeUrl?: string;
  message?: string;
};
