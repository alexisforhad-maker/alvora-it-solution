/**
 * Role-based permission model for the Admin Dashboard.
 *
 * Authentication itself (Auth.js, session/JWT handling) is built in
 * the next phase — this file defines the permission *structure* now,
 * per the Phase 3G requirement to prepare RBAC ahead of auth wiring.
 * Once Auth.js is integrated, the session's role claim maps directly
 * onto the `Role` type below, and `can()` becomes the single gate
 * every admin page and API route checks before allowing an action.
 */

export type Role = "owner" | "admin" | "editor";

export type AdminModule =
  | "dashboard"
  | "services"
  | "industries"
  | "portfolio"
  | "blog"
  | "team"
  | "careers"
  | "messages"
  | "quotes"
  | "media"
  | "seo"
  | "settings"
  | "users";

export type Action = "view" | "create" | "edit" | "delete";

/**
 * Permission matrix. Owner has full access everywhere. Admin has full
 * content access but not User Management deletion of an Owner (that
 * finer-grained rule is enforced at the call site once real user
 * records exist). Editor can manage day-to-day content but cannot
 * touch Site Settings, SEO sitewide config, or User Management.
 */
const matrix: Record<Role, Record<AdminModule, Action[]>> = {
  owner: {
    dashboard: ["view"],
    services: ["view", "create", "edit", "delete"],
    industries: ["view", "create", "edit", "delete"],
    portfolio: ["view", "create", "edit", "delete"],
    blog: ["view", "create", "edit", "delete"],
    team: ["view", "create", "edit", "delete"],
    careers: ["view", "create", "edit", "delete"],
    messages: ["view", "edit", "delete"],
    quotes: ["view", "edit", "delete"],
    media: ["view", "create", "delete"],
    seo: ["view", "edit"],
    settings: ["view", "edit"],
    users: ["view", "create", "edit", "delete"],
  },
  admin: {
    dashboard: ["view"],
    services: ["view", "create", "edit", "delete"],
    industries: ["view", "create", "edit", "delete"],
    portfolio: ["view", "create", "edit", "delete"],
    blog: ["view", "create", "edit", "delete"],
    team: ["view", "create", "edit", "delete"],
    careers: ["view", "create", "edit", "delete"],
    messages: ["view", "edit", "delete"],
    quotes: ["view", "edit", "delete"],
    media: ["view", "create", "delete"],
    seo: ["view", "edit"],
    settings: ["view"],
    users: ["view", "create", "edit"],
  },
  editor: {
    dashboard: ["view"],
    services: ["view", "create", "edit"],
    industries: ["view", "create", "edit"],
    portfolio: ["view", "create", "edit"],
    blog: ["view", "create", "edit"],
    team: ["view", "edit"],
    careers: ["view", "edit"],
    messages: ["view"],
    quotes: ["view"],
    media: ["view", "create"],
    seo: ["view"],
    settings: [],
    users: [],
  },
};

export function can(role: Role, module: AdminModule, action: Action): boolean {
  return matrix[role][module].includes(action);
}

export function permissionsForRole(role: Role): Record<AdminModule, Action[]> {
  return matrix[role];
}

export const roleLabels: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
};

export const roleDescriptions: Record<Role, string> = {
  owner: "Full access to all content, settings, and user management.",
  admin: "Full content access; cannot change Site Settings or delete users.",
  editor: "Can create and edit day-to-day content; no access to settings, SEO sitewide config, or users.",
};
