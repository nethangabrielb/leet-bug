"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { cache } from "react";

import { auth } from "@/lib/auth";
const getSession = cache(async () => await auth.api.getSession({ headers: await headers() }));
import prisma from "@/lib/prisma";

export async function addToRepetitionQueue(data: {
  problemId: string;
  firstResult: "RED" | "YELLOW" | "GREEN";
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const daysToAdd = data.firstResult === "RED" ? 3 : 7;
  const resolveDate = new Date();
  resolveDate.setDate(resolveDate.getDate() + daysToAdd);

  return prisma.repetitionItem.create({
    data: {
      userId: session.user.id,
      problemId: data.problemId,
      firstAttemptDate: new Date(),
      firstResult: data.firstResult,
      resolveDate,
      status: "ACTIVE",
    },
  });
}

export async function updateRepetitionResult(data: {
  repetitionId: string;
  result: "RED" | "YELLOW" | "GREEN";
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  if (data.result === "GREEN") {
    // Move to cleared
    return prisma.repetitionItem.update({
      where: { id: data.repetitionId, userId: session.user.id },
      data: {
        resolveResult: data.result,
        status: "CLEARED",
        clearedDate: new Date(),
      },
    });
  }

  // Schedule next resolve
  const daysToAdd = data.result === "RED" ? 3 : 7;
  const nextResolveDate = new Date();
  nextResolveDate.setDate(nextResolveDate.getDate() + daysToAdd);

  return prisma.repetitionItem.update({
    where: { id: data.repetitionId, userId: session.user.id },
    data: {
      resolveResult: data.result,
      resolveDate: nextResolveDate,
    },
  });
}

export async function getActiveRepetitions() {
  const session = await getSession();
  if (!session) redirect("/login");

  return prisma.repetitionItem.findMany({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: { problem: { include: { pattern: true } } },
    orderBy: { resolveDate: "asc" },
  });
}

export async function getClearedRepetitions() {
  const session = await getSession();
  if (!session) redirect("/login");

  return prisma.repetitionItem.findMany({
    where: { userId: session.user.id, status: "CLEARED" },
    include: { problem: { include: { pattern: true } } },
    orderBy: { clearedDate: "desc" },
  });
}
