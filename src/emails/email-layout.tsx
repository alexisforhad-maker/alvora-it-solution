import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

export interface EmailLayoutProps {
  previewText: string;
  children: ReactNode;
}

/**
 * Shared email layout — every transactional email (contact
 * confirmation, quote confirmation, career confirmation, internal
 * notification) wraps its content in this, so brand header/footer and
 * base styling only exist in one place. Kept deliberately simple
 * (table-free, minimal CSS) for reliable rendering across email
 * clients.
 */
export function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={`${siteConfig.url}/images/logo.png`}
              alt={siteConfig.name}
              width="140"
              style={{ height: "auto" }}
            />
          </Section>

          <Section style={content}>{children}</Section>

          <Hr style={hr} />

          <Section>
            <Text style={footerText}>
              {siteConfig.name} — {siteConfig.url}
            </Text>
            <Text style={footerText}>
              This is an automated message. If you weren&apos;t expecting it, you can safely
              ignore it.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#F7F9FA",
  fontFamily: "Inter, -apple-system, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "32px 24px",
  maxWidth: "480px",
};

const header = {
  paddingBottom: "24px",
};

const content = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #DDE4E6",
  borderRadius: "12px",
  padding: "32px",
};

const hr = {
  borderColor: "#DDE4E6",
  margin: "24px 0",
};

const footerText = {
  color: "#5B6B77",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "4px 0",
};

export const emailStyles = {
  heading: { color: "#0B3A56", fontSize: "20px", fontWeight: 700, margin: "0 0 16px" },
  paragraph: { color: "#101820", fontSize: "15px", lineHeight: "24px", margin: "0 0 12px" },
  muted: { color: "#5B6B77", fontSize: "13px", lineHeight: "20px", margin: "0 0 4px" },
};
