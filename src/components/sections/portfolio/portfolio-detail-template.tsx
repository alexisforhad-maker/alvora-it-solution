import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { CTABanner } from "@/components/shared/cta-banner";
import { PortfolioCard } from "@/components/shared/portfolio-card";
import { ServiceCard } from "@/components/shared/service-card";
import { IndustryCard } from "@/components/shared/industry-card";
import { FadeUp } from "@/components/animation/fade-up";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { services, industries } from "@/config/site";
import { serviceIcons, industryIcons } from "@/lib/icons";
import { servicesContent } from "@/data/services-content";
import { industryRelevanceStatements } from "@/data/industry-content";
import { serviceNamesForSlugs, industryNamesForSlugs } from "@/lib/content-helpers";
import type { PortfolioItem } from "@/types";

export interface PortfolioDetailTemplateProps {
  item: PortfolioItem;
  relatedItems: PortfolioItem[];
}

/**
 * Portfolio Detail Template — the single component behind every
 * Portfolio Detail page (Phase 2 §8 / Phase 3E requirements). Renders
 * Hero → Challenge → Solution → Technology → Result → Testimonial
 * (only if present) → Related Case Studies → Related Service/Industry
 * → CTA. Cross-links are slug-driven, so they stay valid as CMS
 * content is added later.
 */
export function PortfolioDetailTemplate({ item, relatedItems }: PortfolioDetailTemplateProps) {
  const relatedServices = services.filter((s) => item.serviceSlugs.includes(s.slug));
  const relatedIndustries = industries.filter((i) => item.industrySlugs.includes(i.slug));

  return (
    <>
      <div className="container">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Portfolio", href: "/portfolio" },
            { name: item.title, href: `/portfolio/${item.slug}` },
          ]}
        />
      </div>

      <Hero
        eyebrow={[...serviceNamesForSlugs(item.serviceSlugs), ...industryNamesForSlugs(item.industrySlugs)].join(" · ")}
        title={item.title}
        description={item.resultStat}
      />

      <SectionWrapper>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card border border-border bg-neutral-100 shadow-elevated">
          <Image src={item.thumbnail} alt="" fill sizes="100vw" className="object-cover" priority />
        </div>
      </SectionWrapper>

      <SectionWrapper tint>
        <div className="grid gap-[40px] md:grid-cols-2">
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">The Challenge</h2>
            <p className="mt-4 text-body-lg text-neutral-600">{item.challenge}</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-h3 font-heading text-primary">Our Solution</h2>
            <p className="mt-4 text-body-lg text-neutral-600">{item.solution}</p>
          </FadeUp>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <FadeUp>
          <h2 className="text-h3 font-heading text-primary">Technology Used</h2>
        </FadeUp>
        <div className="mt-6 flex flex-wrap gap-3">
          {item.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-pill border border-border bg-surface px-4 py-2 text-body text-neutral-900 transition-colors duration-fast hover:border-secondary/40 hover:bg-secondary/5"
            >
              {tech}
            </span>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper tint>
        <FadeUp className="mx-auto max-w-3xl text-center">
          <h2 className="text-h3 font-heading text-primary">The Result</h2>
          <p className="mt-4 text-body-lg text-neutral-600">{item.result}</p>
        </FadeUp>
      </SectionWrapper>

      {/* Testimonial — only rendered when a real, attributed quote exists on this item */}
      {item.testimonial && (
        <SectionWrapper>
          <FadeUp className="relative mx-auto max-w-2xl overflow-hidden rounded-card border border-border bg-surface p-8 text-center shadow-elevated">
            <span className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              &ldquo;
            </span>
            <p className="text-body-lg text-neutral-900">&ldquo;{item.testimonial.quote}&rdquo;</p>
            <p className="mt-4 text-body font-medium text-primary">
              {item.testimonial.author} — {item.testimonial.role}, {item.testimonial.company}
            </p>
          </FadeUp>
        </SectionWrapper>
      )}

      {relatedServices.length > 0 && (
        <SectionWrapper tint>
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">Related Service</h2>
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
      )}

      {relatedIndustries.length > 0 && (
        <SectionWrapper>
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">Related Industry</h2>
          </FadeUp>
          <StaggerGrid className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3">
            {relatedIndustries.map((i) => (
              <IndustryCard
                key={i.slug}
                name={i.name}
                relevanceStatement={industryRelevanceStatements[i.slug] ?? ""}
                href={`/industries/${i.slug}`}
                icon={industryIcons[i.slug]!}
              />
            ))}
          </StaggerGrid>
        </SectionWrapper>
      )}

      {relatedItems.length > 0 && (
        <SectionWrapper tint>
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">Related Case Studies</h2>
          </FadeUp>
          <StaggerGrid className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedItems.slice(0, 3).map((related) => (
              <PortfolioCard
                key={related.slug}
                title={related.title}
                href={`/portfolio/${related.slug}`}
                thumbnail={related.thumbnail}
                serviceTags={serviceNamesForSlugs(related.serviceSlugs)}
                industryTags={industryNamesForSlugs(related.industrySlugs)}
                resultStat={related.resultStat}
              />
            ))}
          </StaggerGrid>
        </SectionWrapper>
      )}

      <CTABanner
        title="Have a Similar Project in Mind?"
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
