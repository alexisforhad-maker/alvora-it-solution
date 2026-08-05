import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig, contactConfig, footerNav, services } from "@/config/site";

/**
 * Footer — navy background, white/light-teal text, 4-5 column layout
 * collapsing to accordion-style stacking on mobile, per Phase 2 spec.
 * (Mobile uses simple stacked columns here rather than an accordion —
 * footers are short enough that stacking reads better than hiding
 * content behind a tap on a page's final section.)
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    // Black Edition: the shared `gradient-primary` token is now a
    // vivid cyan/blue/purple gradient (tuned for small elements like
    // buttons); at full footer width that reads as loud rather than
    // "deep dark." Uses a dedicated deep navy → near-black gradient
    // instead, with the existing aurora-tinted bg-mesh-wash-dark glow
    // layered on top.
    <footer className="relative overflow-hidden bg-gradient-to-b from-primary-dark to-background text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" aria-hidden="true" />
      <div className="bg-mesh-wash-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="container relative grid grid-cols-2 gap-[40px] py-10 md:grid-cols-4 lg:py-16">
        <div className="col-span-2 md:col-span-1">
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            width={170}
            height={90}
            className="h-[36px] w-auto brightness-0 invert"
          />
          <p className="mt-4 max-w-xs text-body text-white/70">{siteConfig.tagline}</p>
        </div>

        <FooterColumn title="Services" links={services.slice(0, 6).map((s) => ({ label: s.name, href: `/services/${s.slug}` }))} />
        <FooterColumn title="Company" links={footerNav.company} />
        <FooterColumn title="Resources" links={footerNav.resources} />
      </div>

      <div className="relative border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-caption text-white/70 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2">
              <Mail className="size-[16px] text-secondary-light" aria-hidden="true" />
              <a href={`mailto:${contactConfig.email}`} className="break-words transition-colors hover:text-white">
                {contactConfig.email}
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="size-[16px] text-secondary-light" aria-hidden="true" />
              <a href={`tel:${contactConfig.phone}`} className="transition-colors hover:text-white">
                {contactConfig.phone}
              </a>
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-[16px] text-secondary-light" aria-hidden="true" />
              {contactConfig.address.line1}, {contactConfig.address.city}, {contactConfig.address.country}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerNav.legal.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="container pb-6 text-caption text-white/50">
          &copy; {year} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="font-heading text-h6 text-white">{title}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block text-body text-white/70 transition-all duration-fast hover:translate-x-0.5 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
