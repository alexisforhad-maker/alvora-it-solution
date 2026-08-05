import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

/**
 * GET /api/blog — public visitors only ever see PUBLISHED posts;
 * an authenticated admin session (any role, since all three can at
 * least view Blog per the RBAC matrix) also sees drafts, matching the
 * Blog Manager's full list view.
 */
export async function GET() {
  const session = await auth();
  const posts = await prisma.blogPost.findMany({
    where: session?.user ? {} : { status: "PUBLISHED" },
    include: { category: true, author: true, relatedServices: true },
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json(posts);
}

/** POST /api/blog — Blog Manager's "New Post" action. */
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("blog", "create");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const body = await request.json();
      const data = blogPostSchema.parse(body);
      const { relatedServiceIds, categoryId, ...rest } = data;

      const created = await prisma.blogPost.create({
        data: {
          ...rest,
          category: { connect: { id: categoryId } },
          author: { connect: { id: permissionCheck.user.id } },
          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
          ...(relatedServiceIds && {
            relatedServices: { connect: relatedServiceIds.map((id) => ({ id })) },
          }),
        },
      });

      return NextResponse.json(created, { status: 201 });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
