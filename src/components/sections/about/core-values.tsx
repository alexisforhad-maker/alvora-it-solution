import { ShieldCheck, Sparkles, Handshake, Globe2, MessageSquare, Rocket } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";

/**
 * Core Values — the six values from the approved Master Blueprint
 * §1.6, each with its own icon (2x3 desktop grid per Phase 2 §2).
 */
const values = [
  {
    icon: ShieldCheck,
    title: "Integrity First",
    description:
      "We say what we mean, quote what we can deliver, and communicate the truth even when it's inconvenient.",
  },
  {
    icon: Sparkles,
    title: "Engineering Excellence",
    description:
      "We build software the way we'd want it built for ourselves: clean, secure, documented, and made to last.",
  },
  {
    icon: Handshake,
    title: "Partnership Over Projects",
    description:
      "We measure success by how long clients stay, not how many projects we close.",
  },
  {
    icon: Globe2,
    title: "Global Standards, Local Roots",
    description:
      "We hold ourselves to the same bar as top Western and global agencies, while staying proudly based in Bangladesh.",
  },
  {
    icon: MessageSquare,
    title: "Clarity in Communication",
    description:
      "No jargon-hiding, no vague timelines — clients always know where their project stands.",
  },
  {
    icon: Rocket,
    title: "Continuous Innovation",
    description:
      "We stay ahead of tools, frameworks, and practices so our clients don't have to.",
  },
] as const;

export function CoreValues() {
  return (
    <SectionWrapper>
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">What We Believe</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Our Core Values
        </h2>
      </FadeUp>

      <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="group flex flex-col items-start gap-3 rounded-card p-2 transition-colors duration-slow ease-premium hover:bg-surface">
            <span className="flex size-12 items-center justify-center rounded-input bg-secondary/10 text-secondary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:shadow-glow">
              <value.icon className="size-[24px]" aria-hidden="true" />
            </span>
            <h3 className="font-heading text-h5 text-primary transition-colors duration-slow ease-premium group-hover:text-white">{value.title}</h3>
            <p className="text-body text-neutral-600">{value.description}</p>
          </div>
        ))}
      </StaggerGrid>
    </SectionWrapper>
  );
}
