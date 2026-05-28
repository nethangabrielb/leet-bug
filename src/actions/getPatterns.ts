"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getPatternsWithStats() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  const patterns = await prisma.pattern.findMany({
    include: {
      problems: {
        select: {
          id: true,
          practiceLogs: {
            where: { userId },
            orderBy: { date: "desc" },
            take: 1,
            select: { confidence: true }
          },
          repetitionItems: {
            where: { userId, status: "CLEARED" },
            take: 1,
            select: { id: true },
          },
        },
      },
    },
    orderBy: { number: "asc" },
  });

  return patterns.map((p) => {
    const total = p.problems.length;
    const solved = p.problems.filter((pr) => pr.practiceLogs.length > 0).length;
    const green = p.problems.filter(
      (pr) =>
        (pr.practiceLogs.length > 0 && pr.practiceLogs[0].confidence === "GREEN") ||
        pr.repetitionItems.length > 0
    ).length;
    const mastery = total > 0 ? Math.round((green / total) * 100) : 0;
    return { ...p, total, solved, green, mastery };
  });
}
