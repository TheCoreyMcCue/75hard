"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayDetailModal } from "@/components/day-detail-modal";
import type { Challenge, DailyLog } from "@/lib/types";

type Props = {
  challenge: Challenge;
  logs: DailyLog[];
  today: number;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfDayUtc(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function diffInDays(from: number, to: number): number {
  return Math.floor((to - from) / (1000 * 60 * 60 * 24));
}

export function CalendarView({ challenge, logs, today }: Props) {
  const startUtc = useMemo(() => startOfDayUtc(new Date(challenge.startDate)), [challenge.startDate]);
  const todayUtc = startUtc + (today - 1) * 86_400_000;
  const lastChallengeDayUtc = startUtc + (challenge.durationDays - 1) * 86_400_000;

  const initial = new Date(todayUtc);
  const [year, setYear] = useState(initial.getUTCFullYear());
  const [month, setMonth] = useState(initial.getUTCMonth());
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);

  const logByDay = useMemo(() => {
    const m = new Map<number, DailyLog>();
    for (const log of logs) m.set(log.dayNumber, log);
    return m;
  }, [logs]);

  function shiftMonth(delta: number) {
    let m = month + delta;
    let y = year;
    while (m < 0) {
      m += 12;
      y -= 1;
    }
    while (m > 11) {
      m -= 12;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  const firstOfMonthUtc = Date.UTC(year, month, 1);
  const firstDow = new Date(firstOfMonthUtc).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells: ({ date: Date; dayUtc: number; dayNumber: number | null } | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dayUtc = Date.UTC(year, month, d);
    const inRange = dayUtc >= startUtc && dayUtc <= lastChallengeDayUtc;
    const dayNumber = inRange ? diffInDays(startUtc, dayUtc) + 1 : null;
    cells.push({ date: new Date(dayUtc), dayUtc, dayNumber });
  }

  const monthLabel = new Date(firstOfMonthUtc).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const selectedDate = selectedDayNumber != null ? new Date(startUtc + (selectedDayNumber - 1) * 86_400_000) : null;
  const selectedLog = selectedDayNumber != null ? logByDay.get(selectedDayNumber) : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={() => shiftMonth(-1)} aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-base font-bold tracking-tight text-white">{monthLabel}</p>
        <Button variant="ghost" size="sm" onClick={() => shiftMonth(1)} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cell, idx) => {
            if (!cell) return <div key={idx} className="aspect-square" />;
            const { date, dayUtc, dayNumber } = cell;
            const inChallenge = dayNumber != null;
            const isFuture = inChallenge && dayUtc > todayUtc;
            const isToday = dayUtc === todayUtc;
            const log = dayNumber != null ? logByDay.get(dayNumber) : undefined;

            let bg = "bg-white/[0.02] text-white/20";
            if (inChallenge && !isFuture) {
              if (log?.allCompleted)
                bg = "accent-gradient text-slate-950 hover:brightness-110 shadow-[0_0_12px_-4px_rgba(45,212,191,0.6)]";
              else if ((log?.completedTaskIds.length ?? 0) > 0)
                bg = "bg-amber-400/80 text-amber-950 hover:bg-amber-400";
              else bg = "bg-white/[0.06] text-white hover:bg-white/[0.10]";
            } else if (isFuture) {
              bg = "bg-white/[0.02] text-white/30";
            }

            const ring = isToday ? " ring-2 ring-white ring-offset-2 ring-offset-[#050810]" : "";
            const clickable = inChallenge && !isFuture;

            return (
              <button
                key={idx}
                type="button"
                disabled={!clickable}
                onClick={() => dayNumber != null && setSelectedDayNumber(dayNumber)}
                className={`aspect-square rounded-lg text-sm font-semibold transition-all ${bg}${ring} ${
                  clickable ? "cursor-pointer" : "cursor-default"
                }`}
                aria-label={
                  inChallenge
                    ? `Day ${dayNumber}, ${date.toLocaleDateString()}`
                    : date.toLocaleDateString()
                }
              >
                <span className="flex h-full flex-col items-center justify-center">
                  <span>{date.getUTCDate()}</span>
                  {inChallenge && (
                    <span className="text-[9px] opacity-70 font-medium">D{dayNumber}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-white/50">
        <Legend gradient label="All done" />
        <Legend color="bg-amber-400/80" label="Partial" />
        <Legend color="bg-white/10" label="Empty" />
      </div>

      {selectedDayNumber != null && selectedDate && (
        <DayDetailModal
          challengeId={challenge.challengeId}
          dayNumber={selectedDayNumber}
          date={selectedDate}
          tasks={challenge.tasks}
          initialCompletedTaskIds={selectedLog?.completedTaskIds ?? []}
          onClose={() => setSelectedDayNumber(null)}
        />
      )}
    </div>
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
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`h-3 w-3 rounded-sm ${gradient ? "accent-gradient" : (color ?? "")}`}
        aria-hidden
      />
      {label}
    </span>
  );
}
