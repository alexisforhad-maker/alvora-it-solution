import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Statistics, type Stat } from "@/components/shared/statistics";
import { FadeUp } from "@/components/animation/fade-up";

const stats: Stat[] = [
  { value: 10, label: "Core Services" },
  { value: 9, label: "Industries Served" },
  { value: 6, label: "Regions Served Worldwide" },
  { value: 24, suffix: "h", label: "Target Response Time" },
];

/**
 * Statistics — Homepage trust bar. Figures reflect genuine, verifiable
 * facts about Alvora's current scope and commitments (service count,
 * industry count, target regions, response-time commitment) rather
 * than unverified project/client counts the company doesn't yet have
 * formal case studies for (Master Blueprint §1.9).
 */
export function StatsSection() {
  return (
    <SectionWrapper>
      <FadeUp>
        <Statistics stats={stats} />
      </FadeUp>
    </SectionWrapper>
  );
}
