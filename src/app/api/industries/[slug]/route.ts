import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { industryUpdateSchema } from "@/lib/validations";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const industry = await prisma.industry.findUnique({
    where: { slug },
    include: { services: true, portfolioItems: true },
  });
  if (!industry) return jsonError("Industry not found.", 404);
  return NextResponse.json(industry);
}

/** PATCH /api/industries/[slug] — the 9 industries are a fixed list, same pattern as Services. */
export async function PATCH(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("industries", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { slug } = await params;
      const body = await request.json();
      const data = industryUpdateSchema.parse(body);

      const updated = await prisma.industry.update({ where: { slug }, data });
      return NextResponse.json(updated);
    })) ?? jsonError("Something went wrong.", 500)
  );
}
