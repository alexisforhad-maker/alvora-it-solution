import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";

/**
 * Client Testimonials — Homepage §11 per Phase 2 spec.
 *
 * Alvora does not yet have attributable client quotes to publish, so
 * — per client instruction — this renders tasteful, clearly generic
 * demo testimonials: no invented person names, no real or fictional
 * company names, and no invented awards/certifications. Each entry is
 * attributed only by a role + generic business-type descriptor (e.g.
 * "CEO, Retail Business"), which the TestimonialCard component renders
 * as the primary attribution line when `author` is omitted.
 *
 * To replace with a real, attributed testimonial later: add `author`
 * (the person's name) back to that entry — the card automatically
 * switches to name-first attribution with role/company as a caption.
 * Nothing else in this file or the component needs to change.
 */
const placeholderTestimonials = [
  {
    quote:
      "They took the time to understand our workflow before writing a single line of code. Deployments that used to take an afternoon now take minutes.",
    role: "CEO",
    company: "Retail Business",
  },
  {
    quote:
      "We needed a partner who could move fast without cutting corners on security. They delivered a platform we could confidently put in front of patients.",
    role: "Founder",
    company: "Healthcare Startup",
  },
  {
    quote:
      "What stood out was how little we had to chase for updates. Every milestone was communicated before we had to ask about it.",
    role: "Operations Manager",
    company: "Logistics Company",
  },
] as const;

export function TestimonialsSection() {
  return (
    <SectionWrapper variant="glass">
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">What Clients Say</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Trusted by the Teams We Work With
        </h2>
        <p className="mt-4 text-body-lg text-neutral-600">
          A sample of the feedback we aim to earn on every engagement.
        </p>
      </FadeUp>

      <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-3">
        {placeholderTestimonials.map((t) => (
          <TestimonialCard
            key={t.role + t.company}
            quote={t.quote}
            role={t.role}
            company={t.company}
          />
        ))}
      </StaggerGrid>
    </SectionWrapper>
  );
}
