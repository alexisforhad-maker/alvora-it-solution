"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { servicesContent as fallbackServicesContent } from "@/data/services-content";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { fetchWithFallback, apiFetch } from "@/lib/admin-api";
import type { ServiceDetail } from "@/types";

interface DbService {
  slug: string;
  name: string;
  shortDescription: string;
  problem: string;
  solutionOverview: string;
  included: string[];
  benefits: string[];
  approach: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  technologies: { name: string }[];
}

/**
 * Services Manager — the fixed list of 10 services is non-deletable
 * (Phase 2 §Admin spec: "editable, not creatable/deletable" since the
 * service list is strategically fixed by the Master Blueprint).
 *
 * Phase 3I: reads from GET /api/services (falling back to bundled
 * content if unreachable) and PATCHes real edits to
 * /api/services/[slug]. The list endpoint doesn't return
 * relatedServiceSlugs/relatedIndustrySlugs (not needed for this
 * page's fields) or an `icon` value (not a DB column — icons are a
 * presentation-layer concern, see src/lib/icons.ts) — those are
 * merged in from the bundled content by slug so the ServiceDetail
 * shape stays complete for anything that reuses it.
 */
export default function ServicesManagerPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [services, setServices] = React.useState<Record<string, ServiceDetail>>({});
  const [loading, setLoading] = React.useState(true);
  const [editingSlug, setEditingSlug] = React.useState<string | null>(null);
  const [savedNotice, setSavedNotice] = React.useState(false);
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);

  const canEdit = can(role, "services", "edit");
  const editing = editingSlug ? services[editingSlug] : null;

  React.useEffect(() => {
    fetchWithFallback<DbService[] | ServiceDetail[]>(
      "/api/services",
      Object.values(fallbackServicesContent)
    ).then((data) => {
      const merged: Record<string, ServiceDetail> = {};
      for (const svc of data) {
        const fallback = fallbackServicesContent[svc.slug];
        merged[svc.slug] = {
          slug: svc.slug,
          name: svc.name,
          shortDescription: svc.shortDescription,
          icon: fallback?.icon ?? svc.slug,
          problem: svc.problem,
          solutionOverview: svc.solutionOverview,
          included: svc.included,
          benefits: svc.benefits,
          approach: svc.approach,
          faqs: svc.faqs,
          technologies: "technologies" in svc && svc.technologies.length > 0 && typeof svc.technologies[0] === "object"
            ? (svc.technologies as { name: string }[]).map((t) => t.name)
            : (svc.technologies as unknown as string[]),
          relatedServiceSlugs: fallback?.relatedServiceSlugs ?? [],
          relatedIndustrySlugs: fallback?.relatedIndustrySlugs ?? [],
        };
      }
      setServices(merged);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSave(updated: ServiceDetail) {
    try {
      await apiFetch(`/api/services/${updated.slug}`, {
        method: "PATCH",
        body: JSON.stringify({
          shortDescription: updated.shortDescription,
          problem: updated.problem,
          solutionOverview: updated.solutionOverview,
          included: updated.included,
          benefits: updated.benefits,
          approach: updated.approach,
          faqs: updated.faqs,
          // technologyIds intentionally omitted — the edit form deals in
          // technology names, and resolving names to Technology IDs needs
          // a GET /api/technologies lookup endpoint. Text fields save for
          // real today; technology tagging remains locally-editable only
          // until that lookup exists.
        }),
      });
      setServices((prev) => ({ ...prev, [updated.slug]: updated }));
      setEditingSlug(null);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch {
      setErrorNotice("Couldn't save that service. Please try again.");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Services Manager"
        description="Edit content for the 10 approved services. The service list itself is fixed by the Master Blueprint."
      />

      {savedNotice && (
        <Alert variant="success" title="Saved" className="mb-4">
          Changes have been saved.
        </Alert>
      )}
      {errorNotice && (
        <Alert variant="error" title="Something went wrong" className="mb-4">
          {errorNotice}
        </Alert>
      )}

      {loading ? (
        <p className="text-body text-neutral-600">Loading services…</p>
      ) : (
      <Table>
        <TableCaption>All services</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Short Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(services).map((service) => (
            <TableRow key={service.slug}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell className="text-neutral-600">{service.shortDescription}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canEdit}
                  onClick={() => setEditingSlug(service.slug)}
                >
                  <Pencil className="size-[16px]" aria-hidden="true" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}

      {editing && (
        <Modal
          open={!!editingSlug}
          onOpenChange={(open) => !open && setEditingSlug(null)}
          title={`Edit — ${editing.name}`}
          description="Update the content shown on this service's public page."
          className="max-w-2xl"
        >
          <ServiceEditForm content={editing} onSave={handleSave} onCancel={() => setEditingSlug(null)} />
        </Modal>
      )}
    </>
  );
}

function ServiceEditForm({
  content,
  onSave,
  onCancel,
}: {
  content: ServiceDetail;
  onSave: (updated: ServiceDetail) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState(content);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="grid max-h-[70vh] gap-4 overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="svc-short">Short Description</Label>
        <Textarea
          id="svc-short"
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="svc-problem">Business Problem</Label>
        <Textarea
          id="svc-problem"
          value={form.problem}
          onChange={(e) => setForm({ ...form, problem: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="svc-solution">Solution Overview</Label>
        <Textarea
          id="svc-solution"
          value={form.solutionOverview}
          onChange={(e) => setForm({ ...form, solutionOverview: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="svc-included">What&apos;s Included (one per line)</Label>
        <Textarea
          id="svc-included"
          rows={5}
          value={form.included.join("\n")}
          onChange={(e) => setForm({ ...form, included: e.target.value.split("\n").filter(Boolean) })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="svc-benefits">Benefits (one per line)</Label>
        <Textarea
          id="svc-benefits"
          rows={4}
          value={form.benefits.join("\n")}
          onChange={(e) => setForm({ ...form, benefits: e.target.value.split("\n").filter(Boolean) })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="svc-tech">Technologies (comma separated)</Label>
        <Input
          id="svc-tech"
          value={form.technologies.join(", ")}
          onChange={(e) => setForm({ ...form, technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
