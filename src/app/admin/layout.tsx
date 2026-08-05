import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { fontVariables } from "@/lib/fonts";
import { siteIcons } from "@/lib/seo";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin — Alvora IT Solution",
  robots: { index: false, follow: false },
  // Independent root layout from (site) — metadata doesn't cascade
  // between the two, so the browser-branding icon set (Task 001) is
  // applied explicitly here too, from the same shared source in
  // src/lib/seo.ts. Otherwise /admin/* pages would render with no
  // tab icon at all now that the old file-convention favicon files
  // (which applied globally) have been removed.
  icons: siteIcons,
};

/**
 * Admin root layout — an independent root (own <html>/<body>) from the
 * public site's root layout at src/app/(site)/layout.tsx, per Next.js's
 * multiple-root-layouts pattern. This is what makes it possible for
 * /admin/login to render without the public Header/Footer AND without
 * the dashboard sidebar/topbar (which lives one level deeper, in
 * src/app/admin/(dashboard)/layout.tsx).
 *
 * SessionProvider wraps every admin route (including login) so client
 * components can call useSession() — the actual route-protection
 * decision happens server-side in src/middleware.ts, not here.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="font-body antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
