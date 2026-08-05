import { Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "@/emails/email-layout";

export interface QuoteConfirmationEmailProps {
  fullName: string;
  serviceNames: string[];
}

export function QuoteConfirmationEmail({ fullName, serviceNames }: QuoteConfirmationEmailProps) {
  return (
    <EmailLayout previewText="Your project details have been received">
      <Text style={emailStyles.heading}>Thanks, {fullName} — we've got your project details</Text>
      <Text style={emailStyles.paragraph}>
        We received your request regarding <strong>{serviceNames.join(", ")}</strong>. Here&apos;s
        what happens next:
      </Text>
      <Text style={emailStyles.paragraph}>
        Our team will review your project details and reach out within one business day to
        schedule a Discovery Call — a no-obligation conversation about your goals, timeline,
        and how we can help.
      </Text>
      <Text style={emailStyles.muted}>— The Alvora IT Solution Team</Text>
    </EmailLayout>
  );
}

export default QuoteConfirmationEmail;
