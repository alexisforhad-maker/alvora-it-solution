"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { primaryNav } from "@/config/site";

/**
 * Mobile navigation — slide-in drawer from the right, per Phase 2
 * §Responsive Behavior. Nested nav items (Services/Industries) use
 * the Accordion pattern rather than a second-level mega menu, since
 * that doesn't translate to touch/small screens.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-[24px]" />
        </Button>
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerTitle className="sr-only">Site Navigation</DrawerTitle>

        <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
          <Accordion type="single" collapsible>
            {primaryNav.map((item) =>
              item.children && item.children.length > 0 ? (
                <AccordionItem key={item.href} value={item.href}>
                  <AccordionTrigger className="text-h6">{item.label}</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-1 pl-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="rounded-input px-2 py-2 text-body text-neutral-600 transition-colors hover:bg-secondary/10 hover:text-secondary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                // Root-cause fix (Task 005): Next.js <Link> compiles to
                // an <a>, which is `display: inline` by default. As a
                // direct child of <Accordion> (Radix's unstyled Root —
                // a plain <div>, no flex/grid), three consecutive
                // inline links with no block-level box rendered their
                // text flowing together on one line with no line break
                // ("PortfolioAboutBlog"). `block` is the fix — makes
                // each its own full-width row, exactly like AccordionItem
                // (a <div>, block by default) already does for
                // Services/Industries. No structural change, no new
                // wrapper, nav data/order untouched (still primaryNav,
                // same source Desktop reads from).
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border py-4 font-heading text-h6 text-primary transition-colors hover:text-secondary"
                >
                  {item.label}
                </Link>
              )
            )}
          </Accordion>
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          <Button asChild size="lg">
            <Link href="/request-a-quote" onClick={() => setOpen(false)}>
              Book a Free Consultation
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/request-a-quote" onClick={() => setOpen(false)}>
              Request a Quote
            </Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
