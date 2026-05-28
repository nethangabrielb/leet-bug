"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function logPractice(data: {
  problemId: string;
  day?: number | null;
  timeTaken?: number | null;
  timeLimit?: number | null;
  solved: "YES" | "NO" | "PARTIAL";
  confidence: "RED" | "YELLOW" | "GREEN";
  patternUsed?: string;
  trippedUp?: string;
  keyInsight?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  // 1. Verify if user is currently blocked by a Review Day
  // Re-calculate the current day state
  const userPromise = prisma.user.findUnique({
    where: { id: userId },
    select: { passedReviewDays: true },
  });

  const logsPromise = prisma.practiceLog.findMany({
    where: { userId },
    select: { day: true, problem: { select: { dayInPlan: true } } },
  });

  const dueTodayPromise = prisma.repetitionItem.count({
    where: {
      userId,
      status: "ACTIVE",
      resolveDate: { lte: new Date(new Date().setHours(23, 59, 59, 999)) },
    },
  });

  const [user, logs, dueToday] = await Promise.all([userPromise, logsPromise, dueTodayPromise]);

  const rawUniqueDays = new Set(
    logs.map((l) => l.day ?? l.problem.dayInPlan).filter(Boolean)
  );
  const passedReviewDays = user?.passedReviewDays || [];
  
  const completedDaysSet = new Set([...rawUniqueDays, ...passedReviewDays]);
  const daysCompleted = completedDaysSet.size;

  let nextDay = 31;
  for (let d = 1; d <= 31; d++) {
    if (!completedDaysSet.has(d)) {
      nextDay = d;
      break;
    }
  }
  const reviewDays = [7, 14, 21, 28];
  const isReviewDayBlocked = reviewDays.includes(nextDay) && dueToday > 0;

  if (isReviewDayBlocked) {
    throw new Error("Review Day! You must clear your Spaced Repetition queue before progressing.");
  }

  const log = await prisma.practiceLog.create({
    data: {
      userId: session.user.id,
      problemId: data.problemId,
      day: data.day,
      timeTaken: data.timeTaken,
      timeLimit: data.timeLimit,
      solved: data.solved,
      confidence: data.confidence,
      patternUsed: data.patternUsed || null,
      trippedUp: data.trippedUp || null,
      keyInsight: data.keyInsight || null,
    },
  });

  // If confidence is RED or YELLOW, auto-create a spaced repetition entry
  if (data.confidence === "RED" || data.confidence === "YELLOW") {
    const daysToAdd = data.confidence === "RED" ? 3 : 7;
    const resolveDate = new Date();
    resolveDate.setDate(resolveDate.getDate() + daysToAdd);

    // Check if already in the queue
    const existing = await prisma.repetitionItem.findFirst({
      where: {
        userId: session.user.id,
        problemId: data.problemId,
        status: "ACTIVE",
      },
    });

    if (!existing) {
      await prisma.repetitionItem.create({
        data: {
          userId: session.user.id,
          problemId: data.problemId,
          firstAttemptDate: new Date(),
          firstResult: data.confidence,
          resolveDate,
          status: "ACTIVE",
        },
      });
    }
  }

  return log;
}
