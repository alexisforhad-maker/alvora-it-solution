import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { contactConfig, siteConfig } from "@/config/site";

const prisma = new PrismaClient();

/**
 * Seed script — run with `npm run prisma:seed` (or automatically after
 * `prisma migrate dev`, since package.json's `prisma.seed` config
 * points here). Creates the minimum data needed to actually use the
 * app after a fresh migration:
 *   - one OWNER user so someone can sign in to /admin/login at all
 *   - the singleton SiteSettings row (Site Settings page reads/writes it)
 *   - the four blog Category rows the frontend's category filter expects
 *
 * Does NOT seed Services/Industries/Portfolio/Blog/Team content —
 * that content already exists as reviewed, approved copy in
 * src/data/*.ts. A follow-up migration script (not included here)
 * should read those files and insert matching rows, so the approved
 * copy is transcribed once rather than re-authored in two places.
 */
async function main() {
  const ownerPassword = process.env.SEED_OWNER_PASSWORD ?? "change-me-immediately";
  const passwordHash = await bcrypt.hash(ownerPassword, 12);

  const owner = await prisma.user.upsert({
    where: { email: "owner@alvoraitsolution.com" },
    update: {},
    create: {
      name: "Founder & CEO",
      email: "owner@alvoraitsolution.com",
      passwordHash,
      role: "OWNER",
    },
  });
  console.log(`Seeded owner user: ${owner.email} (change the password immediately after first login)`);

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: siteConfig.name,
      domain: siteConfig.domain,
      contactEmail: contactConfig.email,
      contactPhone: contactConfig.phone,
      whatsappNumber: contactConfig.whatsapp,
      businessHours: contactConfig.businessHours,
      socialLinks: {},
      liveChatEnabled: true,
      analyticsEnabled: false,
      cookieBannerEnabled: true,
    },
  });
  console.log("Seeded SiteSettings singleton row.");

  const categories = [
    { slug: "technology-trends", name: "Technology & Trends" },
    { slug: "business-automation", name: "Business Automation" },
    { slug: "case-studies", name: "Case Studies & Lessons" },
    { slug: "company-news", name: "Company News" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`Seeded ${categories.length} blog categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
