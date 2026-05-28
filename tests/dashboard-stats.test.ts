import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "./setup";

const DASH_USER_ID = "test-dash-user-003";

beforeAll(async () => {
  // Clean and setup dedicated user
  await prisma.dailyCheckIn.deleteMany({ where: { userId: DASH_USER_ID } });
  await prisma.repetitionItem.deleteMany({ where: { userId: DASH_USER_ID } });
  await prisma.practiceLog.deleteMany({ where: { userId: DASH_USER_ID } });

  await prisma.user.upsert({
    where: { id: DASH_USER_ID },
    update: {},
    create: {
      id: DASH_USER_ID, name: "Dash Test", email: "dash@test.com",
      emailVerified: true, createdAt: new Date(), updatedAt: new Date(),
    },
  });

  const p1 = (await prisma.problem.findFirst({ where: { leetcodeNumber: 1 } }))!;
  const p2 = (await prisma.problem.findFirst({ where: { leetcodeNumber: 217 } }))!;
  const p3 = (await prisma.problem.findFirst({ where: { leetcodeNumber: 242 } }))!;

  await prisma.practiceLog.createMany({
    data: [
      { userId: DASH_USER_ID, problemId: p1.id, day: 1, solved: "YES", confidence: "GREEN" },
      { userId: DASH_USER_ID, problemId: p2.id, day: 2, solved: "NO", confidence: "RED" },
      { userId: DASH_USER_ID, problemId: p3.id, day: 3, solved: "PARTIAL", confidence: "YELLOW" },
    ],
  });
});

afterAll(async () => {
  await prisma.dailyCheckIn.deleteMany({ where: { userId: DASH_USER_ID } });
  await prisma.repetitionItem.deleteMany({ where: { userId: DASH_USER_ID } });
  await prisma.practiceLog.deleteMany({ where: { userId: DASH_USER_ID } });
  await prisma.user.deleteMany({ where: { id: DASH_USER_ID } });
});

describe("Dashboard Stats Logic", () => {
  it("should compute unique days completed", async () => {
    const logs = await prisma.practiceLog.findMany({ where: { userId: DASH_USER_ID }, select: { day: true } });
    const uniqueDays = new Set(logs.map((l) => l.day).filter(Boolean));
    expect(uniqueDays.size).toBe(3);
  });

  it("should compute confidence counts", async () => {
    const logs = await prisma.practiceLog.findMany({ where: { userId: DASH_USER_ID }, select: { confidence: true } });
    const counts = { RED: 0, YELLOW: 0, GREEN: 0 };
    for (const l of logs) counts[l.confidence]++;
    expect(counts).toEqual({ RED: 1, YELLOW: 1, GREEN: 1 });
  });

  it("should have a streak >= 1 for today's logs", async () => {
    const logs = await prisma.practiceLog.findMany({
      where: { userId: DASH_USER_ID }, select: { date: true }, orderBy: { date: "desc" },
    });
    const dates = [...new Set(logs.map((l) => l.date.toISOString().split("T")[0]))].sort((a, b) => b.localeCompare(a));
    let streak = 0;
    const check = new Date();
    const checkStr = check.toISOString().split("T")[0];
    const checkDate = new Date(checkStr + "T00:00:00.000Z");
    for (const d of dates) {
      const currentCheckStr = checkDate.toISOString().split("T")[0];
      if (d === currentCheckStr) {
        streak++;
        checkDate.setUTCDate(checkDate.getUTCDate() - 1);
      } else {
        break;
      }
    }
    expect(streak).toBeGreaterThanOrEqual(1);
  });

  it("should compute pattern mastery for Arrays & Hashing", async () => {
    const pattern = await prisma.pattern.findFirst({
      where: { number: 2 },
      include: {
        problems: {
          include: { practiceLogs: { where: { userId: DASH_USER_ID }, orderBy: { date: "desc" }, take: 1 } },
        },
      },
    });
    const solved = pattern!.problems.filter((p) => p.practiceLogs.length > 0).length;
    const mastery = Math.round((solved / pattern!.problems.length) * 100);
    expect(solved).toBeGreaterThanOrEqual(1);
    expect(mastery).toBeGreaterThanOrEqual(0);
    expect(mastery).toBeLessThanOrEqual(100);
  });

  it("should count weekly practice sessions", async () => {
    const now = new Date();
    const weekStart = new Date(now); weekStart.setDate(weekStart.getDate() - now.getDay()); weekStart.setHours(0, 0, 0, 0);
    const count = await prisma.practiceLog.count({
      where: { userId: DASH_USER_ID, date: { gte: weekStart } },
    });
    expect(count).toBe(3);
  });

  it("should retrieve today's problems from 31-day plan", async () => {
    const problems = await prisma.problem.findMany({
      where: { dayInPlan: 4 },
      include: { pattern: true },
    });
    expect(problems.length).toBeGreaterThanOrEqual(1);
    for (const p of problems) expect(p.pattern.name).toBeTruthy();
  });
});
