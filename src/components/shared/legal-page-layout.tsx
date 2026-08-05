import type { ReactNode } from "react";
import { formatDate } from "@/lib/utils";

export type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  /** Optional extra content rendered after the sections (e.g. a cookie-preferences control). */
  children?: ReactNode;
}

/**
 * Legal Page Layout — the single component behind Privacy Policy,
 * Terms & Conditions, and Cookie Policy (Phase 2 §16/§17/§18). Minimal
 * hero, anchor-linked table of contents, sequential sections. No
 * animation on legal pages, per the spec ("legal pages should feel
 * stable and static, not animated").
 */
export function LegalPageLayout({ title, lastUpdated, sections, children }: LegalPageLayoutProps) {
  return (
    <div className="container py-8 md:py-9">
      <div className="max-w-3xl">
        <h1 className="font-heading text-h2-mobile text-primary md:text-h1">{title}</h1>
        <p className="mt-2 text-caption text-neutral-600">Last updated {formatDate(lastUpdated)}</p>
      </div>

      <div className="mt-8 grid gap-[40px] lg:grid-cols-4">
        <nav aria-label="Table of contents" className="lg:col-span-1">
          <p className="text-label uppercase text-neutral-600">On This Page</p>
          <ul className="mt-3 flex flex-col gap-2 border-l border-border pl-4">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-body text-neutral-600 transition-colors duration-fast hover:text-secondary"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <div className="prose-alvora">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
