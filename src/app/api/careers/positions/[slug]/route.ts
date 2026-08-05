import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { careerPositionSchema } from "@/lib/validations";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("careers", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { slug } = await params;
      const body = await request.json();
      const data = careerPositionSchema.partial().parse(body);
      const updated = await prisma.careerPosition.update({ where: { slug }, data });
      return NextResponse.json(updated);
    })) ?? jsonError("Something went wrong.", 500)
  );
}

export async function DELETE(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("careers", "delete");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { slug } = await params;
      await prisma.careerPosition.delete({ where: { slug } });
      return NextResponse.json({ success: true });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
