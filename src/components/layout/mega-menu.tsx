"use client";

import * as React from "react";
import Link from "next/link";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/site";

export interface MegaMenuProps {
  items: NavItem[];
}

/**
 * Desktop mega menu — triggered from "Services"/"Industries" per Phase
 * 2 UI/UX spec §Navigation. Grid layout with label + link per item,
 * Surface background, generous padding.
 *
 * Phase 3I visual QA fix: the dropdown was previously positioned
 * `absolute left-0` relative to the whole nav Root and rendered through
 * a shared Viewport — on narrower desktop/laptop widths (~1024–1280px)
 * that let the fixed 560px panel overflow past the right edge of the
 * viewport, clipping content. It's now positioned relative to each
 * trigger's own list item (`left-1/2 -translate-x-1/2`, centered under
 * whichever menu is open) with `max-w-[90vw]` as a hard backstop, so it
 * can never extend past the viewport regardless of screen width or
 * where the trigger sits in the header.
 */
export function MegaMenu({ items }: MegaMenuProps) {
  return (
    <NavigationMenuPrimitive.Root className="hidden lg:block">
      <NavigationMenuPrimitive.List className="flex items-center gap-1">
        {items.map((item) => (
          <NavigationMenuPrimitive.Item key={item.href} className="relative">
            {item.children && item.children.length > 0 ? (
              <>
                <NavigationMenuPrimitive.Trigger
                  className={cn(
                    "group/trigger relative flex items-center gap-1 rounded-input px-3 py-2 text-body font-medium text-primary transition-colors",
                    "hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30",
                    "[&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:text-secondary"
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-[16px] text-secondary transition-transform duration-fast" />
                  <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-secondary transition-transform duration-base ease-premium group-hover/trigger:scale-x-100 group-data-[state=open]/trigger:scale-x-100" />
                </NavigationMenuPrimitive.Trigger>
                <NavigationMenuPrimitive.Content
                  className={cn(
                    "absolute left-1/2 top-full mt-3 w-[560px] max-w-[90vw] -translate-x-1/2",
                    "data-[motion=from-start]:animate-fade-in data-[motion=from-end]:animate-fade-in"
                  )}
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-card border border-border bg-background/95 p-6 shadow-elevated-hover backdrop-blur-sm">
                    {item.children.map((child) => (
                      <NavigationMenuPrimitive.Link key={child.href} asChild>
                        <Link
                          href={child.href}
                          className="group/item flex items-center justify-between rounded-input px-3 py-2.5 text-body text-neutral-900 transition-colors hover:bg-secondary/10 hover:text-secondary"
                        >
                          {child.label}
                          <ChevronDown className="size-[14px] -rotate-90 text-secondary opacity-0 transition-all duration-base -translate-x-1 group-hover/item:translate-x-0 group-hover/item:opacity-100" aria-hidden="true" />
                        </Link>
                      </NavigationMenuPrimitive.Link>
                    ))}
                  </div>
                </NavigationMenuPrimitive.Content>
              </>
            ) : (
              <NavigationMenuPrimitive.Link asChild>
                <Link
                  href={item.href}
                  className="group/link relative block rounded-input px-3 py-2 text-body font-medium text-primary transition-colors hover:text-secondary"
                >
                  {item.label}
                  <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-secondary transition-transform duration-base ease-premium group-hover/link:scale-x-100" />
                </Link>
              </NavigationMenuPrimitive.Link>
            )}
          </NavigationMenuPrimitive.Item>
        ))}
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  );
}
