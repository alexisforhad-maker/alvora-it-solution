import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ServiceCard } from "@/components/shared/service-card";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { services } from "@/config/site";
import { serviceIcons } from "@/lib/icons";
import { servicesContent } from "@/data/services-content";

/**
 * Services Overview — Homepage §3 per Phase 2 spec. All 10 services
 * as cards; on mobile these become horizontally swipeable (handled
 * via the overflow-x-auto snap container rather than a JS carousel
 * library, keeping bundle size minimal per the performance
 * requirements). Descriptions are read from the same
 * src/data/services-content.ts used by the Service Detail pages, so
 * copy only exists in one place.
 */
export function ServicesOverview() {
  return (
    <SectionWrapper id="services" variant="blue">
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">What We Do</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Services Built Around Business Outcomes
        </h2>
      </FadeUp>

      <StaggerGrid className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="mt-8 flex justify-center">
        <Button asChild variant="secondary" size="lg">
          <Link href="/services">View All Services</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
