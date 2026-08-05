import Link from "next/link";
import { CTABanner } from "@/components/shared/cta-banner";
import { Button } from "@/components/ui/button";

export function AboutCTA() {
  return (
    <CTABanner
      title="Ready to Work With a Partner, Not a Vendor?"
      description="Tell us about your project — we'll respond within one business day."
      actions={
        <>
          <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
            <Link href="/request-a-quote">Book a Free Consultation</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="border-white text-white hover:bg-white hover:text-primary-dark"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </>
      }
    />
  );
}
