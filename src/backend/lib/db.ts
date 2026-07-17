import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { startStockCheckJob } from "../services/stock-check.job";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  stockCheckStarted: boolean | undefined;
};

const connectionString = process.env.DATABASE_URL;

export const db =
  globalForPrisma.prisma ??
  (() => {
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not defined");
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Start stock check job in the background if in standard server context (not build/test)
if (
  process.env.NEXT_PHASE !== "phase-production-build" &&
  process.env.NODE_ENV !== "test" &&
  typeof window === "undefined" &&
  !process.env.PRISMA_CLI_BINARY_TARGETS
) {
  if (!globalForPrisma.stockCheckStarted) {
    globalForPrisma.stockCheckStarted = true;
    startStockCheckJob(db);
  }
}
