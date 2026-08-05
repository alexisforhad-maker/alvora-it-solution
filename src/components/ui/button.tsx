import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button variants map directly to the Design System's component spec
 * (Phase 1 §6): Primary (navy fill), Secondary (teal outline), Ghost
 * (text-only, teal on hover). Radius, min-height (tap target), and
 * label weight are all pulled from design tokens, not ad-hoc values.
 *
 * ease-standard → ease-premium: part of the shared motion-system
 * refinement (Button/Card/icon-badge hovers, the hero illustration,
 * and the splash screen now all use the same Apple/Linear-style
 * expo-out curve) rather than the plain browser `ease-out`.
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-input text-button font-body transition-all duration-fast ease-premium active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-slow [&_svg]:ease-premium hover:[&_svg:last-child]:translate-x-0.5",
  {
    variants: {
      variant: {
        // Black Edition: `secondary` was a light frosted-glass button
        // (bg-white/40 + text-primary) — since `text-primary` is now a
        // light color, a light-glass bg would make its own label
        // unreadable. Rebuilt as dark frosted glass (bg-white/[0.06],
        // the exact "Glass Surface" value) with a cyan-accented border.
        // `primary` gets a pure-CSS hover shine sweep via an `after:`
        // pseudo-element (no extra DOM node — safe with asChild/Slot).
        primary:
          "bg-gradient-primary text-primary-foreground shadow-button hover:-translate-y-1 hover:shadow-button-hover hover:brightness-110 active:translate-y-0 active:brightness-100 after:pointer-events-none after:absolute after:inset-0 after:rounded-input after:bg-[linear-gradient(100deg,transparent_30%,rgba(255,255,255,0.28)_45%,rgba(255,255,255,0.28)_55%,transparent_70%)] after:bg-[length:200%_100%] after:opacity-0 hover:after:opacity-100 hover:after:animate-shimmer",
        secondary:
          "border border-cyan/30 bg-white/[0.06] text-primary backdrop-blur-md hover:-translate-y-1 hover:border-cyan hover:bg-cyan/10 hover:text-cyan hover:shadow-button active:translate-y-0",
        ghost:
          "text-secondary bg-transparent hover:bg-secondary/10 hover:text-secondary-light",
        destructive: "bg-error text-white shadow-button hover:-translate-y-0.5 hover:opacity-90 hover:shadow-button-hover active:translate-y-0",
      },
      size: {
        // NOTE: this project's Tailwind spacing scale redefines keys 3–10
        // to large macro-spacing values (e.g. key 8 = 96px, key 9 = 128px)
        // for section-level rhythm — see tailwind.config.ts. Numeric
        // spacing utilities (h-9, px-8, etc.) silently inherit that scale,
        // which is correct for section padding but catastrophically wrong
        // for component-level sizing like button height/padding. Every
        // value below is an explicit arbitrary pixel value for that
        // reason — do not "simplify" these back to plain numeric utilities.
        default: "h-11 px-[26px]", // 44px min height — tap-target requirement
        sm: "h-[36px] px-[18px]",
        lg: "h-12 px-[34px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
