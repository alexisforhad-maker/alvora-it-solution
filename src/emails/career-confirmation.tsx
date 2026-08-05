import { Text } from "@react-email/components";
import { EmailLayout, emailStyles } from "@/emails/email-layout";

export interface CareerConfirmationEmailProps {
  fullName: string;
}

export function CareerConfirmationEmail({ fullName }: CareerConfirmationEmailProps) {
  return (
    <EmailLayout previewText="Thanks for your interest in joining Alvora IT Solution">
      <Text style={emailStyles.heading}>Thanks for your interest, {fullName}</Text>
      <Text style={emailStyles.paragraph}>
        We&apos;ve received your information and will keep it on file. If a role opens up that
        matches your background, our team will reach out directly.
      </Text>
      <Text style={emailStyles.muted}>— The Alvora IT Solution Team</Text>
    </EmailLayout>
  );
}

export default CareerConfirmationEmail;
