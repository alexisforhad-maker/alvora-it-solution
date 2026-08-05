import { Text, Section } from "@react-email/components";
import { EmailLayout, emailStyles } from "@/emails/email-layout";

export interface InternalNotificationEmailProps {
  title: string;
  fields: { label: string; value: string }[];
}

/**
 * Generic internal notification — used for every "new submission"
 * alert to the team (new contact message, new quote request, new
 * career application) rather than three near-duplicate templates.
 */
export function InternalNotificationEmail({ title, fields }: InternalNotificationEmailProps) {
  return (
    <EmailLayout previewText={title}>
      <Text style={emailStyles.heading}>{title}</Text>
      <Section>
        {fields.map((field) => (
          <Text key={field.label} style={emailStyles.paragraph}>
            <strong>{field.label}:</strong> {field.value}
          </Text>
        ))}
      </Section>
    </EmailLayout>
  );
}

export default InternalNotificationEmail;
