import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface IndustryCardProps {
  name: string;
  relevanceStatement: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Industry Card — used on Homepage industries strip and the Industries
 * hub grid. Same visual pattern as ServiceCard for consistency, per
 * Design System §13 (Consistency).
 */
export function IndustryCard({ name, relevanceStatement, href, icon: Icon }: IndustryCardProps) {
  return (
    <Card className="group h-full">
      <Link href={href} className="flex h-full flex-col gap-3 p-5">
        {/* Same soft-glow treatment as ServiceCard's icon, just recolored
            to primary/navy to match this badge's own gradient/hover fill
            (the shared `glow` token is teal-tinted, so a matching-scale
            arbitrary shadow is used here instead of a mismatched color). */}
        <span className="flex size-11 items-center justify-center rounded-input bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-primary-dark group-hover:text-white group-hover:shadow-[0_0_0_1px_rgba(70,215,215,0.25),0_8px_24px_rgba(0,0,0,0.35)]">
          <Icon className="size-[20px]" aria-hidden="true" />
        </span>
        <h3 className="font-heading text-h6 text-primary group-hover:underline group-hover:decoration-secondary group-hover:underline-offset-4">
          {name}
        </h3>
        <p className="text-body text-neutral-600">{relevanceStatement}</p>
        <span className="mt-auto flex items-center gap-1.5 text-button text-secondary">
          Explore
          <ArrowRight className="size-[16px] transition-transform duration-slow ease-premium group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </Card>
  );
}
