import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { CTABanner } from "@/components/shared/cta-banner";
import { ServiceCard } from "@/components/shared/service-card";
import { IndustryCard } from "@/components/shared/industry-card";
import { FAQ } from "@/components/shared/faq";
import { FadeUp } from "@/components/animation/fade-up";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { services, industries } from "@/config/site";
import { serviceIcons, industryIcons } from "@/lib/icons";
import { servicesContent } from "@/data/services-content";
import { industryRelevanceStatements } from "@/data/industry-content";
import { portfolioItems } from "@/data/portfolio-content";
import { serviceNamesForSlugs, industryNamesForSlugs } from "@/lib/content-helpers";
import { serviceJsonLd } from "@/lib/seo";
import { PortfolioCard } from "@/components/shared/portfolio-card";
import type { ServiceDetail } from "@/types";

export interface ServiceDetailTemplateProps {
  content: ServiceDetail;
}

/**
 * Service Detail Template — the single component behind all 10
 * Service Detail pages (Phase 2 §4 / Phase 3D requirements). Renders:
 * Hero → Problem → Solution Overview → What's Included → Benefits →
 * Technologies → Our Approach → FAQ → Related Services → Related
 * Industries → CTA. Each `/services/[slug]/page.tsx` route supplies
 * only the content object — this file is never duplicated per page.
 */
export function ServiceDetailTemplate({ content }: ServiceDetailTemplateProps) {
  const relatedServices = services.filter((s) => content.relatedServiceSlugs.includes(s.slug));
  const relatedIndustries = industries.filter((i) => content.relatedIndustrySlugs.includes(i.slug));
  const relatedPortfolio = portfolioItems.filter((p) => p.serviceSlugs.includes(content.slug));

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              name: content.name,
              description: content.shortDescription,
              path: `/services/${content.slug}`,
            })
          ),
        }}
      />

      <div className="container">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
            { name: content.name, href: `/services/${content.slug}` },
          ]}
        />
      </div>

      <Hero
        eyebrow="How We Help"
        title={content.name}
        description={content.shortDescription}
        actions={
          <>
            <Button asChild size="lg">
              <Link href="/request-a-quote">Book a Free Consultation</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/request-a-quote">Request a Quote</Link>
            </Button>
          </>
        }
      />

      {/* Business Problem */}
      <SectionWrapper>
        <FadeUp className="mx-auto max-w-3xl">
          <p className="font-heading text-h6 text-secondary">The Problem</p>
          <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
            Why This Matters
          </h2>
          <p className="mt-4 text-body-lg text-neutral-600">{content.problem}</p>
        </FadeUp>
      </SectionWrapper>

      {/* Solution Overview */}
      <SectionWrapper tint>
        <FadeUp className="mx-auto max-w-3xl">
          <p className="font-heading text-h6 text-secondary">Our Solution</p>
          <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
            How We Solve It
          </h2>
          <p className="mt-4 text-body-lg text-neutral-600">{content.solutionOverview}</p>
        </FadeUp>
      </SectionWrapper>

      {/* What's Included + Benefits */}
      <SectionWrapper>
        <div className="grid gap-[40px] md:grid-cols-2">
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">What&apos;s Included</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {content.included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body text-neutral-900">
                  <CheckCircle2 className="mt-0.5 size-[20px] shrink-0 text-secondary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-h3 font-heading text-primary">Benefits</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {content.benefits.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body text-neutral-900">
                  <CheckCircle2 className="mt-0.5 size-[20px] shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </SectionWrapper>

      {/* Technologies Used */}
      <SectionWrapper tint>
        <FadeUp>
          <h2 className="text-h3 font-heading text-primary">Technologies Used</h2>
        </FadeUp>
        <div className="mt-6 flex flex-wrap gap-3">
          {content.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-pill border border-border bg-background px-4 py-2 text-body text-neutral-900 transition-colors duration-fast hover:border-secondary/40 hover:bg-secondary/5"
            >
              {tech}
            </span>
          ))}
        </div>
        <Link
          href="/technologies"
          className="mt-4 inline-flex items-center gap-1.5 text-button text-secondary"
        >
          See our full technology stack
          <ArrowRight className="size-[16px]" aria-hidden="true" />
        </Link>
      </SectionWrapper>

      {/* Our Approach */}
      <SectionWrapper>
        <FadeUp className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2-mobile font-heading text-primary md:text-h2">Our Approach</h2>
        </FadeUp>
        <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.approach.map((step, index) => (
            <div
              key={step.title}
              className="hover-lift rounded-card border border-border bg-surface p-5 hover:border-secondary/30 hover:shadow-elevated-hover"
            >
              <span className="flex size-[36px] items-center justify-center rounded-full bg-secondary/10 font-heading text-h6 text-secondary">
                {index + 1}
              </span>
              <h3 className="mt-3 font-heading text-h6 text-primary">{step.title}</h3>
              <p className="mt-2 text-body text-neutral-600">{step.description}</p>
            </div>
          ))}
        </StaggerGrid>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper tint>
        <FadeUp className="mx-auto max-w-3xl">
          <h2 className="text-h2-mobile font-heading text-primary md:text-h2">
            Frequently Asked Questions
          </h2>
          <div className="mt-6">
            <FAQ items={content.faqs} idPrefix={content.slug} />
          </div>
        </FadeUp>
      </SectionWrapper>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <SectionWrapper>
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">Related Services</h2>
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

      {/* Related Industries */}
      {relatedIndustries.length > 0 && (
        <SectionWrapper tint>
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">Related Industries</h2>
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

      {/* Related Portfolio */}
      {relatedPortfolio.length > 0 && (
        <SectionWrapper>
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">Related Portfolio</h2>
          </FadeUp>
          <StaggerGrid className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedPortfolio.slice(0, 3).map((item) => (
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
        title={`Ready to Talk About ${content.name}?`}
        description="Tell us about your project — we'll respond within one business day."
        actions={
          <>
            <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
              <Link href="/request-a-quote">
                Book a Free Consultation
                <ArrowRight className="ml-1 inline size-[16px]" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="border-white text-white hover:bg-white hover:text-primary-dark"
            >
              <Link href="/request-a-quote">Request a Quote</Link>
            </Button>
          </>
        }
      />
    </>
  );
}
