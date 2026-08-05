import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export interface ContactCardProps {
  icon: LucideIcon;
  channel: string;
  value: string;
  href?: string;
  responseTime?: string;
}

/**
 * Intelligent wrapping for contact values (Premium Layout & Typography
 * refinement): the previous `break-words` (overflow-wrap: break-word)
 * allowed a break anywhere, including mid-domain-name for emails —
 * exactly the "awkward wrap" this was meant to prevent. Regular
 * hyphens are also valid default browser break points, so a phone
 * number could split right after one with no special handling at all.
 *
 * Fix: give the browser exactly one deliberate, sensible break
 * opportunity for emails (right before the domain, via <wbr />, with
 * no other break points allowed), and remove the hyphen as a break
 * opportunity for phone-shaped values entirely (swapping it for
 * U+2011, the non-breaking hyphen — displays identically, never a
 * line-break point). Anything else (plain prose like "Available
 * during business hours") already wraps fine at its natural spaces.
 */
function formatContactValue(value: string): ReactNode {
  if (value.includes("@")) {
    const [local, domain] = value.split("@");
    return (
      <>
        {local}@<wbr />
        {domain}
      </>
    );
  }
  if (/\d-\d/.test(value)) {
    return value.replace(/(\d)-(\d)/g, "$1\u2011$2");
  }
  return value;
}

/**
 * Contact Card — icon + channel name + value, grouped in a grid on the
 * Contact page ("Other Ways to Reach Us"), per Phase 2 §14. Values are
 * real tel:/mailto: links where applicable, per the accessibility note.
 *
 * Layout refined to an icon-top, left-aligned stack (was icon-left +
 * horizontal text row) — gives the value room to breathe at the
 * narrow 4-column desktop track instead of competing with the icon
 * for horizontal space, and establishes real hierarchy: a small
 * uppercase eyebrow label (reusing the exact pattern already used for
 * Statistics' labels), then the value as the prominent, heading-
 * weight "hero" of the card — it's the actual actionable
 * information — then a small supporting caption. Outer padding stays
 * p-5 (32px), matching the sitewide card-padding convention already
 * established for Service/Portfolio/Industry/Blog/Contact cards —
 * "breathing space" comes from the internal gaps instead, not from
 * reopening that already-settled consistency pass.
 */
export function ContactCard({ icon: Icon, channel, value, href, responseTime }: ContactCardProps) {
  const content = (
    <div className="flex h-full flex-col gap-4 p-5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-input bg-secondary/10 text-secondary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-secondary group-hover:text-secondary-foreground">
        <Icon className="size-[22px]" aria-hidden="true" />
      </span>
      <div>
        <p className="text-caption uppercase tracking-wide text-neutral-600">{channel}</p>
        <p
          className="mt-2 font-heading text-h5 text-primary transition-colors duration-slow ease-premium group-hover:text-white"
          aria-label={value}
        >
          {formatContactValue(value)}
        </p>
        {responseTime && (
          <p className="mt-3 text-caption text-neutral-600">{responseTime}</p>
        )}
      </div>
    </div>
  );

  return (
    <Card className="group hover-lift h-full overflow-hidden p-0 hover:border-secondary/40 hover:shadow-elevated-hover">
      {href ? (
        <a href={href} className="block h-full">
          {content}
        </a>
      ) : (
        content
      )}
    </Card>
  );
}
