import type { Metadata } from "next";
import Link from "next/link";
import { Globe2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { CTABanner } from "@/components/shared/cta-banner";
import { ProcessTimeline } from "@/components/shared/process-timeline";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { processSteps, engagementModels, contactConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Our Process",
  description:
    "The 8-step engagement process Alvora IT Solution follows on every project — from Discovery Call through ongoing support.",
  path: "/process",
});

/**
 * Process page — Phase 2 §9. Reuses the existing <ProcessTimeline />
 * component in its "full" density (the same component the Homepage
 * uses in "condensed" density), so the step content only exists once
 * in src/config/site.ts.
 */
export default function ProcessPage() {
  return (
    <>
      <Hero
        eyebrow="How We Work"
        title="A Process Built on Transparency"
        description="Every engagement follows the same eight steps — so you always know what's happening next and what to expect from us."
      />

      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <ProcessTimeline steps={processSteps} variant="full" />
        </div>
      </SectionWrapper>

      <SectionWrapper tint>
        <FadeUp className="mx-auto max-w-3xl">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-input bg-secondary/10 text-secondary">
              <Globe2 className="size-[24px]" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-heading text-h3 text-primary">
                Communication Across Time Zones
              </h2>
              <p className="mt-3 text-body-lg text-neutral-600">
                We work with clients across the USA, Canada, UK, Europe, Australia, and the
                Middle East — so structured, asynchronous updates are built into our process
                by default, not an afterthought. You&apos;ll always know your project&apos;s
                status without needing to catch us live.
              </p>
              <p className="mt-3 text-body text-neutral-600">
                Prefer to talk live? See our{" "}
                <Link href="/contact" className="text-secondary underline underline-offset-2">
                  full contact details and business hours by region
                </Link>
                .
              </p>
            </div>
          </div>
        </FadeUp>
      </SectionWrapper>

      <SectionWrapper>
        <FadeUp className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2-mobile font-heading text-primary md:text-h2">
            How We Engage
          </h2>
        </FadeUp>
        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {engagementModels.map((model, index) => (
            <div
              key={model.name}
              className="hover-lift rounded-card border border-border bg-surface p-6 hover:border-secondary/30 hover:shadow-elevated-hover"
            >
              <span className="flex size-[36px] items-center justify-center rounded-full bg-primary/10 font-heading text-h6 text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-heading text-h5 text-primary">{model.name}</h3>
              <p className="mt-2 text-body text-neutral-600">{model.description}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-xl text-center text-caption text-neutral-600">
          We don&apos;t publish pricing publicly — every project&apos;s scope, timeline, and
          complexity is different. A Discovery Call is how we figure out what&apos;s right for
          yours.
        </p>
      </SectionWrapper>

      <CTABanner
        title="Ready to Start With a Discovery Call?"
        description={`We typically respond within one business day — ${contactConfig.email}`}
        actions={
          <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
            <Link href="/request-a-quote">Book a Free Consultation</Link>
          </Button>
        }
      />
    </>
  );
}
