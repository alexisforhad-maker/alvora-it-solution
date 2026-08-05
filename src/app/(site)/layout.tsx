import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { buildMetadata, organizationJsonLd, siteIcons } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SplashScreen } from "@/components/shared/splash-screen";
import "@/app/globals.css";

export const metadata: Metadata = {
  ...buildMetadata({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    path: "/",
  }),
  icons: siteIcons,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        {/* Organization schema — sitewide, per Blueprint §5.5 */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body className="font-body antialiased">
        <SplashScreen />

        {/* Skip-to-content link — required on every page per Phase 2 §Accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
