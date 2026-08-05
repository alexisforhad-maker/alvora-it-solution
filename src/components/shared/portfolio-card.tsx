import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PortfolioCardProps {
  title: string;
  href: string;
  thumbnail: string;
  serviceTags: string[];
  industryTags: string[];
  resultStat?: string;
}

/**
 * Portfolio Card — thumbnail, tags, title, one-line result stat, with
 * "View Case Study" revealed on hover, per Phase 2 §7. Used on
 * Homepage Featured Work and the Portfolio hub grid.
 */
export function PortfolioCard({
  title,
  href,
  thumbnail,
  serviceTags,
  industryTags,
  resultStat,
}: PortfolioCardProps) {
  return (
    <Card className="group overflow-hidden p-0 hover:shadow-elevated-hover">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-slow ease-premium group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/0 to-primary-dark/0 opacity-0 transition-opacity duration-slow ease-premium group-hover:opacity-100" />
          <span className="absolute right-4 top-4 flex size-[36px] translate-y-1 items-center justify-center rounded-full bg-white/90 text-primary-dark opacity-0 shadow-elevated backdrop-blur-sm transition-all duration-slow ease-premium group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowRight className="size-[16px] -rotate-45" aria-hidden="true" />
          </span>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {[...serviceTags, ...industryTags].slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="mt-3 font-heading text-h5 text-primary transition-colors duration-slow ease-premium group-hover:text-secondary">{title}</h3>
          {resultStat && (
            <p className="mt-1 text-body font-medium text-secondary">{resultStat}</p>
          )}
          <span className="mt-4 flex items-center gap-1.5 text-button text-secondary opacity-0 transition-all duration-slow ease-premium -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100">
            View Case Study
            <ArrowRight className="size-[16px] transition-transform duration-slow ease-premium group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
