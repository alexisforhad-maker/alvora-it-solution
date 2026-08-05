import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/api-utils";

/** GET /api/messages — Contact Messages admin module list. Admin-only (contains visitor PII). */
export async function GET() {
  const permissionCheck = await requirePermission("messages", "view");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  const messages = await prisma.contactMessage.findMany({ orderBy: { submittedAt: "desc" } });
  return NextResponse.json(messages);
}
