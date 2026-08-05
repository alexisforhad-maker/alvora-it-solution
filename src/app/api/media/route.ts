import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { requirePermission, withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** GET /api/media — Media Library grid listing. */
export async function GET() {
  const permissionCheck = await requirePermission("media", "view");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  const items = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

/** POST /api/media — Media Library's "Upload" action (multipart/form-data). */
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const permissionCheck = await requirePermission("media", "create");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  return (
    (await withErrorHandling(async () => {
      const formData = await request.formData();
      const file = formData.get("file");
      const usedIn = formData.get("usedIn");

      if (!(file instanceof File)) return jsonError("No file provided.", 400);
      if (file.size > MAX_UPLOAD_BYTES) return jsonError("File is too large (max 10MB).", 413);

      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadToCloudinary(buffer, {
        folder: "alvora/media-library",
        resourceType: "image",
      });

      const asset = await prisma.mediaAsset.create({
        data: {
          filename: file.name,
          url: uploaded.url,
          cloudinaryPublicId: uploaded.publicId,
          usedIn: typeof usedIn === "string" ? usedIn : undefined,
          uploadedById: permissionCheck.user.id,
        },
      });

      return NextResponse.json(asset, { status: 201 });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
