import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PricingCardProps {
  name: string;
  price: string;
  billingNote?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
}

/**
 * Pricing Card — per the Master Blueprint (§1.11) and Phase 2 spec,
 * Alvora does not display public pricing (consultation-first model).
 * This component exists for internal use only: client proposals, an
 * Admin-generated quote document, or a future gated/partner portal —
 * never rendered on the public marketing site.
 */
export function PricingCard({
  name,
  price,
  billingNote,
  description,
  features,
  ctaLabel,
  ctaHref,
  highlighted = false,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-6 p-6",
        highlighted
          ? "border-secondary shadow-glow hover:shadow-glow"
          : "hover:shadow-elevated-hover"
      )}
    >
      <div>
        <h3 className="font-heading text-h5 text-primary">{name}</h3>
        <p className="mt-1 text-body text-neutral-600">{description}</p>
      </div>
      <div>
        <span className="font-heading text-h2 text-primary">{price}</span>
        {billingNote && <span className="ml-2 text-caption text-neutral-600">{billingNote}</span>}
      </div>
      <ul className="flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-body text-neutral-900">
            <Check className="mt-0.5 size-[16px] shrink-0 text-secondary" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <Button asChild className="mt-auto" variant={highlighted ? "primary" : "secondary"}>
        <a href={ctaHref}>{ctaLabel}</a>
      </Button>
    </Card>
  );
}
