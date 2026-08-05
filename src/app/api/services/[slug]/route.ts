import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceUpdateSchema } from "@/lib/validations";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

interface Params {
  params: Promise<{ slug: string }>;
}

/** GET /api/services/[slug] — single service, including its relations. */
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { technologies: true, industries: true, relatedTo: true, portfolioItems: true },
  });
  if (!service) return jsonError("Service not found.", 404);
  return NextResponse.json(service);
}

/**
 * PATCH /api/services/[slug] — Services Manager edit action (Phase 3G
 * UI, not yet wired to this route — see the Development Summary for
 * that remaining step). No POST/DELETE: the 10 services are a fixed
 * list per the Master Blueprint, matching the Admin module's
 * "editable, not creatable/deletable" behavior.
 */
export async function PATCH(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("services", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { slug } = await params;
      const body = await request.json();
      const data = serviceUpdateSchema.parse(body);
      const { technologyIds, ...rest } = data;

      const updated = await prisma.service.update({
        where: { slug },
        data: {
          ...rest,
          ...(technologyIds && { technologies: { set: technologyIds.map((id) => ({ id })) } }),
        },
      });

      return NextResponse.json(updated);
    })) ?? jsonError("Something went wrong.", 500)
  );
}
