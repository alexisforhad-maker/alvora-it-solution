import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { teamMemberSchema } from "@/lib/validations";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

/** GET /api/team — public list, ordered for direct display on the About page. */
export async function GET() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(members);
}

/** POST /api/team — Team Manager's "Add Team Member" action. */
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("team", "create");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const body = await request.json();
      const data = teamMemberSchema.parse(body);
      const created = await prisma.teamMember.create({ data });
      return NextResponse.json(created, { status: 201 });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
