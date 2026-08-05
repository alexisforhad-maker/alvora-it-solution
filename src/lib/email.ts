import { Resend } from "resend";
import { contactConfig, siteConfig } from "@/config/site";
import { ContactConfirmationEmail } from "@/emails/contact-confirmation";
import { QuoteConfirmationEmail } from "@/emails/quote-confirmation";
import { CareerConfirmationEmail } from "@/emails/career-confirmation";
import { InternalNotificationEmail } from "@/emails/internal-notification";

const FROM = process.env.EMAIL_FROM ?? `${siteConfig.name} <hello@${siteConfig.domain}>`;
const SALES_INBOX = process.env.EMAIL_TO_SALES ?? contactConfig.email;

/**
 * Email sending — every API route calls one of these rather than
 * touching the Resend client directly, so the "from" address, error
 * handling, and template wiring stay centralized. Failures are logged
 * but never thrown — a submission should still succeed and save to
 * the database even if the confirmation email fails to send.
 *
 * The Resend client is created lazily (on first send, at request time)
 * rather than at module scope — constructing it eagerly throws
 * ("Missing API key") the moment this file is imported if
 * RESEND_API_KEY isn't set, which crashes `next build`'s page-data
 * collection for every route that imports this module.
 */
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendContactConfirmation(to: string, fullName: string) {
  await safeSend({
    to,
    subject: "We've received your message — Alvora IT Solution",
    react: ContactConfirmationEmail({ fullName }),
  });
}

export async function sendQuoteConfirmation(
  to: string,
  fullName: string,
  serviceNames: string[]
) {
  await safeSend({
    to,
    subject: "Your project details have been received — Alvora IT Solution",
    react: QuoteConfirmationEmail({ fullName, serviceNames }),
  });
}

export async function sendCareerConfirmation(to: string, fullName: string) {
  await safeSend({
    to,
    subject: "Thanks for your interest — Alvora IT Solution",
    react: CareerConfirmationEmail({ fullName }),
  });
}

export async function sendInternalNotification(
  title: string,
  fields: { label: string; value: string }[]
) {
  await safeSend({
    to: SALES_INBOX,
    subject: title,
    react: InternalNotificationEmail({ title, fields }),
  });
}

async function safeSend(params: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  try {
    await getResendClient().emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      react: params.react,
    });
  } catch (error) {
    // Intentionally non-fatal — see module docstring above.
    console.error("Email send failed:", error);
  }
}
