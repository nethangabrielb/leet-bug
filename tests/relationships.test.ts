import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma, ensureTestUser, cleanupTestUser } from "./setup";

beforeAll(async () => { await ensureTestUser(); });
afterAll(async () => { await cleanupTestUser(); });

describe("Data Relationships & Query Patterns", () => {
  it("should query problems with pattern joins", async () => {
    const problems = await prisma.problem.findMany({
      include: { pattern: true },
      orderBy: [{ dayInPlan: "asc" }, { leetcodeNumber: "asc" }],
      take: 10,
    });
    expect(problems.length).toBe(10);
    for (const p of problems) {
      expect(p.pattern).toBeTruthy();
      expect(p.leetcodeNumber).toBeGreaterThan(0);
    }
  });

  it("should query pattern with all its problems", async () => {
    const pattern = await prisma.pattern.findFirst({
      where: { number: 2 },
      include: { problems: { orderBy: { leetcodeNumber: "asc" } } },
    });
    expect(pattern!.name).toBe("Arrays & Hashing");
    expect(pattern!.problems.length).toBe(5);
    expect(pattern!.problems[0].leetcodeNumber).toBe(1);
  });

  it("should filter problems by difficulty correctly", async () => {
    const easy = await prisma.problem.count({ where: { difficulty: "EASY" } });
    const medium = await prisma.problem.count({ where: { difficulty: "MEDIUM" } });
    expect(easy + medium).toBe(36);
    expect(easy).toBeGreaterThan(0);
    expect(medium).toBeGreaterThan(0);
  });

  it("should filter by week in plan", async () => {
    const week1 = await prisma.problem.count({ where: { weekInPlan: 1 } });
    const week2 = await prisma.problem.count({ where: { weekInPlan: 2 } });
    expect(week1).toBeGreaterThan(0);
    expect(week2).toBeGreaterThan(0);
  });

  it("should handle the full practice→repetition→clear flow", async () => {
    const tempId = "temp-flow-test-user";
    const problem = (await prisma.problem.findFirst({ where: { leetcodeNumber: 15 } }))!;

    await prisma.user.create({
      data: {
        id: tempId, name: "Flow", email: "flow@test.com",
        emailVerified: true, createdAt: new Date(), updatedAt: new Date(),
      },
    });

    // Step 1: Log as RED
    const log = await prisma.practiceLog.create({
      data: {
        userId: tempId, problemId: problem.id, day: 13,
        timeTaken: 40, timeLimit: 35, solved: "NO", confidence: "RED",
      },
    });
    expect(log.confidence).toBe("RED");

    // Step 2: Add to queue
    const resolve = new Date(); resolve.setDate(resolve.getDate() + 3);
    const rep = await prisma.repetitionItem.create({
      data: {
        userId: tempId, problemId: problem.id,
        firstAttemptDate: new Date(), firstResult: "RED", resolveDate: resolve, status: "ACTIVE",
      },
    });
    expect(rep.status).toBe("ACTIVE");

    // Step 3: Re-solve → GREEN → clear
    const cleared = await prisma.repetitionItem.update({
      where: { id: rep.id },
      data: { resolveResult: "GREEN", status: "CLEARED", clearedDate: new Date() },
    });
    expect(cleared.status).toBe("CLEARED");

    // Cleanup
    await prisma.repetitionItem.deleteMany({ where: { userId: tempId } });
    await prisma.practiceLog.deleteMany({ where: { userId: tempId } });
    await prisma.user.delete({ where: { id: tempId } });
  });
});
