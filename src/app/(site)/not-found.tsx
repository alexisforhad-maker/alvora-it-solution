import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  path: "/404",
  noIndex: true,
});

const quickLinks = [
  { label: "Homepage", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

/**
 * 404 page — Next.js renders this automatically for any unmatched
 * route. Per Phase 2 spec: centered, minimal, a brand-styled
 * illustration rather than a generic error graphic, quick links to
 * recover rather than a dead end, and the full header/footer still
 * present (handled by the root layout).
 */
export default function NotFound() {
  return (
    <div className="bg-mesh-wash relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden py-9 text-center">
      <div className="container relative flex flex-col items-center">
        {/* Static per the site-wide motion audit — logos/brand marks no
            longer float continuously anywhere on the site. */}
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <polygon points="60,10 100,100 60,75 20,100" fill="var(--color-secondary)" opacity="0.15" />
          <polygon points="60,10 80,65 60,75" fill="var(--color-accent-blue)" />
          <polygon points="60,10 40,65 60,75" fill="var(--color-secondary)" />
        </svg>

        <p className="mt-6 font-heading text-h6 text-secondary">404</p>
        <h1 className="text-balance mt-2 text-h2-mobile font-heading text-primary md:text-h2">
          This Page Took a Wrong Turn
        </h1>
        <p className="mt-3 max-w-md text-body-lg text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Here are a few
          places to go instead.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/">Back to Homepage</Link>
        </Button>

        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body text-secondary underline underline-offset-2 transition-colors hover:text-secondary-light"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
