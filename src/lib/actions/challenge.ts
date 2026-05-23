"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import {
  createChallenge,
  getActiveChallenge,
  getChallenge,
  updateChallengeStatus,
} from "@/lib/db/challenges";
import { getDailyLog, upsertDailyLog } from "@/lib/db/daily-logs";
import { STANDARD_DURATION_DAYS, type Task } from "@/lib/types";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
  return userId;
}

const taskSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1, "Task label required").max(200),
  description: z.string().max(500).optional(),
});

const startChallengeSchema = z.object({
  tasks: z.array(taskSchema).min(1, "Add at least one task"),
  durationDays: z.number().int().min(1).max(365).optional(),
});

export type StartChallengeResult = { error?: string };

export async function startChallengeAction(
  tasks: Task[],
  durationDays: number = STANDARD_DURATION_DAYS,
): Promise<StartChallengeResult> {
  const userId = await requireUserId();

  const parsed = startChallengeSchema.safeParse({ tasks, durationDays });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid challenge setup" };
  }

  const existing = await getActiveChallenge(userId);
  if (existing) {
    return { error: "You already have an active challenge" };
  }

  await createChallenge(userId, parsed.data.tasks, parsed.data.durationDays ?? STANDARD_DURATION_DAYS);
  revalidatePath("/");
  redirect("/");
}

export async function toggleTaskAction(
  challengeId: string,
  dayNumber: number,
  taskId: string,
): Promise<void> {
  const userId = await requireUserId();

  const [existing, challenge] = await Promise.all([
    getDailyLog(userId, challengeId, dayNumber),
    getChallenge(userId, challengeId),
  ]);
  if (!challenge) return;
  const totalTasks = challenge.tasks.length;

  const completed = new Set(existing?.completedTaskIds ?? []);
  if (completed.has(taskId)) {
    completed.delete(taskId);
  } else {
    completed.add(taskId);
  }

  const completedList = [...completed];

  await upsertDailyLog({
    userId,
    challengeId,
    dayNumber,
    date: existing?.date ?? new Date().toISOString().slice(0, 10),
    completedTaskIds: completedList,
    allCompleted: totalTasks > 0 && completedList.length === totalTasks,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function resetChallengeAction(challengeId: string): Promise<void> {
  const userId = await requireUserId();
  const active = await getActiveChallenge(userId);
  if (!active || active.challengeId !== challengeId) {
    return;
  }

  await updateChallengeStatus(userId, challengeId, "failed");
  await createChallenge(userId, active.tasks, active.durationDays);

  revalidatePath("/");
  revalidatePath("/history");
}

export async function completeChallengeAction(challengeId: string): Promise<void> {
  const userId = await requireUserId();
  await updateChallengeStatus(userId, challengeId, "completed");
  revalidatePath("/");
  revalidatePath("/history");
}
