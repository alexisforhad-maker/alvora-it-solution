import type { Role } from "@/lib/permissions";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Invited" | "Disabled";
  lastLogin?: string;
};

/**
 * Placeholder admin user list and "current user" for the User
 * Management module and role-based UI gating. There is no real
 * authentication yet (Auth.js is wired up in the next phase) — this
 * file lets the Admin Dashboard demonstrate and exercise the
 * permission model from src/lib/permissions.ts today. Replace
 * `currentAdminUser` with the real session once auth exists.
 */
export const adminUsers: AdminUser[] = [
  {
    id: "user-1",
    name: "Founder & CEO",
    email: "founder@alvoraitsolution.com",
    role: "owner",
    status: "Active",
    lastLogin: "2026-08-01",
  },
  {
    id: "user-2",
    name: "Project Manager",
    email: "pm@alvoraitsolution.com",
    role: "admin",
    status: "Active",
    lastLogin: "2026-07-30",
  },
  {
    id: "user-3",
    name: "Content Editor",
    email: "editor@alvoraitsolution.com",
    role: "editor",
    status: "Invited",
  },
];

/** @deprecated Superseded by the real Auth.js session (src/lib/auth.ts) as of Phase 3H — `useSession()` is now the source of truth for the current user everywhere in the Admin Dashboard. Kept only as a reference for what a session's shape looks like. */
export const currentAdminUser: AdminUser = adminUsers[0]!;
