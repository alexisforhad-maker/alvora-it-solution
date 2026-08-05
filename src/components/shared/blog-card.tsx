import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export interface BlogCardProps {
  title: string;
  href: string;
  heroImage: string;
  categoryLabel: string;
  publishedAt: string;
  readingTimeMinutes: number;
  authorName: string;
  /** Featured cards render larger with a two-column layout on desktop. */
  featured?: boolean;
}

/**
 * Blog Card — image top, category pill, title, read-time + date,
 * author byline, per Phase 2 §12/§13. The `featured` variant is used
 * for the pinned/most-recent post at the top of the Blog hub.
 */
export function BlogCard({
  title,
  href,
  heroImage,
  categoryLabel,
  publishedAt,
  readingTimeMinutes,
  authorName,
  featured = false,
}: BlogCardProps) {
  return (
    <Card className="group overflow-hidden p-0">
      <Link href={href} className={featured ? "grid md:grid-cols-2" : "block"}>
        <div className={`relative overflow-hidden bg-neutral-100 ${featured ? "aspect-[16/10] md:aspect-auto" : "aspect-[16/10]"}`}>
          <Image
            src={heroImage}
            alt=""
            fill
            sizes={
              featured
                ? "(min-width: 768px) 50vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-slow ease-premium group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-primary-dark/0 to-primary-dark/0 opacity-0 transition-opacity duration-slow ease-premium group-hover:opacity-100" />
        </div>
        <div className="flex flex-col justify-center gap-3 p-5">
          <Badge>{categoryLabel}</Badge>
          <h3 className={`font-heading text-primary transition-colors duration-slow ease-premium group-hover:text-secondary ${featured ? "text-h3" : "text-h5"}`}>{title}</h3>
          <p className="text-caption text-neutral-600">
            {authorName} &middot; {formatDate(publishedAt)} &middot; {readingTimeMinutes} min read
          </p>
        </div>
      </Link>
    </Card>
  );
}
