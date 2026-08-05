import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { teamMembers } from "@/data/team";

/**
 * Leadership Preview — homepage-level introduction to the leadership
 * team, with the full bios/expandable detail living on the About page
 * (`<LeadershipTeam />`, id="leadership"). Circular portraits keep
 * this compact and scannable rather than duplicating the full card
 * treatment used on About.
 */
export function LeadershipPreview() {
  const sorted = [...teamMembers].sort((a, b) => a.order - b.order);

  return (
    <div className="relative overflow-hidden">
      <div className="bg-mesh-wash pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <SectionWrapper className="relative">
        <FadeUp className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-h6 text-secondary">Leadership</p>
          <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
            The People Behind Alvora
          </h2>
          <p className="mt-4 text-body-lg text-neutral-600">
            A lean, senior leadership team that stays close to every engagement — not a name on a
            slide.
          </p>
        </FadeUp>

        <StaggerGrid className="mx-auto mt-9 flex max-w-4xl flex-wrap justify-center gap-x-[40px] gap-y-[32px]">
          {sorted.map((member) => (
            <div key={member.id} className="group flex w-32 flex-col items-center text-center sm:w-36">
              <div className="rounded-full bg-gradient-primary p-[3px] shadow-elevated transition-all duration-slow ease-premium group-hover:scale-105 group-hover:shadow-elevated-hover">
                <div className="relative size-24 overflow-hidden rounded-full ring-4 ring-background sm:size-28">
                  <Image
                    src={member.photo}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="mt-3 font-heading text-h6 text-primary">{member.name}</p>
              <p className="text-caption text-neutral-600">{member.role}</p>
            </div>
          ))}
        </StaggerGrid>

        <div className="mt-9 flex justify-center">
          <Button asChild variant="ghost">
            <Link href="/about#leadership">
              Meet the Full Team
              <ArrowRight className="size-[16px]" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </SectionWrapper>
    </div>
  );
}
