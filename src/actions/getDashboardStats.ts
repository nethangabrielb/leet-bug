"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Fire independent queries concurrently
  const logsPromise = prisma.practiceLog.findMany({
    where: { userId },
    select: { day: true, date: true, confidence: true, problemId: true },
    orderBy: { date: "desc" },
  });

  const dueTodayPromise = prisma.repetitionItem.count({
    where: {
      userId,
      status: "ACTIVE",
      resolveDate: { lte: new Date(today.getTime() + 86400000) },
    },
  });

  const dayOfWeek = now.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - dayOfWeek);

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
        },
      },
    },
    orderBy: { number: "asc" },
  });

  // Await all parallel promises
  const [logs, dueToday, weekLogs, patternStats] = await Promise.all([
    logsPromise,
    dueTodayPromise,
    weekLogsPromise,
    patternStatsPromise,
  ]);

  const uniqueDays = new Set(logs.map((l) => l.day).filter(Boolean));
  const daysCompleted = uniqueDays.size;

  // Confidence breakdown
  const confidenceCounts = { RED: 0, YELLOW: 0, GREEN: 0 };
  for (const log of logs) {
    confidenceCounts[log.confidence]++;
  }

  // Streak calculation (consecutive dates)
  const logDates = [
    ...new Set(
      logs.map((l) => {
        if (l.date instanceof Date) return l.date.toISOString().split("T")[0];
        return new Date(l.date as string).toISOString().split("T")[0];
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

  // Today's problems from 31-day plan
  const nextDay =
    daysCompleted < 31
      ? daysCompleted + 1
      : 31;

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
        prob.practiceLogs.length > 0 &&
        prob.practiceLogs[0].confidence === "GREEN"
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
  };
}
