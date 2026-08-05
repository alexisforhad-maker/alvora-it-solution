import { SectionWrapper } from "@/components/shared/section-wrapper";
import { FadeUp } from "@/components/animation/fade-up";
import { companyTimeline } from "@/data/company-timeline";

/**
 * Company Timeline — framed around growth stages (era labels) rather
 * than specific fabricated dates or figures, per the Phase 3D content
 * rule against inventing history that hasn't been provided.
 */
export function CompanyTimelineSection() {
  return (
    <SectionWrapper>
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">Our Journey</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Where We&apos;ve Been, Where We&apos;re Going
        </h2>
      </FadeUp>

      <ol className="relative mx-auto mt-9 flex max-w-3xl flex-col gap-[36px]">
        <div
          className="absolute bottom-2 left-[7px] top-2 hidden w-px bg-gradient-to-b from-secondary/50 via-secondary/20 to-transparent sm:block"
          aria-hidden="true"
        />
        {companyTimeline.map((milestone, index) => (
          <FadeUp key={milestone.title} delay={index * 0.06}>
            <li className="relative flex gap-5 border-l-2 border-secondary/30 pl-6 sm:border-l-0 sm:pl-10">
              <span className="absolute left-[-5px] top-1.5 hidden size-[14px] rounded-full border-2 border-secondary bg-background sm:block" aria-hidden="true" />
              <div>
                <p className="font-heading text-h6 text-secondary">{milestone.era}</p>
                <h3 className="mt-1 font-heading text-h5 text-primary">{milestone.title}</h3>
                <p className="mt-2 text-body text-neutral-600">{milestone.description}</p>
              </div>
            </li>
          </FadeUp>
        ))}
      </ol>
    </SectionWrapper>
  );
}
