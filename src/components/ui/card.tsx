import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Base Card primitive — Black Edition: genuine glassmorphism.
 * - `bg-surface` (opaque) → `bg-surface/70` + `backdrop-blur-lg`, so
 *   cards read as frosted glass over the aurora/mesh backdrop behind
 *   them rather than a flat opaque panel. Blur eased from `xl` to
 *   `lg` (Final Luxury Polish pass) — explicitly asked for restraint
 *   on glassmorphism intensity; still genuinely frosted, just not the
 *   heaviest blur step, per the same "avoid heavy glassmorphism" note
 *   raised in both the color and final-polish briefs.
 * - Border brightened (`border-border`, the same 8%-white token used
 *   sitewide — previously written as the equivalent hardcoded
 *   `border-white/[0.08]`, same computed value, now on the token) so
 *   the glass edge is visible against dark backgrounds.
 * - Top accent bar's gradient stops changed to cyan/accent-blue/
 *   accent-purple (richer than secondary/primary/accent now that
 *   `primary` is a light color, which would leave a flat pale gap in
 *   the middle of that gradient).
 * - "group" always present, `shadow-elevated-hover` as the default
 *   hover shadow (re-tuned to a colored glow in tailwind.config.ts).
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group hover-lift relative overflow-hidden rounded-card border border-border bg-surface/70 backdrop-blur-lg hover:border-cyan/30 hover:shadow-elevated-hover",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-cyan via-accent-blue to-accent-purple opacity-0 transition-all duration-slow ease-premium group-hover:scale-x-100 group-hover:opacity-100"
      />
      {children}
    </div>
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-5", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-heading text-h5 text-primary", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-body text-neutral-600", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-5 pb-5", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center px-5 pb-5", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
