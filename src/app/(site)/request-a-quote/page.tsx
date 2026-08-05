import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { QuoteRequestForm } from "@/components/shared/quote-request-form";

export const metadata: Metadata = buildMetadata({
  title: "Request a Quote",
  description:
    "Tell us about your project — service, scope, timeline, and contact details — and we'll respond within one business day.",
  path: "/request-a-quote",
});

/**
 * Request a Quote — Phase 2 §15. Renders the multi-step
 * <QuoteRequestForm /> built in Phase 3B (Service Selection → Project
 * Information incl. budget/timeline → Contact Details → Review &
 * Confirmation). No competing CTAs on this page, per the spec.
 */
export default function RequestAQuotePage() {
  return (
    <>
      <Hero
        eyebrow="No Obligation"
        title="Tell Us About Your Project"
        description="We'll respond within one business day with next steps — starting with a Discovery Call."
      />

      <SectionWrapper>
        <div className="mx-auto max-w-2xl">
          <QuoteRequestForm />
        </div>
      </SectionWrapper>
    </>
  );
}
