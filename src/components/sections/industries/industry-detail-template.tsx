import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { CTABanner } from "@/components/shared/cta-banner";
import { ServiceCard } from "@/components/shared/service-card";
import { PortfolioCard } from "@/components/shared/portfolio-card";
import { FadeUp } from "@/components/animation/fade-up";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { services } from "@/config/site";
import { serviceIcons } from "@/lib/icons";
import { servicesContent } from "@/data/services-content";
import { portfolioItems } from "@/data/portfolio-content";
import { serviceNamesForSlugs, industryNamesForSlugs } from "@/lib/content-helpers";
import type { IndustryDetail } from "@/types";

export interface IndustryDetailTemplateProps {
  content: IndustryDetail;
}

/**
 * Industry Detail Template — the single component behind all 9
 * Industry Detail pages (Phase 2 §6 / Phase 3E requirements). Renders
 * Hero → Industry Challenges → How Alvora Helps (linked services) →
 * Relevant Case Study (if one exists for this industry) → CTA.
 */
export function IndustryDetailTemplate({ content }: IndustryDetailTemplateProps) {
  const relatedServices = services.filter((s) => content.relatedServiceSlugs.includes(s.slug));
  const relatedCaseStudies = portfolioItems.filter((p) => p.industrySlugs.includes(content.slug));

  return (
    <>
      <div className="container">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Industries", href: "/industries" },
            { name: content.name, href: `/industries/${content.slug}` },
          ]}
        />
      </div>

      <Hero eyebrow="Where We Focus" title={content.name} description={content.relevanceStatement} />

      <SectionWrapper>
        <FadeUp>
          <h2 className="text-h3 font-heading text-primary">Common Challenges</h2>
        </FadeUp>
        <StaggerGrid className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.challenges.map((challenge) => (
            <div
              key={challenge.title}
              className="hover-lift group rounded-card border border-border bg-surface p-5 hover:border-secondary/30 hover:shadow-elevated-hover"
            >
              <span className="flex size-11 items-center justify-center rounded-input bg-secondary/10 text-secondary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:shadow-glow">
                <AlertCircle className="size-[20px]" aria-hidden="true" />
              </span>
              <h3 className="mt-3 font-heading text-h6 text-primary">{challenge.title}</h3>
              <p className="mt-2 text-body text-neutral-600">{challenge.description}</p>
            </div>
          ))}
        </StaggerGrid>
      </SectionWrapper>

      <SectionWrapper tint>
        <FadeUp>
          <h2 className="text-h3 font-heading text-primary">How Alvora Helps</h2>
        </FadeUp>
        <StaggerGrid className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {relatedServices.map((s) => (
            <ServiceCard
              key={s.slug}
              name={s.name}
              shortDescription={servicesContent[s.slug]?.shortDescription ?? ""}
              href={`/services/${s.slug}`}
              icon={serviceIcons[s.slug]!}
            />
          ))}
        </StaggerGrid>
      </SectionWrapper>

      {relatedCaseStudies.length > 0 && (
        <SectionWrapper>
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">Relevant Case Study</h2>
          </FadeUp>
          <StaggerGrid className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedCaseStudies.slice(0, 3).map((item) => (
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
        </SectionWrapper>
      )}

      <CTABanner
        title={`Ready to Talk About Your ${content.name} Project?`}
        description="Tell us about your project — we'll respond within one business day."
        actions={
          <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
            <Link href="/request-a-quote">
              Book a Free Consultation
              <ArrowRight className="ml-1 inline size-[16px]" aria-hidden="true" />
            </Link>
          </Button>
        }
      />
    </>
  );
}
