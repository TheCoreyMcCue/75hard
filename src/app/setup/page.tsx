import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getActiveChallenge } from "@/lib/db/challenges";
import { STANDARD_75HARD_TASKS, STANDARD_DURATION_DAYS, type Task } from "@/lib/types";
import { SetupForm } from "./setup-form";

export default async function SetupPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const active = await getActiveChallenge(userId);
  if (active) redirect("/");

  const seedTasks: Task[] = STANDARD_75HARD_TASKS.map((t, idx) => ({
    id: `seed-${idx}`,
    label: t.label,
    description: t.description,
  }));

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="block h-5 w-1 rounded-full accent-gradient" aria-hidden />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60">
              Setup
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Set up your <span className="accent-text">challenge</span>.
          </h1>
          <p className="text-white/50 leading-relaxed">
            Pre-filled with the standard 75 Hard rules. Edit, add, or remove tasks now — once you
            start, these are locked for the duration.
          </p>
        </header>
        <SetupForm initialTasks={seedTasks} durationDays={STANDARD_DURATION_DAYS} />
      </div>
    </div>
  );
}
