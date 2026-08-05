"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { HeroMobileBackground } from "@/components/sections/hero-mobile-background";

export interface HeroFullContentProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  visual?: ReactNode;
  className?: string;
  eyebrowBadgeClass: string;
}

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const descriptionVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.15 } },
};

const actionsVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.3 },
  },
};

const visualVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.15 } },
};

/**
 * Homepage Hero content — the "full" variant's implementation,
 * factored out of hero.tsx (which stays a server component for its
 * "compact" variant, used on every other page) since this needs
 * Framer Motion. Two things `Hero`'s previous single `FadeUp` wrapper
 * couldn't do:
 *
 *   1. Per-element entrance motion — heading, description, and
 *      actions each get their own variant (fade+up / fade / fade+
 *      scale) instead of animating as one block.
 *   2. Mobile-only reflow — the illustration moves above the heading
 *      via `order-1 md:order-none` (text becomes `order-2
 *      md:order-none`), so desktop's DOM/visual order is byte-for-
 *      byte the same as before (`order-none` resets to source order).
 *
 * `initial={shouldReduceMotion ? "show" : "hidden"}` is the reduced-
 * motion guard: when `initial` and `animate` resolve to the same
 * variant, Framer Motion renders the end state immediately with no
 * transition — same outcome as FadeUp's plain-div bailout, without
 * branching every element.
 */
export function HeroFullContent({
  eyebrow,
  title,
  description,
  actions,
  visual,
  className,
  eyebrowBadgeClass,
}: HeroFullContentProps) {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "show" : "hidden";

  return (
    <div className="relative overflow-hidden">
      <div
        className="bg-mesh-wash bg-grid-faint pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <HeroMobileBackground />

      <div
        className={cn(
          // Mobile gap between the copy block and the illustration is
          // intentionally tighter (28px) than the desktop column gap
          // (48px, unchanged) — keeps the first mobile screen compact
          // instead of leaving a large vertical gap before the visual.
          "container relative grid gap-[28px] pb-[64px] pt-[56px] md:grid-cols-5 md:items-center md:gap-[48px] md:pb-[80px] md:pt-[176px]",
          className
        )}
      >
        <div className="order-2 md:order-none md:col-span-3">
          <motion.div initial={initial} animate="show" variants={headingVariants}>
            {eyebrow && (
              <span className={eyebrowBadgeClass}>
                <span className="size-1.5 rotate-45 bg-secondary" aria-hidden="true" />
                {eyebrow}
              </span>
            )}
            <h1 className="mt-5 text-balance font-heading text-h1-mobile text-primary md:text-h1">
              {title}
            </h1>
          </motion.div>
          {description && (
            <motion.p
              className="mt-4 max-w-xl text-body-lg text-neutral-600"
              initial={initial}
              animate="show"
              variants={descriptionVariants}
            >
              {description}
            </motion.p>
          )}
          {actions && (
            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={initial}
              animate="show"
              variants={actionsVariants}
            >
              {actions}
            </motion.div>
          )}
        </div>

        {visual && (
          <motion.div
            className="order-1 md:order-none md:col-span-2"
            initial={initial}
            animate="show"
            variants={visualVariants}
          >
            {/* Continuous slow float, mobile-only — desktop keeps the
                illustration perfectly still, exactly as before. */}
            <div className="animate-float-slow md:animate-none">{visual}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
