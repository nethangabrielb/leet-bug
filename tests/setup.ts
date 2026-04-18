import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../orm/generated/prisma/client";

// ─── Shared Prisma instance for all tests ──────────────────────────
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });

// ─── Test user IDs ─────────────────────────────────────────────────
export const TEST_USER_ID = "test-user-e2e-001";
export const TEST_USER = {
  id: TEST_USER_ID,
  name: "Test Runner",
  email: "testrunner@leetcode-tracker.test",
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Ensures the test user exists. Call at the start of each test file's beforeAll.
 */
export async function ensureTestUser() {
  await prisma.user.upsert({
    where: { id: TEST_USER_ID },
    update: {},
    create: TEST_USER,
  });
}

/**
 * Clean up all test data for the test user. Call in afterAll.
 */
export async function cleanupTestUser() {
  await prisma.dailyCheckIn.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.repetitionItem.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.practiceLog.deleteMany({ where: { userId: TEST_USER_ID } });
}
