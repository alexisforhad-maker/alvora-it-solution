import Image from "next/image";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface TestimonialCardProps {
  quote: string;
  /**
   * Optional — omit for a role-only attribution (e.g. generic demo
   * testimonials with no named individual). When omitted, `role` is
   * rendered as the primary attribution line instead of a caption
   * under a name, and the avatar shows a generic icon instead of an
   * initial.
   */
  author?: string;
  role: string;
  company?: string;
  avatarSrc?: string;
}

/**
 * Testimonial Card — placeholder-ready component per Master Blueprint
 * §4.1 (Portfolio/case studies currently have limited formal
 * testimonials). Renders cleanly with or without an avatar, and with
 * or without a named author, so it can be populated incrementally as
 * real quotes arrive.
 */
export function TestimonialCard({ quote, author, role, company, avatarSrc }: TestimonialCardProps) {
  return (
    <Card className="relative flex h-full flex-col gap-4 overflow-hidden p-5 hover:shadow-elevated-hover">
      <Quote className="absolute -right-2 -top-2 size-20 text-primary/[0.05]" aria-hidden="true" />
      <span className="relative flex size-11 items-center justify-center rounded-full bg-secondary/10 text-secondary">
        <Quote className="size-[20px]" aria-hidden="true" />
      </span>
      <p className="relative text-body-lg text-neutral-900">&ldquo;{quote}&rdquo;</p>
      <div className="relative mt-auto flex items-center gap-3 border-t border-border pt-4">
        {avatarSrc ? (
          <Image src={avatarSrc} alt="" width={40} height={40} className="size-[40px] rounded-full object-cover" />
        ) : (
          <span className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-h6 text-primary">
            {author ? author.charAt(0) : <Quote className="size-[16px]" aria-hidden="true" />}
          </span>
        )}
        <div>
          <p className="text-body font-medium text-neutral-900">{author ?? role}</p>
          {author && <p className="text-caption text-neutral-600">{company ? `${role}, ${company}` : role}</p>}
          {!author && company && <p className="text-caption text-neutral-600">{company}</p>}
        </div>
      </div>
    </Card>
  );
}
