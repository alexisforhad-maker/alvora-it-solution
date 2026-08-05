import { Target, Telescope } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";

/**
 * Mission & Vision — text drawn directly from the approved Master
 * Blueprint §1.4/§1.5.
 */
export function MissionVision() {
  return (
    <SectionWrapper tint>
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">What Drives Us</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Mission &amp; Vision
        </h2>
      </FadeUp>

      <StaggerGrid className="mt-9 grid gap-6 md:grid-cols-2">
        <div className="hover-lift group rounded-card border border-border bg-background p-6 hover:border-secondary/30 hover:shadow-elevated-hover">
          <span className="flex size-12 items-center justify-center rounded-input bg-secondary/10 text-secondary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:shadow-glow">
            <Target className="size-[24px]" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-heading text-h4 text-primary transition-colors duration-slow ease-premium group-hover:text-white">Our Mission</h3>
          <p className="mt-3 text-body-lg text-neutral-600">
            To empower startups, SMEs, and growing enterprises worldwide with secure,
            scalable, and thoughtfully engineered digital solutions — delivered through
            transparent communication and genuine long-term partnership, not one-time
            transactions.
          </p>
        </div>

        <div className="hover-lift group rounded-card border border-border bg-background p-6 hover:border-secondary/30 hover:shadow-elevated-hover">
          <span className="flex size-12 items-center justify-center rounded-input bg-white/[0.06] text-primary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-secondary group-hover:to-accent-blue group-hover:text-white group-hover:shadow-glow">
            <Telescope className="size-[24px]" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-heading text-h4 text-primary transition-colors duration-slow ease-premium group-hover:text-white">Our Vision</h3>
          <p className="mt-3 text-body-lg text-neutral-600">
            To become one of the most trusted technology partners for growing businesses
            worldwide — a company globally recognized for the quality of its engineering and
            the integrity of its relationships, proudly rooted in Bangladesh.
          </p>
        </div>
      </StaggerGrid>
    </SectionWrapper>
  );
}
