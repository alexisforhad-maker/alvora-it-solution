import type { TeamMember } from "@/types";

/**
 * Leadership team shown on the homepage preview and the About page
 * (Master Blueprint §1.9 — only leadership is shown publicly, not
 * every employee). Real names, roles, and bios as provided by the
 * client. Personal phone numbers are intentionally excluded — only
 * role-based email addresses are shown.
 */
export const teamMembers: TeamMember[] = [
  {
    id: "forhad-hossain",
    name: "MD Forhad Hossain",
    role: "Founder & CEO",
    photo: "/images/team/forhad-hossain.jpg",
    shortBio:
      "Leads Alvora IT Solution with a vision to build innovative, scalable and future-ready technology solutions for businesses worldwide.",
    extendedBio:
      "Responsible for strategic direction, business growth and long-term technology vision.",
    email: "ceo@alvoraitsolution.com",
    order: 1,
  },
  {
    id: "shahin-alom",
    name: "Shahin Alom",
    role: "Project Manager",
    photo: "/images/team/shahin-alom.jpg",
    shortBio:
      "Oversees project planning, execution and successful delivery while ensuring quality, efficiency and client satisfaction.",
    email: "project@alvoraitsolution.com",
    order: 2,
  },
  {
    id: "tarikul-molla",
    name: "Tarikul Molla",
    role: "Operations Manager",
    photo: "/images/team/tarikul-molla.jpg",
    shortBio:
      "Manages daily business operations and coordinates internal teams to ensure smooth project execution.",
    email: "operations@alvoraitsolution.com",
    order: 3,
  },
  {
    id: "robiul-molla",
    name: "Robiul Molla",
    role: "Commercial Manager",
    photo: "/images/team/robiul-molla.jpg",
    shortBio:
      "Drives business growth through strategic partnerships, commercial planning and client relationship management.",
    email: "development@alvoraitsolution.com",
    order: 4,
  },
  {
    id: "hr-shamim",
    name: "H R Shamim",
    role: "Finance Manager",
    photo: "/images/team/hr-shamim.jpg",
    shortBio: "Oversees financial planning, budgeting, compliance and organizational financial operations.",
    email: "finance@alvoraitsolution.com",
    order: 5,
  },
];

