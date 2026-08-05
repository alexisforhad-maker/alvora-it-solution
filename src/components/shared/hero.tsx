import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FadeUp } from "@/components/animation/fade-up";
import { HeroFullContent } from "@/components/shared/hero-full-content";

export interface HeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Visual accent slot (illustration/graphic) shown beside the copy on the full variant. */
  visual?: ReactNode;
  /** "full": two-zone homepage hero. "compact": single-column page hero used on About, Services, Contact, etc. */
  variant?: "full" | "compact";
  className?: string;
}

/**
 * Hero — the single component behind every page's top section, per
 * Phase 2 spec (every page has a Hero Section). The "full" variant is
 * homepage-only; every other page uses "compact".
 *
 * Phase 3I visual QA fix: the "full" variant's top/bottom padding was
 * symmetric (py-9/py-10), which read as too little breathing room
 * above the H1 relative to the header. It's now asymmetric — more
 * top clearance (pt-10/pt-[176px]) than bottom (pb-8/pb-10) — paired
 * with the Header height increase in header.tsx, for a more balanced,
 * premium top-of-page feel without changing the "compact" variant
 * used on every other page.
 *
 * Signature Brand Experience pass: the eyebrow badge (both variants
 * share this exact markup) moved from a fully-rounded pill with a
 * round dot — the same badge shape used across countless SaaS
 * landing pages — to a badge with two sheared corners and a diamond
 * marker. This isn't a literal reference to the Alvora mark (never
 * literal, per the brief) — it's the same underlying character the
 * mark itself has: precise, cut edges rather than soft ones. Since
 * this file backs every single page's Hero, this one change is the
 * highest-leverage, lowest-risk way to put a small piece of
 * unmistakably-Alvora geometry in front of every visitor on every
 * page, without touching layout, motion, or copy at all.
 */
export const eyebrowBadgeClass =
  "inline-flex items-center gap-2 border border-secondary/25 bg-secondary/10 px-4 py-1.5 font-heading text-h6 text-secondary [clip-path:polygon(10px_0,100%_0,calc(100%-10px)_100%,0_100%)]";

export function Hero({
  eyebrow,
  title,
  description,
  actions,
  visual,
  variant = "compact",
  className,
}: HeroProps) {
  if (variant === "full") {
    // Factored into its own client component (hero-full-content.tsx) —
    // see that file's docstring for why (per-element Framer Motion
    // variants + the mobile-only illustration reorder need "use
    // client", which this file deliberately doesn't carry so the
    // "compact" variant below — used on every other page — stays a
    // plain server component, untouched).
    return (
      <HeroFullContent
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={actions}
        visual={visual}
        className={className}
        eyebrowBadgeClass={eyebrowBadgeClass}
      />
    );
  }

  return (
    <div className="relative overflow-hidden border-b border-border">
      <div
        className="bg-mesh-wash pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      />
      <div className={cn("container relative py-8 md:py-9", className)}>
        <FadeUp className="max-w-2xl">
          {eyebrow && (
            <span className={eyebrowBadgeClass}>
              <span className="size-1.5 rotate-45 bg-secondary" aria-hidden="true" />
              {eyebrow}
            </span>
          )}
          <h1 className="mt-4 text-balance font-heading text-h2-mobile text-primary md:text-h1">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-body-lg text-neutral-600">{description}</p>
          )}
          {actions && <div className="mt-6 flex flex-wrap gap-4">{actions}</div>}
        </FadeUp>
      </div>
    </div>
  );
}
