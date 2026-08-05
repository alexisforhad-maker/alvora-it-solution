"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { primaryNav, siteConfig } from "@/config/site";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

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
 * Mobile scroll morph — a single logo element, below 768px:
 *
 *   - There is exactly ONE logo in the DOM: the original fused
 *     icon+wordmark asset (public/images/logo.png, same one used
 *     everywhere else on the site — Footer, AdminSidebar, admin
 *     login), rendered once, completely unmodified (same width/
 *     height props, same classes, same internal spacing). Earlier
 *     passes tried splitting it into icon+text, then crossfading it
 *     against the separate standalone icon asset — both were
 *     reverted; neither belongs here. The single `<Link>`/`<Image>`
 *     below never duplicates, never swaps assets, never shows a
 *     second logo at any point in the animation.
 *   - The one wrapping `motion.div` moves and scales this logo as a
 *     single rigid unit — `translateX` (left → center) + a uniform
 *     `scale()` (100% → 87%, within the requested 10–15% reduction),
 *     nothing else. Proportions and the icon/wordmark spacing baked
 *     into the asset are untouched since it's one un-split image.
 *   - `progress` is a MotionValue from 0 (natural) to 1 (fully
 *     compact), driven by *scroll delta* rather than absolute scrollY:
 *     every scroll event nudges it by `Δy / 100`, clamped. This is
 *     the only way to satisfy both halves of the brief at once — "0 to
 *     100px of continuous downward scroll" AND "any upward movement,
 *     even 5px, reverses immediately, regardless of how far down the
 *     page you are." A pure position-based mapping (`scrollY / 100`)
 *     can only do the first: once compact at, say, y=4000, scrolling
 *     up to y=3995 wouldn't budge it. Delta-accumulation makes
 *     direction (not position) the source of truth, while still
 *     reducing to the exact position-based curve when scrolling
 *     starts from the top.
 *   - `smoothProgress = useSpring(progress, {stiffness:120, damping:24,
 *     mass:0.8})` adds the "floating," never-snaps physical feel —
 *     there's no threshold to switch across, so scrolling up never
 *     "snaps"; it continuously eases back the way it came.
 *   - `effectiveProgress` is `smoothProgress` gated to 0 whenever the
 *     feature should be a no-op — desktop (`!isMobile`) or
 *     `prefers-reduced-motion`. Every visual MotionValue (logo x/
 *     scale, hamburger opacity, glow, floating pill) derives from
 *     this ONE gated value, so mobile and desktop/reduced-motion can
 *     never fall out of sync with each other.
 *   - None of this touches React state per scroll pixel — `progress`
 *     and every derived value are plain MotionValues, updated outside
 *     React's render cycle. The only `setState` calls left are for
 *     the 24px shared border/shadow (existing, untouched, low-
 *     frequency) and a single boolean crossing a 0.92 threshold to
 *     make the fully-faded hamburger non-interactive.
 *
 * No `height` is ever animated — the "header compacts" impression
 * comes entirely from the logo's own translate/scale plus a separate
 * floating glass pill with its own fixed (never-animated) size, whose
 * only motion is opacity/y entrance. The header's actual box height
 * never changes, so there's no reflow/CLS risk at all, regardless of
 * animation state.
 *
 * The x offset used to center the logo is computed from `offsetLeft`/
 * `offsetWidth` (layout geometry, unaffected by the *current* Framer
 * Motion transform, unlike `getBoundingClientRect`) — see `measure()`
 * — so it's correct however many times it's remeasured regardless of
 * scroll/animation state at that moment. The wrapper's own box is
 * exactly the logo's box (nothing else lives inside it), so `scale()`'s
 * default center transform-origin is already correct.
 */
export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [logoShiftX, setLogoShiftX] = React.useState(0);
  const [hamburgerInert, setHamburgerInert] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  const rowRef = React.useRef<HTMLDivElement>(null);
  const logoWrapRef = React.useRef<HTMLDivElement>(null);
  const lastYRef = React.useRef(0);

  // Existing 24px threshold — shared border/shadow, desktop + mobile,
  // untouched by anything below.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  const { scrollY } = useScroll();
  const progress = useMotionValue(0);

  React.useEffect(() => {
    // Initialize from actual scroll position (not 0) so a page load
    // that starts already-scrolled (scroll restoration, anchor link)
    // reflects the correct state immediately, before any delta-based
    // update has happened.
    lastYRef.current = window.scrollY;
    progress.set(clamp01(window.scrollY / 100));
  }, [progress]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastYRef.current;
    lastYRef.current = y;
    progress.set(clamp01(progress.get() + delta / 100));
  });

  const smoothProgress = useSpring(progress, { stiffness: 120, damping: 24, mass: 0.8 });
  const active = isMobile && !shouldReduceMotion;
  const effectiveProgress = useTransform(smoothProgress, (p) => (active ? p : 0));

  const logoX = useTransform(effectiveProgress, [0, 1], [0, logoShiftX]);
  const logoScale = useTransform(effectiveProgress, [0, 1], [1, 0.87]); // ~13% smaller, within the 10–15% target
  const logoGlowOpacity = useTransform(effectiveProgress, [0.6, 1], [0, 0.07]);
  const pillOpacity = useTransform(effectiveProgress, [0.7, 1], [0, 1]);
  const pillY = useTransform(effectiveProgress, [0.7, 1], [4, 0]);
  const hamburgerOpacity = useTransform(
    effectiveProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [1, 0.9, 0.7, 0.4, 0.15, 0]
  );

  useMotionValueEvent(effectiveProgress, "change", (p) => {
    setHamburgerInert((prev) => {
      const next = p > 0.92;
      return prev === next ? prev : next;
    });
  });

  return (
    <header
      className={cn(
        "glass-panel sticky top-0 z-40 w-full border-b transition-all duration-base",
        scrolled ? "border-border shadow-elevated" : "border-transparent bg-background/80"
      )}
    >
      {/* No `position: relative` here — `header`'s own `sticky`
          positioning is already the nearest positioned ancestor for
          both the floating pill and the logo wrapper below, which
          `measure()` (in the effect above) relies on: it needs
          `row.offsetLeft` and the logo wrapper's `offsetLeft` in the
          *same* coordinate frame to compute a correct centering
          delta. Adding `relative` here would make `row` itself the
          logo wrapper's offsetParent instead, breaking that shared
          frame (and, on mobile, the pill's `left-1/2` centers on the
          same point either way, since the container's own horizontal
          padding is symmetric — so there's nothing to gain from it). */}
      <div
        ref={rowRef}
        className="container flex h-[5.5rem] items-center justify-between"
      >
        {/* Floating glass nav pill — mobile only. Fixed size, never
            itself animated (no width/height in the transition list);
            only opacity and a small entrance `y` move, appearing as
            the logo finishes settling into its centered position. */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 md:hidden"
          aria-hidden="true"
        >
          <motion.div
            className="floating-nav-pill h-14 w-[168px] rounded-pill"
            style={{
              opacity: pillOpacity,
              y: pillY,
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
            }}
          />
        </div>

        {/* The one and only logo — the exact original lockup,
            byte-for-byte unchanged (same asset, same width/height,
            same classes, same spacing), for both mobile and desktop.
            Only this wrapping `motion.div` moves/scales it as a
            whole; nothing inside is aware of the morph, nothing here
            is duplicated or swapped. */}
        <motion.div
          ref={logoWrapRef}
          className="relative"
          style={{
            x: logoX,
            scale: logoScale,
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Soft premium glow behind the logo — capped well under 8%
              opacity per the brief, riding this wrapper's own
              transform so it travels with the logo. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-cyan blur-xl"
            style={{ opacity: logoGlowOpacity }}
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
          {/* Continuous opacity fade (not a mount/unmount switch — a
              binary swap would read as two states, not one fluid
              motion). `hamburgerInert` only flips once fully
              transparent, applying the native `inert` attribute —
              which removes the trigger button from both the a11y tree
              and tab order in one step, no MobileNav changes needed —
              purely so a fully-faded button can't be clicked or
              tabbed to; it's a single boolean crossing one threshold,
              not a per-pixel state update. */}
          <motion.div
            style={{ opacity: hamburgerOpacity, willChange: "opacity" }}
            inert={hamburgerInert}
          >
            <MobileNav />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
