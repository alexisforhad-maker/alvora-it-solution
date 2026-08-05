import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { IndustryCard } from "@/components/shared/industry-card";
import { CTABanner } from "@/components/shared/cta-banner";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { Button } from "@/components/ui/button";
import { industries } from "@/config/site";
import { industryIcons } from "@/lib/icons";
import { industryRelevanceStatements } from "@/data/industry-content";

export const metadata: Metadata = buildMetadata({
  title: "Industries",
  description:
    "Alvora IT Solution is industry-agnostic by design, with particular depth across e-commerce, healthcare, real estate, logistics, education, finance, travel, manufacturing, and professional services.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <Hero
        eyebrow="Who We Work With"
        title="Solutions Shaped by Industry"
        description="Industry-agnostic by design, with particular depth across nine sectors — because understanding your business context is part of building the right solution."
      />

      <SectionWrapper>
        <StaggerGrid className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard
              key={industry.slug}
              name={industry.name}
              relevanceStatement={industryRelevanceStatements[industry.slug] ?? ""}
              href={`/industries/${industry.slug}`}
              icon={industryIcons[industry.slug]!}
            />
          ))}
        </StaggerGrid>
      </SectionWrapper>

      <CTABanner
        title="Don't See Your Industry Listed?"
        description="We're industry-agnostic by design — tell us about your business and we'll show you how we can help."
        actions={
          <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
            <Link href="/request-a-quote">Book a Free Consultation</Link>
          </Button>
        }
      />
    </>
  );
}
