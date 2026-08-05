"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, Bell, ExternalLink, LogOut } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { roleLabels } from "@/lib/permissions";

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/services": "Services Manager",
  "/admin/industries": "Industries Manager",
  "/admin/portfolio": "Portfolio Manager",
  "/admin/blog": "Blog Manager",
  "/admin/team": "Team Manager",
  "/admin/careers": "Careers Manager",
  "/admin/messages": "Contact Messages",
  "/admin/quotes": "Quote Requests",
  "/admin/media": "Media Library",
  "/admin/seo": "SEO Manager",
  "/admin/settings": "Site Settings",
  "/admin/users": "User Management",
};

/**
 * Admin Topbar — now reads the real Auth.js session (Phase 3H) instead
 * of the Phase 3G mock `currentAdminUser`, and offers a real sign-out
 * action. Middleware (src/middleware.ts) guarantees a session exists
 * on every route this renders in.
 */
export function AdminTopbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const title = titleMap[pathname] ?? "Admin";

  const userName = session?.user?.name ?? "…";
  const userRole = session?.user?.role;

  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-background px-4 md:px-8">
      <div className="flex items-center gap-3">
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open admin menu">
              <Menu className="size-[24px]" />
            </Button>
          </DrawerTrigger>
          <DrawerContent side="left" className="w-64 !bg-primary-dark p-0">
            <DrawerTitle className="sr-only">Admin Navigation</DrawerTitle>
            <AdminSidebar />
          </DrawerContent>
        </Drawer>
        <h1 className="font-heading text-h4 text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 text-body text-neutral-600 hover:text-secondary sm:flex"
        >
          View Site
          <ExternalLink className="size-[14px]" aria-hidden="true" />
        </Link>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-[20px]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30">
              <span className="flex size-[36px] items-center justify-center rounded-full bg-primary/10 font-heading text-caption text-primary">
                {userName.charAt(0)}
              </span>
              <div className="hidden text-left sm:block">
                <p className="text-caption font-medium text-neutral-900">{userName}</p>
                {userRole && <Badge variant="primary">{roleLabels[userRole]}</Badge>}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/admin/login" })}>
              <LogOut className="size-[16px]" aria-hidden="true" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
