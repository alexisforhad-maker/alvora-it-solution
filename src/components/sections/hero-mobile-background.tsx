const PARTICLES = [
  { left: "14%", top: "20%", delay: "0s", duration: "9s" },
  { left: "80%", top: "14%", delay: "1.4s", duration: "10.5s" },
  { left: "68%", top: "60%", delay: "2.6s", duration: "8.5s" },
  { left: "22%", top: "70%", delay: "0.8s", duration: "11s" },
  { left: "48%", top: "38%", delay: "3.2s", duration: "9.5s" },
];

/**
 * Homepage hero's mobile-only ambient background — animated grid pan,
 * a drifting cyan glow, a gentle blue aurora, and a handful of slow
 * floating particles, layered under a sub-15%-opacity radial depth
 * wash (see the "MOBILE HERO FIRST-IMPRESSION" block in globals.css
 * for every keyframe/class used here).
 *
 * Pure CSS — no JS, no canvas, no per-frame work — so it costs
 * nothing on the main thread. Hidden entirely at md+ (`md:hidden`),
 * which keeps desktop rendering the existing static bg-mesh-wash/
 * bg-grid-faint treatment in hero.tsx completely untouched.
 */
export function HeroMobileBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 block overflow-hidden md:hidden"
      aria-hidden="true"
    >
      <div className="hero-bg-depth absolute inset-0" />
      <div className="hero-bg-grid absolute inset-0" />
      <div className="hero-bg-glow-cyan absolute left-[6%] top-[6%] size-[220px] rounded-full" />
      <div className="hero-bg-aurora-blue absolute bottom-[8%] right-[4%] size-[240px] rounded-full" />
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="hero-bg-particle absolute size-1 rounded-full bg-cyan"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
