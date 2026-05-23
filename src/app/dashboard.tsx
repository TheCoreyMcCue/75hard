"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, RotateCcw, History as HistoryIcon, Calendar as CalendarIcon, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Celebration } from "@/components/celebration";
import { ChallengeGrid } from "@/components/challenge-grid";
import {
  resetChallengeAction,
  toggleTaskAction,
  completeChallengeAction,
  abandonChallengeAction,
} from "@/lib/actions/challenge";
import { logoutAction } from "@/lib/actions/auth";
import type { Challenge, DailyLog } from "@/lib/types";

type Props = {
  challenge: Challenge;
  dayNumber: number;
  completedTaskIds: string[];
  allLogs: DailyLog[];
};

export function Dashboard({ challenge, dayNumber, completedTaskIds, allLogs }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedTaskIds));
  const [resetOpen, setResetOpen] = useState(false);
  const [abandonOpen, setAbandonOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [celebrating, setCelebrating] = useState(false);
  const [acknowledged, setAcknowledged] = useState(
    completedTaskIds.length === challenge.tasks.length && challenge.tasks.length > 0,
  );

  const allDone = challenge.tasks.length > 0 && completed.size === challenge.tasks.length;
  const challengeOver = dayNumber >= challenge.durationDays && allDone;

  const progress = useMemo(() => {
    if (challenge.tasks.length === 0) return 0;
    return Math.round((completed.size / challenge.tasks.length) * 100);
  }, [completed.size, challenge.tasks.length]);

  function toggle(taskId: string) {
    const wasDone = completed.has(taskId);
    const next = new Set(completed);
    if (wasDone) next.delete(taskId);
    else next.add(taskId);
    setCompleted(next);

    const becomingAllDone =
      !wasDone && next.size === challenge.tasks.length && challenge.tasks.length > 0;
    if (becomingAllDone && !acknowledged) {
      setCelebrating(true);
      setAcknowledged(true);
    }

    startTransition(async () => {
      await toggleTaskAction(challenge.challengeId, dayNumber, taskId);
    });
  }

  function confirmReset() {
    startTransition(async () => {
      await resetChallengeAction(challenge.challengeId);
      setResetOpen(false);
    });
  }

  function confirmAbandon() {
    startTransition(async () => {
      await abandonChallengeAction(challenge.challengeId);
      setAbandonOpen(false);
    });
  }

  function finishChallenge() {
    startTransition(async () => {
      await completeChallengeAction(challenge.challengeId);
    });
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <Hero
          dayNumber={dayNumber}
          durationDays={challenge.durationDays}
          progress={progress}
        />

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
          <ul className="divide-y divide-white/5">
            {challenge.tasks.map((task) => {
              const done = completed.has(task.id);
              return (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => toggle(task.id)}
                    disabled={pending}
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03] disabled:cursor-wait"
                  >
                    <span
                      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                        done
                          ? "accent-gradient text-slate-950 shadow-[0_0_16px_-2px_rgba(45,212,191,0.55)]"
                          : "border-2 border-white/15 bg-transparent group-hover:border-white/30"
                      }`}
                      aria-hidden
                    >
                      {done && <Check className="h-4 w-4" strokeWidth={3} />}
                    </span>
                    <span className="flex-1">
                      <span
                        className={`block text-base font-medium tracking-tight ${
                          done ? "text-white/30 line-through" : "text-white"
                        }`}
                      >
                        {task.label}
                      </span>
                      {task.description && (
                        <span
                          className={`block text-sm ${
                            done ? "text-white/20" : "text-white/40"
                          }`}
                        >
                          {task.description}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {challengeOver && (
          <section className="rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/10 p-6 text-center space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              You finished the challenge.
            </h2>
            <p className="text-sm text-white/70">
              {challenge.durationDays} days, locked in. Mark it complete to archive it.
            </p>
            <div className="flex justify-center pt-1">
              <Button onClick={finishChallenge} disabled={pending}>
                Mark complete
              </Button>
            </div>
          </section>
        )}

        <ChallengeGrid challenge={challenge} logs={allLogs} today={dayNumber} />

        <section className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
            Manage challenge
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="flex-1 space-y-2">
              <p className="text-sm text-white/60 leading-relaxed">
                Missed a task? Strict 75 Hard rule: reset to Day 1 with the same rules.
              </p>
              <Button
                variant="danger"
                onClick={() => setResetOpen(true)}
                className="w-full whitespace-nowrap sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" /> I missed a day
              </Button>
            </div>
            <div className="hidden sm:block w-px bg-white/10" aria-hidden />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-white/60 leading-relaxed">
                Want to start over with different rules? End this challenge first.
              </p>
              <Button
                variant="outline"
                onClick={() => setAbandonOpen(true)}
                className="w-full whitespace-nowrap sm:w-auto"
              >
                <XCircle className="h-4 w-4" /> End challenge
              </Button>
            </div>
          </div>
        </section>
      </main>

      {resetOpen && (
        <ResetDialog
          pending={pending}
          onCancel={() => setResetOpen(false)}
          onConfirm={confirmReset}
        />
      )}

      {abandonOpen && (
        <AbandonDialog
          pending={pending}
          onCancel={() => setAbandonOpen(false)}
          onConfirm={confirmAbandon}
        />
      )}

      {celebrating && (
        <Celebration onDone={() => setCelebrating(false)} dayNumber={dayNumber} />
      )}
    </div>
  );
}

function AbandonDialog({
  pending,
  onCancel,
  onConfirm,
}: {
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
        <h2 className="text-xl font-bold tracking-tight text-white">End this challenge?</h2>
        <p className="text-sm text-white/60 leading-relaxed">
          Your current attempt will be archived as abandoned. You&apos;ll be able to set up a new
          challenge with different rules. This can&apos;t be undone.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={pending}>
            {pending ? "Ending…" : "End challenge"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Hero({
  dayNumber,
  durationDays,
  progress,
}: {
  dayNumber: number;
  durationDays: number;
  progress: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-30 blur-3xl accent-gradient"
        aria-hidden
      />
      <div className="relative flex items-end justify-between gap-6">
        <div className="flex items-end gap-3">
          <div className="h-20 w-1 rounded-full accent-gradient mb-3" aria-hidden />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Today
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="block text-7xl font-black tracking-[-0.05em] leading-none text-white">
                {dayNumber}
              </span>
              <span className="text-2xl font-bold tracking-tight text-white/30">
                / {durationDays}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
            Progress
          </p>
          <p className="text-3xl font-black tracking-tight accent-text mt-1">{progress}%</p>
        </div>
      </div>
      <div className="relative mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full accent-gradient transition-all duration-500 shadow-[0_0_12px_rgba(45,212,191,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}

function Header() {
  return (
    <header className="border-b border-white/5 backdrop-blur-md bg-black/20 sticky top-0 z-30">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="block h-5 w-1 rounded-full accent-gradient"
            aria-hidden
          />
          <span className="text-sm font-black uppercase tracking-[0.18em] text-white">
            75 Hard
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/calendar">
            <Button variant="ghost" size="sm">
              <CalendarIcon className="h-4 w-4" /> Calendar
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="ghost" size="sm">
              <HistoryIcon className="h-4 w-4" /> History
            </Button>
          </Link>
          <form action={logoutAction}>
            <Button variant="ghost" size="sm" type="submit">
              Log out
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}

function ResetDialog({
  pending,
  onCancel,
  onConfirm,
}: {
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
        <h2 className="text-xl font-bold tracking-tight text-white">Reset to Day 1?</h2>
        <p className="text-sm text-white/60 leading-relaxed">
          Your current attempt will be archived as failed. A fresh challenge will start today using
          the same tasks and length. This can&apos;t be undone.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={pending}>
            {pending ? "Resetting…" : "Reset challenge"}
          </Button>
        </div>
      </div>
    </div>
  );
}
