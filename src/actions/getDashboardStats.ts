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

  // Streak calculation (consecutive dates in the user's local time - Asia/Manila)
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const logDates = [
    ...new Set(
      logs.map((l) => {
        const d = l.date instanceof Date ? l.date : new Date(l.date as string);
        return formatter.format(d);
      })
    ),
  ].sort((a, b) => b.localeCompare(a));

  const localTodayStr = formatter.format(new Date());
  const localYesterdayStr = formatter.format(new Date(Date.now() - 86400000));

  let streak = 0;
  if (logDates.length > 0) {
    const mostRecentLogStr = logDates[0];
    if (mostRecentLogStr === localTodayStr || mostRecentLogStr === localYesterdayStr) {
      let checkDate = new Date(mostRecentLogStr);
      for (const dateStr of logDates) {
        const checkStr = formatter.format(checkDate);
        if (dateStr === checkStr) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  // Count passed review days correctly into the progress tally
  // Use the log's day field if set, otherwise fall back to the problem's dayInPlan
  const rawUniqueDays = new Set(
    logs.map((l) => l.day ?? l.problem?.dayInPlan).filter(Boolean)
  );
  const passedReviewDays = user?.passedReviewDays || [];
  
  // Total completed days equals unique practiced days PLUS passed review days
  const completedDaysSet = new Set([...rawUniqueDays, ...passedReviewDays]);
  const daysCompleted = completedDaysSet.size;

  // Prompt 2 & 3 Debug Logging
  console.log("=== DEBUG DAYS COMPLETED ===");
  console.log("User ID:", userId);
  console.log("Passed Review Days:", passedReviewDays);
  console.log("Raw logs in DB:", logs.map(l => ({ problemId: l.problemId, day: l.day, problemDay: l.problem?.dayInPlan, date: l.date })));
  console.log("Raw Unique Days:", Array.from(rawUniqueDays));
  console.log("Completed Days Set:", Array.from(completedDaysSet));
  console.log("============================");

  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  console.log("=== DEBUG WEEKLY PROGRESS ===");
  console.log("weekStart (UTC/Local):", weekStart.toISOString(), "/", weekStart.toString());
  console.log("weekEnd (UTC/Local):", weekEnd.toISOString(), "/", weekEnd.toString());
  for (const l of logs) {
    const isGte = l.date >= weekStart;
    console.log(`Log Date: ${l.date.toISOString()} | problemId: ${l.problemId} | isGte: ${isGte}`);
  }
  console.log("weekLogs count query result:", weekLogs);
  console.log("=============================");

  // Find the first uncompleted day in the 31-day sequence (self-healing for skipped days)
  let nextDay = 31;
  for (let d = 1; d <= 31; d++) {
    if (!completedDaysSet.has(d)) {
      nextDay = d;
      break;
    }
  }

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
