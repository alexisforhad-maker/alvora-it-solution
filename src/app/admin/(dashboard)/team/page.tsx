"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Alert } from "@/components/ui/alert";
import { teamMembers as fallbackTeamMembers } from "@/data/team";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { fetchWithFallback, apiFetch } from "@/lib/admin-api";
import type { TeamMember } from "@/types";

const emptyMember: TeamMember = {
  id: "",
  name: "",
  role: "",
  photo: "/images/team/fc.jpg",
  shortBio: "",
  order: 99,
};

/**
 * Team Manager — Phase 3I: reads from GET /api/team (falling back to
 * bundled content if unreachable), and create/edit/delete/reorder now
 * call the real API routes built in Phase 3H. Photo upload uses the
 * real Media Library upload endpoint (POST /api/media) rather than a
 * placeholder — the returned Cloudinary URL becomes the member's photo.
 */
export default function TeamManagerPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [savedNotice, setSavedNotice] = React.useState(false);
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);

  const canCreate = can(role, "team", "create");
  const canEdit = can(role, "team", "edit");
  const canDelete = can(role, "team", "delete");

  React.useEffect(() => {
    fetchWithFallback<TeamMember[]>("/api/team", fallbackTeamMembers)
      .then((data) => setMembers([...data].sort((a, b) => a.order - b.order)))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(member: TeamMember) {
    try {
      if (member.id) {
        await apiFetch(`/api/team/${member.id}`, { method: "PATCH", body: JSON.stringify(member) });
        setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)).sort((a, b) => a.order - b.order));
      } else {
        const created = await apiFetch<TeamMember>("/api/team", { method: "POST", body: JSON.stringify(member) });
        setMembers((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      }
      setEditingMember(null);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch {
      setErrorNotice("Couldn't save that team member. Please try again.");
    }
  }

  async function handleDelete(id: string) {
    const previous = members;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    try {
      await apiFetch(`/api/team/${id}`, { method: "DELETE" });
    } catch {
      setMembers(previous);
      setErrorNotice("Couldn't delete that team member. Please try again.");
    }
  }

  async function moveMember(id: string, direction: -1 | 1) {
    const index = members.findIndex((m) => m.id === id);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    const reordered = [...members];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex]!, reordered[index]!];
    const withOrder = reordered.map((m, i) => ({ ...m, order: i + 1 }));

    const previous = members;
    setMembers(withOrder);

    try {
      const [a, b] = [reordered[index]!, reordered[targetIndex]!];
      await Promise.all([
        apiFetch(`/api/team/${a.id}`, { method: "PATCH", body: JSON.stringify({ order: withOrder.find((m) => m.id === a.id)!.order }) }),
        apiFetch(`/api/team/${b.id}`, { method: "PATCH", body: JSON.stringify({ order: withOrder.find((m) => m.id === b.id)!.order }) }),
      ]);
    } catch {
      setMembers(previous);
      setErrorNotice("Couldn't save the new order. Please try again.");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Team Manager"
        description="Manage the leadership profiles shown on the About page."
        action={
          <Button
            disabled={!canCreate}
            onClick={() => {
              setEditingMember({ ...emptyMember, order: members.length + 1 });
              setIsNew(true);
            }}
          >
            <Plus className="size-[16px]" aria-hidden="true" />
            Add Team Member
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
        <p className="text-body text-neutral-600">Loading team members…</p>
      ) : (
        <Table>
          <TableCaption>Leadership team, in display order</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="relative size-[40px] overflow-hidden rounded-full bg-neutral-100">
                    <Image src={member.photo} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-neutral-600">{member.role}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" aria-label="Move up" onClick={() => moveMember(member.id, -1)}>
                      <ArrowUp className="size-[16px]" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Move down" onClick={() => moveMember(member.id, 1)}>
                      <ArrowDown className="size-[16px]" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!canEdit}
                    onClick={() => {
                      setEditingMember(member);
                      setIsNew(false);
                    }}
                  >
                    <Pencil className="size-[16px]" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!canDelete}
                    onClick={() => handleDelete(member.id)}
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

      {editingMember && (
        <Modal
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          title={isNew ? "Add Team Member" : `Edit — ${editingMember.name}`}
          className="max-w-lg"
        >
          <TeamEditForm member={editingMember} onSave={handleSave} onCancel={() => setEditingMember(null)} />
        </Modal>
      )}
    </>
  );
}

function TeamEditForm({
  member,
  onSave,
  onCancel,
}: {
  member: TeamMember;
  onSave: (member: TeamMember) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState(member);
  const [uploading, setUploading] = React.useState(false);

  async function handlePhotoSelect(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("usedIn", `Team: ${form.name || "new member"}`);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const asset = await res.json();
      setForm((prev) => ({ ...prev, photo: asset.url }));
    } catch {
      // Upload failures are non-blocking here — the form keeps the previous photo URL.
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="team-name">Name</Label>
        <Input id="team-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="team-role">Role</Label>
        <Input id="team-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
      </div>
      <FileUpload
        id="team-photo"
        label="Photo"
        accept="image/*"
        helperText={uploading ? "Uploading…" : "Uploads to the Media Library via Cloudinary"}
        onFileSelect={handlePhotoSelect}
      />
      <div className="grid gap-2">
        <Label htmlFor="team-bio">Short Bio</Label>
        <Textarea id="team-bio" value={form.shortBio} onChange={(e) => setForm({ ...form, shortBio: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="team-linkedin">LinkedIn URL (optional)</Label>
        <Input
          id="team-linkedin"
          type="url"
          value={form.linkedIn ?? ""}
          onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={uploading}>Save</Button>
      </div>
    </form>
  );
}
