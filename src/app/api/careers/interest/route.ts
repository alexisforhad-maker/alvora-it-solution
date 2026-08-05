import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { careerInterestSchema } from "@/lib/validations";
import { sendCareerConfirmation, sendInternalNotification } from "@/lib/email";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";
import { hit, getClientIp } from "@/lib/rate-limit";

const MAX_RESUME_BYTES = 10 * 1024 * 1024; // 10MB, matches the client-side FileUpload limit

/**
 * POST /api/careers/interest — backs the public CareerInterestForm
 * component (src/components/shared/career-interest-form.tsx,
 * unchanged since Phase 3F — it already POSTs FormData here).
 * multipart/form-data because of the optional résumé file.
 */
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return jsonError("Invalid request origin.", 403);
  }

  const rateLimit = hit(`career:${getClientIp(request)}`, 5, 10 * 60 * 1000);
  if (!rateLimit.success) {
    return jsonError("Too many requests. Please try again later.", 429);
  }

  return (
    (await withErrorHandling(async () => {
      const formData = await request.formData();

      const data = careerInterestSchema.parse({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        areaOfExpertise: formData.get("areaOfExpertise"),
        message: formData.get("message") || undefined,
      });

      const resumeFile = formData.get("resume");
      let resumeUrl: string | undefined;

      if (resumeFile instanceof File && resumeFile.size > 0) {
        if (resumeFile.size > MAX_RESUME_BYTES) {
          return jsonError("Résumé file is too large (max 10MB).", 413);
        }
        const buffer = Buffer.from(await resumeFile.arrayBuffer());
        const uploaded = await uploadToCloudinary(buffer, {
          folder: "alvora/resumes",
          resourceType: "raw",
        });
        resumeUrl = uploaded.url;
      }

      const application = await prisma.careerApplication.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          areaOfExpertise: data.areaOfExpertise,
          message: data.message,
          resumeUrl,
        },
      });

      await Promise.all([
        sendCareerConfirmation(data.email, data.fullName),
        sendInternalNotification("New Career Interest Submission", [
          { label: "Name", value: data.fullName },
          { label: "Email", value: data.email },
          { label: "Expertise", value: data.areaOfExpertise },
          { label: "Résumé", value: resumeUrl ?? "Not provided" },
        ]),
      ]);

      return NextResponse.json({ id: application.id }, { status: 201 });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
