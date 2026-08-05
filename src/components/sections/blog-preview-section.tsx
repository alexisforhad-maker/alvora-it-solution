import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { BlogCard } from "@/components/shared/blog-card";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog-content";
import { teamMembers } from "@/data/team";
import { categoryLabels } from "@/lib/content-helpers";

/**
 * Latest Blog Preview — Homepage §13 per Phase 2 spec. Reads from
 * src/data/blog-content.ts — the same source used by the Blog Hub and
 * Blog Detail pages — so article content only exists in one place.
 */
export function BlogPreviewSection() {
  const latest = blogPosts.slice(0, 3);

  return (
    <SectionWrapper tint>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <FadeUp>
          <p className="font-heading text-h6 text-secondary">Insights</p>
          <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
            What We&apos;re Learning, In Public
          </h2>
        </FadeUp>
        <Button asChild variant="ghost">
          <Link href="/blog">View All Articles →</Link>
        </Button>
      </div>

      <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-3">
        {latest.map((post) => {
          const author = teamMembers.find((m) => m.id === post.authorId);
          return (
            <BlogCard
              key={post.slug}
              title={post.title}
              href={`/blog/${post.slug}`}
              heroImage={post.heroImage}
              categoryLabel={categoryLabels[post.category]}
              publishedAt={post.publishedAt}
              readingTimeMinutes={post.readingTimeMinutes}
              authorName={author?.name ?? "Alvora Team"}
            />
          );
        })}
      </StaggerGrid>
    </SectionWrapper>
  );
}
