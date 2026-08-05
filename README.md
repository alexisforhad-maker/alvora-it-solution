# Alvora IT Solution — Website

Production codebase for the Alvora IT Solution marketing site, CMS, and
admin dashboard. Built against the approved Master Blueprint, Brand
Identity & Design System, and Complete UI/UX Specification.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL, Auth.js, Zod, React Hook Form
- **Storage:** Cloudinary
- **Email:** Resend
- **Deployment:** Vercel

## Folder Structure

```
src/
├── app/
│   ├── (site)/           # Public site route group — its own root layout (Header/Footer)
│   │   ├── layout.tsx    # Independent root <html>/<body> for the public site
│   │   ├── page.tsx, about/, services/, industries/, portfolio/, ...
│   ├── admin/
│   │   ├── layout.tsx    # Independent root <html>/<body> for /admin (separate from (site))
│   │   ├── login/        # Renders OUTSIDE the (dashboard) group — no sidebar/topbar
│   │   └── (dashboard)/  # Sidebar+topbar shell + all 13 admin modules
│   ├── api/               # Route handlers: auth, contact, quote-requests, blog, portfolio,
│   │                       # services, industries, team, careers, messages, media, settings, seo
│   ├── global-error.tsx, robots.ts, sitemap.ts   # True top-level (apply regardless of route group)
├── components/
│   ├── ui/               # shadcn/ui primitives (Button, Card, Input, Table, DropdownMenu, etc.)
│   ├── layout/            # Navbar, Footer, MobileMenu, MegaMenu
│   ├── sections/          # Page-section components (Hero, WhyAlvora, ProcessTimeline, etc.)
│   ├── shared/            # Cross-page components (ServiceCard, PortfolioCard, FAQAccordion...)
│   ├── admin/              # Admin-only components (Sidebar, Topbar, PageHeader, StatCard...)
│   └── animation/         # Framer Motion wrapper components (FadeUp, StaggerGrid, etc.)
├── emails/                # React Email templates (contact/quote/career confirmation, internal notification)
├── lib/                   # cn(), seo.ts, fonts.ts, auth.ts, prisma.ts, email.ts, cloudinary.ts,
│                           # permissions.ts (RBAC), api-utils.ts, rate-limit.ts, validations.ts
├── config/                # site.ts — single source of truth for nav/services/industries/contact
├── types/                 # Shared TypeScript types + next-auth.d.ts session augmentation
├── hooks/                 # Custom React hooks
└── styles/                # Reserved for any non-Tailwind styles (currently unused)

src/middleware.ts          # Route protection for /admin/* (redirects to /admin/login)
prisma/                    # schema.prisma, migrations/, seed.ts
public/                    # Static assets (logo, favicon, images)
```

**Why two root layouts:** Next.js requires either one shared root layout
or independent per-route-group roots when segments need genuinely
different shells. The public site needs Header/Footer; the admin
dashboard needs a sidebar/topbar *and* a chrome-free login screen —
one shared root layout couldn't do all three without every admin page
carrying public site chrome too. See the comments in
`src/app/admin/layout.tsx` and `src/app/(site)/layout.tsx`.

## Design System Source of Truth

All colors, type scale, spacing, radius, and motion values are defined
**once** in `tailwind.config.ts` and mirrored as raw CSS variables in
`src/app/globals.css` for non-Tailwind contexts. Component code should
never hardcode a hex value, px spacing, or duration — extend the config
instead. This keeps the approved Design System enforceable in code, not
just in documentation.

## Local Development Setup

This section is written so a new developer on a **fresh Windows
machine** (with no prior setup) can get the project running end to
end. macOS/Linux steps are the same except where noted.

### 1. Prerequisites

- **Node.js 20 LTS** (the project requires `>=20.0.0` — check with `node --version`). Install from [nodejs.org](https://nodejs.org) (choose the LTS installer) or via [nvm-windows](https://github.com/coreybutler/nvm-windows) if you need to manage multiple versions.
- **Git** (to clone the repo) — [git-scm.com](https://git-scm.com).
- **A local PostgreSQL database.** The easiest path on Windows is **Docker Desktop** ([docker.com](https://www.docker.com/products/docker-desktop/)) — this repo includes a ready-to-use `docker-compose.yml`, so you don't need to install Postgres natively at all. (Alternative: install PostgreSQL natively via the [Windows installer](https://www.postgresql.org/download/windows/), or skip local Postgres entirely and use a free cloud instance from [Neon](https://neon.tech) or [Supabase](https://supabase.com) — either works, just update `DATABASE_URL` accordingly.)

### 2. Install dependencies

```bash
npm install
```

If this fails on Windows with a native-module build error, install the
"Desktop development with C++" workload via [Visual Studio Build
Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and
re-run — this is a general Node.js-on-Windows requirement, not
specific to this project.

### 3. Create your environment file

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Windows (Command Prompt) / macOS / Linux
copy .env.example .env    # cmd.exe
cp .env.example .env      # macOS/Linux
```

Open `.env` and review it — every variable is commented as **REQUIRED**
or **OPTIONAL** for local development. The defaults already in the file
work as-is for `DATABASE_URL`, `AUTH_SECRET`, and `SEED_OWNER_PASSWORD`
(they match the bundled `docker-compose.yml`); Cloudinary and Resend
can stay blank unless you're specifically testing uploads or email.

### 4. Start the local database

```bash
docker compose up -d
```

This starts Postgres 16 on `localhost:5432` with the credentials
already baked into `.env.example`'s `DATABASE_URL`. Verify it's
running with `docker compose ps`. (If you're using a native Postgres
install or a cloud database instead, skip this step and make sure
`DATABASE_URL` in your `.env` points to that database instead.)

### 5. Set up the database schema

```bash
npx prisma validate     # sanity-checks prisma/schema.prisma — should print "The schema at prisma/schema.prisma is valid 🚀"
npx prisma generate     # generates the Prisma Client used throughout src/
npx prisma migrate dev  # creates the database tables from prisma/schema.prisma
```

`prisma migrate dev` will prompt for a migration name the first time
if it doesn't detect the existing `prisma/migrations/20260803000000_init/`
folder as already applied — accept the existing migration when asked,
or see that migration's file header for context on how it was authored.

### 6. Seed the database

```bash
npm run prisma:seed            # creates the first Owner login + SiteSettings row + blog categories
npm run prisma:migrate-content # transcribes src/data/*.ts content into the database
```

### 7. Start the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/admin/login` for the Admin Dashboard.

### Default Development Credentials

After running `npm run prisma:seed`, sign in at `/admin/login` with:

- **Email:** `owner@alvoraitsolution.com`
- **Password:** whatever you set `SEED_OWNER_PASSWORD` to in `.env` (the `.env.example` default is `local-dev-password-change-me`)

This is a local-only seeded account — see `DEPLOYMENT.md` for the
production equivalent of this step, which uses a real, private
password and should be retired after inviting real users.

### Common Troubleshooting

| Problem | Cause / Fix |
|---|---|
| `Environment variable not found: DATABASE_URL` | You haven't created `.env` yet — see step 3. Prisma reads `.env`, not `.env.example`. |
| `Can't reach database server at localhost:5432` | Postgres isn't running — run `docker compose up -d` (step 4) and confirm with `docker compose ps`. If using a native install, confirm the Postgres service is started. |
| `npx prisma migrate dev` asks to reset the database | This means your local database schema doesn't match the migration history — safe to accept on a fresh local DB (it has no real data yet). Never accept a reset against a database you care about. |
| Sign-in at `/admin/login` fails after seeding | Confirm `npm run prisma:seed` actually completed without error, and that you're using the exact `SEED_OWNER_PASSWORD` value from your `.env` (not the `.env.example` placeholder, if you changed it). |
| Image/résumé uploads fail in the Admin Dashboard | Expected if `CLOUDINARY_*` variables are blank — these are optional for local dev (see `.env.example`). Fill them in only if you need to test uploads. |
| Confirmation emails don't arrive from a form submission | Expected if `RESEND_API_KEY` is blank — the submission still succeeds and saves to the database either way (email sending is non-blocking; see `src/lib/email.ts`). |
| `npm install` fails with a native build error on Windows | Install the "Desktop development with C++" workload from Visual Studio Build Tools (see step 2) and retry. |
| Port `3000` or `5432` already in use | Something else on your machine is using it. Stop that process, or change the port (Next.js: `npm run dev -- -p 3001`; Postgres: edit the port mapping in `docker-compose.yml` and update `DATABASE_URL` to match). |

## Development Phases (tracking)

- [x] **Phase 3A — Project Foundation** — structure, config, global styles,
      fonts, root layout, SEO utilities, site config, shared types
- [x] **Phase 3B — Reusable Components** — Prettier/Husky/lint-staged,
      Error Boundary, loading.tsx, robots.ts/sitemap.ts, full UI primitive
      set, layout components (Header/Footer/MegaMenu/MobileNav/Breadcrumb),
      business components (Hero, cards, timeline, stats, FAQ, forms),
      Framer Motion animation wrappers
- [x] **Phase 3C — Homepage** — full section set (Hero, Company Intro,
      Services, Industries, Technologies, Why Alvora, Process Snapshot,
      Featured Portfolio, Testimonials, Stats, Final CTA, Blog Preview,
      Contact CTA), Header/Footer wired into root layout, homepage SEO
      (metadata + WebSite schema), interim placeholder content in
      `src/data/` pending CMS
- [x] **Phase 3D — About & Services** — About page (Hero, Company Story,
      Mission/Vision, Core Values, Leadership Team, Company Timeline,
      Why Alvora [reused], Culture, CTA); Services Hub; all 10 Service
      Detail pages via one reusable template + `generateStaticParams`;
      centralized content in `src/data/services-content.ts` and
      `src/data/industry-content.ts` (dedupes copy across Homepage/Hub/Detail)
- [x] **Phase 3E — Industries, Technologies, Portfolio & Process** —
      Industries Hub + 9 Industry Detail pages (1 template); full
      Technologies page (business-value-first, category-grouped);
      Portfolio Hub (URL-param filtering by service/industry) + Portfolio
      Detail template (slug-driven, testimonial-optional); full Process
      page (reuses `<ProcessTimeline variant="full">`); Service ↔
      Industry ↔ Portfolio cross-linking is fully slug-driven and
      scalable to future CMS content
- [x] **Phase 3F — Blog, Careers, Contact, Request a Quote & Legal** —
      Blog Hub (category filter via URL params) + Blog Detail template
      (1 template → all posts, Article schema); Careers page (culture,
      talent model, honest empty-state open positions, résumé
      submission form); Contact page (primary actions, all channels,
      business hours table, map placeholder, general form); Request a
      Quote page (renders the existing multi-step form); Privacy
      Policy/Terms/Cookie Policy via one `LegalPageLayout` template;
      custom 404. All 18 public pages from the UI/UX spec are now built.
- [x] **Phase 3G — Admin Dashboard & CMS** — full application shell
      (sidebar + topbar, mobile drawer nav); all 12 modules (Dashboard,
      Services/Industries/Portfolio/Blog/Team/Careers Managers, Contact
      Messages, Quote Requests [table + board views], Media Library, SEO
      Manager, Site Settings, User Management); RBAC structure
      (`src/lib/permissions.ts` — Owner/Admin/Editor matrix) enforced via
      `can()` throughout every module ahead of real auth; all admin
      content operations read from and edit the same centralized
      `src/data/*` sources the public site renders from
- [x] **Phase 3H — Authentication, Database & Backend Integration** —
      Prisma schema (19 models) + hand-authored initial migration + seed
      script; Auth.js (Credentials + Prisma adapter, JWT sessions)
      integrated into the *existing* `permissions.ts` RBAC matrix
      unchanged; `/admin/*` route protection via middleware; restructured
      into independent `(site)` and `admin` root layouts (with a
      chrome-free `(dashboard)` sub-group) — a real bug fix, not just an
      addition; 25 API routes (auth, contact, quote-requests,
      careers/interest, + full CRUD for blog/portfolio/team/careers
      positions/media, edit-only for the fixed services/industries
      lists, admin-list+status for messages/quote-requests/applications,
      settings, SEO) — all Zod-validated, permission-checked, origin
      (CSRF) checked, rate-limited; Resend + 4 React Email templates;
      Cloudinary upload/delete. The 3 public forms (Contact, Quote
      Request, Career Interest) needed **zero changes** — they already
      POSTed to these exact routes since Phase 3B/3F.
- [x] **Phase 3I — Final Production Readiness** — all 7
      content/data admin pages (Services, Industries, Portfolio, Blog,
      Team, Careers, Users — Messages/Quotes were already session-wired
      in 3H) now fetch from their real API routes with graceful
      fallback to bundled content (`fetchWithFallback`), and
      create/edit/delete/reorder call real endpoints; added the
      `/api/users` and `/api/technologies` routes that were missing;
      one-time content migration script (`prisma/migrate-content.ts`)
      transcribes `src/data/*.ts` into the database, idempotent via
      upsert; **visual QA fixes** — Header height 80px→88px and Hero
      top/bottom padding rebalanced (the flagged "hero too close to
      top" issue), fixed a real mega-menu overflow/clipping bug on
      1024–1280px screens; **SEO fixes** — generated the previously
      broken `og-default.jpg` reference, added the entirely-missing
      favicon/icon set + `manifest.ts`, added missing `Service`/
      `LocalBusiness` schema; **performance fixes** — added missing
      `sizes` props to 8 `next/image` `fill` usages that were
      requesting oversized images; comprehensive `DEPLOYMENT.md`
      (env vars, migrations, seeding, Cloudinary/Resend/Auth.js
      production notes, Vercel config, post-deploy checklist)

## Conventions

- TypeScript only, strict mode on — no `any` (ESLint enforced)
- All class name composition goes through `cn()` from `src/lib/utils.ts`
- All page metadata goes through `buildMetadata()` from `src/lib/seo.ts`
- All nav/services/industries/contact content is read from `src/config/site.ts`
- Path aliases: `@/components`, `@/lib`, `@/config`, `@/types`, `@/hooks`
- No individual page is built until its section's turn in the sequence above
