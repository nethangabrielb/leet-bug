import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma, TEST_USER_ID, ensureTestUser, cleanupTestUser } from "./setup";

const SR_USER_ID = "test-sr-user-002";

let redProblem: { id: string };
let yellowProblem: { id: string };
let greenProblem: { id: string };

beforeAll(async () => {
  // Use a separate user for SR tests to avoid race conditions
  await prisma.repetitionItem.deleteMany({ where: { userId: SR_USER_ID } });
  await prisma.practiceLog.deleteMany({ where: { userId: SR_USER_ID } });
  await prisma.dailyCheckIn.deleteMany({ where: { userId: SR_USER_ID } });
  await prisma.user.upsert({
    where: { id: SR_USER_ID },
    update: {},
    create: {
      id: SR_USER_ID, name: "SR Test", email: "sr@test.com",
      emailVerified: true, createdAt: new Date(), updatedAt: new Date(),
    },
  });

  redProblem = (await prisma.problem.findFirst({ where: { leetcodeNumber: 11 } }))!;
  yellowProblem = (await prisma.problem.findFirst({ where: { leetcodeNumber: 125 } }))!;
  greenProblem = (await prisma.problem.findFirst({ where: { leetcodeNumber: 167 } }))!;
});

afterAll(async () => {
  await prisma.repetitionItem.deleteMany({ where: { userId: SR_USER_ID } });
  await prisma.practiceLog.deleteMany({ where: { userId: SR_USER_ID } });
  await prisma.dailyCheckIn.deleteMany({ where: { userId: SR_USER_ID } });
  await prisma.user.deleteMany({ where: { id: SR_USER_ID } });
});

describe("Spaced Repetition Logic", () => {
  it("should add a RED problem with +3 day resolve", async () => {
    const now = new Date();
    const resolve = new Date(now); resolve.setDate(resolve.getDate() + 3);
    const item = await prisma.repetitionItem.create({
      data: {
        userId: SR_USER_ID, problemId: redProblem.id,
        firstAttemptDate: now, firstResult: "RED", resolveDate: resolve, status: "ACTIVE",
      },
    });
    expect(item.status).toBe("ACTIVE");
    expect(item.firstResult).toBe("RED");
    const diff = Math.round((item.resolveDate!.getTime() - now.getTime()) / 86400000);
    expect(diff).toBe(3);
  });

  it("should add a YELLOW problem with +7 day resolve", async () => {
    const now = new Date();
    const resolve = new Date(now); resolve.setDate(resolve.getDate() + 7);
    const item = await prisma.repetitionItem.create({
      data: {
        userId: SR_USER_ID, problemId: yellowProblem.id,
        firstAttemptDate: now, firstResult: "YELLOW", resolveDate: resolve, status: "ACTIVE",
      },
    });
    expect(item.firstResult).toBe("YELLOW");
    const diff = Math.round((item.resolveDate!.getTime() - now.getTime()) / 86400000);
    expect(diff).toBe(7);
  });

  it("should retrieve active items with problem joins", async () => {
    const items = await prisma.repetitionItem.findMany({
      where: { userId: SR_USER_ID, status: "ACTIVE" },
      include: { problem: { include: { pattern: true } } },
      orderBy: { resolveDate: "asc" },
    });
    expect(items.length).toBe(2);
    for (const item of items) {
      expect(item.problem.title).toBeTruthy();
      expect(item.problem.pattern.name).toBeTruthy();
    }
  });

  it("should detect overdue items", async () => {
    const pastDate = new Date(); pastDate.setDate(pastDate.getDate() - 1);
    await prisma.repetitionItem.create({
      data: {
        userId: SR_USER_ID, problemId: greenProblem.id,
        firstAttemptDate: new Date(Date.now() - 86400000 * 4),
        firstResult: "RED", resolveDate: pastDate, status: "ACTIVE",
      },
    });
    const due = await prisma.repetitionItem.findMany({
      where: { userId: SR_USER_ID, status: "ACTIVE", resolveDate: { lte: new Date() } },
    });
    expect(due.length).toBeGreaterThanOrEqual(1);
  });

  it("should clear an item on GREEN result", async () => {
    const item = await prisma.repetitionItem.findFirst({
      where: { userId: SR_USER_ID, status: "ACTIVE", problemId: greenProblem.id },
    });
    const cleared = await prisma.repetitionItem.update({
      where: { id: item!.id },
      data: { resolveResult: "GREEN", status: "CLEARED", clearedDate: new Date() },
    });
    expect(cleared.status).toBe("CLEARED");
    expect(cleared.resolveResult).toBe("GREEN");
    expect(cleared.clearedDate).toBeTruthy();
  });

  it("should reschedule on RED result (+3 days)", async () => {
    const item = await prisma.repetitionItem.findFirst({
      where: { userId: SR_USER_ID, status: "ACTIVE", problemId: redProblem.id },
    });
    expect(item).toBeTruthy();
    const now = new Date();
    const next = new Date(now); next.setDate(next.getDate() + 3);
    const updated = await prisma.repetitionItem.update({
      where: { id: item!.id },
      data: { resolveResult: "RED", resolveDate: next },
    });
    expect(updated.resolveResult).toBe("RED");
    const diff = Math.round((updated.resolveDate!.getTime() - now.getTime()) / 86400000);
    expect(diff).toBe(3);
  });

  it("should correctly separate active vs cleared", async () => {
    const active = await prisma.repetitionItem.count({ where: { userId: SR_USER_ID, status: "ACTIVE" } });
    const cleared = await prisma.repetitionItem.count({ where: { userId: SR_USER_ID, status: "CLEARED" } });
    expect(active).toBeGreaterThanOrEqual(1);
    expect(cleared).toBeGreaterThanOrEqual(1);
  });
});
