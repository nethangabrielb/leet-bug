import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "./setup";

const CHECKIN_USER_ID = "test-checkin-user-005";

beforeAll(async () => {
  await prisma.dailyCheckIn.deleteMany({ where: { userId: CHECKIN_USER_ID } });
  await prisma.repetitionItem.deleteMany({ where: { userId: CHECKIN_USER_ID } });
  await prisma.practiceLog.deleteMany({ where: { userId: CHECKIN_USER_ID } });

  await prisma.user.upsert({
    where: { id: CHECKIN_USER_ID },
    update: {},
    create: {
      id: CHECKIN_USER_ID, name: "Checkin Test", email: "checkin@test.com",
      emailVerified: true, createdAt: new Date(), updatedAt: new Date(),
    },
  });
});

afterAll(async () => {
  await prisma.dailyCheckIn.deleteMany({ where: { userId: CHECKIN_USER_ID } });
  await prisma.repetitionItem.deleteMany({ where: { userId: CHECKIN_USER_ID } });
  await prisma.practiceLog.deleteMany({ where: { userId: CHECKIN_USER_ID } });
  await prisma.user.deleteMany({ where: { id: CHECKIN_USER_ID } });
});

describe("Daily Check-In Logic", () => {
  it("should create a daily check-in", async () => {
    const today = new Date(); const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkIn = await prisma.dailyCheckIn.create({
      data: {
        userId: CHECKIN_USER_ID, date: dateOnly,
        block1Done: true, block2Done: false, block3Done: false, block4Done: false,
        notes: "Just started morning warm-up",
      },
    });
    expect(checkIn.block1Done).toBe(true);
    expect(checkIn.block2Done).toBe(false);
    expect(checkIn.notes).toBe("Just started morning warm-up");
  });

  it("should upsert (update) the same day's check-in", async () => {
    const today = new Date(); const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const updated = await prisma.dailyCheckIn.upsert({
      where: { userId_date: { userId: CHECKIN_USER_ID, date: dateOnly } },
      create: {
        userId: CHECKIN_USER_ID, date: dateOnly,
        block1Done: true, block2Done: true, block3Done: true, block4Done: true,
      },
      update: {
        block1Done: true, block2Done: true, block3Done: false, block4Done: false,
        notes: "Completed blocks 1 & 2",
      },
    });
    expect(updated.block2Done).toBe(true);
    expect(updated.block3Done).toBe(false);
    expect(updated.notes).toBe("Completed blocks 1 & 2");
  });

  it("should retrieve by composite key userId_date", async () => {
    const today = new Date(); const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkIn = await prisma.dailyCheckIn.findUnique({
      where: { userId_date: { userId: CHECKIN_USER_ID, date: dateOnly } },
    });
    expect(checkIn).toBeTruthy();
    expect(checkIn!.block1Done).toBe(true);
  });

  it("should count completed blocks correctly", async () => {
    const today = new Date(); const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkIn = await prisma.dailyCheckIn.findUnique({
      where: { userId_date: { userId: CHECKIN_USER_ID, date: dateOnly } },
    });
    const completed = [checkIn!.block1Done, checkIn!.block2Done, checkIn!.block3Done, checkIn!.block4Done].filter(Boolean).length;
    expect(completed).toBe(2);
  });
});
