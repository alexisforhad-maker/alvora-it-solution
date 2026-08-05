import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { CTABanner } from "@/components/shared/cta-banner";
import { TechnologyCard } from "@/components/shared/technology-card";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { techGroups } from "@/data/technologies-content";

export const metadata: Metadata = buildMetadata({
  title: "Technologies",
  description:
    "The modern, production-grade technology stack Alvora IT Solution builds with — organized by category, chosen for scalability, security, and long-term maintainability.",
  path: "/technologies",
});

/**
 * Technologies page — Phase 2 §10. Deliberately business-value-first:
 * each category leads with why it matters before listing the specific
 * tools, and the page stays icon-light rather than a dense logo wall.
 */
export default function TechnologiesPage() {
  return (
    <>
      <Hero
        eyebrow="How We Build"
        title="Technology We Trust"
        description="We choose tools for scalability, security, and long-term maintainability — never because they're trendy. Here's what we build with, and why it matters for your project."
      />

      <SectionWrapper>
        <div className="flex flex-col gap-[40px]">
          {techGroups.map((group, index) => (
            <FadeUp key={group.category} delay={index * 0.05}>
              <div className="hover-lift group grid gap-6 rounded-card border border-border bg-surface p-6 hover:border-secondary/30 hover:shadow-elevated-hover md:grid-cols-3 md:p-8">
                <div className="md:col-span-1">
                  <span className="flex size-12 items-center justify-center rounded-input bg-white/[0.06] text-primary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-secondary group-hover:to-accent-blue group-hover:text-white group-hover:shadow-glow">
                    <group.icon className="size-[24px]" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-heading text-h4 text-primary transition-colors duration-slow ease-premium group-hover:text-white">{group.category}</h2>
                  <p className="mt-2 text-body text-neutral-600">{group.valueStatement}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:col-span-2 md:grid-cols-4">
                  {group.items.map((item) => (
                    <TechnologyCard key={item} name={item} icon={group.icon} />
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper tint>
        <FadeUp className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2-mobile font-heading text-primary md:text-h2">
            Why Our Stack Choices Matter
          </h2>
          <p className="mt-4 text-body-lg text-neutral-600">
            Every tool on this page was chosen for a reason tied to your project&apos;s
            long-term health — not because it&apos;s the newest thing available. Scalable
            architecture means your system handles growth without a rebuild. Security-first
            defaults mean fewer surprises later. Maintainable code means whoever supports your
            system next — us or your own team — can actually work with it.
          </p>
        </FadeUp>
      </SectionWrapper>

      <CTABanner
        title="Curious How This Applies to Your Project?"
        description="Tell us about your project — we'll respond within one business day."
        actions={
          <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
            <Link href="/request-a-quote">Book a Free Consultation</Link>
          </Button>
        }
      />
    </>
  );
}
