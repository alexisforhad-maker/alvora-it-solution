"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { industriesContent as fallbackIndustriesContent } from "@/data/industries-content";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { fetchWithFallback, apiFetch } from "@/lib/admin-api";
import type { IndustryDetail } from "@/types";

interface DbIndustry {
  slug: string;
  name: string;
  relevanceStatement: string;
  challenges: { title: string; description: string }[];
}

/**
 * Industries Manager — same fixed-list, editable-only pattern as
 * Services Manager (the 9 industries are fixed by the Master
 * Blueprint).
 *
 * Phase 3I: reads from GET /api/industries (falling back to bundled
 * content if unreachable) and PATCHes real edits to
 * /api/industries/[slug]. relatedServiceSlugs and `icon` aren't DB
 * columns for this list endpoint, so they're merged in from bundled
 * content by slug (same pattern as the Services Manager).
 */
export default function IndustriesManagerPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [industries, setIndustries] = React.useState<Record<string, IndustryDetail>>({});
  const [loading, setLoading] = React.useState(true);
  const [editingSlug, setEditingSlug] = React.useState<string | null>(null);
  const [savedNotice, setSavedNotice] = React.useState(false);
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);

  const canEdit = can(role, "industries", "edit");
  const editing = editingSlug ? industries[editingSlug] : null;

  React.useEffect(() => {
    fetchWithFallback<DbIndustry[] | IndustryDetail[]>(
      "/api/industries",
      Object.values(fallbackIndustriesContent)
    ).then((data) => {
      const merged: Record<string, IndustryDetail> = {};
      for (const ind of data) {
        const fallback = fallbackIndustriesContent[ind.slug];
        merged[ind.slug] = {
          slug: ind.slug,
          name: ind.name,
          relevanceStatement: ind.relevanceStatement,
          icon: fallback?.icon ?? ind.slug,
          challenges: ind.challenges,
          relatedServiceSlugs: fallback?.relatedServiceSlugs ?? [],
        };
      }
      setIndustries(merged);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSave(updated: IndustryDetail) {
    try {
      await apiFetch(`/api/industries/${updated.slug}`, {
        method: "PATCH",
        body: JSON.stringify({
          relevanceStatement: updated.relevanceStatement,
          challenges: updated.challenges,
        }),
      });
      setIndustries((prev) => ({ ...prev, [updated.slug]: updated }));
      setEditingSlug(null);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch {
      setErrorNotice("Couldn't save that industry. Please try again.");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Industries Manager"
        description="Edit content for the 9 approved industries."
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
        <p className="text-body text-neutral-600">Loading industries…</p>
      ) : (
      <Table>
        <TableCaption>All industries</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Industry</TableHead>
            <TableHead>Relevance Statement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(industries).map((industry) => (
            <TableRow key={industry.slug}>
              <TableCell className="font-medium">{industry.name}</TableCell>
              <TableCell className="text-neutral-600">{industry.relevanceStatement}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canEdit}
                  onClick={() => setEditingSlug(industry.slug)}
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
          description="Update the content shown on this industry's public page."
          className="max-w-2xl"
        >
          <IndustryEditForm content={editing} onSave={handleSave} onCancel={() => setEditingSlug(null)} />
        </Modal>
      )}
    </>
  );
}

function IndustryEditForm({
  content,
  onSave,
  onCancel,
}: {
  content: IndustryDetail;
  onSave: (updated: IndustryDetail) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState(content);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="ind-relevance">Relevance Statement</Label>
        <Textarea
          id="ind-relevance"
          value={form.relevanceStatement}
          onChange={(e) => setForm({ ...form, relevanceStatement: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ind-challenges">
          Challenges (one per line, format: Title — Description)
        </Label>
        <Textarea
          id="ind-challenges"
          rows={5}
          value={form.challenges.map((c) => `${c.title} — ${c.description}`).join("\n")}
          onChange={(e) =>
            setForm({
              ...form,
              challenges: e.target.value
                .split("\n")
                .filter(Boolean)
                .map((line) => {
                  const [title, ...rest] = line.split(" — ");
                  return { title: title ?? "", description: rest.join(" — ") };
                }),
            })
          }
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
