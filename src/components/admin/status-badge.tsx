import { Badge, type BadgeProps } from "@/components/ui/badge";

const variantByStatus: Record<string, NonNullable<BadgeProps["variant"]>> = {
  // Blog / content
  Draft: "outline",
  Published: "success",
  // Contact messages
  New: "accent",
  Replied: "success",
  Archived: "outline",
  // Quote request pipeline
  Contacted: "primary",
  "Proposal Sent": "default",
  Won: "success",
  Lost: "error",
  // Careers submissions
  Reviewed: "success",
  // Users
  Active: "success",
  Invited: "accent",
  Disabled: "error",
  // Open positions
  Open: "success",
  Closed: "outline",
};

export function AdminStatusBadge({ status }: { status: string }) {
  return <Badge variant={variantByStatus[status] ?? "outline"}>{status}</Badge>;
}
