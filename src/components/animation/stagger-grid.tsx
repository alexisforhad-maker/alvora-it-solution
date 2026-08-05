"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Children } from "react";
import { cn } from "@/lib/utils";

export interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  /** Delay between each child's entrance, in seconds — Design System §10 default is 60-80ms. */
  staggerDelay?: number;
}

const containerVariants = (staggerDelay: number) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: staggerDelay },
  },
});

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

/**
 * Wraps a grid/list of cards and staggers their fade-up entrance as the
 * group scrolls into view — used for Service grids, Portfolio grids,
 * Industry grids, Blog grids, etc. per Design System §10 (Card
 * Animation: 60-80ms stagger between items).
 */
export function StaggerGrid({ children, className, staggerDelay = 0.07 }: StaggerGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants(staggerDelay)}
    >
      {Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
