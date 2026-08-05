import type { Metadata } from "next";
import { buildMetadata, websiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";

import { HeroSection } from "@/components/sections/hero-section";
import { CompanyIntro } from "@/components/sections/company-intro";
import { ServicesOverview } from "@/components/sections/services-overview";
import { IndustriesStrip } from "@/components/sections/industries-strip";
import { TechnologiesSection } from "@/components/sections/technologies-section";
import { WhyAlvora } from "@/components/sections/why-alvora";
import { ProcessSnapshot } from "@/components/sections/process-snapshot";
import { FeaturedPortfolio } from "@/components/sections/featured-portfolio";
import { LeadershipPreview } from "@/components/sections/leadership-preview";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { StatsSection } from "@/components/sections/stats-section";
import { FinalCTA } from "@/components/sections/final-cta";
import { BlogPreviewSection } from "@/components/sections/blog-preview-section";
import { ContactCTA } from "@/components/sections/contact-cta";

/**
 * Homepage-specific metadata. The root layout already sets sitewide
 * defaults for "/", but Phase 3C calls for explicit homepage-level SEO
 * (Open Graph, Twitter, canonical, structured data) — this override
 * makes that explicit rather than relying implicitly on the layout.
 */
export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* WebSite schema — homepage-specific, per Phase 3C SEO requirement */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />

      <HeroSection />
      <CompanyIntro />
      <ServicesOverview />
      <IndustriesStrip />
      <TechnologiesSection />
      <WhyAlvora />
      <ProcessSnapshot />
      <FeaturedPortfolio />
      <LeadershipPreview />
      <TestimonialsSection />
      <StatsSection />
      <FinalCTA />
      <BlogPreviewSection />
      <ContactCTA />
    </>
  );
}
