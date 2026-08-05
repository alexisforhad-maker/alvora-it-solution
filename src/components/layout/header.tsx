"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { primaryNav, siteConfig } from "@/config/site";

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

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
 * Mobile scroll-direction logo toggle — below 768px:
 *
 *   - There is exactly ONE logo in the DOM: the original fused
 *     icon+wordmark asset (public/images/logo.png, the same one used
 *     everywhere else on the site — Footer, AdminSidebar, admin
 *     login), rendered once, completely unmodified. Earlier passes
 *     tried splitting it into icon+text, crossfading it against a
 *     separate standalone-icon asset, and wrapping it in a floating
 *     glass "pill" — all reverted. This is deliberately just one
 *     `<Link>`/`<Image>` moved by one wrapping `motion.div`; nothing
 *     else lives behind or beside it.
 *   - `compact` is a plain boolean, flipped by comparing each scroll
 *     event's `y` to the *previous* one — not a position threshold:
 *     `y > lastY` → true (center), `y < lastY` → false (left). This
 *     is exactly what makes reversal instant regardless of depth: at
 *     any scrollY, the very next upward pixel flips it back, because
 *     the comparison is always against the immediately preceding
 *     position, never a fixed line like "scrollY > 80". Equal `y`
 *     (no net movement) leaves the state untouched.
 *   - The animation itself is a plain two-value Framer Motion
 *     `animate`/`variants` toggle (`"left"` ↔ `"center"`, x + scale
 *     only) with a fixed 460ms/cubic-bezier(0.22,1,0.36,1) transition
 *     — no spring, no MotionValue chain, no per-pixel interpolation.
 *     Framer Motion's own animation engine (WAAPI/rAF under the hood)
 *     handles the actual frame-by-frame easing.
 *   - `compactActive` additionally requires `isMobile` and
 *     `!prefers-reduced-motion`; whenever either is false the variant
 *     always resolves to `"left"` (x:0, scale:1 — a no-op), so
 *     desktop and reduced-motion users are structurally unaffected
 *     regardless of `compact`'s value.
 *
 * No `height`/`width`/`left`/`top` is ever animated — only
 * `transform` (translateX + scale) on the logo, and `opacity` on the
 * hamburger. The header's own box height never changes, so there's no
 * reflow/CLS risk at all.
 *
 * The x offset used to center the logo is computed from `offsetLeft`/
 * `offsetWidth` (layout geometry, unaffected by the *current* Framer
 * Motion transform, unlike `getBoundingClientRect`) — see `measure()`
 * — so it's correct however many times it's remeasured regardless of
 * scroll/animation state at that moment.
 */
export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [logoShiftX, setLogoShiftX] = React.useState(0);
  const [compact, setCompact] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  const rowRef = React.useRef<HTMLDivElement>(null);
  const logoWrapRef = React.useRef<HTMLDivElement>(null);
  const lastYRef = React.useRef(0);

  React.useEffect(() => {
    lastYRef.current = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const lastY = lastYRef.current;
      // Existing 24px threshold — shared border/shadow, desktop +
      // mobile, unrelated to the direction-based logo toggle below.
      setScrolled(y > 24);
      if (y > lastY) {
        setCompact(true);
      } else if (y < lastY) {
        setCompact(false);
      }
      lastYRef.current = y;
    }
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
      const wrap = logoWrapRef.current;
      if (!row || !wrap) return;
      const rowCenter = row.offsetLeft + row.offsetWidth / 2;
      const wrapCenter = wrap.offsetLeft + wrap.offsetWidth / 2;
      setLogoShiftX(rowCenter - wrapCenter);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const compactActive = isMobile && !shouldReduceMotion && compact;

  return (
    <header
      className={cn(
        "glass-panel sticky top-0 z-40 w-full border-b transition-all duration-base",
        scrolled ? "border-border shadow-elevated" : "border-transparent bg-background/80"
      )}
    >
      <div
        ref={rowRef}
        className="container flex h-[5.5rem] items-center justify-between"
      >
        {/* The one and only logo — the exact original lockup,
            byte-for-byte unchanged (same asset, same width/height,
            same classes, same spacing), for both mobile and desktop.
            Only this wrapping `motion.div` moves/scales it as a
            whole; nothing else is ever rendered here. */}
        <motion.div
          ref={logoWrapRef}
          animate={compactActive ? "center" : "left"}
          variants={{
            left: { x: 0, scale: 1 },
            center: { x: logoShiftX, scale: 0.87 }, // ~13% smaller, within the 10–15% target
          }}
          transition={{ duration: 0.46, ease: EASE_PREMIUM }}
          style={{ willChange: "transform", backfaceVisibility: "hidden" }}
        >
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
          {/* Same direction-driven boolean as the logo — fades out as
              the logo reaches center, fades back in the instant scroll
              direction reverses. `inert` while faded so a transparent
              button can't be focused/tapped. */}
          <motion.div
            animate={{ opacity: compactActive ? 0 : 1 }}
            transition={{ duration: 0.46, ease: EASE_PREMIUM }}
            style={{ willChange: "opacity" }}
            inert={compactActive}
          >
            <MobileNav />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
