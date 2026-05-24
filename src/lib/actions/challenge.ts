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
import { log } from "@/lib/log";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    log.warn("auth.unauthenticated_request");
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
  log.info("challenge.start_attempt", {
    userId,
    taskCount: tasks.length,
    durationDays,
  });

  const parsed = startChallengeSchema.safeParse({ tasks, durationDays });
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? "Invalid challenge setup";
    log.warn("challenge.start_invalid", { userId, issue });
    return { error: issue };
  }

  const existing = await getActiveChallenge(userId);
  if (existing) {
    log.warn("challenge.start_rejected_active_exists", {
      userId,
      existingChallengeId: existing.challengeId,
    });
    return { error: "You already have an active challenge" };
  }

  const challenge = await createChallenge(
    userId,
    parsed.data.tasks,
    parsed.data.durationDays ?? STANDARD_DURATION_DAYS,
  );
  log.info("challenge.started", {
    userId,
    challengeId: challenge.challengeId,
    taskCount: challenge.tasks.length,
    durationDays: challenge.durationDays,
  });

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
  if (!challenge) {
    log.warn("challenge.toggle_missing_challenge", { userId, challengeId, dayNumber });
    return;
  }
  const totalTasks = challenge.tasks.length;

  const completed = new Set(existing?.completedTaskIds ?? []);
  const wasCompleted = completed.has(taskId);
  if (wasCompleted) completed.delete(taskId);
  else completed.add(taskId);

  const completedList = [...completed];
  const allDone = totalTasks > 0 && completedList.length === totalTasks;

  await upsertDailyLog({
    userId,
    challengeId,
    dayNumber,
    date: existing?.date ?? new Date().toISOString().slice(0, 10),
    completedTaskIds: completedList,
    allCompleted: allDone,
    updatedAt: new Date().toISOString(),
  });

  log.info("challenge.task_toggled", {
    userId,
    challengeId,
    dayNumber,
    taskId,
    nowCompleted: !wasCompleted,
    dayProgress: `${completedList.length}/${totalTasks}`,
    dayFullyDone: allDone,
  });

  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function resetChallengeAction(challengeId: string): Promise<void> {
  const userId = await requireUserId();
  const active = await getActiveChallenge(userId);
  if (!active || active.challengeId !== challengeId) {
    log.warn("challenge.reset_no_op", { userId, requestedChallengeId: challengeId });
    return;
  }

  await updateChallengeStatus(userId, challengeId, "failed");
  const fresh = await createChallenge(userId, active.tasks, active.durationDays);

  log.info("challenge.reset", {
    userId,
    failedChallengeId: challengeId,
    newChallengeId: fresh.challengeId,
  });

  revalidatePath("/");
  revalidatePath("/history");
}

export async function completeChallengeAction(challengeId: string): Promise<void> {
  const userId = await requireUserId();
  await updateChallengeStatus(userId, challengeId, "completed");
  log.info("challenge.completed", { userId, challengeId });
  revalidatePath("/");
  revalidatePath("/history");
}

export async function abandonChallengeAction(challengeId: string): Promise<void> {
  const userId = await requireUserId();
  const active = await getActiveChallenge(userId);
  if (!active || active.challengeId !== challengeId) {
    log.warn("challenge.abandon_no_op", { userId, requestedChallengeId: challengeId });
    return;
  }

  await updateChallengeStatus(userId, challengeId, "abandoned");
  log.info("challenge.abandoned", { userId, challengeId });

  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath("/calendar");
}
