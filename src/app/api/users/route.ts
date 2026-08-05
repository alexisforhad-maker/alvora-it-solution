import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

/** GET /api/users — User Management list. Requires "users" view permission (Editor role has none, per the RBAC matrix). */
export async function GET() {
  const permissionCheck = await requirePermission("users", "view");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, passwordHash: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Never return the hash itself — only whether one exists, which the
  // UI uses to infer "Invited" (no password set yet) vs "Active".
  const sanitized = users.map(({ passwordHash, ...user }) => ({
    ...user,
    status: passwordHash ? "Active" : "Invited",
  }));

  return NextResponse.json(sanitized);
}

const inviteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["OWNER", "ADMIN", "EDITOR"]),
});

/**
 * POST /api/users — invites a new dashboard user. Creates the record
 * with no password set (status "Invited"); a real invite-email flow
 * (magic link to set a password) is a documented follow-up — see
 * DEPLOYMENT.md — this endpoint creates the row that flow would send
 * an email about.
 */
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("users", "create");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const body = await request.json();
      const data = inviteSchema.parse(body);

      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing) return jsonError("A user with that email already exists.", 409);

      const created = await prisma.user.create({
        data: { name: data.name, email: data.email, role: data.role },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      });

      return NextResponse.json({ ...created, status: "Invited" }, { status: 201 });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
