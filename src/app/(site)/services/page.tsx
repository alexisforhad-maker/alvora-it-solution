import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ServiceCard } from "@/components/shared/service-card";
import { CTABanner } from "@/components/shared/cta-banner";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { services } from "@/config/site";
import { serviceIcons } from "@/lib/icons";
import { servicesContent } from "@/data/services-content";
import { IndustriesStrip } from "@/components/sections/industries-strip";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Custom software, web, e-commerce, mobile, UI/UX, AI automation, cloud, ERP/CRM, IT consulting, and ongoing support — the ten services Alvora IT Solution builds around business outcomes.",
  path: "/services",
});

/**
 * Services Hub — Phase 2 §3. Reuses <IndustriesStrip /> from the
 * homepage sections rather than duplicating an industries grid.
 */
export default function ServicesPage() {
  return (
    <>
      <Hero
        eyebrow="What We Do"
        title="Services Built Around Business Outcomes"
        description="Ten focused services — not an endless menu — each aimed at a specific business result: efficiency, growth, or reliability."
      />

      <SectionWrapper>
        <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.slug}
              name={service.name}
              shortDescription={servicesContent[service.slug]?.shortDescription ?? ""}
              href={`/services/${service.slug}`}
              icon={serviceIcons[service.slug]!}
            />
          ))}
        </StaggerGrid>
      </SectionWrapper>

      <SectionWrapper tint>
        <FadeUp className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <h2 className="text-h2-mobile font-heading text-primary md:text-h2">
            Not Sure What You Need?
          </h2>
          <p className="text-body-lg text-neutral-600">
            That&apos;s what the Discovery Call is for — tell us your goal, and we&apos;ll
            recommend the right service (or combination of services).
          </p>
          <Button asChild size="lg">
            <Link href="/request-a-quote">Book a Free Consultation</Link>
          </Button>
        </FadeUp>
      </SectionWrapper>

      <IndustriesStrip />

      <CTABanner
        title="Let's Scope Your Project"
        description="Tell us about your project — we'll respond within one business day."
        actions={
          <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
            <Link href="/request-a-quote">Request a Quote</Link>
          </Button>
        }
      />
    </>
  );
}
