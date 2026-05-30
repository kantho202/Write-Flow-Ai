import path from "node:path";
import { defineConfig } from "prisma/config";

const DB_URL = "file:b:/Programing-hero-course/WriteFlowAi/writeflow-ai/prisma/dev.db";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: DB_URL,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
  migrate: {
    async adapter() {
      const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
      return new PrismaBetterSqlite3({ url: DB_URL });
    },
  },
});
