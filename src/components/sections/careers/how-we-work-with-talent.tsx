import { SectionWrapper } from "@/components/shared/section-wrapper";
import { FadeUp } from "@/components/animation/fade-up";

/**
 * How We Work With Talent — explains the flexible engagement model
 * from Master Blueprint §1.9 (lean leadership core + flexible pool of
 * engineers, designers, QA, and technology partners staffed per
 * project) in plain language for prospective candidates.
 */
export function HowWeWorkWithTalent() {
  return (
    <SectionWrapper tint>
      <div className="grid gap-[40px] lg:gap-16 lg:grid-cols-5">
        <FadeUp className="lg:col-span-2">
          <p className="font-heading text-h6 text-secondary">Our Structure</p>
          <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
            How We Work With Talent
          </h2>
        </FadeUp>
        <FadeUp delay={0.1} className="lg:col-span-3">
          <div className="flex flex-col gap-4 text-body-lg text-neutral-600">
            <p>
              Alvora is built around a small, senior leadership core, supported by a flexible
              pool of engineers, designers, QA specialists, and technology partners staffed
              based on what each project actually needs.
            </p>
            <p>
              That means the right people are matched to the right work, rather than
              everything routing through the same generalist team regardless of fit — and it
              means we can scale up or down without carrying overhead that doesn&apos;t serve
              clients.
            </p>
            <p>
              Whether you&apos;re looking for a core team role or ongoing project-based
              collaboration, we&apos;d like to know about you.
            </p>
          </div>
        </FadeUp>
      </div>
    </SectionWrapper>
  );
}
