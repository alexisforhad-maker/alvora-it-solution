"use client";

import * as React from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

/**
 * Newsletter — simple email capture block used at the bottom of the
 * Blog hub, per Phase 2 §12. Kept as a secondary, low-friction
 * conversion path (single field, no name/other data collected).
 */
export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setErrorMessage(result.error.issues[0]?.message ?? "Invalid email.");
      setStatus("error");
      return;
    }
    // API route (e.g. /api/newsletter) is wired up in a later phase.
    setStatus("success");
  }

  return (
    // Root-cause fix (readability/contrast): `bg-grid-faint` uses
    // `mask-image`, which composites the ENTIRE element it's applied
    // to, not just its background-image layer — it used to sit
    // directly on this card (also wrapping the real heading/paragraph/
    // form as children), silently fading that real content toward
    // transparent along with the decorative grid texture. Isolated
    // below into its own absolutely-positioned decorative sibling —
    // the same pattern already used correctly elsewhere for this exact
    // utility (see hero.tsx, hero-illustration.tsx) — so the card's
    // background, border, shadow, and padding are all unchanged, and
    // real content simply no longer sits inside the masked layer.
    <div className="relative overflow-hidden rounded-card border border-border bg-surface p-6 shadow-elevated md:p-8">
      <div className="bg-grid-faint pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <h3 className="font-heading text-h4 text-primary">Stay Ahead of the Curve</h3>
        <p className="mt-2 max-w-md text-body text-neutral-600">
          Occasional insights on technology, automation, and business growth — no spam.
        </p>

        {status === "success" ? (
          <Alert variant="success" title="You're subscribed" className="mt-4">
            We&apos;ll only email you when there&apos;s something worth reading.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              invalid={status === "error"}
              aria-describedby={status === "error" ? "newsletter-error" : undefined}
              required
            />
            <Button type="submit" className="shrink-0">
              Subscribe
            </Button>
          </form>
        )}
        {status === "error" && (
          <p id="newsletter-error" role="alert" className="mt-2 text-caption text-error">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
