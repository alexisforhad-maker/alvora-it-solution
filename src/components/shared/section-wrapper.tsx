import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  /**
   * @deprecated Prefer `variant="tint"`. Kept so every existing call
   * site using the boolean `tint` prop keeps working unchanged — this
   * pass only adds new variant options, it doesn't remove the old one.
   */
  tint?: boolean;
  /**
   * Background treatment for the section — all subtle, built from
   * existing brand tokens (no new colors introduced). Section-variation
   * pass: gives pages visual rhythm between sections without hard
   * borders or a wall of flat white. Defaults to "white", or "tint" if
   * the legacy `tint` prop is set.
   */
  variant?: "white" | "tint" | "blue" | "teal" | "mesh" | "glass";
  as?: "section" | "div";
  id?: string;
}

const variantClasses: Record<NonNullable<SectionWrapperProps["variant"]>, string> = {
  white: "",
  tint: "bg-gradient-to-b from-neutral-100 via-neutral-100 to-surface",
  // Very light navy wash — same primary token used everywhere else,
  // just at very low opacity, fading to transparent.
  blue: "bg-gradient-to-b from-primary/[0.05] via-primary/[0.015] to-transparent",
  // Very light teal wash — same secondary token, same treatment.
  teal: "bg-gradient-to-b from-secondary/[0.07] via-secondary/[0.02] to-transparent",
  // "mesh" does NOT paint bg-mesh-wash/bg-grid-faint directly on this
  // element (see meshDecorationClass below and the root-cause note in
  // the render body) — `relative` now lives in the base class below
  // (every variant needs it, for the vignette layer), so this only
  // adds the overflow containment mesh's own decorative layer needs.
  mesh: "overflow-hidden",
  // Reuses the existing frosted glass-panel utility from globals.css.
  glass: "glass-panel",
};

/**
 * Root-cause fix (Process Timeline / Homepage "mesh" section bug):
 * `.bg-grid-faint` (globals.css) uses `mask-image`, which composites
 * the ENTIRE element it's applied to — not just its background-image
 * layer — fading anything painted inside toward transparent by the
 * bottom of the radial gradient. Applying it directly to the same
 * element that also wraps real `children` (as this variant used to)
 * silently faded content out well before the section's natural end,
 * and left the faded-to-transparent remainder looking like a large
 * empty gap, since the box still occupied its full height.
 *
 * Fix: render it as an isolated, absolutely-positioned decorative
 * sibling instead — the same pattern already used correctly elsewhere
 * for this exact utility combo (see hero.tsx, hero-illustration.tsx).
 * Real content now sits in a separate stacking layer the mask never
 * touches.
 */
const meshDecorationClass = "pointer-events-none absolute inset-0 bg-mesh-wash bg-grid-faint";

/**
 * Background Atmosphere Refinement — a very soft vignette rendered on
 * EVERY section regardless of variant, so no section reads as a flat
 * rectangle. This is the one atmospheric layer the brief asked for
 * that wasn't already covered by an existing utility elsewhere
 * (engineering grid → .bg-grid-faint, ambient light →
 * .bg-mesh-wash/.bg-aurora, tonal variation between sections → this
 * component's own variant system, hairline borders → the shared
 * border token already used sitewide). Isolated as its own
 * absolutely-positioned decorative sibling, same reason as always: a
 * background effect sharing a paint layer with real content is what
 * caused the two earlier bugs already fixed in this exact file.
 */
const vignetteClass = "pointer-events-none absolute inset-0 bg-vignette";

/**
 * SectionWrapper — every page section on the site is built with this,
 * so vertical rhythm (spacing tokens) and container width stay
 * identical everywhere, per Design System §5/§13 (Consistency,
 * Alignment).
 */
export function SectionWrapper({
  children,
  className,
  tint = false,
  variant,
  as: Component = "section",
  id,
}: SectionWrapperProps) {
  const resolved = variant ?? (tint ? "tint" : "white");
  const isMesh = resolved === "mesh";
  return (
    <Component
      id={id}
      className={cn("relative py-8 md:py-9", variantClasses[resolved], className)}
    >
      <div className={vignetteClass} aria-hidden="true" />
      {isMesh && <div className={meshDecorationClass} aria-hidden="true" />}
      <div className="container relative">{children}</div>
    </Component>
  );
}
