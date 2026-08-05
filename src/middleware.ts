import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

/**
 * Route protection for the Admin Dashboard. Every /admin/* route
 * (except /admin/login itself) requires an authenticated session;
 * unauthenticated requests are redirected to /admin/login with a
 * callback URL so the user lands back where they started after
 * signing in.
 *
 * This is intentionally a coarse "is there a session" check — the
 * fine-grained per-module, per-action permission check still happens
 * via `can(session.user.role, module, action)` from
 * src/lib/permissions.ts inside each page/route, unchanged from
 * Phase 3G.
 *
 * Runtime fix: built from `authConfig` (src/lib/auth.config.ts) —
 * the Edge-safe subset — NOT from the full config in src/lib/auth.ts.
 * middleware.ts is always bundled for the Edge Runtime by Next.js
 * itself, and the full config's Credentials provider pulls in
 * bcryptjs, which isn't Edge-compatible. This still does a real
 * session-validity check (reads/verifies the JWT session cookie,
 * which Edge Runtime can do natively) — it just never touches bcrypt
 * or the database to do it, since it doesn't need to for a coarse
 * "logged in or not" gate.
 */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isLoggedIn = !!req.auth;

  if (isLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
