"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function checkInDaily(data: {
  date?: Date;
  block1Done: boolean;
  block2Done: boolean;
  block3Done: boolean;
  block4Done: boolean;
  notes?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const checkDate = data.date || new Date();
  const dateOnly = new Date(
    checkDate.getFullYear(),
    checkDate.getMonth(),
    checkDate.getDate()
  );

  return prisma.dailyCheckIn.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date: dateOnly,
      },
    },
    create: {
      userId: session.user.id,
      date: dateOnly,
      block1Done: data.block1Done,
      block2Done: data.block2Done,
      block3Done: data.block3Done,
      block4Done: data.block4Done,
      notes: data.notes || null,
    },
    update: {
      block1Done: data.block1Done,
      block2Done: data.block2Done,
      block3Done: data.block3Done,
      block4Done: data.block4Done,
      notes: data.notes || null,
    },
  });
}

export async function getTodayCheckIn() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const today = new Date();
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return prisma.dailyCheckIn.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date: dateOnly,
      },
    },
  });
}
