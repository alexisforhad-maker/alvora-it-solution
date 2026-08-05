import Link from "next/link";
import { Hero } from "@/components/shared/hero";
import { Button } from "@/components/ui/button";
import { HeroIllustration } from "@/components/sections/hero-illustration";

/**
 * Homepage Hero — full two-zone variant per Phase 2 §1. The visual
 * side is the real Alvora "A" mark (see hero-illustration.tsx) inside
 * a subtle animated technology environment, replacing the earlier
 * placeholder inline-SVG facet illustration.
 */
export function HeroSection() {
  return (
    <Hero
      variant="full"
      eyebrow="Engineering Trust. Delivering Growth."
      title="Engineered With You. Not Just For You."
      description="Alvora IT Solution partners with startups, SMEs, and growing enterprises across the USA, Canada, UK, Europe, Australia, and the Middle East — building scalable, secure software as a long-term technology partner, not a vendor who disappears after launch."
      actions={
        <>
          {/* Mobile-only soft pulse behind the primary CTA (`md:hidden`
              on the glow itself) — desktop's Button is untouched. */}
          <span className="relative inline-block">
            <span
              className="hero-cta-glow pointer-events-none absolute -inset-[10px] -z-10 block rounded-input md:hidden"
              aria-hidden="true"
            />
            <Button asChild size="lg">
              <Link href="/request-a-quote">Book a Free Consultation</Link>
            </Button>
          </span>
          <Button asChild variant="secondary" size="lg">
            <Link href="/request-a-quote">Request a Quote</Link>
          </Button>
        </>
      }
      visual={<HeroIllustration />}
    />
  );
}
