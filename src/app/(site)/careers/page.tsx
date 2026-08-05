import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { CareerInterestForm } from "@/components/shared/career-interest-form";
import { FadeUp } from "@/components/animation/fade-up";
import { WhyWorkWithUs } from "@/components/sections/careers/why-work-with-us";
import { HowWeWorkWithTalent } from "@/components/sections/careers/how-we-work-with-talent";
import { OpenPositionsSection } from "@/components/sections/careers/open-positions-section";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description:
    "Join Alvora IT Solution — a lean, collaborative team working with international clients. See open positions or register your interest.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <Hero
        eyebrow="Join Us"
        title="Build Your Career With Alvora"
        description="We're not actively hiring for every role at every moment — but we're always glad to hear from people who care about doing good work."
      />

      <WhyWorkWithUs />
      <HowWeWorkWithTalent />
      <OpenPositionsSection />

      <SectionWrapper tint id="interest-form">
        <FadeUp className="mx-auto max-w-xl">
          <h2 className="text-center text-h2-mobile font-heading text-primary md:text-h2">
            Register Your Interest
          </h2>
          <p className="mt-3 text-center text-body-lg text-neutral-600">
            Tell us a bit about yourself — we&apos;ll keep it on file for the right
            opportunity.
          </p>
          <div className="mt-8">
            <CareerInterestForm />
          </div>
        </FadeUp>
      </SectionWrapper>
    </>
  );
}
