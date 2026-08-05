import type { Metadata } from "next";
import { Suspense } from "react";
import { Newspaper } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { BlogCard } from "@/components/shared/blog-card";
import { Newsletter } from "@/components/shared/newsletter";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { blogPosts } from "@/data/blog-content";
import { teamMembers } from "@/data/team";
import { categoryLabels } from "@/lib/content-helpers";
import { BlogFilterBar } from "@/components/sections/blog/blog-filter-bar";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Insights on custom software, automation, and choosing a technology partner — from the Alvora IT Solution team.",
  path: "/blog",
});

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

function authorName(authorId: string): string {
  return teamMembers.find((m) => m.id === authorId)?.name ?? "Alvora Team";
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const filtered = category ? blogPosts.filter((p) => p.category === category) : blogPosts;
  const [featured, ...rest] = filtered;

  return (
    <>
      <Hero eyebrow="Insights" title="What We're Learning, In Public" description="The thinking behind our work — technical, honest, and useful whether or not you ever hire us." />

      <SectionWrapper>
        <Suspense fallback={<div className="h-11" aria-hidden="true" />}>
          <BlogFilterBar />
        </Suspense>

        {featured ? (
          <>
            <div className="mt-8">
              <BlogCard
                title={featured.title}
                href={`/blog/${featured.slug}`}
                heroImage={featured.heroImage}
                categoryLabel={categoryLabels[featured.category]}
                publishedAt={featured.publishedAt}
                readingTimeMinutes={featured.readingTimeMinutes}
                authorName={authorName(featured.authorId)}
                featured
              />
            </div>

            {rest.length > 0 && (
              <StaggerGrid className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {rest.map((post) => (
                  <BlogCard
                    key={post.slug}
                    title={post.title}
                    href={`/blog/${post.slug}`}
                    heroImage={post.heroImage}
                    categoryLabel={categoryLabels[post.category]}
                    publishedAt={post.publishedAt}
                    readingTimeMinutes={post.readingTimeMinutes}
                    authorName={authorName(post.authorId)}
                  />
                ))}
              </StaggerGrid>
            )}
          </>
        ) : (
          <div className="mt-10 rounded-card border border-dashed border-border bg-surface p-10 text-center">
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Newspaper className="size-[24px]" aria-hidden="true" />
            </span>
            <p className="text-body-lg text-neutral-600">
              No articles in this category yet — check back soon.
            </p>
          </div>
        )}
      </SectionWrapper>

      <SectionWrapper tint>
        <div className="mx-auto max-w-xl">
          <Newsletter />
        </div>
      </SectionWrapper>
    </>
  );
}
