import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Marks the field as invalid — pairs with an Alert/inline error message via aria-describedby on the consuming form field. */
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex h-11 w-full rounded-input border border-border bg-background px-4 text-body text-neutral-900 placeholder:text-neutral-600 transition-colors duration-fast ease-standard",
          "focus-visible:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid && "border-error focus-visible:border-error focus-visible:ring-error/30",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
