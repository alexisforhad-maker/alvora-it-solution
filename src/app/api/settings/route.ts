import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteSettingsSchema } from "@/lib/validations";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

/**
 * GET /api/settings — single-row settings (id is always "singleton").
 * Read access requires at least a valid admin session (Editor role
 * included, since Site Settings is view-only for Editors per the
 * RBAC matrix — the UI-level gate already reflects this in the Phase
 * 3G Settings page).
 */
export async function GET() {
  const permissionCheck = await requirePermission("settings", "view");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(settings);
}

/** PATCH /api/settings — Owner/Admin only, per the RBAC matrix (Editors have no "edit" permission on this module). */
export async function PATCH(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("settings", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const body = await request.json();
      const data = siteSettingsSchema.partial().parse(body);

      const updated = await prisma.siteSettings.upsert({
        where: { id: "singleton" },
        update: data,
        create: { id: "singleton", ...siteSettingsSchema.parse(body) },
      });

      return NextResponse.json(updated);
    })) ?? jsonError("Something went wrong.", 500)
  );
}
