import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TeamCard } from "@/components/shared/team-card";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { teamMembers } from "@/data/team";

/**
 * Leadership Team — only leadership is shown publicly, not every
 * employee, per Master Blueprint §1.9. Sorted by the `order` field so
 * the Admin Team Manager (later phase) can reorder without a redeploy.
 */
export function LeadershipTeam() {
  const sorted = [...teamMembers].sort((a, b) => a.order - b.order);

  return (
    <SectionWrapper tint id="leadership">
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">Our People</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          Leadership Team
        </h2>
        <p className="mt-4 text-body-lg text-neutral-600">
          A lean, senior team that stays involved throughout every engagement.
        </p>
      </FadeUp>

      <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((member) => (
          <TeamCard
            key={member.id}
            name={member.name}
            role={member.role}
            photo={member.photo}
            shortBio={member.shortBio}
            extendedBio={member.extendedBio}
            linkedIn={member.linkedIn}
            email={member.email}
          />
        ))}
      </StaggerGrid>
    </SectionWrapper>
  );
}
