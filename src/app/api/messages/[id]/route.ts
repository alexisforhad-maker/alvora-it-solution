import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

interface Params {
  params: Promise<{ id: string }>;
}

const statusSchema = z.object({ status: z.enum(["NEW", "REPLIED", "ARCHIVED"]) });

export async function PATCH(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("messages", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { id } = await params;
      const body = await request.json();
      const { status } = statusSchema.parse(body);
      const updated = await prisma.contactMessage.update({ where: { id }, data: { status } });
      return NextResponse.json(updated);
    })) ?? jsonError("Something went wrong.", 500)
  );
}

export async function DELETE(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("messages", "delete");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { id } = await params;
      await prisma.contactMessage.delete({ where: { id } });
      return NextResponse.json({ success: true });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
