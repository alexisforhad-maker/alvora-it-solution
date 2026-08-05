import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { portfolioItemSchema } from "@/lib/validations";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

/** GET /api/portfolio — public list, supports ?service=slug and ?industry=slug filtering, mirroring the Portfolio Hub's URL-param filter bar. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service");
  const industry = searchParams.get("industry");

  const items = await prisma.portfolioItem.findMany({
    where: {
      ...(service && { services: { some: { slug: service } } }),
      ...(industry && { industries: { some: { slug: industry } } }),
    },
    include: { services: true, industries: true, technologies: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

/** POST /api/portfolio — Portfolio Manager's "New Case Study" action. */
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("portfolio", "create");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const body = await request.json();
      const data = portfolioItemSchema.parse(body);
      const { serviceIds, industryIds, technologyIds, ...rest } = data;

      const created = await prisma.portfolioItem.create({
        data: {
          ...rest,
          services: { connect: serviceIds.map((id) => ({ id })) },
          industries: { connect: industryIds.map((id) => ({ id })) },
          ...(technologyIds && { technologies: { connect: technologyIds.map((id) => ({ id })) } }),
        },
      });

      return NextResponse.json(created, { status: 201 });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
