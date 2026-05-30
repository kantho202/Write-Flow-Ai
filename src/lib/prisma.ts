import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const DB_URL =
  process.env.DATABASE_URL ||
  "file:b:/Programing-hero-course/WriteFlowAi/writeflow-ai/prisma/dev.db";

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: DB_URL });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
