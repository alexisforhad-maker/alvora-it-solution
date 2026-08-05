import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { portfolioItemSchema } from "@/lib/validations";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const item = await prisma.portfolioItem.findUnique({
    where: { slug },
    include: { services: true, industries: true, technologies: true },
  });
  if (!item) return jsonError("Portfolio item not found.", 404);
  return NextResponse.json(item);
}

export async function PATCH(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("portfolio", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { slug } = await params;
      const body = await request.json();
      const data = portfolioItemSchema.partial().parse(body);
      const { serviceIds, industryIds, technologyIds, ...rest } = data;

      const updated = await prisma.portfolioItem.update({
        where: { slug },
        data: {
          ...rest,
          ...(serviceIds && { services: { set: serviceIds.map((id) => ({ id })) } }),
          ...(industryIds && { industries: { set: industryIds.map((id) => ({ id })) } }),
          ...(technologyIds && { technologies: { set: technologyIds.map((id) => ({ id })) } }),
        },
      });

      return NextResponse.json(updated);
    })) ?? jsonError("Something went wrong.", 500)
  );
}

export async function DELETE(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("portfolio", "delete");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { slug } = await params;
      await prisma.portfolioItem.delete({ where: { slug } });
      return NextResponse.json({ success: true });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
