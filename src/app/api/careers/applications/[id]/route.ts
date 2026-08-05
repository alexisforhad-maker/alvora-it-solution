import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

interface Params {
  params: Promise<{ id: string }>;
}

const statusSchema = z.object({ status: z.enum(["NEW", "REVIEWED"]) });

/** PATCH /api/careers/applications/[id] — marks a submission Reviewed/New from the Interest Submissions table. */
export async function PATCH(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("careers", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { id } = await params;
      const body = await request.json();
      const { status } = statusSchema.parse(body);
      const updated = await prisma.careerApplication.update({ where: { id }, data: { status } });
      return NextResponse.json(updated);
    })) ?? jsonError("Something went wrong.", 500)
  );
}
