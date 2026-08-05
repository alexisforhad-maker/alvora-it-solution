/**
 * Prisma enums are UPPER_SNAKE_CASE by DB convention; the frontend
 * (Phase 3F/3G) displays Title Case status labels. These maps are the
 * single place that translation happens, used by every admin page
 * that reads/writes a status field against the API.
 */

export const contactStatusFromDb: Record<string, "New" | "Replied" | "Archived"> = {
  NEW: "New",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
};
export const contactStatusToDb: Record<string, "NEW" | "REPLIED" | "ARCHIVED"> = {
  New: "NEW",
  Replied: "REPLIED",
  Archived: "ARCHIVED",
};

export const quoteStatusFromDb: Record<
  string,
  "New" | "Contacted" | "Proposal Sent" | "Won" | "Lost"
> = {
  NEW: "New",
  CONTACTED: "Contacted",
  PROPOSAL_SENT: "Proposal Sent",
  WON: "Won",
  LOST: "Lost",
};
export const quoteStatusToDb: Record<
  string,
  "NEW" | "CONTACTED" | "PROPOSAL_SENT" | "WON" | "LOST"
> = {
  New: "NEW",
  Contacted: "CONTACTED",
  "Proposal Sent": "PROPOSAL_SENT",
  Won: "WON",
  Lost: "LOST",
};

export const applicationStatusFromDb: Record<string, "New" | "Reviewed"> = {
  NEW: "New",
  REVIEWED: "Reviewed",
};
export const applicationStatusToDb: Record<string, "NEW" | "REVIEWED"> = {
  New: "NEW",
  Reviewed: "REVIEWED",
};

export const positionTypeFromDb: Record<string, "Full-time" | "Part-time" | "Contract" | "Internship"> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};
export const positionTypeToDb: Record<string, "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACT",
  Internship: "INTERNSHIP",
};

export const roleFromDb: Record<string, "owner" | "admin" | "editor"> = {
  OWNER: "owner",
  ADMIN: "admin",
  EDITOR: "editor",
};
export const roleToDb: Record<string, "OWNER" | "ADMIN" | "EDITOR"> = {
  owner: "OWNER",
  admin: "ADMIN",
  editor: "EDITOR",
};
