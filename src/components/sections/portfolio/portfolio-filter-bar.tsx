"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { services, industries } from "@/config/site";

/**
 * Portfolio filter bar — filters by Service and by Industry via URL
 * search params (?service=slug&industry=slug), so filtered views are
 * shareable/bookmarkable and the filtering itself happens server-side
 * in the Portfolio Hub page component. On mobile, per Phase 2 §7,
 * these collapse into a stacked pair rather than a modal sheet —
 * simpler to build accessibly and just as usable at two filters.
 */
export function PortfolioFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentService = searchParams.get("service") ?? "all";
  const currentIndustry = searchParams.get("industry") ?? "all";

  function updateParam(key: "service" | "industry", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row" role="group" aria-label="Filter portfolio">
      <div className="flex-1">
        <label htmlFor="filter-service" className="sr-only">
          Filter by service
        </label>
        <Select value={currentService} onValueChange={(v) => updateParam("service", v)}>
          <SelectTrigger id="filter-service">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            {/* pl-5 (32px) overrides SelectItem's own pl-8 — this
                project's spacing scale redefines key 8 as 96px (see
                tailwind.config.ts / the same gotcha ui/button.tsx's
                own comments warn about), so pl-8 there silently opens
                a ~72px dead gap between the checkmark and the label
                instead of the intended ~32px inset. pl-5 = 32px in
                this scale restores the standard Radix/shadcn spacing
                the component was clearly written against. Scoped to
                this call site only — ui/select.tsx has other
                consumers (Blog filter, several Admin pages) outside
                this task's Portfolio-only scope, and shares the same
                underlying bug; not touched here. */}
            <SelectItem value="all" className="pl-5">
              All Services
            </SelectItem>
            {services.map((service) => (
              <SelectItem key={service.slug} value={service.slug} className="pl-5">
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <label htmlFor="filter-industry" className="sr-only">
          Filter by industry
        </label>
        <Select value={currentIndustry} onValueChange={(v) => updateParam("industry", v)}>
          <SelectTrigger id="filter-industry">
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="pl-5">
              All Industries
            </SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry.slug} value={industry.slug} className="pl-5">
                {industry.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
