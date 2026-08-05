import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { services } from "@/config/site";
import { servicesContent } from "@/data/services-content";
import { ServiceDetailTemplate } from "@/components/sections/services/service-detail-template";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Statically generates all 10 approved service routes at build time —
 * no dynamic/unknown slugs are served, keeping the route set exactly
 * matched to the Blueprint's fixed service list.
 */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = servicesContent[slug];
  if (!content) return buildMetadata({ title: "Service Not Found", description: "", noIndex: true });

  return buildMetadata({
    title: content.name,
    description: content.shortDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const content = servicesContent[slug];

  if (!content) {
    notFound();
  }

  return <ServiceDetailTemplate content={content} />;
}
