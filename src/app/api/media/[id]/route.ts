import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

interface Params {
  params: Promise<{ id: string }>;
}

/** DELETE /api/media/[id] — removes the asset from both Cloudinary and the database. */
export async function DELETE(request: Request, { params }: Params) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("media", "delete");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const { id } = await params;
      const asset = await prisma.mediaAsset.findUnique({ where: { id } });
      if (!asset) return jsonError("Media asset not found.", 404);

      await deleteFromCloudinary(asset.cloudinaryPublicId);
      await prisma.mediaAsset.delete({ where: { id } });

      return NextResponse.json({ success: true });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
