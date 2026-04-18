import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "./setup";

const PRAC_USER_ID = "test-prac-user-004";

beforeAll(async () => {
  await prisma.dailyCheckIn.deleteMany({ where: { userId: PRAC_USER_ID } });
  await prisma.repetitionItem.deleteMany({ where: { userId: PRAC_USER_ID } });
  await prisma.practiceLog.deleteMany({ where: { userId: PRAC_USER_ID } });

  await prisma.user.upsert({
    where: { id: PRAC_USER_ID },
    update: {},
    create: {
      id: PRAC_USER_ID, name: "Practice Test", email: "prac@test.com",
      emailVerified: true, createdAt: new Date(), updatedAt: new Date(),
    },
  });
});

afterAll(async () => {
  await prisma.dailyCheckIn.deleteMany({ where: { userId: PRAC_USER_ID } });
  await prisma.repetitionItem.deleteMany({ where: { userId: PRAC_USER_ID } });
  await prisma.practiceLog.deleteMany({ where: { userId: PRAC_USER_ID } });
  await prisma.user.deleteMany({ where: { id: PRAC_USER_ID } });
});

describe("Practice Log Logic", () => {
  it("should create a GREEN practice log entry", async () => {
    const problem = await prisma.problem.findFirst({ where: { leetcodeNumber: 1 } });
    const log = await prisma.practiceLog.create({
      data: {
        userId: PRAC_USER_ID, problemId: problem!.id, day: 1,
        timeTaken: 15, timeLimit: 20, solved: "YES", confidence: "GREEN",
        patternUsed: "Arrays & Hashing", keyInsight: "Use Map for O(1) lookup",
      },
    });
    expect(log.id).toBeTruthy();
    expect(log.confidence).toBe("GREEN");
    expect(log.solved).toBe("YES");
  });

  it("should create a RED practice log entry", async () => {
    const problem = await prisma.problem.findFirst({ where: { leetcodeNumber: 217 } });
    const log = await prisma.practiceLog.create({
      data: {
        userId: PRAC_USER_ID, problemId: problem!.id, day: 2,
        timeTaken: 25, timeLimit: 20, solved: "NO", confidence: "RED",
        trippedUp: "Couldn't think of using a Set",
      },
    });
    expect(log.confidence).toBe("RED");
    expect(log.solved).toBe("NO");
  });

  it("should create a YELLOW practice log entry", async () => {
    const problem = await prisma.problem.findFirst({ where: { leetcodeNumber: 242 } });
    const log = await prisma.practiceLog.create({
      data: {
        userId: PRAC_USER_ID, problemId: problem!.id, day: 3,
        timeTaken: 18, timeLimit: 20, solved: "PARTIAL", confidence: "YELLOW",
        trippedUp: "Edge case with empty strings",
      },
    });
    expect(log.confidence).toBe("YELLOW");
    expect(log.solved).toBe("PARTIAL");
  });

  it("should retrieve logs with problem and pattern joins", async () => {
    const logs = await prisma.practiceLog.findMany({
      where: { userId: PRAC_USER_ID },
      include: { problem: { include: { pattern: true } } },
      orderBy: { date: "desc" },
    });
    expect(logs.length).toBeGreaterThanOrEqual(3);
    for (const log of logs) {
      expect(log.problem.title).toBeTruthy();
      expect(log.problem.pattern.name).toBeTruthy();
    }
  });

  it("should filter logs by confidence", async () => {
    const red = await prisma.practiceLog.count({ where: { userId: PRAC_USER_ID, confidence: "RED" } });
    const yellow = await prisma.practiceLog.count({ where: { userId: PRAC_USER_ID, confidence: "YELLOW" } });
    const green = await prisma.practiceLog.count({ where: { userId: PRAC_USER_ID, confidence: "GREEN" } });
    expect(red).toBeGreaterThanOrEqual(1);
    expect(yellow).toBeGreaterThanOrEqual(1);
    expect(green).toBeGreaterThanOrEqual(1);
  });

  it("should track unique days completed", async () => {
    const logs = await prisma.practiceLog.findMany({
      where: { userId: PRAC_USER_ID }, select: { day: true },
    });
    const uniqueDays = new Set(logs.map((l) => l.day).filter(Boolean));
    expect(uniqueDays.size).toBeGreaterThanOrEqual(3);
  });
});
