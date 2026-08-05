import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteRequestSchema } from "@/lib/validations";
import { sendQuoteConfirmation, sendInternalNotification } from "@/lib/email";
import { withErrorHandling, verifySameOrigin, jsonError, requirePermission } from "@/lib/api-utils";
import { hit, getClientIp } from "@/lib/rate-limit";

const methodLabels: Record<string, string> = { email: "EMAIL", phone: "PHONE", whatsapp: "WHATSAPP" };

/** GET /api/quote-requests — Quote Requests admin module list (Table/Board views). Admin-only (contains prospect PII). */
export async function GET() {
  const permissionCheck = await requirePermission("quotes", "view");
  if (permissionCheck instanceof NextResponse) return permissionCheck;

  const requests = await prisma.quoteRequest.findMany({
    include: { services: { include: { service: true } } },
    orderBy: { submittedAt: "desc" },
  });
  return NextResponse.json(requests);
}

/**
 * POST /api/quote-requests — backs the public QuoteRequestForm
 * component (src/components/shared/quote-request-form.tsx, unchanged
 * since Phase 3B — it already POSTs here). Resolves the submitted
 * service slugs to real Service records (skipping any that don't
 * match, defensively) before creating the join rows.
 */
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return jsonError("Invalid request origin.", 403);
  }

  const rateLimit = hit(`quote:${getClientIp(request)}`, 5, 10 * 60 * 1000);
  if (!rateLimit.success) {
    return jsonError("Too many requests. Please try again later.", 429);
  }

  return (
    (await withErrorHandling(async () => {
      const body = await request.json();
      const data = quoteRequestSchema.parse(body);

      const services = await prisma.service.findMany({
        where: { slug: { in: data.serviceSlugs } },
        select: { id: true, name: true },
      });

      const quoteRequest = await prisma.quoteRequest.create({
        data: {
          fullName: data.fullName,
          company: data.company,
          email: data.email,
          phone: data.phone,
          projectDescription: data.projectDescription,
          timelineExpectation: data.timelineExpectation,
          budgetRange: data.budgetRange,
          preferredContactMethod: methodLabels[data.preferredContactMethod] as
            | "EMAIL"
            | "PHONE"
            | "WHATSAPP",
          timeZone: data.timeZone,
          services: {
            create: services.map((service) => ({ serviceId: service.id })),
          },
        },
      });

      const serviceNames = services.map((s) => s.name);

      await Promise.all([
        sendQuoteConfirmation(data.email, data.fullName, serviceNames),
        sendInternalNotification("New Quote Request", [
          { label: "Name", value: data.fullName },
          { label: "Company", value: data.company ?? "—" },
          { label: "Email", value: data.email },
          { label: "Services", value: serviceNames.join(", ") || "—" },
          { label: "Project", value: data.projectDescription },
          { label: "Timeline", value: data.timelineExpectation ?? "—" },
          { label: "Budget", value: data.budgetRange ?? "—" },
        ]),
      ]);

      return NextResponse.json({ id: quoteRequest.id }, { status: 201 });
    })) ?? jsonError("Something went wrong.", 500)
  );
}
