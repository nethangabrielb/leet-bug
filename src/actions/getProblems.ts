"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getProblems(filters?: {
  patternId?: string;
  difficulty?: "EASY" | "MEDIUM";
  weekInPlan?: number;
  isStarred?: boolean;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const where: Record<string, unknown> = {};
  if (filters?.patternId) where.patternId = filters.patternId;
  if (filters?.difficulty) where.difficulty = filters.difficulty;
  if (filters?.weekInPlan) where.weekInPlan = filters.weekInPlan;
  if (filters?.isStarred !== undefined) where.isStarred = filters.isStarred;

  return prisma.problem.findMany({
    where,
    include: {
      pattern: {
        select: { id: true, name: true }
      },
      practiceLogs: {
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
        take: 1,
        select: { confidence: true }
      },
    },
    orderBy: [{ dayInPlan: "asc" }, { leetcodeNumber: "asc" }],
  });
}

export async function getProblemById(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return prisma.problem.findUnique({
    where: { id },
    include: {
      pattern: true,
      practiceLogs: {
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
      },
      repetitionItems: {
        where: { userId: session.user.id },
      },
    },
  });
}

export async function getAllProblemsWithPatterns() {
  return prisma.problem.findMany({
    include: { pattern: true },
    orderBy: [{ dayInPlan: "asc" }, { leetcodeNumber: "asc" }],
  });
}

export async function getPracticeLogs(filters?: {
  confidence?: "RED" | "YELLOW" | "GREEN";
  patternId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const where: Record<string, unknown> = { userId: session.user.id };
  if (filters?.confidence) where.confidence = filters.confidence;

  if (filters?.dateFrom || filters?.dateTo) {
    where.date = {};
    if (filters?.dateFrom)
      (where.date as Record<string, unknown>).gte = filters.dateFrom;
    if (filters?.dateTo)
      (where.date as Record<string, unknown>).lte = filters.dateTo;
  }

  const logs = await prisma.practiceLog.findMany({
    where,
    include: {
      problem: {
        include: { pattern: true },
      },
    },
    orderBy: { date: "desc" },
  });

  // Filter by pattern after the fact if needed
  if (filters?.patternId) {
    return logs.filter((l) => l.problem.patternId === filters.patternId);
  }

  return logs;
}
