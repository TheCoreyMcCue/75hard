"use client";

import { useState } from "react";
import { DayDetailModal } from "./day-detail-modal";
import type { Challenge, DailyLog } from "@/lib/types";

type Props = {
  challenge: Challenge;
  logs: DailyLog[];
  today: number;
};

type CellState = "complete" | "partial" | "empty" | "future" | "today";

function cellClasses(state: CellState, isToday: boolean): string {
  const base = "h-7 w-7 rounded-md transition-all";
  const ring = isToday
    ? " ring-2 ring-white ring-offset-2 ring-offset-[#050810]"
    : "";
  switch (state) {
    case "complete":
      return (
        base +
        " accent-gradient hover:brightness-110 shadow-[0_0_10px_-3px_rgba(45,212,191,0.6)]" +
        ring
      );
    case "partial":
      return base + " bg-amber-400/80 hover:bg-amber-400" + ring;
    case "empty":
      return base + " bg-white/[0.06] hover:bg-white/[0.12]" + ring;
    case "future":
      return base + " bg-white/[0.02]" + ring;
    case "today":
      return base + " bg-white/[0.08] hover:bg-white/[0.14]" + ring;
  }
}

export function ChallengeGrid({ challenge, logs, today }: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const logByDay = new Map<number, DailyLog>();
  for (const log of logs) logByDay.set(log.dayNumber, log);

  const days = Array.from({ length: challenge.durationDays }, (_, i) => i + 1);
  const completedCount = logs.filter((l) => l.allCompleted).length;

  function stateFor(day: number): CellState {
    if (day > today) return "future";
    const log = logByDay.get(day);
    if (!log || log.completedTaskIds.length === 0) {
      return day === today ? "today" : "empty";
    }
    if (log.allCompleted) return "complete";
    return "partial";
  }

  function dateFor(day: number): Date {
    const start = new Date(challenge.startDate);
    const d = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + (day - 1)),
    );
    return d;
  }

  const selectedLog = selectedDay != null ? logByDay.get(selectedDay) : undefined;

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
            Progress
          </p>
          <p className="text-2xl font-black tracking-tight text-white mt-1">
            {completedCount}
            <span className="text-white/30 text-lg font-bold ml-1">
              / {challenge.durationDays} days
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
          <Legend gradient label="Done" />
          <Legend color="bg-amber-400/80" label="Partial" />
          <Legend color="bg-white/10" label="Empty" />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {days.map((day) => {
          const state = stateFor(day);
          const isToday = day === today;
          const isFuture = day > today;
          const log = logByDay.get(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => !isFuture && setSelectedDay(day)}
              disabled={isFuture}
              className={cellClasses(state, isToday) + (isFuture ? " cursor-not-allowed" : "")}
              aria-label={
                isFuture
                  ? `Day ${day} (future)`
                  : `Day ${day}, ${log?.completedTaskIds.length ?? 0} of ${challenge.tasks.length} tasks`
              }
              title={`Day ${day}`}
            />
          );
        })}
      </div>

      {selectedDay != null && (
        <DayDetailModal
          challengeId={challenge.challengeId}
          dayNumber={selectedDay}
          date={dateFor(selectedDay)}
          tasks={challenge.tasks}
          initialCompletedTaskIds={selectedLog?.completedTaskIds ?? []}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </section>
  );
}

function Legend({
  color,
  gradient,
  label,
}: {
  color?: string;
  gradient?: boolean;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={`h-3 w-3 rounded-sm ${gradient ? "accent-gradient" : (color ?? "")}`}
        aria-hidden
      />
      {label}
    </span>
  );
}
