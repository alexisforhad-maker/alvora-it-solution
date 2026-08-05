import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { IndustryCard } from "@/components/shared/industry-card";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { industries } from "@/config/site";
import { industryIcons } from "@/lib/icons";
import { industryRelevanceStatements } from "@/data/industry-content";

/**
 * Industries We Serve — Homepage §7 per Phase 2 spec. All 9 industry
 * cards; industry-agnostic positioning per Master Blueprint §1.8, but
 * shown explicitly to help sector-specific visitors self-identify.
 */
export function IndustriesStrip() {
  return (
    <SectionWrapper id="industries">
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">Who We Work With</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          We Learn Your Industry Before We Touch Your Code
        </h2>
        <p className="mt-4 text-body-lg text-neutral-600">
          Industry-agnostic by design, with particular depth across nine sectors — because
          context shapes the right solution as much as the code does.
        </p>
      </FadeUp>

      <StaggerGrid className="mt-9 grid grid-cols-2 gap-5 md:grid-cols-3">
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

      <div className="mt-8 flex justify-center">
        <Button asChild variant="ghost" size="lg">
          <Link href="/industries">Explore All Industries →</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
