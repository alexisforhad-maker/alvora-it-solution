import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { industries } from "@/config/site";
import { industriesContent } from "@/data/industries-content";
import { IndustryDetailTemplate } from "@/components/sections/industries/industry-detail-template";

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = industriesContent[slug];
  if (!content) return buildMetadata({ title: "Industry Not Found", description: "", noIndex: true });

  return buildMetadata({
    title: content.name,
    description: content.relevanceStatement,
    path: `/industries/${slug}`,
  });
}

export default async function IndustryDetailPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const content = industriesContent[slug];

  if (!content) {
    notFound();
  }

  return <IndustryDetailTemplate content={content} />;
}
