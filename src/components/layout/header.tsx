"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
 *
 * Mobile "morphing logo" scroll transition: below 768px, scrolling
 * *down* past ~80px translates+scales the logo to a centered, 80%-size
 * resting position via Framer Motion (plus a soft <10%-opacity cyan
 * glow that fades in behind it, riding the same wrapper transform),
 * fades the hamburger trigger out (and fully out of layout — see the
 * `AnimatePresence` around `MobileNav` below), and the header chrome
 * shrinks to a slim glass bar (`.header-mobile-compact` +
 * `.header-row`, both media-query-scoped in globals.css so they're a
 * no-op at md+). Reversal is *direction*-based, not position-based —
 * any upward scroll movement (a few px is enough) immediately
 * reverses it, without waiting for a return to the top; `lastYRef`
 * tracks the previous scrollY purely to compute that per-event delta
 * and is never rendered.
 *
 * The row's `height` is the one deliberate exception to "animate only
 * transform/opacity" here — shrinking a sticky header's actual box
 * height can't be faked with `scale` without the header's own
 * background clipping to a smaller box and revealing whatever's
 * behind it, so `.header-row`'s height transition is a plain (but
 * cheap: one small, isolated, already-`sticky` element, not a
 * page-wide reflow) CSS transition instead.
 *
 * Desktop's existing `scrolled` (24px border/shadow) behavior is
 * untouched — the new `compact` state and `isMobile` gate are
 * additive, and the logo's animate variant is "natural" (x:0, scale:1,
 * a no-op) whenever `isMobile` is false, so nothing here can affect
 * desktop rendering. The x offset is computed from `offsetLeft`/
 * `offsetWidth` (layout geometry, unlike `getBoundingClientRect`,
 * which reflects the *current* transform) so it stays correct however
 * many times it's remeasured.
 */
export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [compact, setCompact] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [logoShiftX, setLogoShiftX] = React.useState(0);
  const shouldReduceMotion = useReducedMotion();

  const rowRef = React.useRef<HTMLDivElement>(null);
  const logoWrapRef = React.useRef<HTMLDivElement>(null);
  const lastYRef = React.useRef(0);

  React.useEffect(() => {
    lastYRef.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastYRef.current;
      setScrolled(y > 24);
      if (delta > 2 && y > 80) {
        setCompact(true);
      } else if (delta < -2) {
        setCompact(false);
      }
      lastYRef.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  React.useLayoutEffect(() => {
    function measure() {
      const row = rowRef.current;
      const logo = logoWrapRef.current;
      if (!row || !logo) return;
      const rowCenter = row.offsetLeft + row.offsetWidth / 2;
      const logoCenter = logo.offsetLeft + logo.offsetWidth / 2;
      setLogoShiftX(rowCenter - logoCenter);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const morphActive = isMobile && compact && !shouldReduceMotion;

  return (
    <header
      className={cn(
        "glass-panel sticky top-0 z-40 w-full border-b transition-all duration-base",
        scrolled
          ? "border-border shadow-elevated"
          : "border-transparent bg-background/80",
        // Tied to `morphActive` (not raw `compact`) so the header's
        // CSS-driven chrome/height and the logo's Framer Motion state
        // always move — or stay frozen — together. Keying this off
        // `compact` alone would let the header shrink/darken under
        // `prefers-reduced-motion` while the (motion-gated) logo stays
        // put, cramming a full-size logo into a 56px bar.
        morphActive && "header-mobile-compact"
      )}
    >
      <div
        ref={rowRef}
        className="header-row container flex h-[5.5rem] items-center justify-between"
      >
        <motion.div
          ref={logoWrapRef}
          className="relative"
          animate={morphActive ? "compact" : "natural"}
          variants={{
            natural: { x: 0, scale: 1 },
            compact: { x: logoShiftX, scale: 0.8 },
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Soft premium glow behind the centered logo — capped well
              under 10% opacity per the brief, fades in on the exact
              same schedule as the logo since it rides this wrapper's
              own transform (translate/scale) and only ever animates
              its own opacity independently. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-cyan blur-xl"
            initial={false}
            animate={{ opacity: morphActive ? 0.08 : 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
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
              className="shimmer-surface pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-slow ease-premium group-hover:animate-shimmer group-hover:opacity-40"
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
        </motion.div>

        <MegaMenu items={primaryNav} />

        <div className="flex items-center gap-3">
          {/* size="lg" (48px) — kept at lg rather than matching the
              56px logo 1:1; a CTA taller than 48px starts to compete
              with the logo for visual weight instead of supporting
              it, and 48px already reads as premium next to the nav. */}
          <Button asChild size="lg" className="hidden sm:inline-flex">
            <Link href="/request-a-quote">Book a Free Consultation</Link>
          </Button>
          {/* Fades out AND leaves layout (no placeholder) once the
              compact mobile morph is active — AnimatePresence removes
              it from the DOM only after its exit fade completes, and
              the Drawer/menu it wraps locks page scroll while open
              (Radix Dialog), so it can never be unmounted mid-use. */}
          <AnimatePresence initial={false}>
            {!morphActive && (
              <motion.div
                key="mobile-nav"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <MobileNav />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
