import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/services — public list, used to hydrate the Services Hub / Homepage once the frontend is wired to the DB. */
export async function GET() {
  const services = await prisma.service.findMany({
    include: { technologies: true, industries: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(services);
}
