import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { careerPositionSchema } from "@/lib/validations";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

/** GET /api/careers/positions — public sees only OPEN positions; the Careers Manager (admin) passes ?all=true to see everything. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "true";

  const positions = await prisma.careerPosition.findMany({
    where: showAll ? {} : { status: "OPEN" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(positions);
}

/** POST /api/careers/positions — Careers Manager's "New Listing" action. */
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("careers", "create");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const body = await request.json();
      const data = careerPositionSchema.parse(body);
      const created = await prisma.careerPosition.create({ data });
      return NextResponse.json(created, { status: 201 });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
