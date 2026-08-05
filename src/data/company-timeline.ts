/**
 * Company Timeline — deliberately framed around stages rather than
 * specific fabricated dates, award names, or client counts (none of
 * which are available yet per Master Blueprint §1.9). Reflects only
 * what's genuinely true about Alvora's stage of growth.
 */
export type TimelineMilestone = {
  era: string;
  title: string;
  description: string;
};

export const companyTimeline: TimelineMilestone[] = [
  {
    era: "The Beginning",
    title: "Founded in Dhaka",
    description:
      "Alvora IT Solution was founded with a clear focus: deliver quality software as a genuine long-term partner, not a one-time vendor.",
  },
  {
    era: "Early Projects",
    title: "First Client Engagements",
    description:
      "Our first projects across e-commerce, automation, and CRM development shaped the delivery process we use today.",
  },
  {
    era: "Going International",
    title: "Expanding Our Reach",
    description:
      "We built our engagement model around serving clients across the USA, Canada, UK, Europe, Australia, and the Middle East.",
  },
  {
    era: "What's Next",
    title: "Building for the Long Term",
    description:
      "We continue to grow our team and refine our process, one long-term client partnership at a time.",
  },
];
