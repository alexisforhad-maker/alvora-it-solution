import type { LucideIcon } from "lucide-react";

export interface TechnologyCardProps {
  name: string;
  icon: LucideIcon;
}

/**
 * Technology Card — small icon + label, used in grouped rows on the
 * Technologies page and the "Technologies Used" row on Service Detail
 * / Portfolio Detail pages. Renders a category icon rather than an
 * official product logo — avoids reproducing third-party trademarks
 * and keeps the visual language consistent with the rest of the site
 * (custom geometric icon style, per Design System §7). Deliberately
 * minimal: Phase 2 spec calls for "no per-icon animation, avoids a
 * busy badge wall".
 */
export function TechnologyCard({ name, icon: Icon }: TechnologyCardProps) {
  return (
    <div className="hover-lift group flex flex-col items-center gap-2 rounded-card border border-border bg-surface p-4 text-center hover:border-secondary/30 hover:bg-background hover:shadow-card-hover">
      <Icon className="size-[32px] text-secondary transition-transform duration-slow ease-premium group-hover:scale-110" aria-hidden="true" />
      <span className="text-caption font-medium text-neutral-900">{name}</span>
    </div>
  );
}
