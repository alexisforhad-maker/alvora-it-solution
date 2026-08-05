import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { faqJsonLd } from "@/lib/seo";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQProps {
  items: FAQItem[];
  /** Used to give each accordion a unique id namespace when multiple FAQ blocks exist on one page. */
  idPrefix?: string;
}

/**
 * FAQ — accordion-based, used on the Contact/FAQ page and per-service
 * FAQ sections. Emits FAQPage schema alongside the visible content,
 * per Blueprint §5.5.
 */
export function FAQ({ items, idPrefix = "faq" }: FAQProps) {
  const jsonLd = faqJsonLd(items);

  return (
    <div className="rounded-card border border-border bg-background p-6 shadow-elevated sm:p-8">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Accordion type="single" collapsible className="divide-y-0 [&>*:last-child]:border-b-0">
        {items.map((item, index) => (
          <AccordionItem key={`${idPrefix}-${index}`} value={`${idPrefix}-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
