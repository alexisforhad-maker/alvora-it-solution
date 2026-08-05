"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export interface FadeUpProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds — used when several FadeUp instances sit in a row (see StaggerGrid). */
  delay?: number;
  /** Distance (px) the element travels — Design System §10 default is 16px. */
  distance?: number;
}

/**
 * Fade-up scroll-reveal — the standard "content enters the viewport"
 * animation used across nearly every page per Design System §10
 * (Scroll Animation: fade-up + 16px translate, 400-500ms, ease-out).
 * Respects prefers-reduced-motion by rendering content statically.
 */
export function FadeUp({ children, className, delay = 0, distance = 16 }: FadeUpProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
