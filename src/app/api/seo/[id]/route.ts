import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seoMetadataSchema } from "@/lib/validations";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

interface Params {
  params: Promise<{ id: string }>;
}

/** PATCH /api/seo/[id] — the SEO Manager's per-page edit modal. */
export async function PATCH(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("seo", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { id } = await params;
      const body = await request.json();
      const data = seoMetadataSchema.partial().parse(body);
      const updated = await prisma.seoMetadata.update({ where: { id }, data });
      return NextResponse.json(updated);
    })) ?? jsonError("Something went wrong.", 500)
  );
}
