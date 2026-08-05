import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/api-utils";

/** GET /api/careers/applications — Careers Manager's "Interest Submissions" tab. Admin-only (contains applicant PII). */
export async function GET() {
  const permissionCheck = await requirePermission("careers", "view");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  const applications = await prisma.careerApplication.findMany({
    include: { position: true },
    orderBy: { submittedAt: "desc" },
  });
  return NextResponse.json(applications);
}
