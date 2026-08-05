# Deployment Guide — Alvora IT Solution

This guide covers everything needed to take this codebase from local
development to a live production deployment.

---

## 1. Prerequisites

- A PostgreSQL database (Vercel Postgres, Neon, Supabase, or Railway all work)
- A [Cloudinary](https://cloudinary.com) account (media storage)
- A [Resend](https://resend.com) account (transactional email)
- A domain (this guide assumes `alvoraitsolution.com`)
- A [Vercel](https://vercel.com) account (recommended host — the stack is built for it)

---

## 2. Environment Variables (Production)

Copy `.env.example` to `.env` for local development. In production,
set these as environment variables in your hosting platform (Vercel
Project Settings → Environment Variables) — **never commit `.env`**.

| Variable | Where it comes from | Notes |
|---|---|---|
| `DATABASE_URL` | Your Postgres provider | Use the **pooled** connection string if your provider offers one (Vercel Postgres, Neon, and Supabase all do) — serverless functions open many short-lived connections, and an unpooled connection string will exhaust your DB's connection limit under load. |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` | A different value than any development secret. Rotating this invalidates all active sessions. |
| `AUTH_URL` | Your production URL | e.g. `https://alvoraitsolution.com` — must match exactly (including protocol) or sign-in will fail. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary Dashboard → Settings → API Keys | See §5 below. |
| `RESEND_API_KEY` | Resend Dashboard → API Keys | See §6 below. |
| `EMAIL_FROM` | e.g. `Alvora IT Solution <hello@alvoraitsolution.com>` | Must be on a domain you've verified in Resend. |
| `EMAIL_TO_SALES` | Internal inbox for notifications | Where "new contact message / quote request / application" emails are sent. |
| `NEXT_PUBLIC_SITE_URL` | Your production URL | Used for canonical URLs, sitemap, and Open Graph tags. |
| `SEED_OWNER_PASSWORD` | A strong password you choose | Only used once, by the seed script. **Change it via a real password reset immediately after first login** — don't leave the seeded credential active. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Leave blank if not using Google Analytics yet. |

---

## 3. Database Setup & Migrations

1. Provision a Postgres database with your chosen provider and copy its connection string into `DATABASE_URL`.
2. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
   This applies `prisma/migrations/20260803000000_init/migration.sql`.

   **Important note on that migration file:** it was hand-authored
   directly from `prisma/schema.prisma` in a sandboxed environment
   without a live database connection (so `prisma migrate dev`
   couldn't run to generate it automatically). Before your first real
   deploy, validate it:
   ```bash
   npx prisma migrate diff \
     --from-empty \
     --to-schema-datamodel prisma/schema.prisma \
     --script
   ```
   Compare the output against `migration.sql`. If they differ,
   trust the freshly-generated output — delete the existing
   migration folder and run `npx prisma migrate dev --name init`
   against a real (even local/throwaway) Postgres instance to have
   Prisma generate the canonical version, then commit that instead.
3. Generate the Prisma client (happens automatically via the `postinstall` script, but can be run manually):
   ```bash
   npx prisma generate
   ```

---

## 4. Seeding & Content Migration

Run these **once**, after migrations succeed:

```bash
npm run prisma:seed            # Creates the first Owner login, SiteSettings row, blog categories
npm run prisma:migrate-content # Transcribes src/data/*.ts content into the database
```

- `prisma:seed` creates `owner@alvoraitsolution.com` with the password
  from `SEED_OWNER_PASSWORD`. **Sign in and change this immediately** —
  ideally by inviting the real Owner via User Management and disabling
  this seeded account, rather than continuing to use it long-term.
- `prisma:migrate-content` is safe to re-run (every write is an
  upsert keyed by slug/name) — re-running it after editing
  `src/data/*.ts` will sync those edits into the database.

---

## 5. Cloudinary Setup

1. Create a Cloudinary account and note your **Cloud Name**, **API Key**, and **API Secret** from the Dashboard.
2. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. No manual bucket/folder setup is required — `src/lib/cloudinary.ts` uploads into `alvora/media-library` (Media Library uploads) and `alvora/resumes` (career application résumés) automatically on first use.
4. Recommended: in Cloudinary's Dashboard, set an **upload size limit** and enable **auto-backup** for the account as a safety net beyond the app's own 10MB client-side limit.
5. `next.config.ts` is already configured to allow `res.cloudinary.com` as an image source for `next/image` — no changes needed there.

---

## 6. Resend Setup

1. Create a Resend account and verify your sending domain (Resend Dashboard → Domains → Add Domain), following their DNS (SPF/DKIM) instructions with your DNS provider.
2. Generate an API key (Dashboard → API Keys) and set `RESEND_API_KEY`.
3. Set `EMAIL_FROM` to an address on your verified domain (unverified-domain sends will fail or land in spam).
4. Test in production with a real form submission (Contact, Quote Request, or Career Interest) — check both the visitor confirmation and the internal notification arrive. Failures are logged server-side but never block the form submission itself (see `src/lib/email.ts`).

---

## 7. Auth.js Production Notes

- **`AUTH_SECRET` must be set and kept secret** — without it, Auth.js refuses to start in production.
- **`AUTH_URL` must exactly match your production domain**, including `https://`.
- Sessions are JWT-based (required for the Credentials provider) — there's no server-side session store to manage or clean up.
- The Prisma adapter is wired in even though only Credentials is configured today, so adding an OAuth provider (Google, Microsoft) later needs zero schema changes — just add the provider to `src/lib/auth.ts`.
- `src/middleware.ts` protects every `/admin/*` route except `/admin/login`. If you add new top-level admin routes outside `src/app/admin/`, update the `matcher` in that file.
- Passwords are hashed with bcrypt (cost factor 12, set in `prisma/seed.ts` — reuse that cost factor anywhere else a password is hashed).
- **Rotate `AUTH_SECRET` if it's ever exposed.** This immediately invalidates all active sessions (acceptable — users just sign in again).

---

## 8. Vercel Deployment

This project needs no special Vercel configuration beyond environment
variables — it's a standard Next.js App Router project.

1. Import the repository into Vercel.
2. Set all environment variables from §2 in Project Settings → Environment Variables (set them for Production, and separately for Preview if you want preview deployments to hit a staging database instead of production).
3. Build command: `next build` (default — no change needed).
4. Framework preset: Next.js (auto-detected).
5. **Before the first deploy succeeds**, your production `DATABASE_URL` needs to already have migrations applied (§3) — Vercel's build step does not run `prisma migrate deploy` automatically unless you add it. Recommended: add a `vercel-build` script or run migrations from your CI pipeline / manually before the first deploy, then rely on `postinstall`'s `prisma generate` for subsequent builds (which only regenerates the client, not the schema).
6. Add your custom domain in Project Settings → Domains, and update `AUTH_URL`/`NEXT_PUBLIC_SITE_URL` to match exactly.
7. `robots.txt` and `sitemap.xml` are generated automatically at build time (`src/app/robots.ts`, `src/app/sitemap.ts`) — no extra configuration needed.

---

## 9. Post-Deployment Checklist

- [ ] Sign in at `/admin/login` with the seeded Owner account, then invite real team members via User Management and retire the seeded credential
- [ ] Submit a test Contact Form, Quote Request, and Career Interest submission — confirm they appear in the Admin Dashboard and both confirmation + internal emails arrive
- [ ] Upload a test image via the Media Library — confirm it appears in Cloudinary and renders on the site
- [ ] Verify `/sitemap.xml` and `/robots.txt` resolve correctly on the production domain
- [ ] Verify Open Graph previews render correctly (share a page link in Slack/iMessage/Twitter to check the image and text)
- [ ] Run a Lighthouse pass on the homepage and a Service Detail page (Performance, Accessibility, Best Practices, SEO)
- [ ] Confirm HTTPS is enforced and the security headers in `next.config.ts` are present (check via browser dev tools → Network → Response Headers)
