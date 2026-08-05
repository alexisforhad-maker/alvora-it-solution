import { ShieldCheck, MessageCircleHeart, Users, TrendingUp } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Senior-Led Delivery",
    description:
      "Our leadership team stays engaged throughout your project — not just at the sales stage.",
  },
  {
    icon: MessageCircleHeart,
    title: "Transparent by Default",
    description:
      "Clear scoping, honest timelines, and regular updates. No confusing pricing menus, no surprises.",
  },
  {
    icon: Users,
    title: "Partnership Over Projects",
    description:
      "We measure success by how long clients stay with us, not how many projects we close.",
  },
  {
    icon: TrendingUp,
    title: "Global Standards, Local Roots",
    description:
      "Held to the same bar as top international agencies, proudly based in Bangladesh.",
  },
] as const;

/**
 * Why Choose Alvora — Homepage §4 per Phase 2 spec, mapped directly to
 * the USP pillars in Master Blueprint §1.7.
 */
export function WhyAlvora() {
  return (
    <SectionWrapper>
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">Why Alvora</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          A Boutique-Quality Partner With Global Standards
        </h2>
      </FadeUp>

      <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="group flex flex-col items-start gap-3 rounded-card p-2 transition-colors duration-slow ease-premium hover:bg-surface">
            <span className="flex size-12 items-center justify-center rounded-input bg-white/[0.06] text-primary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-secondary group-hover:to-accent-blue group-hover:text-white group-hover:shadow-glow">
              <pillar.icon className="size-[24px]" aria-hidden="true" />
            </span>
            <h3 className="font-heading text-h5 text-primary transition-colors duration-slow ease-premium group-hover:text-white">{pillar.title}</h3>
            <p className="text-body text-neutral-600">{pillar.description}</p>
          </div>
        ))}
      </StaggerGrid>
    </SectionWrapper>
  );
}
