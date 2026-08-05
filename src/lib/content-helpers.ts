import { services, industries } from "@/config/site";

/**
 * Resolves service/industry slugs to their display names — used
 * wherever content (Portfolio items, cross-links) stores slugs rather
 * than display strings, so labels never drift out of sync with
 * src/config/site.ts.
 */
export function serviceNameForSlug(slug: string): string {
  return services.find((s) => s.slug === slug)?.name ?? slug;
}

export function industryNameForSlug(slug: string): string {
  return industries.find((i) => i.slug === slug)?.name ?? slug;
}

export function serviceNamesForSlugs(slugs: string[]): string[] {
  return slugs.map(serviceNameForSlug);
}

export function industryNamesForSlugs(slugs: string[]): string[] {
  return slugs.map(industryNameForSlug);
}

/**
 * Display labels for the fixed blog category union type
 * (BlogPost["category"] in src/types/index.ts).
 */
export const categoryLabels: Record<string, string> = {
  "technology-trends": "Technology & Trends",
  "business-automation": "Business Automation",
  "case-studies": "Case Studies & Lessons",
  "company-news": "Company News",
};
