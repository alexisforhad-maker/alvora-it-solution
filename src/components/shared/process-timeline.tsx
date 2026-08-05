"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProcessTimelineProps {
  steps: readonly { step: number; name: string; description: string }[];
  /** "condensed" renders the Homepage snapshot (fewer visual details); "full" renders the dedicated Process page treatment. */
  variant?: "condensed" | "full";
  className?: string;
}

/**
 * Process Timeline — the 8-step engagement process, rendered as an
 * ordered list (screen readers announce step order correctly) with a
 * connecting line that "draws in" as each step enters the viewport on
 * the full Process page, per Phase 2 §9 (signature animation moment).
 * Numbering is appropriate here since this genuinely is a sequence.
 */
export function ProcessTimeline({ steps, variant = "full", className }: ProcessTimelineProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ol className={cn("relative flex flex-col gap-[32px] md:gap-[40px]", className)}>
      {steps.map((s, index) => (
        <li key={s.step} className="group relative flex gap-5 pl-1">
          <div className="flex flex-col items-center">
            <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-primary font-heading text-h6 text-white shadow-elevated ring-4 ring-secondary/0 transition-all duration-slow ease-premium group-hover:ring-secondary/20">
              {s.step}
            </span>
            {index < steps.length - 1 && (
              <motion.span
                className="mt-1 w-px flex-1 bg-gradient-to-b from-secondary/50 to-secondary/10"
                initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ transformOrigin: "top", minHeight: variant === "full" ? 56 : 32 }}
              />
            )}
          </div>
          <div className="pb-2">
            <h3 className="font-heading text-h5 text-primary transition-colors duration-slow ease-premium group-hover:text-secondary">{s.name}</h3>
            <p className="mt-1 text-body text-neutral-600">{s.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
