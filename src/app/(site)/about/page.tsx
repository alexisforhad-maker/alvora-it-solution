import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

import { AboutHero } from "@/components/sections/about/about-hero";
import { CompanyStory } from "@/components/sections/about/company-story";
import { MissionVision } from "@/components/sections/about/mission-vision";
import { CoreValues } from "@/components/sections/about/core-values";
import { LeadershipTeam } from "@/components/sections/about/leadership-team";
import { CompanyTimelineSection } from "@/components/sections/about/company-timeline-section";
import { WhyAlvora } from "@/components/sections/why-alvora";
import { CultureSection } from "@/components/sections/about/culture-section";
import { AboutCTA } from "@/components/sections/about/about-cta";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Alvora IT Solution is a premium IT solutions company based in Dhaka, Bangladesh, built to be a long-term technology partner for startups, SMEs, and growing enterprises worldwide.",
  path: "/about",
});

/**
 * About page — reuses the Homepage's <WhyAlvora /> section directly
 * rather than duplicating the USP-pillar content, per the "reuse
 * existing components, do not duplicate code" project rule.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CompanyStory />
      <MissionVision />
      <CoreValues />
      <LeadershipTeam />
      <CompanyTimelineSection />
      <WhyAlvora />
      <CultureSection />
      <AboutCTA />
    </>
  );
}
