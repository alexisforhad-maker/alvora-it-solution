import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { can, type AdminModule, type Action } from "@/lib/permissions";
import { siteConfig } from "@/config/site";

/**
 * Shared guards and response helpers for API routes — used by every
 * route under src/app/api/, so auth checks, permission checks, and
 * error formatting are consistent everywhere instead of hand-rolled
 * per route.
 */

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Requires an authenticated session; returns the session or a 401
 * response. Callers should `if (result instanceof NextResponse) return
 * result;` to narrow the type before using the session.
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    return jsonError("Authentication required.", 401);
  }
  return session;
}

/**
 * Requires the current session's role to have a given permission,
 * per the unchanged RBAC matrix in src/lib/permissions.ts. Returns
 * the session on success, or a 401/403 response.
 */
export async function requirePermission(module: AdminModule, action: Action) {
  const session = await auth();
  if (!session?.user) {
    return jsonError("Authentication required.", 401);
  }
  if (!can(session.user.role, module, action)) {
    return jsonError("You do not have permission to perform this action.", 403);
  }
  return session;
}

/**
 * Basic CSRF mitigation for state-changing admin API routes: confirms
 * the request's Origin header matches our own site. Auth.js's session
 * cookie already sets SameSite=Lax (blocking the cross-site POST case
 * in modern browsers), so this is a defense-in-depth second check
 * rather than the sole protection.
 */
export function verifySameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin requests from some clients omit Origin; SameSite cookie is the primary defense in that case
  try {
    return new URL(origin).host === new URL(siteConfig.url).host;
  } catch {
    return false;
  }
}

/**
 * Formats a Zod validation error into a consistent 400 response body:
 * { error: "Validation failed", fields: { fieldName: "message" } }.
 */
export function zodErrorResponse(error: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    if (!fields[key]) fields[key] = issue.message;
  }
  return NextResponse.json({ error: "Validation failed", fields }, { status: 400 });
}

/**
 * Wraps a route handler body with consistent try/catch error handling
 * so an unexpected throw (DB connection error, etc.) never leaks a
 * stack trace to the client — it logs server-side and returns a
 * generic 500.
 */
export async function withErrorHandling<T>(fn: () => Promise<T>): Promise<T | NextResponse> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(error);
    }
    console.error("API route error:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
