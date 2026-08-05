"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

export interface StatisticsProps {
  stats: Stat[];
}

/**
 * Statistics — Homepage Trust Bar (Enterprise Metrics refinement).
 * Presented as ONE unified executive panel divided into independent
 * zones, not four separate cards: a single bordered/shadowed surface
 * with a single faint blueprint-style background spanning the whole
 * container (never per-metric icons/watermarks). Visual hierarchy is
 * deliberately Numbers > Labels > Panel Depth > Background Geometry —
 * the background sits at ~3% opacity specifically so it registers
 * only subconsciously.
 *
 * The decorative background is rendered as an isolated, absolutely-
 * positioned sibling of the real content — never applied to the same
 * element that wraps it. That's not stylistic preference: a mask
 * applied directly to a content-bearing element silently faded real
 * text in two other places in this codebase (SectionWrapper's "mesh"
 * variant, the Newsletter card) before being fixed. This background
 * doesn't use a mask at all (opacity-only), but the isolation pattern
 * is kept regardless, for the same underlying reason.
 */
export function Statistics({ stats }: StatisticsProps) {
  return (
    <dl className="relative overflow-hidden rounded-card border border-border bg-background shadow-elevated">
      <BlueprintBackground />
      <div className="relative grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <StatZone key={stat.label} stat={stat} index={index} />
        ))}
      </div>
    </dl>
  );
}

function StatZone({ stat, index }: { stat: Stat; index: number }) {
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-1 px-4 py-8 text-center",
        "transition-all duration-slow ease-premium hover:-translate-y-px hover:bg-white/[0.02]",
        "border-border hover:border-secondary/30",
        // Right divider: left column on mobile (2-col), every column
        // except the last on desktop (4-col) — kept as explicit
        // per-cell borders (rather than the `divide-x`/`divide-y`
        // shorthand this replaced) specifically so each zone's own
        // divider can brighten on that zone's own hover.
        index % 2 === 0 && "max-md:border-r",
        index !== 3 && "md:border-r",
        // Bottom divider: mobile only, first row (not the last row).
        index < 2 && "max-md:border-b"
      )}
    >
      {/* Hairline top accent — invisible at rest, soft cyan → blue →
          violet sweep on hover. Reuses the exact gradient stops the
          Card component's own top accent already uses elsewhere. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan via-accent-blue to-accent-purple opacity-0 transition-all duration-slow ease-premium group-hover:scale-x-100 group-hover:opacity-70"
      />
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        <CountUpNumber value={stat.value} suffix={stat.suffix} />
      </dd>
      <p className="text-caption uppercase tracking-wide text-neutral-600">{stat.label}</p>
    </div>
  );
}

function CountUpNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = React.useState(shouldReduceMotion ? value : 0);

  React.useEffect(() => {
    if (!inView || shouldReduceMotion) return;
    // Fixed-duration ease-out tween (was a physics spring, whose
    // settle time isn't directly controllable and can overshoot
    // depending on damping/stiffness) — 1000ms sits in the requested
    // 900–1100ms window with a plain, predictable ease-out curve.
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, shouldReduceMotion, value]);

  return (
    <span
      ref={ref}
      // tabular-nums: fixed digit width, so the count-up doesn't
      // visibly jitter/reflow as digits change — an optical-alignment
      // fix, not a spacing change. The glow is a constant, static
      // text-shadow (not transitioned on hover) — text-shadow isn't a
      // GPU-composited property, so rather than animate it, only
      // `color` shifts on hover (already the sitewide convention for
      // interactive text), keeping every actual transition on
      // transform/opacity/color.
      className="font-heading text-h2-mobile tabular-nums text-primary [text-shadow:0_0_24px_rgba(70,215,215,0.18)] transition-colors duration-slow ease-premium group-hover:text-white md:text-h1"
      aria-label={`${value}${suffix}`}
    >
      {display}
      {suffix}
    </span>
  );
}

/**
 * Single blueprint-style background geometry spanning the entire
 * panel — concentric drafting-compass circles + thin guide lines at
 * the same x-positions as the desktop column dividers (1200 / 4 =
 * 300px apart), with small node dots at their intersections. One
 * consistent geometric language, ~3% opacity, static (no animation,
 * no glow) — deliberately meant to be noticed only subconsciously.
 */
function BlueprintBackground() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
    >
      <g fill="none" stroke="white" strokeWidth="1">
        <circle cx="1150" cy="0" r="70" />
        <circle cx="1150" cy="0" r="130" />
        <circle cx="1150" cy="0" r="190" />
        <line x1="0" y1="1" x2="1200" y2="1" />
        <line x1="0" y1="199" x2="1200" y2="199" />
        <line x1="300" y1="0" x2="300" y2="200" />
        <line x1="600" y1="0" x2="600" y2="200" />
        <line x1="900" y1="0" x2="900" y2="200" />
      </g>
      <g fill="white">
        <circle cx="300" cy="100" r="2" />
        <circle cx="600" cy="100" r="2" />
        <circle cx="900" cy="100" r="2" />
      </g>
    </svg>
  );
}
