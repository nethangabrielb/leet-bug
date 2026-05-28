"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getDashboardStats(tzOffset?: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  // Compute "now" in the user's local timezone.
  // tzOffset is minutes BEHIND UTC (e.g. UTC+8 → -480).
  // If not provided, fall back to the server's local time.
  const serverNow = new Date();
  const offsetMs =
    tzOffset != null
      ? (serverNow.getTimezoneOffset() - tzOffset) * 60_000
      : 0;
  const now = new Date(serverNow.getTime() + offsetMs);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Fire independent queries concurrently
  const userPromise = prisma.user.findUnique({
    where: { id: userId },
    select: { passedReviewDays: true },
  });

  const logsPromise = prisma.practiceLog.findMany({
    where: { userId },
    select: {
      day: true,
      date: true,
      confidence: true,
      problemId: true,
      problem: { select: { dayInPlan: true } },
    },
    orderBy: { date: "desc" },
  });

  const dueTodayPromise = prisma.repetitionItem.count({
    where: {
      userId,
      status: "ACTIVE",
      resolveDate: { lte: new Date(today.getTime() + 86400000) },
    },
  });

  // Week starts on Monday to match the UI labels (Mon–Sun).
  // getDay(): 0=Sun,1=Mon,...,6=Sat → days since Monday = (day + 6) % 7
  const daysSinceMonday = (now.getDay() + 6) % 7;
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - daysSinceMonday);

  const weekLogsPromise = prisma.practiceLog.count({
    where: {
      userId,
      date: { gte: weekStart },
    },
  });

  const patternStatsPromise = prisma.pattern.findMany({
    include: {
      problems: {
        include: {
          practiceLogs: {
            where: { userId },
            orderBy: { date: "desc" },
            take: 1,
          },
          repetitionItems: {
            where: { userId, status: "CLEARED" },
            take: 1,
          },
        },
      },
    },
    orderBy: { number: "asc" },
  });

  // Await all parallel promises
  const [user, logs, dueToday, weekLogs, patternStats] = await Promise.all([
    userPromise,
    logsPromise,
    dueTodayPromise,
    weekLogsPromise,
    patternStatsPromise,
  ]);


  // Confidence breakdown
  const confidenceCounts = { RED: 0, YELLOW: 0, GREEN: 0 };
  for (const log of logs) {
    confidenceCounts[log.confidence]++;
  }

  // Streak calculation (consecutive dates in the user's local time)
  // Shift each log date by the offset so the UTC date string matches local calendar days.
  const logDates = [
    ...new Set(
      logs.map((l) => {
        const d = l.date instanceof Date ? l.date : new Date(l.date as string);
        return new Date(d.getTime() + offsetMs).toISOString().split("T")[0];
      })
    ),
  ].sort((a, b) => b.localeCompare(a));

  let streak = 0;
  const checkDate = new Date(today);

  for (const dateStr of logDates) {
    const checkStr = checkDate.toISOString().split("T")[0];
    if (dateStr === checkStr) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (dateStr < checkStr) {
      break;
    }
  }

  // Count passed review days correctly into the progress tally
  // Use the log's day field if set, otherwise fall back to the problem's dayInPlan
  const rawUniqueDays = new Set(
    logs.map((l) => l.day ?? l.problem.dayInPlan).filter(Boolean)
  );
  const passedReviewDays = user?.passedReviewDays || [];
  
  // Total completed days equals unique practiced days PLUS passed review days
  const completedDaysSet = new Set([...rawUniqueDays, ...passedReviewDays]);
  const daysCompleted = completedDaysSet.size;

  // Today's problems from 31-day plan
  const nextDay =
    daysCompleted < 31
      ? daysCompleted + 1
      : 31;

  const reviewDays = [7, 14, 21, 28];
  const isReviewDay = reviewDays.includes(nextDay);
  const isReviewDayBlocked = isReviewDay && dueToday > 0;

  const todayProblems = await prisma.problem.findMany({
    where: { dayInPlan: nextDay },
    include: { pattern: true },
  });

  const patternMastery = patternStats.map((p) => {
    const totalProblems = p.problems.length;
    const solved = p.problems.filter(
      (prob) => prob.practiceLogs.length > 0
    ).length;
    const greenCount = p.problems.filter(
      (prob) =>
        (prob.practiceLogs.length > 0 &&
          prob.practiceLogs[0].confidence === "GREEN") ||
        prob.repetitionItems.length > 0
    ).length;

    return {
      id: p.id,
      number: p.number,
      name: p.name,
      totalProblems,
      solved,
      greenCount,
      mastery: totalProblems > 0 ? Math.round((greenCount / totalProblems) * 100) : 0,
    };
  });

  return {
    daysCompleted,
    totalDays: 31,
    confidenceCounts,
    streak,
    dueToday,
    weeklyDone: weekLogs,
    weeklyTarget: 7,
    currentDay: nextDay,
    todayProblems,
    patternMastery,
    totalLogs: logs.length,
    isReviewDay,
    isReviewDayBlocked,
  };
}
