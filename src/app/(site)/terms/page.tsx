import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPageLayout } from "@/components/shared/legal-page-layout";
import { termsSections, lastUpdated } from "@/data/legal-content";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "The terms governing use of the Alvora IT Solution website and services.",
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPageLayout title="Terms & Conditions" lastUpdated={lastUpdated} sections={termsSections} />;
}
