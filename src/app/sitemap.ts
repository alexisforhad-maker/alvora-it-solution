import type { MetadataRoute } from "next";
import { siteConfig, services, industries } from "@/config/site";
import { portfolioItems } from "@/data/portfolio-content";
import { blogPosts } from "@/data/blog-content";

/**
 * Generates /sitemap.xml at build time.
 *
 * Static routes are listed directly; Service/Industry/Portfolio/Blog
 * detail routes are derived from their respective content sources —
 * Portfolio from src/data/portfolio-content.ts (now live), Blog
 * entries will be appended here from the database once the CMS phase
 * introduces Prisma-backed content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/industries`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/technologies`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/portfolio`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/process`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/careers`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/request-a-quote`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${siteConfig.url}/industries/${industry.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioItems.map((item) => ({
    url: `${siteConfig.url}/portfolio/${item.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...industryRoutes, ...portfolioRoutes, ...blogRoutes];
}
