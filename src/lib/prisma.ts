import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton — prevents exhausting database connections
 * during Next.js dev-mode hot reloading, where modules re-evaluate on
 * every change. In production (a single long-lived process per
 * serverless invocation or server instance) this just returns one
 * instance as normal.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
