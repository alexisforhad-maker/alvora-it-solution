"use client";

import * as React from "react";
import Image from "next/image";
import { Linkedin, ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TeamCardProps {
  name: string;
  role: string;
  photo: string;
  shortBio: string;
  extendedBio?: string;
  linkedIn?: string;
  email?: string;
}

/**
 * Team Card — executive profile card for the About page leadership
 * grid (Master Blueprint §1.9 — only leadership is shown publicly).
 * Floating portrait + gradient-glow border give it an "executive
 * bio card" feel rather than a generic content card. Equal card
 * heights across a row are achieved via h-full on the root + flex-1
 * on the bio paragraph, so the email/LinkedIn row always sits flush
 * with the bottom of every card regardless of bio length.
 */
export function TeamCard({ name, role, photo, shortBio, extendedBio, linkedIn, email }: TeamCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="group relative h-full pt-[42px]">
      {/* Soft gradient glow — sits behind the card, brightens on hover */}
      <div
        className="absolute inset-x-4 top-[42px] bottom-0 rounded-card bg-gradient-to-br from-secondary/30 via-accent/20 to-primary/30 opacity-0 blur-xl transition-opacity duration-slow ease-premium group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* pt-14 (mobile, portrait size-20) / sm:pt-[68px] (sm+, portrait
          size-24) — tuned so the gap between the floating portrait's
          bottom edge and the name is a consistent 8–12px at every
          breakpoint. The single pt-14 value used before this fix left
          a 12px gap on mobile but let the larger sm+ portrait overlap
          the name by ~4px — this responsive split corrects that
          without touching the portrait size or offset. */}
      <div className="relative flex h-full flex-col items-center rounded-card border border-border bg-surface/90 px-5 pb-5 pt-14 text-center shadow-elevated backdrop-blur-sm transition-all duration-slow ease-premium group-hover:-translate-y-1.5 group-hover:border-secondary/30 group-hover:shadow-elevated-hover sm:pt-[68px]">
        {/* Floating portrait — overlaps the top edge of the card */}
        <div className="absolute -top-[42px] left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-gradient-primary p-[3px] shadow-elevated-hover transition-transform duration-slow ease-premium group-hover:scale-105">
            <div className="relative size-20 overflow-hidden rounded-full ring-4 ring-background sm:size-24">
              <Image
                src={photo}
                alt={`${name}, ${role}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <p className="font-heading text-h5 text-primary">{name}</p>
        <p className="mt-1.5 text-body text-secondary">{role}</p>

        <p className="mt-3 flex-1 text-body text-neutral-600">{shortBio}</p>

        {extendedBio && (
          <>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mt-2 flex items-center gap-1.5 text-button text-secondary transition-colors hover:text-secondary-light"
            >
              {expanded ? "Read less" : "Read more"}
              <ChevronDown
                className={cn("size-[16px] transition-transform duration-fast", expanded && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            {expanded && <p className="mt-2 text-body text-neutral-600">{extendedBio}</p>}
          </>
        )}

        {(linkedIn || email) && (
          <div className="mt-5 flex items-center gap-2 border-t border-border pt-5">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 rounded-pill border border-secondary/30 bg-secondary/5 px-4 py-1.5 text-caption font-medium text-secondary transition-all duration-fast hover:border-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                <Mail className="size-[14px]" aria-hidden="true" />
                Email
              </a>
            )}
            {linkedIn ? (
              <a
                href={linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on LinkedIn`}
                className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-primary transition-all duration-slow ease-premium hover:scale-105 hover:bg-gradient-to-br hover:from-secondary hover:to-accent-blue hover:text-white hover:shadow-glow"
              >
                <Linkedin className="size-[16px]" />
              </a>
            ) : (
              <span
                aria-hidden="true"
                className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-300"
                title="LinkedIn coming soon"
              >
                <Linkedin className="size-[16px]" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
