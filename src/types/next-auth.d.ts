import type { Role } from "@/lib/permissions";
import type { DefaultSession } from "next-auth";

/**
 * Augments Auth.js's built-in types so `session.user.role` and
 * `session.user.id` are typed everywhere `auth()` is called, instead
 * of needing an `as` cast at every call site.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    id: string;
  }
}
