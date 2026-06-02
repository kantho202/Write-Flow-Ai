import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    database: {
      url: process.env.DATABASE_URL!,
    },
    seed: "npx tsx prisma/seed.ts",
  },
});
