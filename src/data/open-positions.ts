export type OpenPosition = {
  slug: string;
  title: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  location: string;
  description: string;
};

/**
 * Open Positions — Alvora is not actively hiring right now (Master
 * Blueprint §1.9), so this is intentionally empty rather than
 * populated with placeholder job listings. The Careers page renders
 * a graceful empty state when this array is empty. Once the Careers
 * Manager (Admin/CMS phase) exists, real openings are added here (or
 * to the database this file seeds).
 */
export const openPositions: OpenPosition[] = [];
