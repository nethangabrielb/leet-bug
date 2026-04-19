"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function markReviewDayComplete(day: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  // Verify the user's active Spaced Repetition queue is empty
  const dueToday = await prisma.repetitionItem.count({
    where: {
      userId,
      status: "ACTIVE",
      resolveDate: { lte: new Date(new Date().setHours(23, 59, 59, 999)) },
    },
  });

  if (dueToday > 0) {
    throw new Error("Cannot pass Review Day with active due items");
  }

  // Update the user array by pushing the day onto it
  await prisma.user.update({
    where: { id: userId },
    data: {
      passedReviewDays: { push: day },
    },
  });

  return { success: true };
}
