import { beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "../src/lib/prisma.js";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  const tableNames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;

  for (const { tablename } of tableNames) {
    if (tablename === "_prisma_migrations") {
      continue;
    }

    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE`
    );
  }
});
