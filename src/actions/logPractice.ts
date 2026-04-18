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
    const daysToAdd = data.confidence === "RED" ? 3 : 4;
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
