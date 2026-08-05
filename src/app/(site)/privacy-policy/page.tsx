import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPageLayout } from "@/components/shared/legal-page-layout";
import { privacyPolicySections, lastUpdated } from "@/data/legal-content";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Alvora IT Solution collects, uses, and protects your information.",
  path: "/privacy-policy",
  noIndex: false,
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={lastUpdated} sections={privacyPolicySections} />
  );
}
