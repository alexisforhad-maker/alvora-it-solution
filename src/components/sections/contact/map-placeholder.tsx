import { MapPin } from "lucide-react";
import { contactConfig } from "@/config/site";

/**
 * Map placeholder — per the Phase 3F requirement for a "Google Maps
 * placeholder" rather than a live embed (no API key/network access
 * configured yet). Swap for a real embedded map once Google Maps API
 * credentials are available — the office address is already centralized
 * in src/config/site.ts so the embed query needs no other change.
 */
export function MapPlaceholder() {
  return (
    <div className="relative flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-card border border-border bg-neutral-100 text-center">
      {/* Was a hardcoded light-theme grid color (#DDE4E6) left over
          from before the Black Edition dark-theme pass — inconsistent
          with the shared .bg-grid-faint decorative-grid treatment used
          everywhere else sitewide (Hero, hero-illustration, the
          Homepage Process Snapshot section). Switched to that same
          shared utility so this tracks any future palette refinement
          automatically instead of drifting on its own. This div is
          purely decorative (no real content inside it) and already
          isolated as its own absolutely-positioned layer, so it's safe
          to use the mask-based utility here — unlike the two earlier
          bugs where a mask was applied to an element that also wrapped
          real text. */}
      <div className="bg-grid-faint absolute inset-0" aria-hidden="true" />
      <span className="relative flex size-14 items-center justify-center rounded-full bg-gradient-primary text-white shadow-elevated-hover">
        <span className="absolute inset-0 animate-[pulse-ring_2.2s_cubic-bezier(0.4,0,0.2,1)_infinite] rounded-full bg-secondary/40" aria-hidden="true" />
        <MapPin className="relative size-[28px]" aria-hidden="true" />
      </span>
      <p className="relative font-heading text-h6 text-primary">
        {contactConfig.address.line1}, {contactConfig.address.city}
      </p>
      <p className="relative text-caption text-neutral-600">
        {contactConfig.address.country} — interactive map coming soon
      </p>
    </div>
  );
}
