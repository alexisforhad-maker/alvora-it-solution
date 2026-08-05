import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Alert — left-accent-bar style (4px color bar + icon + message), per
 * Design System §6. Used for form states, banner notices, etc.
 */
const alertVariants = cva(
  "flex gap-3 rounded-card border-l-4 bg-surface p-4",
  {
    variants: {
      variant: {
        success: "border-l-success",
        warning: "border-l-warning",
        error: "border-l-error",
        info: "border-l-secondary",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
} as const;

const iconColorMap = {
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-secondary",
} as const;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const Icon = iconMap[variant ?? "info"];
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className={cn("mt-0.5 size-[20px] shrink-0", iconColorMap[variant ?? "info"])} aria-hidden="true" />
      <div>
        {title && <p className="font-heading text-h6 text-neutral-900">{title}</p>}
        <div className="text-body text-neutral-600">{children}</div>
      </div>
    </div>
  );
}

export { Alert };
