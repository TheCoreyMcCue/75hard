"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { startChallengeAction } from "@/lib/actions/challenge";
import { newTaskId } from "@/lib/challenge-helpers";
import type { Task } from "@/lib/types";

type Props = {
  initialTasks: Task[];
  durationDays: number;
};

export function SetupForm({ initialTasks, durationDays: initialDuration }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [durationDays, setDurationDays] = useState(initialDuration);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function addTask() {
    setTasks((prev) => [...prev, { id: newTaskId(), label: "", description: "" }]);
  }

  function openConfirm() {
    setError(null);
    const cleaned = tasks
      .map((t) => ({ ...t, label: t.label.trim() }))
      .filter((t) => t.label.length > 0);
    if (cleaned.length === 0) {
      setError("Add at least one task before starting.");
      return;
    }
    setTasks(cleaned);
    setConfirmOpen(true);
  }

  function startChallenge() {
    startTransition(async () => {
      const result = await startChallengeAction(tasks, durationDays);
      if (result?.error) {
        setError(result.error);
        setConfirmOpen(false);
      }
    });
  }

  return (
    <>
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
            Daily tasks
          </h2>
          <span className="text-xs text-white/40">{tasks.length} total</span>
        </div>

        <ul className="space-y-2.5">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-3"
            >
              <div className="flex items-start gap-2">
                <Input
                  value={task.label}
                  onChange={(e) => updateTask(task.id, { label: e.target.value })}
                  placeholder="Task name (e.g. Drink 1 gallon of water)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => removeTask(task.id)}
                  aria-label="Remove task"
                  className="shrink-0 px-2 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={task.description ?? ""}
                onChange={(e) => updateTask(task.id, { description: e.target.value })}
                placeholder="Optional notes"
                className="text-xs"
              />
            </li>
          ))}
        </ul>

        <Button type="button" variant="outline" onClick={addTask} className="w-full">
          <Plus className="h-4 w-4" /> Add task
        </Button>
      </div>

      <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
        <label
          htmlFor="duration"
          className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/60"
        >
          Challenge length (days)
        </label>
        <Input
          id="duration"
          type="number"
          min={1}
          max={365}
          value={durationDays}
          onChange={(e) => setDurationDays(Number(e.target.value) || 1)}
          className="w-32"
        />
        <p className="text-xs text-white/40">Standard 75 Hard is 75 days.</p>
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="button" size="lg" onClick={openConfirm}>
          Start challenge
        </Button>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          taskCount={tasks.length}
          durationDays={durationDays}
          pending={pending}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={startChallenge}
        />
      )}
    </>
  );
}

function ConfirmDialog({
  taskCount,
  durationDays,
  pending,
  onCancel,
  onConfirm,
}: {
  taskCount: number;
  durationDays: number;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-[#0b1020] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white">Lock in your challenge?</h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="text-white/50 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">
          Once you start, your {taskCount} task{taskCount === 1 ? "" : "s"} and the {durationDays}
          -day length are locked. You won&apos;t be able to add, edit, or remove tasks until the
          challenge ends — or you miss a day and reset.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={pending}>
            {pending ? "Starting…" : "Start challenge"}
          </Button>
        </div>
      </div>
    </div>
  );
}
