"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { portfolioItems as fallbackPortfolioItems } from "@/data/portfolio-content";
import { services, industries } from "@/config/site";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { slugify } from "@/lib/utils";
import { fetchWithFallback, apiFetch } from "@/lib/admin-api";
import { useAdminLookups } from "@/hooks/use-admin-lookups";
import type { PortfolioItem } from "@/types";

const emptyItem: PortfolioItem = {
  slug: "",
  title: "",
  serviceSlugs: [],
  industrySlugs: [],
  thumbnail: "/images/portfolio/ecommerce-placeholder.jpg",
  challenge: "",
  solution: "",
  technologies: [],
  result: "",
};

interface DbPortfolioItem {
  slug: string;
  title: string;
  thumbnail: string;
  resultStat?: string | null;
  challenge: string;
  solution: string;
  result: string;
  services: { slug: string }[];
  industries: { slug: string }[];
  technologies: { name: string }[];
}

/**
 * Portfolio Manager — full create/edit/delete against the real API
 * (Phase 3I). Uses `useAdminLookups()` to resolve the slugs/names the
 * form works with into the database IDs the API expects.
 */
export default function PortfolioManagerPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";
  const lookups = useAdminLookups();

  const [items, setItems] = React.useState<PortfolioItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingItem, setEditingItem] = React.useState<PortfolioItem | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [savedNotice, setSavedNotice] = React.useState(false);
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);

  const canCreate = can(role, "portfolio", "create");
  const canEdit = can(role, "portfolio", "edit");
  const canDelete = can(role, "portfolio", "delete");

  React.useEffect(() => {
    fetchWithFallback<DbPortfolioItem[] | PortfolioItem[]>("/api/portfolio", fallbackPortfolioItems)
      .then((data) => {
        const normalized: PortfolioItem[] = data.map((raw) => {
          const isDbShape = "services" in raw && Array.isArray(raw.services) && (raw.services[0] === undefined || "slug" in raw.services[0]!);
          if (isDbShape) {
            const db = raw as DbPortfolioItem;
            return {
              slug: db.slug,
              title: db.title,
              thumbnail: db.thumbnail,
              resultStat: db.resultStat ?? undefined,
              challenge: db.challenge,
              solution: db.solution,
              result: db.result,
              serviceSlugs: db.services.map((s) => s.slug),
              industrySlugs: db.industries.map((i) => i.slug),
              technologies: db.technologies.map((t) => t.name),
            };
          }
          return raw as PortfolioItem;
        });
        setItems(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(item: PortfolioItem) {
    const serviceIds = item.serviceSlugs.map((s) => lookups.serviceIdBySlug[s]).filter((id): id is string => !!id);
    const industryIds = item.industrySlugs.map((s) => lookups.industryIdBySlug[s]).filter((id): id is string => !!id);
    const technologyIds = item.technologies.map((t) => lookups.technologyIdByName[t]).filter((id): id is string => !!id);

    const payload = {
      slug: item.slug,
      title: item.title,
      thumbnail: item.thumbnail,
      resultStat: item.resultStat,
      challenge: item.challenge,
      solution: item.solution,
      result: item.result,
      serviceIds,
      industryIds,
      technologyIds,
    };

    try {
      const exists = items.some((p) => p.slug === item.slug);
      if (exists) {
        await apiFetch(`/api/portfolio/${item.slug}`, { method: "PATCH", body: JSON.stringify(payload) });
        setItems((prev) => prev.map((p) => (p.slug === item.slug ? item : p)));
      } else {
        await apiFetch("/api/portfolio", { method: "POST", body: JSON.stringify(payload) });
        setItems((prev) => [item, ...prev]);
      }
      setEditingItem(null);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch {
      setErrorNotice("Couldn't save that case study. Please try again — some referenced services/industries/technologies may not exist in the database yet.");
    }
  }

  async function handleDelete(slug: string) {
    const previous = items;
    setItems((prev) => prev.filter((p) => p.slug !== slug));
    try {
      await apiFetch(`/api/portfolio/${slug}`, { method: "DELETE" });
    } catch {
      setItems(previous);
      setErrorNotice("Couldn't delete that case study. Please try again.");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Portfolio Manager"
        description="Add or edit case studies shown on the public Portfolio pages."
        action={
          <Button
            disabled={!canCreate}
            onClick={() => {
              setEditingItem(emptyItem);
              setIsNew(true);
            }}
          >
            <Plus className="size-[16px]" aria-hidden="true" />
            New Case Study
          </Button>
        }
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
        <p className="text-body text-neutral-600">Loading portfolio items…</p>
      ) : (
        <Table>
          <TableCaption>All portfolio items</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Services</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.slug}>
                <TableCell>
                  <div className="relative size-12 overflow-hidden rounded-input bg-neutral-100">
                    <Image src={item.thumbnail} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-neutral-600">{item.serviceSlugs.length} service(s)</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!canEdit}
                    onClick={() => {
                      setEditingItem(item);
                      setIsNew(false);
                    }}
                  >
                    <Pencil className="size-[16px]" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!canDelete}
                    onClick={() => handleDelete(item.slug)}
                    className="text-error hover:text-error"
                  >
                    <Trash2 className="size-[16px]" aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {editingItem && (
        <Modal
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          title={isNew ? "New Case Study" : `Edit — ${editingItem.title}`}
          className="max-w-2xl"
        >
          <PortfolioEditForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => setEditingItem(null)}
          />
        </Modal>
      )}
    </>
  );
}

function PortfolioEditForm({
  item,
  onSave,
  onCancel,
}: {
  item: PortfolioItem;
  onSave: (item: PortfolioItem) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState(item);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...form, slug: form.slug || slugify(form.title) });
      }}
      className="grid max-h-[70vh] gap-4 overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="pf-title">Title</Label>
        <Input
          id="pf-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-label text-neutral-900">Related Services</legend>
        <div className="grid grid-cols-2 gap-2">
          {services.map((s) => (
            <label key={s.slug} className="flex items-center gap-2 text-caption text-neutral-900">
              <Checkbox
                checked={form.serviceSlugs.includes(s.slug)}
                onCheckedChange={(checked) =>
                  setForm({
                    ...form,
                    serviceSlugs: checked
                      ? [...form.serviceSlugs, s.slug]
                      : form.serviceSlugs.filter((slug) => slug !== s.slug),
                  })
                }
              />
              {s.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-label text-neutral-900">Related Industries</legend>
        <div className="grid grid-cols-2 gap-2">
          {industries.map((i) => (
            <label key={i.slug} className="flex items-center gap-2 text-caption text-neutral-900">
              <Checkbox
                checked={form.industrySlugs.includes(i.slug)}
                onCheckedChange={(checked) =>
                  setForm({
                    ...form,
                    industrySlugs: checked
                      ? [...form.industrySlugs, i.slug]
                      : form.industrySlugs.filter((slug) => slug !== i.slug),
                  })
                }
              />
              {i.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <Label htmlFor="pf-challenge">Challenge</Label>
        <Textarea id="pf-challenge" value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pf-solution">Solution</Label>
        <Textarea id="pf-solution" value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pf-result">Result</Label>
        <Textarea id="pf-result" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pf-tech">Technologies (comma separated)</Label>
        <Input
          id="pf-tech"
          value={form.technologies.join(", ")}
          onChange={(e) => setForm({ ...form, technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Case Study</Button>
      </div>
    </form>
  );
}
