import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/technologies — full lookup list, grouped implicitly by
 * `category`. Added during Phase 3I admin-wiring: the Portfolio and
 * Services Manager forms tag technologies by name, and resolving
 * those names to real Technology IDs for the API's `technologyIds`
 * fields needs this endpoint to exist.
 */
export async function GET() {
  const technologies = await prisma.technology.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(technologies);
}
