import { SectionWrapper } from "@/components/shared/section-wrapper";
import { FadeUp } from "@/components/animation/fade-up";

/**
 * Company Story — drawn directly from the approved Master Blueprint
 * §1.3 Brand Story, condensed for on-page reading.
 */
export function CompanyStory() {
  return (
    <SectionWrapper>
      <div className="grid gap-[40px] lg:gap-16 lg:grid-cols-5">
        <FadeUp className="lg:col-span-2">
          <p className="font-heading text-h6 text-secondary">Our Story</p>
          <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
            Why We Started Alvora
          </h2>
        </FadeUp>
        <FadeUp delay={0.1} className="lg:col-span-3">
          <div className="flex flex-col gap-4 text-body-lg text-neutral-600">
            <p>
              Alvora IT Solution was founded in Dhaka, Bangladesh, on a simple observation:
              businesses don&apos;t just need code written — they need a partner who
              understands their goals, communicates clearly across time zones, and stays
              with them long after launch.
            </p>
            <p>
              Too many companies have been burned by offshore vendors who disappear after
              delivery, or agencies that treat every project as a one-off transaction. Alvora
              was built to be different — combining the technical depth of a modern software
              house with the reliability and transparency of an in-house team.
            </p>
            <p>
              Today, we work with founders, operators, and technical leaders across the USA,
              Canada, UK, Europe, Australia, and the Middle East, turning ambitious ideas into
              scalable, secure software — and staying in the room long after the first release
              ships.
            </p>
          </div>
        </FadeUp>
      </div>
    </SectionWrapper>
  );
}
