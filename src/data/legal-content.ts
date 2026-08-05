import type { LegalSection } from "@/components/shared/legal-page-layout";
import { siteConfig, contactConfig } from "@/config/site";

/**
 * Standard-form legal content for Privacy Policy, Terms & Conditions,
 * and Cookie Policy. This is template legal language appropriate for
 * a software services company — it should be reviewed by qualified
 * legal counsel before production launch, particularly for
 * jurisdiction-specific requirements (GDPR, CCPA, and Bangladesh data
 * protection law) that a template cannot fully address.
 */

export const lastUpdated = "2026-08-01";

export const privacyPolicySections: LegalSection[] = [
  {
    id: "introduction",
    heading: "Introduction",
    paragraphs: [
      `This Privacy Policy explains how ${siteConfig.name} ("we", "us", or "our") collects, uses, and protects information when you visit ${siteConfig.domain} or engage our services.`,
    ],
  },
  {
    id: "information-we-collect",
    heading: "Information We Collect",
    paragraphs: [
      "We collect information you provide directly, such as your name, email address, company, and project details when you submit a contact form, request a quote, or register interest in a role.",
      "We also collect limited technical information automatically, such as browser type and general usage patterns, to help us understand how the site is used and to keep it secure.",
    ],
  },
  {
    id: "how-we-use-information",
    heading: "How We Use Information",
    paragraphs: [
      "We use the information we collect to respond to inquiries, prepare project proposals, deliver contracted services, and communicate with clients and candidates.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies",
    paragraphs: [
      "We use cookies to support core site functionality and to understand aggregate site usage. See our Cookie Policy for details on the categories of cookies we use and how to manage your preferences.",
    ],
  },
  {
    id: "third-party-services",
    heading: "Third-Party Services",
    paragraphs: [
      "We may use third-party service providers for functions such as email delivery, media storage, and analytics. These providers process data on our behalf and are not permitted to use it for their own purposes.",
    ],
  },
  {
    id: "your-rights",
    heading: "Your Rights",
    paragraphs: [
      "Depending on your location, you may have rights to access, correct, or request deletion of your personal information. To exercise these rights, contact us using the details below.",
    ],
  },
  {
    id: "contact",
    heading: "Contact Us",
    paragraphs: [
      `If you have questions about this Privacy Policy, contact us at ${contactConfig.email}.`,
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Acceptance of Terms",
    paragraphs: [
      `By accessing ${siteConfig.domain} or engaging ${siteConfig.name} for services, you agree to these Terms & Conditions.`,
    ],
  },
  {
    id: "services",
    heading: "Services",
    paragraphs: [
      "Specific project scope, deliverables, timelines, and pricing are defined in a separate written proposal or agreement for each engagement, not on this website.",
    ],
  },
  {
    id: "intellectual-property",
    heading: "Intellectual Property",
    paragraphs: [
      "Unless otherwise agreed in writing, ownership of custom deliverables (source code, designs, and related project assets) transfers to the client upon full payment, as detailed in the project agreement.",
      "Alvora retains ownership of any pre-existing tools, frameworks, or internal libraries used to deliver a project, and may reuse general knowledge and non-confidential techniques gained across engagements.",
    ],
  },
  {
    id: "payment-terms",
    heading: "Payment Terms",
    paragraphs: [
      "Payment terms, including milestones and schedules, are set out in the individual project agreement or statement of work for each engagement.",
    ],
  },
  {
    id: "confidentiality",
    heading: "Confidentiality",
    paragraphs: [
      "We treat client project information as confidential and do not disclose it to third parties without consent, except as required by law.",
    ],
  },
  {
    id: "limitation-of-liability",
    heading: "Limitation of Liability",
    paragraphs: [
      `To the extent permitted by law, ${siteConfig.name}'s liability for any claim arising from our services is limited to the fees paid for the specific engagement giving rise to the claim.`,
    ],
  },
  {
    id: "governing-law",
    heading: "Governing Law",
    paragraphs: [
      "These terms are governed by the laws of Bangladesh, without prejudice to any mandatory consumer or data protection rights applicable in a client's home jurisdiction.",
    ],
  },
  {
    id: "contact",
    heading: "Contact Us",
    paragraphs: [`Questions about these Terms & Conditions can be directed to ${contactConfig.email}.`],
  },
];

export const cookiePolicySections: LegalSection[] = [
  {
    id: "what-are-cookies",
    heading: "What Are Cookies",
    paragraphs: [
      "Cookies are small text files stored on your device that help websites function properly and understand how they're used.",
    ],
  },
  {
    id: "categories",
    heading: "Cookie Categories We Use",
    paragraphs: [
      "Essential cookies: required for core site functionality, such as remembering your cookie preferences. These cannot be disabled.",
      "Analytics cookies: help us understand aggregate site usage so we can improve the experience. These are only set with your consent.",
      "Functional cookies: remember preferences such as previously selected filters, to make your visit more convenient.",
    ],
  },
  {
    id: "managing-preferences",
    heading: "Managing Your Preferences",
    paragraphs: [
      "You can update your cookie preferences at any time using the control below, or through your browser settings.",
    ],
  },
  {
    id: "contact",
    heading: "Contact Us",
    paragraphs: [`Questions about this Cookie Policy can be directed to ${contactConfig.email}.`],
  },
];
