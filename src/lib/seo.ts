import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string; // e.g. "/services/custom-software-development"
  image?: string; // absolute or Cloudinary URL; falls back to default OG image
  noIndex?: boolean;
};

/**
 * Build page-level Metadata consistently across the site.
 *
 * Every page's `generateMetadata` (or static `metadata` export) should
 * call this rather than constructing the Metadata object by hand, so
 * title formatting, canonical URLs, and Open Graph defaults stay
 * consistent sitewide (SEO Manager admin module edits feed into this
 * same shape once the CMS is wired up in a later phase).
 */
export function buildMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? `${siteConfig.url}/images/og-default.jpg`;
  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Browser Branding System — single source of truth for the site's
 * favicon/icon `<link>` declarations (Task 001).
 *
 * `(site)` and `admin` are independent Next.js root layouts (see the
 * comment in src/app/admin/layout.tsx), so metadata does not cascade
 * between them — each root's `metadata.icons` must import this
 * constant directly rather than relying on Next's file-convention
 * auto-detection (which was removed from src/app/ to avoid duplicate
 * <link rel="icon"> declarations once this explicit set was added).
 * PWA/Android home-screen icons are declared separately via the
 * manifest (src/app/manifest.ts), not here.
 */
export const siteIcons: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  ],
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  other: [
    // Safari pinned-tab icon — must be a single-color SVG; Safari
    // applies `color` itself and ignores the SVG's own fill.
    { rel: "mask-icon", url: "/mask-icon.svg", color: "#0B3A56" },
  ],
};

/**
 * Organization schema — injected sitewide in the root layout.
 * Design Blueprint §5.5 (Schema).
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Uttara, Dhaka",
      addressCountry: "BD",
    },
  };
}

/**
 * BreadcrumbList schema helper — used on all deep pages
 * (Service Details, Industry Details, Portfolio Details, Blog Details).
 */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * WebSite schema — injected on the Homepage specifically (Phase 3C
 * requirement), separate from the sitewide Organization schema in the
 * root layout.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-US",
  };
}

/**
 * Service schema — used on each Service Detail page, per Blueprint
 * §5.5. Added in the Phase 3I SEO finalization pass (was specified
 * but not yet implemented).
 */
export function serviceJsonLd(service: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${siteConfig.url}${service.path}`,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: ["US", "CA", "GB", "AU", "AE"],
  };
}

/**
 * LocalBusiness schema — used on the Contact page, per Blueprint
 * §5.5. Added in the Phase 3I SEO finalization pass.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/images/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Uttara, Dhaka",
      addressCountry: "BD",
    },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
