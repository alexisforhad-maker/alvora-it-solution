"use client";

import * as React from "react";
import { apiFetch } from "@/lib/admin-api";

interface LookupRecord {
  id: string;
  slug?: string;
  name: string;
}

export interface AdminLookups {
  serviceIdBySlug: Record<string, string>;
  industryIdBySlug: Record<string, string>;
  technologyIdByName: Record<string, string>;
  loading: boolean;
}

/**
 * Fetches Services/Industries/Technologies once and builds
 * slug-or-name → database-ID lookup maps, so admin forms that work in
 * terms of slugs/names (matching the public site's content shape) can
 * resolve real relation IDs before calling the Portfolio/Services API
 * routes, which expect `serviceIds`/`industryIds`/`technologyIds`.
 * Used by the Portfolio Manager (and available for Services Manager's
 * technology tagging as a follow-up).
 */
export function useAdminLookups(): AdminLookups {
  const [serviceIdBySlug, setServiceIdBySlug] = React.useState<Record<string, string>>({});
  const [industryIdBySlug, setIndustryIdBySlug] = React.useState<Record<string, string>>({});
  const [technologyIdByName, setTechnologyIdByName] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      apiFetch<LookupRecord[]>("/api/services").catch(() => []),
      apiFetch<LookupRecord[]>("/api/industries").catch(() => []),
      apiFetch<LookupRecord[]>("/api/technologies").catch(() => []),
    ])
      .then(([services, industries, technologies]) => {
        setServiceIdBySlug(Object.fromEntries(services.filter((s) => s.slug).map((s) => [s.slug!, s.id])));
        setIndustryIdBySlug(Object.fromEntries(industries.filter((i) => i.slug).map((i) => [i.slug!, i.id])));
        setTechnologyIdByName(Object.fromEntries(technologies.map((t) => [t.name, t.id])));
      })
      .finally(() => setLoading(false));
  }, []);

  return { serviceIdBySlug, industryIdBySlug, technologyIdByName, loading };
}
