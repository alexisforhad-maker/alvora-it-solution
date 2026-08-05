"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary. Next.js renders this automatically when
 * a rendering error is thrown anywhere within this segment's tree.
 * Kept dependency-free (no design system components beyond Button)
 * since an error state should never itself be a source of failure.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with real error monitoring (e.g. Sentry) in a later phase.
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-heading text-h6 text-secondary">Something went wrong</p>
      <h1 className="mt-2 font-heading text-h3 text-primary md:text-h2">
        We hit an unexpected error
      </h1>
      <p className="mt-3 max-w-md text-body text-neutral-600">
        Our team has been notified. You can try again, or head back to the
        homepage.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()}>Try Again</Button>
        <Button asChild variant="secondary">
          <Link href="/">Back to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
