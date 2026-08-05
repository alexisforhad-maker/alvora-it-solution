import Link from "next/link";
import { CTABanner } from "@/components/shared/cta-banner";
import { Button } from "@/components/ui/button";

/**
 * Call To Action — Homepage §12 per Phase 2 spec (and the site's
 * final-CTA pattern used at natural page-end points throughout).
 */
export function FinalCTA() {
  return (
    <CTABanner
      title="Let's Build Something That Lasts"
      description="Tell us about your project — we'll respond within one business day."
      actions={
        <>
          <Button asChild size="lg" variant="secondary" className="border-white text-white hover:bg-white hover:text-primary-dark">
            <Link href="/request-a-quote">Book a Free Consultation</Link>
          </Button>
          <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
            <Link href="/request-a-quote">Request a Quote</Link>
          </Button>
        </>
      }
    />
  );
}
