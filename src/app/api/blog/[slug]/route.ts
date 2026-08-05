import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const session = await auth();

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true, author: true, relatedServices: true },
  });

  if (!post) return jsonError("Post not found.", 404);
  if (post.status === "DRAFT" && !session?.user) return jsonError("Post not found.", 404);

  return NextResponse.json(post);
}

export async function PATCH(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("blog", "edit");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { slug } = await params;
      const body = await request.json();
      const data = blogPostSchema.partial().parse(body);
      const { relatedServiceIds, categoryId, ...rest } = data;

      const existing = await prisma.blogPost.findUnique({ where: { slug } });
      if (!existing) return jsonError("Post not found.", 404);

      const updated = await prisma.blogPost.update({
        where: { slug },
        data: {
          ...rest,
          ...(categoryId && { category: { connect: { id: categoryId } } }),
          ...(relatedServiceIds && {
            relatedServices: { set: relatedServiceIds.map((id) => ({ id })) },
          }),
          ...(data.status === "PUBLISHED" && !existing.publishedAt && { publishedAt: new Date() }),
        },
      });

      return NextResponse.json(updated);
    })) ?? jsonError("Something went wrong.", 500)
  );
}

export async function DELETE(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("blog", "delete");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { slug } = await params;
      await prisma.blogPost.delete({ where: { slug } });
      return NextResponse.json({ success: true });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
