import { describe, it, expect } from "vitest";
import { prisma } from "./setup";

describe("Database Seed Integrity", () => {
  // ─── Patterns ──────────────────────────────────────────────────

  it("should have exactly 10 patterns seeded", async () => {
    const count = await prisma.pattern.count();
    expect(count).toBe(10);
  });

  it("should have patterns numbered 1 through 10", async () => {
    const patterns = await prisma.pattern.findMany({
      orderBy: { number: "asc" },
      select: { number: true },
    });
    expect(patterns.map((p) => p.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("should have all expected pattern names", async () => {
    const patterns = await prisma.pattern.findMany({
      orderBy: { number: "asc" },
      select: { name: true },
    });
    const expected = [
      "Math & Modulo", "Arrays & Hashing", "Two Pointers", "Sliding Window",
      "Binary Search", "Strings", "Stack & Queue", "Sorting + Greedy",
      "Recursion & Basic Trees", "Linked Lists",
    ];
    expect(patterns.map((p) => p.name)).toEqual(expected);
  });

  it("should have recognition cues for every pattern", async () => {
    const patterns = await prisma.pattern.findMany({ select: { name: true, recognitionCues: true } });
    for (const p of patterns) {
      expect(p.recognitionCues, `${p.name} missing recognition cues`).toBeTruthy();
      expect(p.recognitionCues.length).toBeGreaterThan(10);
    }
  });

  it("should have code templates for every pattern", async () => {
    const patterns = await prisma.pattern.findMany({ select: { name: true, template: true } });
    for (const p of patterns) {
      expect(p.template, `${p.name} missing template`).toBeTruthy();
      expect(p.template.length).toBeGreaterThan(20);
    }
  });

  it("should have flowchart hints for every pattern", async () => {
    const patterns = await prisma.pattern.findMany({ select: { name: true, flowchartHint: true } });
    for (const p of patterns) {
      expect(p.flowchartHint, `${p.name} missing flowchartHint`).toBeTruthy();
    }
  });

  // ─── Problems ──────────────────────────────────────────────────

  it("should have 36 problems seeded", async () => {
    const count = await prisma.problem.count();
    expect(count).toBe(36);
  });

  it("should have every problem linked to a valid pattern", async () => {
    const problems = await prisma.problem.findMany({ include: { pattern: true } });
    for (const p of problems) {
      expect(p.pattern, `Problem #${p.leetcodeNumber} has no pattern`).toBeTruthy();
      expect(p.pattern.number).toBeGreaterThanOrEqual(1);
      expect(p.pattern.number).toBeLessThanOrEqual(10);
    }
  });

  it("should have valid LeetCode URLs for every problem", async () => {
    const problems = await prisma.problem.findMany({ select: { url: true } });
    for (const p of problems) {
      expect(p.url).toMatch(/^https:\/\/leetcode\.com\/problems\//);
    }
  });

  it("should have only EASY or MEDIUM difficulties", async () => {
    const problems = await prisma.problem.findMany({ select: { difficulty: true } });
    for (const p of problems) {
      expect(["EASY", "MEDIUM"]).toContain(p.difficulty);
    }
  });

  it("should have starred problems including key ones", async () => {
    const starred = await prisma.problem.findMany({
      where: { isStarred: true },
      select: { leetcodeNumber: true },
    });
    const nums = starred.map((p) => p.leetcodeNumber);
    expect(nums).toContain(1);   // Two Sum
    expect(nums).toContain(206); // Reverse Linked List
    expect(nums).toContain(704); // Binary Search
  });

  it("should have problems assigned to days in the 31-day plan", async () => {
    const planned = await prisma.problem.findMany({
      where: { dayInPlan: { not: null } },
      orderBy: { dayInPlan: "asc" },
    });
    expect(planned.length).toBeGreaterThanOrEqual(20);
    expect(planned[0].dayInPlan).toBe(1);
  });

  it("should have correct week assignments for planned problems", async () => {
    const problems = await prisma.problem.findMany({
      where: { weekInPlan: { not: null }, dayInPlan: { not: null } },
    });
    for (const p of problems) {
      if (p.dayInPlan! <= 7) expect(p.weekInPlan).toBe(1);
      else if (p.dayInPlan! <= 14) expect(p.weekInPlan).toBe(2);
      else if (p.dayInPlan! <= 21) expect(p.weekInPlan).toBe(3);
      else if (p.dayInPlan! <= 28) expect(p.weekInPlan).toBe(4);
      else expect(p.weekInPlan).toBe(5);
    }
  });

  it("should have at least 2 problems per pattern", async () => {
    const patterns = await prisma.pattern.findMany({
      include: { _count: { select: { problems: true } } },
    });
    for (const p of patterns) {
      expect(p._count.problems, `"${p.name}" has only ${p._count.problems} problem(s)`).toBeGreaterThanOrEqual(2);
    }
  });
});
