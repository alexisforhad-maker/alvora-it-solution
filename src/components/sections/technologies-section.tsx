import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TechnologyCard } from "@/components/shared/technology-card";
import { FadeUp } from "@/components/animation/fade-up";
import { techGroups } from "@/data/technologies-content";

/**
 * Technologies — condensed homepage version of the full /technologies
 * page, grouped by category per Phase 2 §10. Reads from
 * src/data/technologies-content.ts, the same source the full
 * Technologies page uses, so the category/item list only exists once.
 */
export function TechnologiesSection() {
  return (
    <SectionWrapper variant="teal">
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">How We Build</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Technology We Trust
        </h2>
        <p className="mt-4 text-body-lg text-neutral-600">
          Modern, production-grade tooling chosen for scalability, security, and long-term
          maintainability — never for its own sake.
        </p>
      </FadeUp>

      <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {techGroups.map((group) => (
          <div
            key={group.category}
            className="hover-lift rounded-card border border-border bg-background p-5 hover:border-secondary/30 hover:shadow-elevated-hover"
          >
            <div className="flex items-center gap-2">
              <group.icon className="size-[20px] text-primary" aria-hidden="true" />
              <h3 className="font-heading text-h6 text-primary">{group.category}</h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {group.items.map((item) => (
                <TechnologyCard key={item} name={item} icon={group.icon} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
