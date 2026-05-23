import type { Challenge } from "./types";

export function newTaskId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `task-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function dayNumberForChallenge(challenge: Challenge, now: Date = new Date()): number {
  const start = new Date(challenge.startDate);
  const startMidnight = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const nowMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dayIndex = Math.floor((nowMidnight - startMidnight) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(dayIndex + 1, 1), challenge.durationDays);
}
