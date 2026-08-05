import { Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "@/emails/email-layout";

export interface ContactConfirmationEmailProps {
  fullName: string;
}

export function ContactConfirmationEmail({ fullName }: ContactConfirmationEmailProps) {
  return (
    <EmailLayout previewText="Thanks for reaching out to Alvora IT Solution">
      <Text style={emailStyles.heading}>Thanks for reaching out, {fullName}</Text>
      <Text style={emailStyles.paragraph}>
        We&apos;ve received your message and typically respond within one business day. If
        your question is urgent, feel free to reach us directly via WhatsApp or phone.
      </Text>
      <Text style={emailStyles.muted}>— The Alvora IT Solution Team</Text>
    </EmailLayout>
  );
}

export default ContactConfirmationEmail;
