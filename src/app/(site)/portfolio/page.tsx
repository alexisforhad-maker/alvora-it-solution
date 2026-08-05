import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { CTABanner } from "@/components/shared/cta-banner";
import { PortfolioCard } from "@/components/shared/portfolio-card";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { Button } from "@/components/ui/button";
import { portfolioItems } from "@/data/portfolio-content";
import { serviceNamesForSlugs, industryNamesForSlugs } from "@/lib/content-helpers";
import { PortfolioFilterBar } from "@/components/sections/portfolio/portfolio-filter-bar";

export const metadata: Metadata = buildMetadata({
  title: "Portfolio",
  description:
    "A look at the projects Alvora IT Solution has delivered — filterable by service and industry.",
  path: "/portfolio",
});

interface PortfolioPageProps {
  searchParams: Promise<{ service?: string; industry?: string }>;
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const { service, industry } = await searchParams;

  const filtered = portfolioItems.filter((item) => {
    const matchesService = !service || item.serviceSlugs.includes(service);
    const matchesIndustry = !industry || item.industrySlugs.includes(industry);
    return matchesService && matchesIndustry;
  });

  return (
    <>
      <Hero
        eyebrow="Our Work"
        title="Work That Speaks for Itself"
        description="A look at how we've helped clients solve real business problems — filter by service or industry to find something relevant to you."
      />

      <SectionWrapper>
        <Suspense fallback={<div className="h-11" aria-hidden="true" />}>
          <PortfolioFilterBar />
        </Suspense>

        <p aria-live="polite" className="mt-4 text-caption text-neutral-600">
          Showing {filtered.length} of {portfolioItems.length} projects
        </p>

        {filtered.length > 0 ? (
          <StaggerGrid className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {filtered.map((item) => (
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
        ) : (
          <div className="mt-10 rounded-card border border-dashed border-border bg-surface p-10 text-center">
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <SearchX className="size-[24px]" aria-hidden="true" />
            </span>
            <p className="text-body-lg text-neutral-600">
              No projects match that combination yet — try a different filter, or{" "}
              <Link href="/request-a-quote" className="text-secondary underline underline-offset-2">
                tell us about your project
              </Link>{" "}
              directly.
            </p>
          </div>
        )}
      </SectionWrapper>

      <CTABanner
        title="Don't See a Project Like Yours?"
        description="We're growing our portfolio one project at a time — yours could be next."
        actions={
          <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
            <Link href="/request-a-quote">Book a Free Consultation</Link>
          </Button>
        }
      />
    </>
  );
}
