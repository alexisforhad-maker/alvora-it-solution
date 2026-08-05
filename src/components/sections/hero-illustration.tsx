"use client";

import * as React from "react";
import Image from "next/image";
import { Globe, Webhook, LayoutDashboard, Cloud } from "lucide-react";

/**
 * Homepage Hero Illustration — "Master Luxury Hero Redesign."
 *
 * Full concept change from the previous orbit/satellite version, per
 * explicit instruction ("forget everything you previously built
 * regarding the Hero animation"). The logo asset itself is unchanged
 * (public/images/hero-mark.png, the real PNG, still used exactly as
 * provided) and the outer scaffolding (Hero.tsx, hero-section.tsx,
 * this component's export signature) is untouched — only what
 * happens inside this illustration changed.
 *
 * THE LOGO is now the "digital core" of the scene, not an animated
 * object:
 * - No breathing, no scaling, no rotation, no tilt, no idle motion of
 *   any kind. It simply sits there, still — the previous rounds'
 *   `animate-breathe` and mouse-proximity tilt are both gone entirely.
 * - Its only interactive state is a one-shot "light sweep" on
 *   proximity — a soft diagonal highlight crossing the mark once, like
 *   light reflecting across polished glass — no color change, no tint,
 *   built from the existing `.shimmer-surface` utility blended with
 *   `mix-blend-mode: overlay` so it reads as a sheen on the actual
 *   colored artwork rather than a flat wash.
 *
 * THE ENVIRONMENT does the moving instead:
 * - Four small floating glass UI modules (Browser, API, Dashboard,
 *   Cloud) drift with a very slow, small-amplitude float — deliberately
 *   calmer than the previous version's orbit, since these are meant to
 *   feel like ambient telemetry, not spinning satellites.
 * - Each module connects to the logo with an ultra-thin glowing line;
 *   along each line, a tiny glowing packet travels slowly back and
 *   forth and fades in/out naturally (SVG native `animateMotion` +
 *   `animate` on opacity — no per-frame JS needed for this, and it
 *   never looks like a laser since it's always fading at both ends of
 *   its journey, never a hard-edged streak).
 * - A handful of faint background grid-nodes softly pulse at staggered
 *   delays for a subtle "live network" feel.
 *
 * Mouse proximity affects the environment only (glow strengthens and
 * drifts toward the cursor, connection lines brighten) — never the
 * logo's position, scale, or rotation, and never animation *speed*
 * (changing a running animation's timing via JS is a proven source of
 * visible jumps, per earlier rounds — proximity here only ever touches
 * opacity/glow, which transitions smoothly).
 */

type ModuleDef = {
  name: string;
  Icon: typeof Globe;
  // Position as a percentage offset from center, and the module's
  // own gentle-float phase offset so the four don't move in unison.
  x: number;
  y: number;
  floatDelay: number;
};

const MODULES: ModuleDef[] = [
  { name: "browser", Icon: Globe, x: -148, y: -87, floatDelay: 0 },
  { name: "api", Icon: Webhook, x: 143, y: -103, floatDelay: -2 },
  { name: "dashboard", Icon: LayoutDashboard, x: 155, y: 94, floatDelay: -4 },
  { name: "cloud", Icon: Cloud, x: -132, y: 108, floatDelay: -6 },
];

const GRID_NODES = [
  { x: "18%", y: "22%", delay: 0 },
  { x: "82%", y: "16%", delay: 1.4 },
  { x: "12%", y: "78%", delay: 2.8 },
  { x: "88%", y: "70%", delay: 0.9 },
  { x: "50%", y: "10%", delay: 2.1 },
  { x: "46%", y: "90%", delay: 3.4 },
];

function ConnectionAndPacket({ x, y, near }: { x: number; y: number; near: boolean }) {
  // Path runs module → center → module, so the packet travels the full
  // line back and forth rather than snapping back to its start.
  const path = `M ${200 + x} ${200 + y} L 200 200 L ${200 + x} ${200 + y}`;
  return (
    <>
      <line
        x1={200 + x}
        y1={200 + y}
        x2="200"
        y2="200"
        stroke="#46D7D7"
        strokeWidth="1"
        className="transition-opacity duration-slow ease-premium"
        style={{ opacity: near ? 0.35 : 0.16 }}
      />
      <circle r="2.4" fill="#46D7D7">
        {/* calcMode="spline" + keySplines eases the packet in/out of the
            turnaround at the center — the previous constant-velocity
            motion reversed direction instantly at that point, which
            read as slightly mechanical. Duration also nudged from 6s
            to 7.5s — slower, calmer, per the "less mechanical" note. */}
        <animateMotion
          path={path}
          dur="7.5s"
          repeatCount="indefinite"
          rotate="0"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
        />
        <animate
          attributeName="opacity"
          values="0;0.9;0.9;0"
          keyTimes="0;0.12;0.88;1"
          dur="7.5s"
          repeatCount="indefinite"
        />
      </circle>
    </>
  );
}

function Module({ def }: { def: ModuleDef }) {
  const { Icon, x, y, floatDelay } = def;
  return (
    // Outer: static position only (translate to the module's fixed
    // offset from center) — no animation here.
    <div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
    >
      {/* Inner: the CSS animation (gentle float) lives on a separate
          element from the static position transform above — the same
          "animation + inline transform on one element" conflict that
          caused the Hero logo's reported jumping in an earlier round
          would repeat here otherwise, since both would fight over the
          `transform` property on the same node. Duration overridden to
          13s (was 9s via the shared `animate-float-slow` token) via an
          arbitrary value scoped to just this component — slower and
          calmer, without touching the shared token other components
          might use elsewhere. Same keyframe/easing (ease-in-out),
          only the speed changed. */}
      <div className="animate-[float-slow_13s_ease-in-out_infinite]" style={{ animationDelay: `${floatDelay}s` }}>
        {/* Icon reduced from 16px to 14px and given a slight opacity
            reduction (90%) plus a soft, small-blur glow (drop-shadow,
            follows the icon's own shape — not a box) so the four icons
            read as quieter background detail, with the logo remaining
            the clear focal point. */}
        <Icon
          size={14}
          className="text-cyan opacity-90"
          strokeWidth={1.75}
          style={{ filter: "drop-shadow(0 0 4px rgba(70, 215, 215, 0.35))" }}
        />
      </div>
    </div>
  );
}

export function HeroIllustration() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const [drift, setDrift] = React.useState({ x: 0, y: 0 });
  const [near, setNear] = React.useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setDrift({
        x: (clientX - rect.left) / rect.width - 0.5,
        y: (clientY - rect.top) / rect.height - 0.5,
      });
      setNear(true);
    });
  }

  function handleMouseLeave() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setDrift({ x: 0, y: 0 });
    setNear(false);
  }

  React.useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const lightX = drift.x * 16;
  const lightY = drift.y * 16;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto aspect-square w-[78%] max-w-[260px] sm:w-full sm:max-w-md"
    >
      {/* Ambient light — reads as emanating FROM the logo outward (the
          logo "powers" the scene), strengthening and drifting very
          slightly toward the cursor on proximity. Never touches the
          logo itself. */}
      <div
        className="pointer-events-none absolute inset-[-6%] rounded-full bg-secondary/10 blur-[60px] transition-all duration-slow ease-premium"
        style={{ opacity: near ? 0.85 : 0.55, transform: `translate3d(${lightX * 0.5}px, ${lightY * 0.5}px, 0)` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[10%] rounded-full bg-secondary/20 blur-3xl transition-all duration-slow ease-premium"
        style={{ opacity: near ? 0.75 : 0.45, transform: `translate3d(${lightX}px, ${lightY}px, 0)` }}
        aria-hidden="true"
      />

      {/* Faint grid backdrop with a handful of softly-pulsing nodes —
          "a live network," kept deliberately subtle. */}
      <div className="bg-grid-faint pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
        {GRID_NODES.map((n) => (
          <circle key={n.x + n.y} cx={n.x} cy={n.y} r="2" fill="#46D7D7" opacity="0">
            <animate
              attributeName="opacity"
              values="0;0.5;0"
              keyTimes="0;0.5;1"
              dur="5.5s"
              begin={`${n.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Connection lines + traveling data packets — module ↔ core */}
      <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 hidden size-full sm:block" aria-hidden="true">
        {MODULES.map((m) => (
          <ConnectionAndPacket key={m.name} x={m.x} y={m.y} near={near} />
        ))}
      </svg>

      {/* Floating glass modules — hidden below sm (fewer elements on
          mobile), each drifting independently and slowly. */}
      <div className="hidden sm:contents">
        {MODULES.map((m) => (
          <Module key={m.name} def={m} />
        ))}
      </div>

      {/* THE LOGO — the digital core. Completely still: no breathing,
          no scaling, no rotation, no tilt, no idle motion of any kind.
          Its only state change is a one-shot light-sweep on proximity
          (mix-blend-mode: overlay reads as a sheen crossing the actual
          colored artwork, not a flat tint — "no color change, no
          tint," per the brief). */}
      <div className="relative size-full overflow-hidden">
        <Image
          src="/images/hero-mark.png"
          alt=""
          fill
          sizes="(min-width: 640px) 448px, 260px"
          className="object-contain"
          priority
        />
        <div
          className={
            "shimmer-surface pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-slow ease-premium " +
            (near ? "opacity-70" : "opacity-0")
          }
          style={{ animation: near ? "shimmer 1.6s cubic-bezier(0.16, 1, 0.3, 1) 1" : "none" }}
          aria-hidden="true"
        />
      </div>

      {/* Proof-point chips — unchanged, static (no continuous motion). */}
      <div className="pointer-events-none absolute -left-2 top-[28px] hidden rounded-card border border-border bg-background/90 px-4 py-2.5 shadow-elevated-hover backdrop-blur-sm sm:block">
        <p className="text-caption text-neutral-600">Delivery model</p>
        <p className="font-heading text-h6 text-primary">Senior-led teams</p>
      </div>
      <div className="pointer-events-none absolute -right-4 bottom-[24px] hidden rounded-card border border-border bg-background/90 px-4 py-2.5 shadow-elevated-hover backdrop-blur-sm sm:block">
        <p className="text-caption text-neutral-600">Target response</p>
        <p className="font-heading text-h6 text-secondary">Within 24 hours</p>
      </div>
    </div>
  );
}
