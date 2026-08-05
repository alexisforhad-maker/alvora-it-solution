import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seoMetadataSchema } from "@/lib/validations";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

/** GET /api/seo — full page-metadata inventory for the SEO Manager, mirroring src/data/admin-seo-pages.ts's shape once wired to this route. */
export async function GET() {
  const permissionCheck = await requirePermission("seo", "view");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  const entries = await prisma.seoMetadata.findMany({ orderBy: { path: "asc" } });
  return NextResponse.json(entries);
}

/** POST /api/seo — creates an override entry for a path that doesn't have one yet (upsert semantics from the admin UI's perspective). */
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("seo", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const body = await request.json();
      const data = seoMetadataSchema.parse(body);

      const entry = await prisma.seoMetadata.upsert({
        where: { path: data.path },
        update: data,
        create: data,
      });

      return NextResponse.json(entry, { status: 201 });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
