import { PrismaClient } from "@prisma/client";
import { servicesContent } from "@/data/services-content";
import { industriesContent } from "@/data/industries-content";
import { techGroups } from "@/data/technologies-content";
import { portfolioItems } from "@/data/portfolio-content";
import { blogPosts } from "@/data/blog-content";
import { teamMembers } from "@/data/team";
import { openPositions } from "@/data/open-positions";

// Flatten the category-grouped technologies list into {name, category} pairs.
const technologiesFlat = techGroups.flatMap((group) =>
  group.items.map((name) => ({ name, category: group.category }))
);

const prisma = new PrismaClient();

/**
 * One-time content migration — transcribes the reviewed, approved
 * copy already living in src/data/*.ts into the database. Run this
 * once, right after `prisma migrate dev` and `npm run prisma:seed`
 * (seed creates the Owner user and Category rows this script depends
 * on), with:
 *
 *   npx tsx prisma/migrate-content.ts
 *
 * Safe to re-run — every write is an upsert keyed by slug (or name,
 * for Technology), so running it twice updates existing rows rather
 * than duplicating them. This does NOT replace src/data/*.ts as the
 * frontend's data source in this codebase; the frontend continues
 * reading those files directly (with the "fetch from API, fall back
 * to bundled content" pattern used by the Admin Dashboard). This
 * script exists so the Admin Dashboard's live API endpoints return
 * real data immediately, rather than an empty result set that always
 * falls back.
 */
async function main() {
  console.log("Starting content migration...\n");

  // --- Technologies (referenced by Services and Portfolio below) ---
  const technologyIdByName = new Map<string, string>();
  for (const tech of technologiesFlat) {
    const record = await prisma.technology.upsert({
      where: { name: tech.name },
      update: { category: tech.category },
      create: { name: tech.name, category: tech.category },
    });
    technologyIdByName.set(tech.name, record.id);
  }
  console.log(`✓ ${technologyIdByName.size} technologies`);

  // --- Services ---
  const serviceIdBySlug = new Map<string, string>();
  for (const svc of Object.values(servicesContent)) {
    const record = await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {
        name: svc.name,
        shortDescription: svc.shortDescription,
        problem: svc.problem,
        solutionOverview: svc.solutionOverview,
        included: svc.included,
        benefits: svc.benefits,
        approach: svc.approach,
        faqs: svc.faqs,
      },
      create: {
        slug: svc.slug,
        name: svc.name,
        shortDescription: svc.shortDescription,
        problem: svc.problem,
        solutionOverview: svc.solutionOverview,
        included: svc.included,
        benefits: svc.benefits,
        approach: svc.approach,
        faqs: svc.faqs,
      },
    });
    serviceIdBySlug.set(svc.slug, record.id);

    const technologyIds = svc.technologies
      .map((name) => technologyIdByName.get(name))
      .filter((id): id is string => !!id);
    if (technologyIds.length > 0) {
      await prisma.service.update({
        where: { id: record.id },
        data: { technologies: { set: technologyIds.map((id) => ({ id })) } },
      });
    }
  }
  console.log(`✓ ${serviceIdBySlug.size} services`);

  // --- Industries ---
  const industryIdBySlug = new Map<string, string>();
  for (const ind of Object.values(industriesContent)) {
    const record = await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: { name: ind.name, relevanceStatement: ind.relevanceStatement, challenges: ind.challenges },
      create: {
        slug: ind.slug,
        name: ind.name,
        relevanceStatement: ind.relevanceStatement,
        challenges: ind.challenges,
      },
    });
    industryIdBySlug.set(ind.slug, record.id);
  }
  console.log(`✓ ${industryIdBySlug.size} industries`);

  // --- Service <-> Industry relations (derived from each service's relatedIndustrySlugs) ---
  for (const svc of Object.values(servicesContent)) {
    const serviceId = serviceIdBySlug.get(svc.slug);
    const industryIds = svc.relatedIndustrySlugs
      .map((slug) => industryIdBySlug.get(slug))
      .filter((id): id is string => !!id);
    if (serviceId && industryIds.length > 0) {
      await prisma.service.update({
        where: { id: serviceId },
        data: { industries: { set: industryIds.map((id) => ({ id })) } },
      });
    }
  }

  // --- Service <-> Service (related services) ---
  for (const svc of Object.values(servicesContent)) {
    const serviceId = serviceIdBySlug.get(svc.slug);
    const relatedIds = svc.relatedServiceSlugs
      .map((slug) => serviceIdBySlug.get(slug))
      .filter((id): id is string => !!id);
    if (serviceId && relatedIds.length > 0) {
      await prisma.service.update({
        where: { id: serviceId },
        data: { relatedTo: { set: relatedIds.map((id) => ({ id })) } },
      });
    }
  }
  console.log("✓ service↔industry and service↔service relations");

  // --- Portfolio Items ---
  let portfolioCount = 0;
  for (const item of portfolioItems) {
    const serviceIds = item.serviceSlugs.map((s) => serviceIdBySlug.get(s)).filter((id): id is string => !!id);
    const industryIds = item.industrySlugs.map((s) => industryIdBySlug.get(s)).filter((id): id is string => !!id);
    const technologyIds = item.technologies.map((t) => technologyIdByName.get(t)).filter((id): id is string => !!id);

    await prisma.portfolioItem.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        thumbnail: item.thumbnail,
        resultStat: item.resultStat,
        challenge: item.challenge,
        solution: item.solution,
        result: item.result,
        services: { set: serviceIds.map((id) => ({ id })) },
        industries: { set: industryIds.map((id) => ({ id })) },
        technologies: { set: technologyIds.map((id) => ({ id })) },
      },
      create: {
        slug: item.slug,
        title: item.title,
        thumbnail: item.thumbnail,
        resultStat: item.resultStat,
        challenge: item.challenge,
        solution: item.solution,
        result: item.result,
        services: { connect: serviceIds.map((id) => ({ id })) },
        industries: { connect: industryIds.map((id) => ({ id })) },
        technologies: { connect: technologyIds.map((id) => ({ id })) },
      },
    });
    portfolioCount++;
  }
  console.log(`✓ ${portfolioCount} portfolio items`);

  // --- Team Members ---
  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {
        name: member.name,
        role: member.role,
        photo: member.photo,
        shortBio: member.shortBio,
        extendedBio: member.extendedBio,
        linkedIn: member.linkedIn,
        order: member.order,
      },
      create: {
        id: member.id,
        name: member.name,
        role: member.role,
        photo: member.photo,
        shortBio: member.shortBio,
        extendedBio: member.extendedBio,
        linkedIn: member.linkedIn,
        order: member.order,
      },
    });
  }
  console.log(`✓ ${teamMembers.length} team members`);

  // --- Blog Posts (attributed to the seeded Owner account — see the
  //     author-attribution note in the Admin Blog Manager for why
  //     TeamMember and User are intentionally separate here) ---
  const owner = await prisma.user.findUnique({ where: { email: "owner@alvoraitsolution.com" } });
  if (!owner) {
    console.warn("⚠ No owner user found — run `npm run prisma:seed` first. Skipping blog posts.");
  } else {
    let blogCount = 0;
    for (const post of blogPosts) {
      const category = await prisma.category.findUnique({ where: { slug: post.category } });
      if (!category) {
        console.warn(`⚠ Category "${post.category}" not found for post "${post.slug}" — skipping.`);
        continue;
      }
      const relatedServiceId = post.relatedServiceSlug ? serviceIdBySlug.get(post.relatedServiceSlug) : undefined;

      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {
          title: post.title,
          status: post.status === "Published" ? "PUBLISHED" : "DRAFT",
          excerpt: post.excerpt,
          content: post.content,
          heroImage: post.heroImage,
          publishedAt: new Date(post.publishedAt),
          readingTimeMinutes: post.readingTimeMinutes,
          categoryId: category.id,
          ...(relatedServiceId && { relatedServices: { set: [{ id: relatedServiceId }] } }),
        },
        create: {
          slug: post.slug,
          title: post.title,
          status: post.status === "Published" ? "PUBLISHED" : "DRAFT",
          excerpt: post.excerpt,
          content: post.content,
          heroImage: post.heroImage,
          publishedAt: new Date(post.publishedAt),
          readingTimeMinutes: post.readingTimeMinutes,
          categoryId: category.id,
          authorId: owner.id,
          ...(relatedServiceId && { relatedServices: { connect: [{ id: relatedServiceId }] } }),
        },
      });
      blogCount++;
    }
    console.log(`✓ ${blogCount} blog posts`);
  }

  // --- Career Positions (currently empty — see src/data/open-positions.ts) ---
  for (const position of openPositions) {
    await prisma.careerPosition.upsert({
      where: { slug: position.slug },
      update: {
        title: position.title,
        type: position.type.toUpperCase().replace("-", "_") as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
        location: position.location,
        description: position.description,
      },
      create: {
        slug: position.slug,
        title: position.title,
        type: position.type.toUpperCase().replace("-", "_") as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
        location: position.location,
        description: position.description,
        status: "OPEN",
      },
    });
  }
  console.log(`✓ ${openPositions.length} career positions`);

  console.log("\nContent migration complete.");
}

main()
  .catch((error) => {
    console.error("Content migration failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
