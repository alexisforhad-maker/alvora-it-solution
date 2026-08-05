import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ProcessTimeline } from "@/components/shared/process-timeline";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { processSteps } from "@/config/site";

/**
 * Development Process — condensed snapshot of the engagement process,
 * per Phase 2 Homepage §5 ("condensed 4-5 step visual... See Full
 * Process link"). Shows the first 5 of 8 steps in the "condensed"
 * ProcessTimeline density — matching the documented spec (showing all
 * 8 here made this column roughly 2x taller than its text companion,
 * an imbalance the full list belongs on the dedicated /process page,
 * not the homepage snapshot). The /process page renders the complete
 * 8-step sequence in the "full" density.
 */
export function ProcessSnapshot() {
  return (
    <SectionWrapper variant="mesh">
      <div className="grid gap-[40px] lg:gap-16 lg:grid-cols-2">
        <FadeUp>
          <p className="font-heading text-h6 text-secondary">How We Work</p>
          <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
            A Process Built on Transparency
          </h2>
          <p className="mt-4 max-w-md text-body-lg text-neutral-600">
            Every engagement follows the same structured process — so you always know
            what&apos;s happening next.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-6">
            <Link href="/process">See Full 8-Step Process</Link>
          </Button>
        </FadeUp>

        <ProcessTimeline steps={processSteps.slice(0, 5)} variant="condensed" />
      </div>
    </SectionWrapper>
  );
}
