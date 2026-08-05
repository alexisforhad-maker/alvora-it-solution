import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface ServiceCardProps {
  name: string;
  shortDescription: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Service Card — used on Homepage services overview and the Services
 * hub grid. Entire card is one accessible link, per Phase 2
 * accessibility note for the Services hub.
 */
export function ServiceCard({ name, shortDescription, href, icon: Icon }: ServiceCardProps) {
  return (
    <Card className="group h-full">
      <Link href={href} className="flex h-full flex-col gap-4 p-5">
        <span className="flex size-12 items-center justify-center rounded-input bg-gradient-to-br from-secondary/15 to-secondary/5 text-secondary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:shadow-glow">
          <Icon className="size-[24px]" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-heading text-h5 text-primary transition-colors duration-slow ease-premium group-hover:text-secondary">{name}</h3>
          <p className="mt-2 text-body text-neutral-600">{shortDescription}</p>
        </div>
        <span className="mt-auto flex items-center gap-1.5 text-button text-secondary">
          Learn More
          <ArrowRight className="size-[16px] transition-transform duration-slow ease-premium group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </Card>
  );
}
