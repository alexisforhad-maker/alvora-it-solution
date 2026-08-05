"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  FolderKanban,
  Newspaper,
  Users,
  UserPlus,
  Mail,
  FileText,
  Image as ImageIcon,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { can, type AdminModule } from "@/lib/permissions";

const navItems: { module: AdminModule; label: string; href: string; icon: typeof LayoutDashboard }[] = [
  { module: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { module: "services", label: "Services", href: "/admin/services", icon: Briefcase },
  { module: "industries", label: "Industries", href: "/admin/industries", icon: Building2 },
  { module: "portfolio", label: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
  { module: "blog", label: "Blog", href: "/admin/blog", icon: Newspaper },
  { module: "team", label: "Team", href: "/admin/team", icon: Users },
  { module: "careers", label: "Careers", href: "/admin/careers", icon: UserPlus },
  { module: "messages", label: "Contact Messages", href: "/admin/messages", icon: Mail },
  { module: "quotes", label: "Quote Requests", href: "/admin/quotes", icon: FileText },
  { module: "media", label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { module: "seo", label: "SEO Manager", href: "/admin/seo", icon: Search },
  { module: "settings", label: "Site Settings", href: "/admin/settings", icon: Settings },
  { module: "users", label: "User Management", href: "/admin/users", icon: ShieldCheck },
];

/**
 * Admin Sidebar — persistent navigation across all 12 modules
 * (Phase 2 §Admin spec). Items the current role cannot at least
 * `view` are hidden entirely, per the RBAC structure in
 * src/lib/permissions.ts.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  // Middleware guarantees an authenticated session on every route this
  // renders in; "editor" (the least-privileged role) is a safe fallback
  // for the brief client-side hydration moment before session data
  // resolves, rather than showing every module and yanking items away.
  const role = session?.user?.role ?? "editor";

  return (
    <nav
      aria-label="Admin navigation"
      className="flex w-64 shrink-0 flex-col bg-primary-dark"
    >
      <Link href="/admin" className="flex h-20 items-center gap-2 px-6">
        <Image
          src="/images/logo.png"
          alt="Alvora IT Solution"
          width={170}
          height={90}
          className="h-[32px] w-auto brightness-0 invert"
        />
      </Link>

      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-6">
        {navItems
          .filter((item) => can(role, item.module, "view"))
          .map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-input px-3 py-2.5 text-body text-white/70 transition-colors",
                    "hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50",
                    isActive && "bg-white/10 text-white"
                  )}
                >
                  <item.icon className="size-[20px] shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
