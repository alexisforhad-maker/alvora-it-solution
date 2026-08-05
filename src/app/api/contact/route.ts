import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validations";
import { sendContactConfirmation, sendInternalNotification } from "@/lib/email";
import { withErrorHandling, verifySameOrigin, jsonError } from "@/lib/api-utils";
import { hit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/contact — backs the public ContactForm component
 * (src/components/shared/contact-form.tsx, unchanged since Phase 3B —
 * it already POSTs here). Validates with the same Zod schema the
 * client form uses, persists to ContactMessage, and sends both a
 * visitor confirmation and an internal notification email.
 */
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return jsonError("Invalid request origin.", 403);
  }

  const rateLimit = hit(`contact:${getClientIp(request)}`, 5, 10 * 60 * 1000);
  if (!rateLimit.success) {
    return jsonError("Too many requests. Please try again later.", 429);
  }

  return (
    (await withErrorHandling(async () => {
      const body = await request.json();
      const data = contactFormSchema.parse(body);

      const message = await prisma.contactMessage.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          message: data.message,
          channel: "CONTACT_FORM",
        },
      });

      await Promise.all([
        sendContactConfirmation(data.email, data.fullName),
        sendInternalNotification("New Contact Message", [
          { label: "Name", value: data.fullName },
          { label: "Email", value: data.email },
          { label: "Message", value: data.message },
        ]),
      ]);

      return NextResponse.json({ id: message.id }, { status: 201 });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
