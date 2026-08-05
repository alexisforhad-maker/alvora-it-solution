import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FadeUp } from "@/components/animation/fade-up";

export interface CTABannerProps {
  title: string;
  description?: string;
  actions: ReactNode;
  className?: string;
}

/**
 * CTA Banner — full-width navy band with centered headline + button,
 * used at natural page-end points across nearly every page, per
 * Phase 2 spec. Deliberately un-animated beyond a simple fade-up
 * (Design System: "final CTA banner has no animation... stays calm
 * /authoritative").
 */
export function CTABanner({ title, description, actions, className }: CTABannerProps) {
  return (
    <div className={cn("relative overflow-hidden bg-gradient-primary py-8 md:py-9", className)}>
      <div className="bg-mesh-wash-dark pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundSize: "40px 40px" }}
        aria-hidden="true"
      />
      <FadeUp className="container relative flex flex-col items-center gap-6 text-center">
        <h2 className="text-balance max-w-2xl text-h2-mobile font-heading text-white md:text-h2">
          {title}
        </h2>
        {description && (
          <p className="max-w-xl text-body-lg text-white/80">{description}</p>
        )}
        <div className="flex flex-wrap justify-center gap-4">{actions}</div>
      </FadeUp>
    </div>
  );
}
