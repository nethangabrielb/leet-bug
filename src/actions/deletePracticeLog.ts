"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function deletePracticeLog(logId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  // Find the log first to ensure it exists and belongs to user
  const log = await prisma.practiceLog.findUnique({
    where: { id: logId, userId },
  });

  if (!log) {
    throw new Error("Practice log not found or unauthorized");
  }

  // Count how many logs exist for this problem for this user
  const problemLogsCount = await prisma.practiceLog.count({
    where: { problemId: log.problemId, userId },
  });

  // Delete the practice log
  await prisma.practiceLog.delete({
    where: { id: logId },
  });

  // If this was the ONLY log for this problem, wipe any associated Spaced Repetition items
  if (problemLogsCount === 1) {
    await prisma.repetitionItem.deleteMany({
      where: { problemId: log.problemId, userId },
    });
  }

  return { success: true };
}
