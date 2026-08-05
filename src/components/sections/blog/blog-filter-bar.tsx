"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { categoryLabels } from "@/lib/content-helpers";

const categories = Object.keys(categoryLabels);

/**
 * Blog category filter — same URL-search-param pattern as the
 * Portfolio filter bar (?category=slug), so filtered views stay
 * shareable and filtering happens server-side in the Blog Hub page.
 */
export function BlogFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "all";

  function updateParam(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="max-w-xs">
      <label htmlFor="filter-category" className="sr-only">
        Filter by category
      </label>
      <Select value={current} onValueChange={updateParam}>
        <SelectTrigger id="filter-category">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {categoryLabels[category]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
