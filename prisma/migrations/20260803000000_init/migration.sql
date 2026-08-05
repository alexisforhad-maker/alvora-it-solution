-- ============================================================================
-- ALVORA IT SOLUTION — INITIAL MIGRATION
--
-- NOTE: This migration was authored directly from prisma/schema.prisma in a
-- sandboxed environment without a live PostgreSQL connection, so it could
-- not be generated via `prisma migrate dev` (which requires DATABASE_URL to
-- reach a real database). Before applying to production, validate it with:
--
--   npx prisma migrate diff \
--     --from-empty \
--     --to-schema-datamodel prisma/schema.prisma \
--     --script
--
-- and reconcile any differences, or simply delete this folder and run
-- `npx prisma migrate dev --name init` against a real database to have
-- Prisma generate the canonical version. The schema.prisma file is the
-- source of truth either way.
-- ============================================================================

-- Enums
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'EDITOR');
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TYPE "PositionType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');
CREATE TYPE "PositionStatus" AS ENUM ('OPEN', 'CLOSED');
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'REVIEWED');
CREATE TYPE "ContactChannel" AS ENUM ('CONTACT_FORM', 'LIVE_CHAT');
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'REPLIED', 'ARCHIVED');
CREATE TYPE "PreferredContactMethod" AS ENUM ('EMAIL', 'PHONE', 'WHATSAPP');
CREATE TYPE "QuoteStatus" AS ENUM ('NEW', 'CONTACTED', 'PROPOSAL_SENT', 'WON', 'LOST');

-- ============================================================================
-- Auth.js required tables
-- ============================================================================

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- ============================================================================
-- Lookup models
-- ============================================================================

CREATE TABLE "technologies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "technologies_name_key" ON "technologies"("name");

CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- ============================================================================
-- Services
-- ============================================================================

CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "solutionOverview" TEXT NOT NULL,
    "included" TEXT[],
    "benefits" TEXT[],
    "approach" JSONB NOT NULL,
    "faqs" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- ============================================================================
-- Industries
-- ============================================================================

CREATE TABLE "industries" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relevanceStatement" TEXT NOT NULL,
    "challenges" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "industries_slug_key" ON "industries"("slug");

-- ============================================================================
-- Portfolio
-- ============================================================================

CREATE TABLE "portfolio_items" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "resultStat" TEXT,
    "challenge" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "testimonialQuote" TEXT,
    "testimonialAuthor" TEXT,
    "testimonialRole" TEXT,
    "testimonialCompany" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "portfolio_items_slug_key" ON "portfolio_items"("slug");

-- ============================================================================
-- Blog
-- ============================================================================

CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "excerpt" TEXT NOT NULL,
    "content" TEXT[],
    "heroImage" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "readingTimeMinutes" INTEGER NOT NULL DEFAULT 5,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================================
-- Team
-- ============================================================================

CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "shortBio" TEXT NOT NULL,
    "extendedBio" TEXT,
    "linkedIn" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- Careers
-- ============================================================================

CREATE TABLE "career_positions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "PositionType" NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "PositionStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "career_positions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "career_positions_slug_key" ON "career_positions"("slug");

CREATE TABLE "career_applications" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "areaOfExpertise" TEXT NOT NULL,
    "message" TEXT,
    "resumeUrl" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "positionId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "career_applications_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "career_applications" ADD CONSTRAINT "career_applications_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "career_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================================
-- Contact & Quote submissions
-- ============================================================================

CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "channel" "ContactChannel" NOT NULL DEFAULT 'CONTACT_FORM',
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quote_requests" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "projectDescription" TEXT NOT NULL,
    "timelineExpectation" TEXT,
    "budgetRange" TEXT,
    "preferredContactMethod" "PreferredContactMethod" NOT NULL DEFAULT 'EMAIL',
    "timeZone" TEXT NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'NEW',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quote_requests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quote_request_services" (
    "quoteRequestId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    CONSTRAINT "quote_request_services_pkey" PRIMARY KEY ("quoteRequestId", "serviceId")
);
ALTER TABLE "quote_request_services" ADD CONSTRAINT "quote_request_services_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "quote_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quote_request_services" ADD CONSTRAINT "quote_request_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================================
-- SEO
-- ============================================================================

CREATE TABLE "seo_metadata" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "ogImage" TEXT,
    "serviceId" TEXT,
    "industryId" TEXT,
    "portfolioItemId" TEXT,
    "blogPostId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "seo_metadata_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "seo_metadata_path_key" ON "seo_metadata"("path");
CREATE UNIQUE INDEX "seo_metadata_serviceId_key" ON "seo_metadata"("serviceId");
CREATE UNIQUE INDEX "seo_metadata_industryId_key" ON "seo_metadata"("industryId");
CREATE UNIQUE INDEX "seo_metadata_portfolioItemId_key" ON "seo_metadata"("portfolioItemId");
CREATE UNIQUE INDEX "seo_metadata_blogPostId_key" ON "seo_metadata"("blogPostId");
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_portfolioItemId_fkey" FOREIGN KEY ("portfolioItemId") REFERENCES "portfolio_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- Site Settings, Navigation, Footer
-- ============================================================================

CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "siteName" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "businessHours" JSONB NOT NULL,
    "socialLinks" JSONB NOT NULL,
    "liveChatEnabled" BOOLEAN NOT NULL DEFAULT true,
    "analyticsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "analyticsId" TEXT,
    "cookieBannerEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "navigation_items" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    CONSTRAINT "navigation_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "navigation_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "footer_links" (
    "id" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "footer_links_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- Media Library
-- ============================================================================

CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "altText" TEXT,
    "usedIn" TEXT,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "media_assets_cloudinaryPublicId_key" ON "media_assets"("cloudinaryPublicId");
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================================
-- Many-to-many join tables (implicit relations — Prisma default naming: _<RelationName>)
-- ============================================================================

CREATE TABLE "_ServiceTechnologies" ("A" TEXT NOT NULL, "B" TEXT NOT NULL);
CREATE UNIQUE INDEX "_ServiceTechnologies_AB_unique" ON "_ServiceTechnologies"("A", "B");
CREATE INDEX "_ServiceTechnologies_B_index" ON "_ServiceTechnologies"("B");
ALTER TABLE "_ServiceTechnologies" ADD CONSTRAINT "_ServiceTechnologies_A_fkey" FOREIGN KEY ("A") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ServiceTechnologies" ADD CONSTRAINT "_ServiceTechnologies_B_fkey" FOREIGN KEY ("B") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_ServiceIndustries" ("A" TEXT NOT NULL, "B" TEXT NOT NULL);
CREATE UNIQUE INDEX "_ServiceIndustries_AB_unique" ON "_ServiceIndustries"("A", "B");
CREATE INDEX "_ServiceIndustries_B_index" ON "_ServiceIndustries"("B");
ALTER TABLE "_ServiceIndustries" ADD CONSTRAINT "_ServiceIndustries_A_fkey" FOREIGN KEY ("A") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ServiceIndustries" ADD CONSTRAINT "_ServiceIndustries_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_PortfolioServices" ("A" TEXT NOT NULL, "B" TEXT NOT NULL);
CREATE UNIQUE INDEX "_PortfolioServices_AB_unique" ON "_PortfolioServices"("A", "B");
CREATE INDEX "_PortfolioServices_B_index" ON "_PortfolioServices"("B");
ALTER TABLE "_PortfolioServices" ADD CONSTRAINT "_PortfolioServices_A_fkey" FOREIGN KEY ("A") REFERENCES "portfolio_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PortfolioServices" ADD CONSTRAINT "_PortfolioServices_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_PortfolioIndustries" ("A" TEXT NOT NULL, "B" TEXT NOT NULL);
CREATE UNIQUE INDEX "_PortfolioIndustries_AB_unique" ON "_PortfolioIndustries"("A", "B");
CREATE INDEX "_PortfolioIndustries_B_index" ON "_PortfolioIndustries"("B");
ALTER TABLE "_PortfolioIndustries" ADD CONSTRAINT "_PortfolioIndustries_A_fkey" FOREIGN KEY ("A") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PortfolioIndustries" ADD CONSTRAINT "_PortfolioIndustries_B_fkey" FOREIGN KEY ("B") REFERENCES "portfolio_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_PortfolioTechnologies" ("A" TEXT NOT NULL, "B" TEXT NOT NULL);
CREATE UNIQUE INDEX "_PortfolioTechnologies_AB_unique" ON "_PortfolioTechnologies"("A", "B");
CREATE INDEX "_PortfolioTechnologies_B_index" ON "_PortfolioTechnologies"("B");
ALTER TABLE "_PortfolioTechnologies" ADD CONSTRAINT "_PortfolioTechnologies_A_fkey" FOREIGN KEY ("A") REFERENCES "portfolio_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PortfolioTechnologies" ADD CONSTRAINT "_PortfolioTechnologies_B_fkey" FOREIGN KEY ("B") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_ServiceBlogPosts" ("A" TEXT NOT NULL, "B" TEXT NOT NULL);
CREATE UNIQUE INDEX "_ServiceBlogPosts_AB_unique" ON "_ServiceBlogPosts"("A", "B");
CREATE INDEX "_ServiceBlogPosts_B_index" ON "_ServiceBlogPosts"("B");
ALTER TABLE "_ServiceBlogPosts" ADD CONSTRAINT "_ServiceBlogPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ServiceBlogPosts" ADD CONSTRAINT "_ServiceBlogPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_RelatedServices" ("A" TEXT NOT NULL, "B" TEXT NOT NULL);
CREATE UNIQUE INDEX "_RelatedServices_AB_unique" ON "_RelatedServices"("A", "B");
CREATE INDEX "_RelatedServices_B_index" ON "_RelatedServices"("B");
ALTER TABLE "_RelatedServices" ADD CONSTRAINT "_RelatedServices_A_fkey" FOREIGN KEY ("A") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_RelatedServices" ADD CONSTRAINT "_RelatedServices_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
