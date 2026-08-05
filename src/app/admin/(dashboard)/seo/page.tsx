"use client";

import * as React from "react";
import { Pencil, RefreshCw } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { getSeoPageInventory, type SeoPageEntry } from "@/data/admin-seo-pages";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { siteConfig } from "@/config/site";

export default function SeoManagerPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [pages, setPages] = React.useState<SeoPageEntry[]>(getSeoPageInventory);
  const [editing, setEditing] = React.useState<SeoPageEntry | null>(null);
  const [savedNotice, setSavedNotice] = React.useState(false);

  const canEdit = can(role, "seo", "edit");

  function handleSave(entry: SeoPageEntry) {
    setPages((prev) => prev.map((p) => (p.path === entry.path ? entry : p)));
    setEditing(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  return (
    <>
      <AdminPageHeader
        title="SEO Manager"
        description="Metadata for every page on the site, plus sitewide SEO settings."
      />

      {savedNotice && (
        <Alert variant="success" title="Saved" className="mb-4">
          Overrides are held locally until the backend is connected in a later phase.
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sitewide Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-label uppercase text-neutral-600">Default OG Image</p>
            <p className="mt-1 text-body text-neutral-900">/images/og-default.jpg</p>
          </div>
          <div>
            <p className="text-label uppercase text-neutral-600">Sitemap</p>
            <a href="/sitemap.xml" className="mt-1 block text-body text-secondary underline underline-offset-2">
              {siteConfig.url}/sitemap.xml
            </a>
          </div>
          <div>
            <p className="text-label uppercase text-neutral-600">Robots.txt</p>
            <a href="/robots.txt" className="mt-1 block text-body text-secondary underline underline-offset-2">
              {siteConfig.url}/robots.txt
            </a>
          </div>
          <div className="flex items-end">
            <Button variant="secondary" disabled={!canEdit}>
              <RefreshCw className="size-[16px]" aria-hidden="true" />
              Regenerate Sitemap
            </Button>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableCaption>All pages</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Page</TableHead>
            <TableHead>Meta Title</TableHead>
            <TableHead>Meta Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.path}>
              <TableCell className="font-medium">
                {page.pageName}
                <p className="text-caption text-neutral-600">{page.path}</p>
              </TableCell>
              <TableCell className="max-w-xs truncate text-neutral-600">{page.metaTitle}</TableCell>
              <TableCell className="max-w-xs truncate text-neutral-600">{page.metaDescription}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" disabled={!canEdit} onClick={() => setEditing(page)}>
                  <Pencil className="size-[16px]" aria-hidden="true" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing && (
        <Modal
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          title={`Edit SEO — ${editing.pageName}`}
          className="max-w-xl"
        >
          <SeoEditForm entry={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </>
  );
}

function SeoEditForm({
  entry,
  onSave,
  onCancel,
}: {
  entry: SeoPageEntry;
  onSave: (entry: SeoPageEntry) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState(entry);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="seo-title">Meta Title</Label>
        <Input id="seo-title" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} maxLength={60} />
        <p className="text-caption text-neutral-600">{form.metaTitle.length}/60 characters</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="seo-description">Meta Description</Label>
        <Textarea
          id="seo-description"
          value={form.metaDescription}
          onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
          maxLength={160}
        />
        <p className="text-caption text-neutral-600">{form.metaDescription.length}/160 characters</p>
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
