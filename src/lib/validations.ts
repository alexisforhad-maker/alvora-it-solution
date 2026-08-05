import { z } from "zod";

/**
 * Shared form validation schemas — used by both the client-side forms
 * (via @hookform/resolvers/zod) and, in a later phase, the API routes
 * that receive these submissions server-side. Keeping schemas here
 * (rather than duplicating rules in each form) means client and server
 * validation can never drift apart.
 */

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(10, "Tell us a little more (at least 10 characters)."),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const quoteRequestSchema = z.object({
  serviceSlugs: z.array(z.string()).min(1, "Select at least one service."),
  projectDescription: z.string().min(20, "Please describe your project in a bit more detail."),
  timelineExpectation: z.string().optional(),
  budgetRange: z.string().optional(),
  fullName: z.string().min(2, "Enter your full name."),
  company: z.string().optional(),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp"]),
  timeZone: z.string().min(1, "Let us know your time zone."),
});
export type QuoteRequestValues = z.infer<typeof quoteRequestSchema>;

export const careerInterestSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  areaOfExpertise: z.string().min(2, "Tell us your area of expertise."),
  message: z.string().optional(),
});
export type CareerInterestValues = z.infer<typeof careerInterestSchema>;

// ============================================================================
// Admin / CMS schemas — used by the API routes under src/app/api/
// (Blog, Portfolio, Services, Industries, Team, Careers, Settings, SEO).
// Centralized here so client-side admin forms (when wired to these
// routes) and the routes themselves validate against the same rules.
// ============================================================================

export const serviceUpdateSchema = z.object({
  shortDescription: z.string().min(1),
  problem: z.string().min(1),
  solutionOverview: z.string().min(1),
  included: z.array(z.string()),
  benefits: z.array(z.string()),
  approach: z.array(z.object({ title: z.string(), description: z.string() })),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  technologyIds: z.array(z.string()).optional(),
});
export type ServiceUpdateValues = z.infer<typeof serviceUpdateSchema>;

export const industryUpdateSchema = z.object({
  relevanceStatement: z.string().min(1),
  challenges: z.array(z.object({ title: z.string(), description: z.string() })),
});
export type IndustryUpdateValues = z.infer<typeof industryUpdateSchema>;

export const portfolioItemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  thumbnail: z.string().min(1),
  resultStat: z.string().optional(),
  challenge: z.string().min(1),
  solution: z.string().min(1),
  result: z.string().min(1),
  serviceIds: z.array(z.string()),
  industryIds: z.array(z.string()),
  technologyIds: z.array(z.string()).optional(),
  testimonialQuote: z.string().optional(),
  testimonialAuthor: z.string().optional(),
  testimonialRole: z.string().optional(),
  testimonialCompany: z.string().optional(),
});
export type PortfolioItemValues = z.infer<typeof portfolioItemSchema>;

export const blogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  excerpt: z.string().min(1),
  content: z.array(z.string()).min(1),
  heroImage: z.string().min(1),
  categoryId: z.string().min(1),
  readingTimeMinutes: z.number().int().positive(),
  relatedServiceIds: z.array(z.string()).optional(),
});
export type BlogPostValues = z.infer<typeof blogPostSchema>;

export const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  photo: z.string().min(1),
  shortBio: z.string().min(1),
  extendedBio: z.string().optional(),
  linkedIn: z.string().url().optional().or(z.literal("")),
  order: z.number().int(),
});
export type TeamMemberValues = z.infer<typeof teamMemberSchema>;

export const careerPositionSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
  location: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(["OPEN", "CLOSED"]),
});
export type CareerPositionValues = z.infer<typeof careerPositionSchema>;

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  domain: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1),
  whatsappNumber: z.string().min(1),
  businessHours: z.array(
    z.object({ region: z.string(), hours: z.string(), responseTime: z.string() })
  ),
  socialLinks: z.record(z.string(), z.string()),
  liveChatEnabled: z.boolean(),
  analyticsEnabled: z.boolean(),
  analyticsId: z.string().optional(),
  cookieBannerEnabled: z.boolean(),
});
export type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;

export const seoMetadataSchema = z.object({
  path: z.string().min(1),
  metaTitle: z.string().min(1).max(60),
  metaDescription: z.string().min(1).max(160),
  ogImage: z.string().optional(),
});
export type SeoMetadataValues = z.infer<typeof seoMetadataSchema>;
