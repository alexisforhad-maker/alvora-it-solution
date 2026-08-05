import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe subset of the Auth.js configuration — consumed ONLY by
 * middleware.ts.
 *
 * Root cause this file exists to fix: Next.js always compiles
 * middleware.ts for the Edge Runtime — that's a platform constraint,
 * not something configured anywhere in this app. middleware.ts used
 * to import `auth` directly from the full config in src/lib/auth.ts,
 * which includes the Credentials provider (bcryptjs password
 * verification) and the PrismaAdapter. Both pull in Node.js-only APIs
 * (bcryptjs specifically uses setImmediate/process.nextTick), so
 * building middleware dragged that whole dependency chain into the
 * Edge bundle — which the Edge Runtime cannot execute. That's the
 * exact deployment failure this split resolves.
 *
 * This file must NEVER import bcryptjs, @auth/prisma-adapter, the
 * Prisma client, or the Credentials provider — directly or
 * transitively. It only needs enough to answer "does this request
 * carry a valid session" for coarse route protection at the edge; the
 * actual credential check (bcrypt + database) still happens on the
 * Node.js runtime, in src/lib/auth.ts, via the /api/auth/* route
 * handler — this file doesn't change that at all.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  // Providers that need Node.js APIs (Credentials + bcrypt) are added
  // in src/lib/auth.ts, not here — this array intentionally stays
  // empty. NextAuth only needs a providers array to exist for the
  // Edge-side `auth()` wrapper used by middleware to type-check.
  providers: [],
  callbacks: {
    // Coarse "is there a session" check only — used by middleware.ts.
    // The fine-grained per-module/per-action permission check still
    // happens via `can(session.user.role, module, action)` from
    // src/lib/permissions.ts inside each page/route, unchanged from
    // Phase 3G.
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
