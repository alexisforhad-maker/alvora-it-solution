import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/industries — public list. */
export async function GET() {
  const industries = await prisma.industry.findMany({
    include: { services: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(industries);
}
