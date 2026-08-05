"use client";

import * as React from "react";
import Image from "next/image";

/**
 * Boot splash screen — shown once per full page load across the
 * public site (mounted in `(site)/layout.tsx`, which persists across
 * client-side navigations, so this does NOT replay on internal Link
 * clicks — only on an actual page load/refresh).
 *
 * Uses the standalone "A" icon (public/images/hero-mark.png) only —
 * never the full icon+wordmark lockup, which stays reserved for
 * Header/Footer/Admin/Emails.
 *
 * Simplified per the client's explicit brief — down to exactly:
 * Logo (rotating gently) + one rotating orbit ring + a soft glow +
 * an elegant fade. The previous pass's three fixed particles and the
 * diagonal light-sweep were removed — this is deliberately the
 * minimum, not a place to add more. A later round added the gentle
 * icon rotation back in as an explicit exception to "the logo barely
 * moves" (which governs the Hero's brand centerpiece specifically,
 * not this transient loading affordance) — 7s per rotation, slow
 * enough that only a small partial turn is visible during the ~1.1s
 * the splash is on screen.
 *
 * Timing: ~1.1s visible, ~500ms fade — within the requested 0.8–1.5s
 * window. `prefers-reduced-motion` collapses every animation/
 * transition here to near-instant via the sitewide rule in
 * globals.css — the splash still appears/disappears, just without
 * the motion.
 *
 * Centering fix: the icon assembly is positioned with the explicit
 * `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` technique
 * (mathematically exact regardless of box-size rounding) rather than
 * flex centering. Critically, that centering transform lives on a
 * *static, non-animated* wrapper — the spinning logo itself carries
 * no transform besides its own rotation. Combining a translate-based
 * position with a `spin` keyframe animation on the *same* element is
 * a real bug: Tailwind's built-in `spin` keyframe only defines the
 * end state (`to { transform: rotate(360deg) }`), so the browser
 * matrix-interpolates from "translate(-50%,-50%)" toward a bare
 * "rotate(...)" — bleeding the centering offset out over each
 * rotation and snapping back at the loop boundary, i.e. exactly a
 * "logo drifts off-center while spinning" bug. Keeping the translate
 * and the rotate on separate nodes avoids that entirely. (The PNG
 * itself was checked — public/images/hero-mark.png's artwork is
 * symmetrically padded, 51px/51px horizontal and 38px/38px vertical
 * within its canvas — so rotating around the image's own geometric
 * center, its default `transform-origin`, already equals its visual
 * center; no crop offset needed for this asset.)
 */
export function SplashScreen() {
  const [phase, setPhase] = React.useState<"visible" | "fading" | "done">("visible");

  React.useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fading"), 1100);
    const doneTimer = setTimeout(() => setPhase("done"), 1100 + 500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;
  const fading = phase === "fading";

  return (
    <div
      aria-hidden="true"
      className={
        "fixed inset-0 z-[100] bg-primary-dark transition-opacity duration-slow ease-premium " +
        (fading ? "pointer-events-none opacity-0" : "opacity-100")
      }
    >
      <div
        className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2"
        style={{ transformOrigin: "center" }}
      >
        {/* Soft glow */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-secondary/30 blur-2xl" />

        {/* One rotating orbit ring — constant, calm, linear speed.
            Positioned via `inset-0` (not a transform), so combining
            it with the `spin` animation below never risks the
            translate/rotate composition bug described above. */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full animate-[spin_9s_linear_infinite] opacity-60"
          style={{ transformOrigin: "center" }}
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#3AA9A9"
            strokeWidth="1.25"
            strokeDasharray="2 9"
          />
        </svg>

        {/* The standalone "A" icon — rotates gently (slower than the
            route-loading spinner, per the brief: "logo rotates
            gently"), inverted to white, matching the same
            brightness-0/invert treatment used sitewide (Footer,
            AdminSidebar, admin login) for this logo on dark
            backgrounds. Centered within the assembly via `inset-0
            flex` on its wrapper (no transform involved), keeping this
            element's own `transform` free for `spin` alone — the
            fix's second half. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/hero-mark.png"
            alt="Alvora IT Solution"
            width={56}
            height={43}
            className="animate-[spin_7s_linear_infinite] object-contain brightness-0 invert"
            style={{ transformOrigin: "center" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
