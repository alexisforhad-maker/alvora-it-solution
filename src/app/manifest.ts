import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Generates /manifest.webmanifest at build time. Previously missing
 * entirely (Phase 3I visual/SEO QA finding) — Next.js auto-serves
 * this from src/app/manifest.ts and auto-links it in <head>.
 *
 * Browser-tab/bookmark/apple-touch icons are NOT auto-detected from
 * this directory anymore (Task 001, Browser Branding System) — they're
 * declared explicitly via `siteIcons` in src/lib/seo.ts and applied in
 * both root layouts. This file only supplies the PWA/Android
 * home-screen icon sizes referenced below.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: siteConfig.themeColor,
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
