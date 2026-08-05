import { Briefcase, MapPin, Mailbox } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { FadeUp } from "@/components/animation/fade-up";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { openPositions } from "@/data/open-positions";

/**
 * Open Positions — renders real listings from src/data/open-positions.ts
 * when present, or an honest empty state when not (Alvora is not
 * actively hiring right now, per Master Blueprint §1.9). This is the
 * exact shape the Careers Manager (Admin/CMS phase) will populate.
 */
export function OpenPositionsSection() {
  return (
    <SectionWrapper id="open-positions">
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">Join Us</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Open Positions
        </h2>
      </FadeUp>

      {openPositions.length > 0 ? (
        <StaggerGrid className="mx-auto mt-9 flex max-w-3xl flex-col gap-4">
          {openPositions.map((position) => (
            <a
              key={position.slug}
              href="#interest-form"
              className="hover-lift group flex flex-col gap-2 rounded-card border border-border bg-surface p-5 hover:border-secondary/30 hover:shadow-elevated-hover sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-heading text-h5 text-primary transition-colors duration-slow ease-premium group-hover:text-secondary">{position.title}</h3>
                <p className="mt-1 flex items-center gap-4 text-caption text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Briefcase className="size-[14px]" aria-hidden="true" />
                    {position.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-[14px]" aria-hidden="true" />
                    {position.location}
                  </span>
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-button text-secondary opacity-0 transition-all duration-slow ease-premium -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 sm:opacity-100 sm:translate-x-0">
                Register Interest
              </span>
            </a>
          ))}
        </StaggerGrid>
      ) : (
        <FadeUp className="mx-auto mt-9 max-w-xl rounded-card border border-dashed border-border bg-surface p-10 text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <Mailbox className="size-[24px]" aria-hidden="true" />
          </span>
          <p className="text-body-lg text-neutral-600">
            We don&apos;t have any open roles right now — but we&apos;re always glad to hear
            from good people. Register your interest below and we&apos;ll reach out when a fit
            comes up.
          </p>
        </FadeUp>
      )}
    </SectionWrapper>
  );
}
