"use client";

import * as React from "react";
import { LayoutList, Kanban } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { serviceNamesForSlugs } from "@/lib/content-helpers";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { Alert } from "@/components/ui/alert";
import { fetchWithFallback, apiFetch } from "@/lib/admin-api";
import { quoteStatusFromDb, quoteStatusToDb } from "@/lib/admin-mappers";
import {
  quoteRequests as fallbackQuotes,
  type QuoteRequestRecord,
  type QuotePipelineStatus,
} from "@/data/admin-quote-requests";

const statuses: QuotePipelineStatus[] = ["New", "Contacted", "Proposal Sent", "Won", "Lost"];

interface DbQuoteRequest {
  id: string;
  fullName: string;
  company?: string | null;
  email: string;
  projectDescription: string;
  timelineExpectation?: string | null;
  budgetRange?: string | null;
  status: string;
  submittedAt: string;
  services: { service: { slug: string } }[];
}

/**
 * Quote Requests — the highest-value lead type. Offers both a Table
 * view (default, fully accessible) and a Board view (grouped by
 * pipeline status). The Board view intentionally has no drag-and-drop
 * — status changes happen through the detail modal's Select control
 * in both views, per Phase 2's accessibility note that a Kanban-only,
 * drag-driven interface is not reliably keyboard/screen-reader
 * accessible.
 *
 * Phase 3I: reads from GET /api/quote-requests (falling back to
 * bundled mock data if unreachable) and PATCHes real status changes.
 */
export default function QuoteRequestsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [quotes, setQuotes] = React.useState<QuoteRequestRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<QuoteRequestRecord | null>(null);
  const [view, setView] = React.useState<"table" | "board">("table");
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);

  const canEdit = can(role, "quotes", "edit");

  React.useEffect(() => {
    fetchWithFallback<DbQuoteRequest[] | QuoteRequestRecord[]>("/api/quote-requests", fallbackQuotes)
      .then((data) => {
        const normalized: QuoteRequestRecord[] = data.map((q) => {
          const isDbShape = "services" in q && Array.isArray((q as DbQuoteRequest).services) && (q as DbQuoteRequest).services[0]?.service !== undefined;
          if (isDbShape) {
            const db = q as DbQuoteRequest;
            return {
              id: db.id,
              fullName: db.fullName,
              company: db.company ?? undefined,
              email: db.email,
              serviceSlugs: db.services.map((s) => s.service.slug),
              projectDescription: db.projectDescription,
              timelineExpectation: db.timelineExpectation ?? undefined,
              budgetRange: db.budgetRange ?? undefined,
              submittedAt: db.submittedAt,
              status: (quoteStatusFromDb[db.status] ?? "New") as QuotePipelineStatus,
            };
          }
          return q as QuoteRequestRecord;
        });
        setQuotes(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: QuotePipelineStatus) {
    const previous = quotes;
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));

    try {
      await apiFetch(`/api/quote-requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: quoteStatusToDb[status] }),
      });
    } catch {
      setQuotes(previous);
      setErrorNotice("Couldn't save that status change. Please try again.");
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Quote Requests"
        description="Structured project inquiries submitted through Request a Quote."
        action={
          <div className="flex gap-2">
            <Button variant={view === "table" ? "primary" : "secondary"} size="sm" onClick={() => setView("table")}>
              <LayoutList className="size-[16px]" aria-hidden="true" />
              Table
            </Button>
            <Button variant={view === "board" ? "primary" : "secondary"} size="sm" onClick={() => setView("board")}>
              <Kanban className="size-[16px]" aria-hidden="true" />
              Board
            </Button>
          </div>
        }
      />

      {errorNotice && (
        <Alert variant="error" title="Update failed" className="mb-4">
          {errorNotice}
        </Alert>
      )}

      {loading ? (
        <p className="text-body text-neutral-600">Loading quote requests…</p>
      ) : view === "table" ? (
        <Table>
          <TableCaption>Quote requests</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Company / Name</TableHead>
              <TableHead>Service Requested</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id} className="cursor-pointer" onClick={() => setSelected(quote)}>
                <TableCell className="font-medium">{quote.company ?? quote.fullName}</TableCell>
                <TableCell className="text-neutral-600">{serviceNamesForSlugs(quote.serviceSlugs).join(", ")}</TableCell>
                <TableCell className="text-neutral-600">{formatDate(quote.submittedAt)}</TableCell>
                <TableCell><AdminStatusBadge status={quote.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-3 lg:grid-cols-5">
          {statuses.map((status) => (
            <div key={status} className="min-w-[220px]">
              <p className="mb-3 text-label uppercase text-neutral-600">{status}</p>
              <div className="flex flex-col gap-3">
                {quotes
                  .filter((q) => q.status === status)
                  .map((quote) => (
                    <Card
                      key={quote.id}
                      className="cursor-pointer p-4"
                      onClick={() => setSelected(quote)}
                    >
                      <p className="text-body font-medium text-neutral-900">
                        {quote.company ?? quote.fullName}
                      </p>
                      <p className="mt-1 text-caption text-neutral-600">{formatDate(quote.submittedAt)}</p>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <Modal
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          title={selected.company ?? selected.fullName}
          description={selected.email}
        >
          <div className="grid gap-3">
            <DetailRow label="Contact" value={selected.fullName} />
            <DetailRow label="Services" value={serviceNamesForSlugs(selected.serviceSlugs).join(", ")} />
            <DetailRow label="Project" value={selected.projectDescription} />
            {selected.timelineExpectation && <DetailRow label="Timeline" value={selected.timelineExpectation} />}
            {selected.budgetRange && <DetailRow label="Budget" value={selected.budgetRange} />}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-caption text-neutral-600">Pipeline Status</span>
            <Select
              value={selected.status}
              onValueChange={(v) => updateStatus(selected.id, v as QuotePipelineStatus)}
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-label uppercase text-neutral-600">{label}</p>
      <p className="text-body text-neutral-900">{value}</p>
    </div>
  );
}
