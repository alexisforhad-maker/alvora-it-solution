import Link from "next/link";
import { Users2, BookOpenCheck, Scale } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";

const cultureTraits = [
  {
    icon: Users2,
    title: "Collaborative by Nature",
    description:
      "A lean core team working closely with flexible specialists — everyone stays close to the client relationship.",
  },
  {
    icon: BookOpenCheck,
    title: "Always Learning",
    description:
      "We stay current with modern tools and practices so our recommendations are never out of date.",
  },
  {
    icon: Scale,
    title: "Quality Over Quantity",
    description: "We'd rather do fewer projects well than take on more than we can properly serve.",
  },
] as const;

/**
 * Company Culture — closes with a link to Careers, per Phase 2 §2
 * ("Interested in joining us? →").
 */
export function CultureSection() {
  return (
    <SectionWrapper tint>
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">How We Work</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Our Culture
        </h2>
      </FadeUp>

      <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-3">
        {cultureTraits.map((trait) => (
          <div key={trait.title} className="hover-lift group rounded-card border border-border bg-background p-6 hover:border-secondary/30 hover:shadow-elevated-hover">
            <span className="flex size-12 items-center justify-center rounded-input bg-white/[0.06] text-primary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-secondary group-hover:to-accent-blue group-hover:text-white group-hover:shadow-glow">
              <trait.icon className="size-[24px]" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-heading text-h5 text-primary transition-colors duration-slow ease-premium group-hover:text-white">{trait.title}</h3>
            <p className="mt-3 text-body text-neutral-600">{trait.description}</p>
          </div>
        ))}
      </StaggerGrid>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="ghost" size="lg">
          <Link href="/careers">Interested in joining us? →</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
