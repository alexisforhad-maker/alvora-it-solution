import { siteConfig, services, industries } from "@/config/site";
import { servicesContent } from "@/data/services-content";
import { industriesContent } from "@/data/industries-content";
import { portfolioItems } from "@/data/portfolio-content";
import { blogPosts } from "@/data/blog-content";

export type SeoPageEntry = {
  path: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
};

/**
 * SEO page inventory — derived from the same content sources that
 * already feed each page's `generateMetadata()` call (via
 * src/lib/seo.ts's `buildMetadata`), rather than a separately
 * maintained copy. Editing an entry here represents an SEO override;
 * once the backend exists, saved overrides would take precedence over
 * the derived default in `buildMetadata`.
 */
export function getSeoPageInventory(): SeoPageEntry[] {
  const staticPages: SeoPageEntry[] = [
    { path: "/", pageName: "Homepage", metaTitle: `${siteConfig.name} — ${siteConfig.tagline}`, metaDescription: siteConfig.description },
    { path: "/about", pageName: "About Us", metaTitle: "About Us", metaDescription: "Company story, mission, values, and leadership team." },
    { path: "/services", pageName: "Services Hub", metaTitle: "Services", metaDescription: "All 10 services Alvora IT Solution offers." },
    { path: "/industries", pageName: "Industries Hub", metaTitle: "Industries", metaDescription: "The 9 industries Alvora IT Solution serves." },
    { path: "/portfolio", pageName: "Portfolio Hub", metaTitle: "Portfolio", metaDescription: "Filterable project portfolio." },
    { path: "/technologies", pageName: "Technologies", metaTitle: "Technologies", metaDescription: "The technology stack Alvora builds with." },
    { path: "/process", pageName: "Process", metaTitle: "Our Process", metaDescription: "The 8-step engagement process." },
    { path: "/blog", pageName: "Blog Hub", metaTitle: "Blog", metaDescription: "Insights on software, automation, and technology partnership." },
    { path: "/careers", pageName: "Careers", metaTitle: "Careers", metaDescription: "Open positions and how to register interest." },
    { path: "/contact", pageName: "Contact", metaTitle: "Contact", metaDescription: "All contact channels and business hours." },
    { path: "/request-a-quote", pageName: "Request a Quote", metaTitle: "Request a Quote", metaDescription: "Multi-step project inquiry form." },
  ];

  const servicePages: SeoPageEntry[] = services.map((s) => ({
    path: `/services/${s.slug}`,
    pageName: `Service: ${s.name}`,
    metaTitle: servicesContent[s.slug]?.name ?? s.name,
    metaDescription: servicesContent[s.slug]?.shortDescription ?? "",
  }));

  const industryPages: SeoPageEntry[] = industries.map((i) => ({
    path: `/industries/${i.slug}`,
    pageName: `Industry: ${i.name}`,
    metaTitle: industriesContent[i.slug]?.name ?? i.name,
    metaDescription: industriesContent[i.slug]?.relevanceStatement ?? "",
  }));

  const portfolioPages: SeoPageEntry[] = portfolioItems.map((p) => ({
    path: `/portfolio/${p.slug}`,
    pageName: `Portfolio: ${p.title}`,
    metaTitle: p.title,
    metaDescription: p.result,
  }));

  const blogPages: SeoPageEntry[] = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    pageName: `Blog: ${post.title}`,
    metaTitle: post.title,
    metaDescription: post.excerpt,
  }));

  return [...staticPages, ...servicePages, ...industryPages, ...portfolioPages, ...blogPages];
}
