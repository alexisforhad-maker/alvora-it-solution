import { Users2, BookOpenCheck, Scale, Globe2 } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";

const reasons = [
  {
    icon: Users2,
    title: "A Lean, Collaborative Team",
    description: "You'll work closely with a small core team, not get lost in a large org chart.",
  },
  {
    icon: Globe2,
    title: "International Client Exposure",
    description: "Work on projects for clients across the USA, UK, Europe, Australia, and beyond.",
  },
  {
    icon: BookOpenCheck,
    title: "Modern Tooling",
    description: "We invest in current tools and practices — not legacy stacks held together by habit.",
  },
  {
    icon: Scale,
    title: "Quality Over Quantity",
    description: "We take on fewer projects so the ones we do take get the attention they deserve.",
  },
] as const;

export function WhyWorkWithUs() {
  return (
    <SectionWrapper>
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">Why Alvora</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Why Work With Us
        </h2>
      </FadeUp>

      <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((reason) => (
          <div key={reason.title} className="group flex flex-col items-start gap-3 rounded-card p-2 transition-colors duration-slow ease-premium hover:bg-surface">
            <span className="flex size-12 items-center justify-center rounded-input bg-secondary/10 text-secondary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:shadow-glow">
              <reason.icon className="size-[24px]" aria-hidden="true" />
            </span>
            <h3 className="font-heading text-h5 text-primary transition-colors duration-slow ease-premium group-hover:text-white">{reason.title}</h3>
            <p className="text-body text-neutral-600">{reason.description}</p>
          </div>
        ))}
      </StaggerGrid>
    </SectionWrapper>
  );
}
