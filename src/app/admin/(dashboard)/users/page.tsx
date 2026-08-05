"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { adminUsers as fallbackUsers, type AdminUser } from "@/data/admin-users";
import { can, permissionsForRole, roleLabels, roleDescriptions, type Role } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/utils";
import { fetchWithFallback, apiFetch } from "@/lib/admin-api";
import { roleFromDb, roleToDb } from "@/lib/admin-mappers";

const roles: Role[] = ["owner", "admin", "editor"];

interface DbUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Invited";
  createdAt: string;
}

/**
 * User Management — Phase 3I: reads from GET /api/users (falling
 * back to bundled mock users if unreachable), role changes PATCH
 * /api/users/[id], and Invite User really POSTs a new (passwordless,
 * "Invited") user row. No "Disabled" status or last-login tracking
 * exists in the schema yet — this UI reflects exactly what the API
 * returns rather than inventing fields the backend doesn't have.
 */
export default function UserManagementPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [savedNotice, setSavedNotice] = React.useState<string | null>(null);
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);

  const canInvite = can(role, "users", "create");
  const canEdit = can(role, "users", "edit");

  React.useEffect(() => {
    fetchWithFallback<DbUser[] | AdminUser[]>("/api/users", fallbackUsers)
      .then((data) => {
        const normalized: AdminUser[] = data.map((u) => {
          const isDbShape = typeof u.role === "string" && u.role === u.role.toUpperCase();
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: isDbShape ? (roleFromDb[u.role] ?? "editor") : (u.role as Role),
            status: u.status,
          };
        });
        setUsers(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  async function inviteUser(name: string, email: string, newRole: Role) {
    try {
      const created = await apiFetch<DbUser>("/api/users", {
        method: "POST",
        body: JSON.stringify({ name, email, role: roleToDb[newRole] }),
      });
      setUsers((prev) => [...prev, { id: created.id, name: created.name, email: created.email, role: newRole, status: "Invited" }]);
      setInviteOpen(false);
      setSavedNotice("Invitation sent — they can sign in once a password is set up for their account.");
      setTimeout(() => setSavedNotice(null), 4000);
    } catch (error) {
      setErrorNotice(error instanceof Error ? error.message : "Couldn't send that invitation.");
    }
  }

  async function updateRole(userId: string, newRole: Role) {
    const previous = users;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    try {
      await apiFetch(`/api/users/${userId}`, { method: "PATCH", body: JSON.stringify({ role: roleToDb[newRole] }) });
    } catch (error) {
      setUsers(previous);
      setErrorNotice(error instanceof Error ? error.message : "Couldn't update that user's role.");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="User Management"
        description="Manage who has access to this dashboard and what they can do."
        action={
          <Button disabled={!canInvite} onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-[16px]" aria-hidden="true" />
            Invite User
          </Button>
        }
      />

      {savedNotice && (
        <Alert variant="success" title="Invitation sent" className="mb-4">
          {savedNotice}
        </Alert>
      )}
      {errorNotice && (
        <Alert variant="error" title="Something went wrong" className="mb-4">
          {errorNotice}
        </Alert>
      )}

      {loading ? (
        <p className="text-body text-neutral-600">Loading users…</p>
      ) : (
        <Table>
          <TableCaption>Dashboard users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-neutral-600">{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    disabled={!canEdit || user.id === session?.user?.id}
                    onValueChange={(v) => updateRole(user.id, v as Role)}
                  >
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell><AdminStatusBadge status={user.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Role Permissions Reference</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {roles.map((r) => (
            <div key={r} className="rounded-input border border-border p-4">
              <Badge variant="primary">{roleLabels[r]}</Badge>
              <p className="mt-2 text-body text-neutral-600">{roleDescriptions[r]}</p>
              <ul className="mt-3 flex flex-col gap-1 text-caption text-neutral-600">
                {Object.entries(permissionsForRole(r))
                  .filter(([, actions]) => actions.length > 0)
                  .map(([module, actions]) => (
                    <li key={module}>
                      <span className="capitalize">{module}</span>: {actions.join(", ")}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Modal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title="Invite User"
        description="They'll be able to sign in once a password is set up for their account."
      >
        <InviteForm onInvite={inviteUser} onCancel={() => setInviteOpen(false)} />
      </Modal>
    </>
  );
}

function InviteForm({
  onInvite,
  onCancel,
}: {
  onInvite: (name: string, email: string, role: Role) => void;
  onCancel: () => void;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Role>("editor");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onInvite(name, email, role);
      }}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="invite-name">Name</Label>
        <Input id="invite-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="invite-email">Email</Label>
        <Input id="invite-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="invite-role">Role</Label>
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger id="invite-role"><SelectValue /></SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Send Invitation</Button>
      </div>
    </form>
  );
}
