import { SectionWrapper } from "@/components/shared/section-wrapper";
import { FadeUp } from "@/components/animation/fade-up";

/**
 * Company Introduction — condensed brand story, positioned right
 * after the Hero to establish "who is this company" before the
 * visitor evaluates services in detail.
 */
export function CompanyIntro() {
  return (
    <SectionWrapper>
      <FadeUp className="mx-auto max-w-3xl text-center">
        <p className="font-heading text-h6 text-secondary">Who We Are</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          A Technology Partner, Not Just a Vendor
        </h2>
        <p className="mt-5 text-body-lg text-neutral-600">
          Alvora IT Solution was founded in Dhaka, Bangladesh, on a simple idea: businesses
          deserve a technology partner who understands their goals, communicates clearly
          across time zones, and stays with them long after launch. We combine the technical
          depth of a modern software house with the reliability of an in-house team — for
          founders, operators, and technical leaders building ambitious things.
        </p>
      </FadeUp>
    </SectionWrapper>
  );
}
