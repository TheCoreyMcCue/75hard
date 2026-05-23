"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleTaskAction } from "@/lib/actions/challenge";
import type { Task } from "@/lib/types";

type Props = {
  challengeId: string;
  dayNumber: number;
  date: Date;
  tasks: Task[];
  initialCompletedTaskIds: string[];
  onClose: () => void;
};

export function DayDetailModal({
  challengeId,
  dayNumber,
  date,
  tasks,
  initialCompletedTaskIds,
  onClose,
}: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompletedTaskIds));
  const [pending, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);

  function toggle(taskId: string) {
    const next = new Set(completed);
    if (next.has(taskId)) next.delete(taskId);
    else next.add(taskId);
    setCompleted(next);
    setDirty(true);

    startTransition(async () => {
      await toggleTaskAction(challengeId, dayNumber, taskId);
    });
  }

  function close() {
    if (dirty) router.refresh();
    onClose();
  }

  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-[#0b1020] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
              Day {dayNumber}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">{dateLabel}</h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-white/50 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="divide-y divide-white/5 rounded-xl border border-white/10 overflow-hidden">
          {tasks.map((task) => {
            const done = completed.has(task.id);
            return (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => toggle(task.id)}
                  disabled={pending}
                  className="group flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-white/[0.03] disabled:cursor-wait"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all ${
                      done
                        ? "accent-gradient text-slate-950 shadow-[0_0_10px_-3px_rgba(45,212,191,0.6)]"
                        : "border-2 border-white/15 group-hover:border-white/30"
                    }`}
                    aria-hidden
                  >
                    {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                  <span
                    className={`flex-1 text-sm font-medium ${
                      done ? "text-white/30 line-through" : "text-white"
                    }`}
                  >
                    {task.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={close}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
