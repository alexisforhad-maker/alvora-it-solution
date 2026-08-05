"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/**
 * Switch — used in Admin Site Settings (Phase 2 §11 admin module).
 * Note per Design System §11: on/off state must be communicated with
 * text as well as position/color — consuming code should always pair
 * this with a visible label, not rely on the switch alone.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-[24px] w-11 shrink-0 items-center rounded-pill border border-border bg-neutral-300 transition-colors duration-fast",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-secondary data-[state=checked]:border-secondary",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block size-[20px] translate-x-0.5 rounded-full bg-white shadow-card transition-transform duration-fast",
        "data-[state=checked]:translate-x-[22px]"
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
