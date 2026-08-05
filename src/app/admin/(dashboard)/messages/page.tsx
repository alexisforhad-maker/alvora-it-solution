"use client";

import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { fetchWithFallback, apiFetch } from "@/lib/admin-api";
import { contactStatusFromDb, contactStatusToDb } from "@/lib/admin-mappers";
import { contactMessages as fallbackMessages, type ContactMessageRecord, type ContactMessageStatus } from "@/data/admin-messages";

const statuses: ContactMessageStatus[] = ["New", "Replied", "Archived"];

/**
 * Contact Messages — now reads from GET /api/messages (Phase 3I),
 * falling back to the Phase 3G mock data if the API is unreachable or
 * the database hasn't been seeded/migrated yet. Status changes PATCH
 * the real record; UI updates only after the request succeeds.
 */
export default function ContactMessagesPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [messages, setMessages] = React.useState<ContactMessageRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<ContactMessageRecord | null>(null);
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);

  const canEdit = can(role, "messages", "edit");

  React.useEffect(() => {
    type DbMessage = { id: string; fullName: string; email: string; message: string; channel: string; status: string; submittedAt: string };

    fetchWithFallback<DbMessage[] | ContactMessageRecord[]>("/api/messages", fallbackMessages)
      .then((data) => {
        const normalized: ContactMessageRecord[] = data.map((m) => ({
          id: m.id,
          fullName: m.fullName,
          email: m.email,
          message: m.message,
          channel: (m.channel === "LIVE_CHAT" ? "Live Chat" : m.channel === "CONTACT_FORM" ? "Contact Form" : m.channel) as ContactMessageRecord["channel"],
          status: (contactStatusFromDb[m.status] ?? m.status) as ContactMessageStatus,
          submittedAt: m.submittedAt,
        }));
        setMessages(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: ContactMessageStatus) {
    const previous = messages;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));

    try {
      await apiFetch(`/api/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: contactStatusToDb[status] }),
      });
    } catch {
      setMessages(previous); // roll back on failure
      setErrorNotice("Couldn't save that status change. Please try again.");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Contact Messages"
        description="General contact form submissions and offline live-chat messages."
      />

      {errorNotice && (
        <Alert variant="error" title="Update failed" className="mb-4">
          {errorNotice}
        </Alert>
      )}

      {loading ? (
        <p className="text-body text-neutral-600">Loading messages…</p>
      ) : (
        <Table>
          <TableCaption>Contact messages</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id} className="cursor-pointer" onClick={() => setSelected(msg)}>
                <TableCell className="font-medium">{msg.fullName}</TableCell>
                <TableCell className="text-neutral-600">{msg.channel}</TableCell>
                <TableCell className="max-w-xs truncate text-neutral-600">{msg.message}</TableCell>
                <TableCell className="text-neutral-600">{formatDate(msg.submittedAt)}</TableCell>
                <TableCell><AdminStatusBadge status={msg.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selected && (
        <Modal
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          title={selected.fullName}
          description={selected.email}
        >
          <p className="text-body text-neutral-900">{selected.message}</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-caption text-neutral-600">Status</span>
            <Select
              value={selected.status}
              onValueChange={(v) => updateStatus(selected.id, v as ContactMessageStatus)}
              disabled={!canEdit}
            >
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild className="mt-5">
            <a href={`mailto:${selected.email}`}>Reply via Email</a>
          </Button>
        </Modal>
      )}
    </>
  );
}
