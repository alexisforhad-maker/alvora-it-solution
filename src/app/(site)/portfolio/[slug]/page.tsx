import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { portfolioItems } from "@/data/portfolio-content";
import { PortfolioDetailTemplate } from "@/components/sections/portfolio/portfolio-detail-template";

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);
  if (!item) return buildMetadata({ title: "Project Not Found", description: "", noIndex: true });

  return buildMetadata({
    title: item.title,
    description: item.result,
    path: `/portfolio/${slug}`,
  });
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);

  if (!item) {
    notFound();
  }

  const relatedItems = portfolioItems.filter(
    (p) =>
      p.slug !== item.slug &&
      (p.serviceSlugs.some((s) => item.serviceSlugs.includes(s)) ||
        p.industrySlugs.some((i) => item.industrySlugs.includes(i)))
  );

  return <PortfolioDetailTemplate item={item} relatedItems={relatedItems} />;
}
