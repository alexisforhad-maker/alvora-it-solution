import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbJsonLd } from "@/lib/seo";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb — appears on all deep pages (Service Details, Industry
 * Details, Portfolio Details, Blog Details) per Phase 2 cross-cutting
 * notes. Emits BreadcrumbList schema alongside the visible trail.
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLd = breadcrumbJsonLd(
    items.map((item) => ({ name: item.name, url: item.href }))
  );

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-2 text-caption">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-neutral-900" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="text-neutral-600 transition-colors duration-fast hover:text-secondary">
                    {item.name}
                  </Link>
                  <ChevronRight className="size-[14px] text-neutral-300" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
