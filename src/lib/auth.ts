import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import type { Role } from "@/lib/permissions";

/**
 * Auth.js configuration — the full, Node.js-runtime version.
 *
 * Integrates directly with the RBAC structure already defined in
 * src/lib/permissions.ts (Phase 3G) — this file does NOT redefine
 * roles or the permission matrix. It only:
 *   1. Authenticates a user against the `users` table (email + bcrypt
 *      password hash)
 *   2. Puts that user's `role` (already typed as the same `Role` union
 *      from permissions.ts) onto the JWT and session
 *
 * Every admin page and API route then calls `can(session.user.role, …)`
 * from permissions.ts exactly as the Phase 3G mock version did —
 * `currentAdminUser` from src/data/admin-users.ts is what gets
 * replaced by `await auth()`, not the permission logic itself.
 *
 * Credentials provider requires the JWT session strategy (database
 * sessions aren't supported for Credentials in Auth.js) — the
 * PrismaAdapter is still wired in so Account/Session tables are ready
 * if an OAuth provider (Google, Microsoft) is added later without a
 * schema change.
 *
 * Runtime fix: built on top of `authConfig` (src/lib/auth.config.ts)
 * rather than duplicating `pages`/`authorized` here. This file is the
 * one place the Credentials provider, bcrypt, and the PrismaAdapter
 * are allowed to live — it's only ever imported by code that runs on
 * the Node.js runtime (the /api/auth/* route handler, the blog API
 * routes, and src/lib/api-utils.ts for other Route Handlers), never
 * by middleware.ts, which now builds its own Edge-safe `auth()` from
 * `authConfig` directly instead of importing it from here.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          // Prisma's Role enum is uppercase (OWNER/ADMIN/EDITOR) by DB
          // convention; the RBAC permission matrix in permissions.ts
          // (Phase 3G, unchanged here) uses lowercase — map at this one
          // boundary rather than touching either existing type.
          role: user.role.toLowerCase() as Role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
