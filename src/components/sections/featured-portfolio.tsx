import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { PortfolioCard } from "@/components/shared/portfolio-card";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { portfolioItems } from "@/data/portfolio-content";
import { serviceNamesForSlugs, industryNamesForSlugs } from "@/lib/content-helpers";

/**
 * Featured Portfolio — Homepage §6 per Phase 2 spec. Reads from
 * src/data/portfolio-content.ts — the same source used by the
 * Portfolio Hub and Portfolio Detail pages — so there is exactly one
 * place project content is authored.
 */
export function FeaturedPortfolio() {
  const featured = portfolioItems.slice(0, 3);

  return (
    <SectionWrapper id="work">
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">Our Work</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Work That Speaks for Itself
        </h2>
      </FadeUp>

      <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-3">
        {featured.map((item) => (
          <PortfolioCard
            key={item.slug}
            title={item.title}
            href={`/portfolio/${item.slug}`}
            thumbnail={item.thumbnail}
            serviceTags={serviceNamesForSlugs(item.serviceSlugs)}
            industryTags={industryNamesForSlugs(item.industrySlugs)}
            resultStat={item.resultStat}
          />
        ))}
      </StaggerGrid>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="secondary" size="lg">
          <Link href="/portfolio">View All Work</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
