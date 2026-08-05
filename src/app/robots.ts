import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Generates /robots.txt at build time. Admin/CMS routes are disallowed
 * since they have no business being indexed; everything public is
 * crawlable. See src/app/sitemap.ts for the companion sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
