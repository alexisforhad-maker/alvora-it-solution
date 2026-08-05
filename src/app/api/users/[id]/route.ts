import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

interface Params {
  params: Promise<{ id: string }>;
}

const roleSchema = z.object({ role: z.enum(["OWNER", "ADMIN", "EDITOR"]) });

/** PATCH /api/users/[id] — changes a user's role from the User Management table. */
export async function PATCH(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("users", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { id } = await params;

      // Prevent a user from demoting/removing themselves out of the
      // Owner role by accident — mirrors the Phase 3G UI-level guard
      // (the role Select was disabled for the current user's own row).
      if (id === permissionCheck.user.id) {
        return jsonError("You can't change your own role.", 400);
      }

      const body = await request.json();
      const { role } = roleSchema.parse(body);
      const updated = await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, name: true, email: true, role: true },
      });

      return NextResponse.json(updated);
    })) ?? jsonError("Something went wrong.", 500)
  );
}

/** DELETE /api/users/[id] — removes dashboard access. Owner-only via the "delete" permission (Admin can create/edit users but not delete, per the RBAC matrix). */
export async function DELETE(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("users", "delete");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { id } = await params;
      if (id === permissionCheck.user.id) {
        return jsonError("You can't remove your own account.", 400);
      }
      await prisma.user.delete({ where: { id } });
      return NextResponse.json({ success: true });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
