import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPageLayout } from "@/components/shared/legal-page-layout";
import { CookiePreferencesButton } from "@/components/shared/cookie-preferences-button";
import { cookiePolicySections, lastUpdated } from "@/data/legal-content";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: "How Alvora IT Solution uses cookies, and how to manage your preferences.",
  path: "/cookies",
});

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated={lastUpdated} sections={cookiePolicySections}>
      <CookiePreferencesButton />
    </LegalPageLayout>
  );
}
