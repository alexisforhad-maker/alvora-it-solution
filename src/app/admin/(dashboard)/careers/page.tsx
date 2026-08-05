"use client";

import * as React from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { openPositions as fallbackOpenPositions } from "@/data/open-positions";
import { careerSubmissions as fallbackSubmissions } from "@/data/admin-career-submissions";
import { formatDate, slugify } from "@/lib/utils";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { fetchWithFallback, apiFetch } from "@/lib/admin-api";
import { positionTypeFromDb, positionTypeToDb, applicationStatusFromDb } from "@/lib/admin-mappers";
import type { OpenPosition } from "@/data/open-positions";
import type { CareerSubmissionRecord } from "@/data/admin-career-submissions";

const emptyPosition: OpenPosition = { slug: "", title: "", type: "Full-time", location: "Remote", description: "" };

interface DbPosition {
  slug: string;
  title: string;
  type: string;
  location: string;
  description: string;
}

interface DbApplication {
  id: string;
  fullName: string;
  email: string;
  areaOfExpertise: string;
  resumeUrl: string | null;
  status: string;
  submittedAt: string;
}

/**
 * Careers Manager — Phase 3I: both tabs now read from the real API
 * (GET /api/careers/positions?all=true, GET /api/careers/applications),
 * falling back to bundled mock data if unreachable. Listing
 * create/delete and application status updates call the real
 * endpoints too.
 */
export default function CareersManagerPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [positions, setPositions] = React.useState<OpenPosition[]>([]);
  const [submissions, setSubmissions] = React.useState<CareerSubmissionRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingPosition, setEditingPosition] = React.useState<OpenPosition | null>(null);
  const [savedNotice, setSavedNotice] = React.useState(false);
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);

  const canCreate = can(role, "careers", "create");
  const canEdit = can(role, "careers", "edit");
  const canDelete = can(role, "careers", "delete");

  React.useEffect(() => {
    Promise.all([
      fetchWithFallback<DbPosition[] | OpenPosition[]>("/api/careers/positions?all=true", fallbackOpenPositions),
      fetchWithFallback<DbApplication[] | CareerSubmissionRecord[]>("/api/careers/applications", fallbackSubmissions),
    ])
      .then(([positionsData, submissionsData]) => {
        setPositions(
          positionsData.map((p) => ({
            slug: p.slug,
            title: p.title,
            type: (positionTypeFromDb[p.type] ?? p.type) as OpenPosition["type"],
            location: p.location,
            description: "description" in p ? p.description : "",
          }))
        );
        setSubmissions(
          submissionsData.map((s) => {
            const isDb = "id" in s && "resumeUrl" in s;
            if (isDb) {
              const db = s as DbApplication;
              return {
                id: db.id,
                fullName: db.fullName,
                email: db.email,
                areaOfExpertise: db.areaOfExpertise,
                resumeFileName: db.resumeUrl ? "Résumé on file" : undefined,
                submittedAt: db.submittedAt,
                status: (applicationStatusFromDb[db.status] ?? "New") as CareerSubmissionRecord["status"],
              };
            }
            return s as CareerSubmissionRecord;
          })
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(position: OpenPosition) {
    try {
      const exists = positions.some((p) => p.slug === position.slug);
      if (!exists) {
        await apiFetch("/api/careers/positions", {
          method: "POST",
          body: JSON.stringify({ ...position, type: positionTypeToDb[position.type], status: "OPEN" }),
        });
        setPositions((prev) => [position, ...prev]);
      }
      setEditingPosition(null);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch {
      setErrorNotice("Couldn't save that listing. Please try again.");
    }
  }

  async function handleDeletePosition(slug: string) {
    const previous = positions;
    setPositions((prev) => prev.filter((p) => p.slug !== slug));
    try {
      await apiFetch(`/api/careers/positions/${slug}`, { method: "DELETE" });
    } catch {
      setPositions(previous);
      setErrorNotice("Couldn't delete that listing. Please try again.");
    }
  }

  async function markReviewed(id: string) {
    const previous = submissions;
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "Reviewed" } : s)));
    try {
      await apiFetch(`/api/careers/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status: "REVIEWED" }) });
    } catch {
      setSubmissions(previous);
      setErrorNotice("Couldn't update that submission. Please try again.");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Careers Manager"
        description="Manage job listings and review interest submissions."
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
        <p className="text-body text-neutral-600">Loading…</p>
      ) : (
      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">Job Listings</TabsTrigger>
          <TabsTrigger value="submissions">Interest Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <div className="mb-4 flex justify-end">
            <Button disabled={!canCreate} onClick={() => setEditingPosition(emptyPosition)}>
              <Plus className="size-[16px]" aria-hidden="true" />
              New Listing
            </Button>
          </div>

          {positions.length > 0 ? (
            <Table>
              <TableCaption>Open positions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position.slug}>
                    <TableCell className="font-medium">{position.title}</TableCell>
                    <TableCell className="text-neutral-600">{position.type}</TableCell>
                    <TableCell className="text-neutral-600">{position.location}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!canDelete}
                        onClick={() => handleDeletePosition(position.slug)}
                        className="text-error hover:text-error"
                      >
                        <Trash2 className="size-[16px]" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="rounded-card border border-dashed border-border bg-surface p-8 text-center text-body text-neutral-600">
              No open positions — the public Careers page shows an appropriate empty state
              automatically.
            </div>
          )}
        </TabsContent>

        <TabsContent value="submissions">
          <Table>
            <TableCaption>Interest submissions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Résumé</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.fullName}</TableCell>
                  <TableCell className="text-neutral-600">{sub.areaOfExpertise}</TableCell>
                  <TableCell className="text-neutral-600">{sub.resumeFileName ?? "—"}</TableCell>
                  <TableCell className="text-neutral-600">{formatDate(sub.submittedAt)}</TableCell>
                  <TableCell><AdminStatusBadge status={sub.status} /></TableCell>
                  <TableCell className="text-right">
                    {sub.status === "New" && (
                      <Button variant="ghost" size="sm" disabled={!canEdit} onClick={() => markReviewed(sub.id)}>
                        <Check className="size-[16px]" aria-hidden="true" />
                        Mark Reviewed
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      )}

      {editingPosition && (
        <Modal
          open={!!editingPosition}
          onOpenChange={(open) => !open && setEditingPosition(null)}
          title="New Listing"
          className="max-w-lg"
        >
          <PositionEditForm position={editingPosition} onSave={handleSave} onCancel={() => setEditingPosition(null)} />
        </Modal>
      )}
    </>
  );
}

function PositionEditForm({
  position,
  onSave,
  onCancel,
}: {
  position: OpenPosition;
  onSave: (position: OpenPosition) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState(position);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...form, slug: form.slug || slugify(form.title) });
      }}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="pos-title">Title</Label>
        <Input id="pos-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pos-type">Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as OpenPosition["type"] })}>
            <SelectTrigger id="pos-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["Full-time", "Part-time", "Contract", "Internship"] as const).map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pos-location">Location</Label>
          <Input id="pos-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pos-description">Description</Label>
        <Textarea id="pos-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Listing</Button>
      </div>
    </form>
  );
}
