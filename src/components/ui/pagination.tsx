import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Given a page number, returns the URL for that page (e.g. `/blog?page=2`). */
  buildHref: (page: number) => string;
  /** Below this page count, render numbered links; above it, render prev/next only, per Phase 2 §12 mobile spec. */
  simplifiedThreshold?: number;
}

/**
 * Pagination — numbered on larger result sets, collapsing to a simple
 * prev/next pair on mobile-sized result sets or when explicitly told
 * to via simplifiedThreshold, per the Blog hub mobile behavior spec.
 */
export function Pagination({
  currentPage,
  totalPages,
  buildHref,
  simplifiedThreshold = 7,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const useSimplified = totalPages > simplifiedThreshold;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <PageLink
        href={buildHref(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="size-[16px]" />
      </PageLink>

      {!useSimplified &&
        pages.map((page) => (
          <PageLink
            key={page}
            href={buildHref(page)}
            active={page === currentPage}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </PageLink>
        ))}

      {useSimplified && (
        <span className="px-3 text-body text-neutral-600">
          Page {currentPage} of {totalPages}
        </span>
      )}

      <PageLink
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className="size-[16px]" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & { active?: boolean; disabled?: boolean }) {
  if (disabled) {
    return (
      <span
        className="flex size-[40px] items-center justify-center rounded-input text-neutral-300"
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex size-[40px] items-center justify-center rounded-input text-body text-neutral-600 transition-colors",
        "hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30",
        active && "bg-secondary text-secondary-foreground hover:bg-secondary"
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
