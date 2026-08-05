"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { primaryNav, siteConfig } from "@/config/site";

/**
 * Sticky header — white background, subtle shadow appears only after
 * scrolling past the hero, per Phase 2 UI/UX spec (Navigation
 * component). Persists the primary "Book a Free Consultation" CTA on
 * every public page except Request a Quote (handled by the page
 * itself, not this component).
 *
 * Height is 88px (h-[5.5rem]) rather than the default 80px (h-20) —
 * a Phase 3I visual QA fix: the original height read as slightly
 * cramped against the Homepage Hero's headline, and 88px gives the
 * logo/nav more breathing room at every screen size without changing
 * anything else about the design language.
 *
 * Logo asset note (stabilization pass): the source file
 * (public/images/logo.png) was a 4000x4000 square canvas with the
 * mark+wordmark occupying only its center ~1.89:1 region. Every
 * <Image> usage across the site had width/height props (180x44 etc.)
 * that assumed a ~4:1 ratio, which does not match the file's actual
 * content — the logo was rendering stretched. The asset has been
 * trimmed to its true content bounds (now ~1.89:1) and every usage's
 * width/height props updated to match, so w-auto sizing is accurate
 * everywhere it appears (this file, Footer, AdminSidebar, admin login).
 */
export function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "glass-panel sticky top-0 z-40 w-full border-b transition-all duration-base",
        scrolled
          ? "border-border shadow-elevated"
          : "border-transparent bg-background/80"
      )}
    >
      <div className="container flex h-[5.5rem] items-center justify-between">
        <Link
          href="/"
          className="group relative flex items-center gap-2"
          aria-label={`${siteConfig.name} — Home`}
        >
          {/* Header logo — Vercel/Linear-inspired restraint, per explicit
              client direction. Stays pure white at all times.
              HOTFIX: a `group-hover:brightness-*` utility was removed
              from here — Tailwind composes brightness/invert/drop-shadow
              through shared `--tw-*` CSS custom properties, and a
              hover-scoped brightness utility has higher specificity
              than the base `brightness-0`, so it was overriding
              (not combining with) `--tw-brightness` on hover. That
              silently removed the "blackout" step `invert` depends on
              to turn the colored artwork white, so hover was inverting
              the ORIGINAL navy/teal colors instead — producing the
              reported yellow/orange/red tint. Hover is now exactly
              scale + a white drop-shadow glow; neither touches
              brightness or invert, so this can't recur. */}
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            width={170}
            height={90}
            priority
            className="h-[56px] w-auto brightness-0 invert transition-all duration-slow ease-premium group-hover:scale-[1.02] group-hover:drop-shadow-[0_2px_14px_rgba(255,255,255,0.35)]"
          />
          {/* Optional shine — a single, very subtle light pass confined
              to the logo's own silhouette (CSS mask referencing the
              same PNG as its alpha shape, not a blend-mode trick — a
              blend-mode sweep would be invisible against a solid-white
              shape, the same issue caught and fixed on the splash
              screen earlier). Runs once per hover, low opacity, and
              never extends past the logo itself — "only the logo," per
              the brief. Safe to delete this one block if it doesn't
              read well in practice; nothing else depends on it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 shimmer-surface transition-opacity duration-slow ease-premium group-hover:opacity-40 group-hover:animate-shimmer"
            style={{
              WebkitMaskImage: "url(/images/logo.png)",
              maskImage: "url(/images/logo.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
              animationIterationCount: 1,
            }}
          />
        </Link>

        <MegaMenu items={primaryNav} />

        <div className="flex items-center gap-3">
          {/* size="lg" (48px) — kept at lg rather than matching the
              56px logo 1:1; a CTA taller than 48px starts to compete
              with the logo for visual weight instead of supporting
              it, and 48px already reads as premium next to the nav. */}
          <Button asChild size="lg" className="hidden sm:inline-flex">
            <Link href="/request-a-quote">Book a Free Consultation</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
