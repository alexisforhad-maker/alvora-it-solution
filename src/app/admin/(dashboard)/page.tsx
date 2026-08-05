import Link from "next/link";
import { FileText, Mail, Newspaper, FolderKanban, Plus } from "lucide-react";
import { AdminStatCard } from "@/components/admin/stat-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/utils";
import { blogPosts } from "@/data/blog-content";
import { portfolioItems } from "@/data/portfolio-content";
import { contactMessages } from "@/data/admin-messages";
import { quoteRequests } from "@/data/admin-quote-requests";

export default function AdminDashboardPage() {
  const newMessages = contactMessages.filter((m) => m.status === "New").length;
  const newQuotes = quoteRequests.filter((q) => q.status === "New").length;
  const publishedPosts = blogPosts.length;
  const activePortfolioItems = portfolioItems.length;

  const recentActivity = [
    ...contactMessages.map((m) => ({
      type: "Contact Message" as const,
      description: `${m.fullName} — ${m.message.slice(0, 60)}${m.message.length > 60 ? "…" : ""}`,
      date: m.submittedAt,
      status: m.status,
    })),
    ...quoteRequests.map((q) => ({
      type: "Quote Request" as const,
      description: `${q.fullName}${q.company ? ` (${q.company})` : ""} — ${q.projectDescription.slice(0, 50)}${q.projectDescription.length > 50 ? "…" : ""}`,
      date: q.submittedAt,
      status: q.status,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="A snapshot of recent activity across the site."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard icon={Mail} label="New Contact Messages" value={newMessages} />
        <AdminStatCard icon={FileText} label="New Quote Requests" value={newQuotes} />
        <AdminStatCard icon={Newspaper} label="Published Blog Posts" value={publishedPosts} />
        <AdminStatCard icon={FolderKanban} label="Portfolio Items" value={activePortfolioItems} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y divide-border">
              {recentActivity.map((activity, index) => (
                <li key={index} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="text-caption font-medium text-neutral-600">{activity.type}</p>
                    <p className="truncate text-body text-neutral-900">{activity.description}</p>
                    <p className="text-caption text-neutral-600">{formatDate(activity.date)}</p>
                  </div>
                  <AdminStatusBadge status={activity.status} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/admin/blog">
                <Plus className="size-[16px]" aria-hidden="true" />
                New Blog Post
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/admin/portfolio">
                <Plus className="size-[16px]" aria-hidden="true" />
                New Case Study
              </Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/admin/quotes">
                <FileText className="size-[16px]" aria-hidden="true" />
                Review Quote Requests
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
