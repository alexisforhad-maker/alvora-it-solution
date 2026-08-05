import Image from "next/image";

/**
 * Route-level loading UI, shown automatically by Next.js while a
 * segment's data is being fetched. Uses the real standalone "A" icon
 * (public/images/hero-mark.png) — a valid location for it per the
 * client's icon-usage rule ("Loading / Splash screen").
 *
 * The icon itself now rotates — a deliberate, explicit exception to
 * "the logo barely moves," which applies to the Hero's brand
 * centerpiece, not to a transient loading affordance. A slow
 * continuous spin is the conventional, expected signal that something
 * is actively processing (unlike the Hero, this element only exists
 * while work is happening), so it rotates gently — about one turn
 * every 2.5s — combined with a soft glow and a gentle breathing pulse
 * on that glow.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="relative flex size-14 items-center justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-secondary/20 blur-xl" aria-hidden="true" />
        <Image
          src="/images/hero-mark.png"
          alt=""
          width={34}
          height={26}
          className="relative animate-[spin_2.5s_linear_infinite] object-contain"
          aria-hidden="true"
        />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
