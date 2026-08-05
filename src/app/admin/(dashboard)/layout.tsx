import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

/**
 * Dashboard shell layout — sidebar + topbar. Scoped to the
 * `(dashboard)` route group only, so /admin/login (a sibling route
 * outside this group) renders without the sidebar/topbar, per the
 * multi-root-layout restructure. The actual auth guard lives in
 * src/middleware.ts; by the time a request reaches this layout, the
 * middleware has already confirmed a session exists.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <div className="hidden border-r border-border lg:block">
        <AdminSidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
