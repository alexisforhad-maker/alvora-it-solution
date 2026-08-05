import Link from "next/link";
import Image from "next/image";
import { CTABanner } from "@/components/shared/cta-banner";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { BlogCard } from "@/components/shared/blog-card";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { formatDate } from "@/lib/utils";
import { categoryLabels } from "@/lib/content-helpers";
import { teamMembers } from "@/data/team";
import { blogPosts } from "@/data/blog-content";
import { servicesContent } from "@/data/services-content";
import type { BlogPost } from "@/types";

export interface BlogDetailTemplateProps {
  post: BlogPost;
}

/**
 * Blog Detail Template — the single component behind every Blog
 * Detail page (Phase 2 §13 / Phase 3F requirements). Renders Hero →
 * Article Body → Author Bio → Related Articles → contextual Related
 * Service CTA. Article body is rendered from a paragraph array
 * (BlogPost.content) rather than raw HTML, avoiding injection risk.
 */
export function BlogDetailTemplate({ post }: BlogDetailTemplateProps) {
  const author = teamMembers.find((m) => m.id === post.authorId);
  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const relatedService = post.relatedServiceSlug ? servicesContent[post.relatedServiceSlug] : undefined;

  return (
    <>
      <div className="container">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: post.title, href: `/blog/${post.slug}` },
          ]}
        />
      </div>

      <div className="container">
        <FadeUp className="mx-auto max-w-3xl">
          <span className="rounded-pill bg-secondary/10 px-3 py-1 text-label uppercase text-secondary">
            {categoryLabels[post.category]}
          </span>
          <h1 className="mt-4 text-h2-mobile font-heading text-primary md:text-h1">{post.title}</h1>
          <p className="mt-4 text-caption text-neutral-600">
            {author?.name ?? "Alvora Team"} &middot; {formatDate(post.publishedAt)} &middot;{" "}
            {post.readingTimeMinutes} min read
          </p>
        </FadeUp>
      </div>

      <SectionWrapper>
        <div className="relative mx-auto aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-card border border-border bg-neutral-100 shadow-elevated">
          <Image src={post.heroImage} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <article className="prose-alvora mx-auto">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </SectionWrapper>

      {author && (
        <SectionWrapper tint>
          <div className="hover-lift mx-auto flex max-w-3xl items-center gap-4 rounded-card border border-border bg-background p-5 hover:border-secondary/30 hover:shadow-elevated-hover">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-h6 text-primary">
              {author.name.charAt(0)}
            </span>
            <div>
              <p className="font-heading text-h6 text-primary">{author.name}</p>
              <p className="text-body text-neutral-600">{author.role}</p>
            </div>
            <Link href="/about#leadership" className="ml-auto shrink-0 text-button text-secondary transition-colors hover:text-secondary-light">
              About the Team →
            </Link>
          </div>
        </SectionWrapper>
      )}

      {relatedService && (
        <SectionWrapper>
          <FadeUp className="hover-lift mx-auto max-w-3xl rounded-card border border-border bg-surface p-6 hover:border-secondary/30 hover:shadow-elevated-hover">
            <p className="text-body text-neutral-600">Related to this article</p>
            <h2 className="mt-1 font-heading text-h5 text-primary">{relatedService.name}</h2>
            <p className="mt-2 text-body text-neutral-600">{relatedService.shortDescription}</p>
            <Link
              href={`/services/${relatedService.slug}`}
              className="mt-4 inline-block text-button text-secondary"
            >
              Learn more →
            </Link>
          </FadeUp>
        </SectionWrapper>
      )}

      {relatedPosts.length > 0 && (
        <SectionWrapper tint>
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">Related Articles</h2>
          </FadeUp>
          <StaggerGrid className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <BlogCard
                key={related.slug}
                title={related.title}
                href={`/blog/${related.slug}`}
                heroImage={related.heroImage}
                categoryLabel={categoryLabels[related.category]}
                publishedAt={related.publishedAt}
                readingTimeMinutes={related.readingTimeMinutes}
                authorName={teamMembers.find((m) => m.id === related.authorId)?.name ?? "Alvora Team"}
              />
            ))}
          </StaggerGrid>
        </SectionWrapper>
      )}

      <CTABanner
        title="Have a Project in Mind?"
        description="Tell us about your project — we'll respond within one business day."
        actions={
          <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
            <Link href="/request-a-quote">Book a Free Consultation</Link>
          </Button>
        }
      />
    </>
  );
}
