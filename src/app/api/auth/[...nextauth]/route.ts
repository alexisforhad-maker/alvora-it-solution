import { handlers } from "@/lib/auth";

/**
 * Auth.js route handler — handles /api/auth/signin, /api/auth/callback,
 * /api/auth/session, /api/auth/signout, etc. All configuration lives
 * in src/lib/auth.ts; this file only re-exports the generated handlers
 * per the Next.js App Router convention.
 */
export const { GET, POST } = handlers;
