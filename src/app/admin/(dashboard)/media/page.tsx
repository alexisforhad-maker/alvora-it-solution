"use client";

import * as React from "react";
import Image from "next/image";
import { Search, Trash2, UploadCloud } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { mediaItems } from "@/data/admin-media";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";

export default function MediaLibraryPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const canCreate = can(role, "media", "create");
  const canDelete = can(role, "media", "delete");

  const filtered = mediaItems.filter((item) =>
    item.filename.toLowerCase().includes(query.toLowerCase())
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Media Library"
        description="All images used across the public site."
        action={
          <Button disabled={!canCreate}>
            <UploadCloud className="size-[16px]" aria-hidden="true" />
            Upload
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-[16px] -translate-y-1/2 text-neutral-600" aria-hidden="true" />
          <Input
            placeholder="Search by filename"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Search media by filename"
          />
        </div>
        {selected.size > 0 && (
          <Button variant="destructive" size="sm" disabled={!canDelete}>
            <Trash2 className="size-[16px]" aria-hidden="true" />
            Delete {selected.size} selected
          </Button>
        )}
      </div>

      {!canCreate && (
        <Alert variant="info" className="mb-4">
          Uploading requires an Admin or Owner role. Editors can view the library but not add
          new files.
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {filtered.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-card border border-border bg-surface">
            <label className="absolute left-2 top-2 z-10">
              <Checkbox
                checked={selected.has(item.id)}
                onCheckedChange={() => toggle(item.id)}
                aria-label={`Select ${item.filename}`}
              />
            </label>
            <div className="relative aspect-square w-full bg-neutral-100">
              <Image src={item.src} alt="" fill sizes="(min-width: 1280px) 16vw, (min-width: 640px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="p-2">
              <p className="truncate text-caption font-medium text-neutral-900">{item.filename}</p>
              <p className="truncate text-caption text-neutral-600">{item.usedIn}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-body text-neutral-600">
          No media matches &ldquo;{query}&rdquo;.
        </p>
      )}
    </>
  );
}
