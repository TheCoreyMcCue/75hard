import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getActiveChallenge } from "@/lib/db/challenges";
import { getDailyLog, listDailyLogs } from "@/lib/db/daily-logs";
import { dayNumberForChallenge } from "@/lib/challenge-helpers";
import { Button } from "@/components/ui/button";
import { Dashboard } from "./dashboard";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const active = await getActiveChallenge(userId);
  if (!active) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="block h-6 w-1 rounded-full accent-gradient" aria-hidden />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
                75 Hard
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white">
              Ready when <span className="accent-text">you are</span>.
            </h1>
            <p className="text-white/50 text-lg">
              No active challenge. Start one to begin tracking.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Link href="/setup">
              <Button size="lg">Set up a challenge</Button>
            </Link>
            <Link href="/history">
              <Button size="lg" variant="outline">
                View history
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dayNumber = dayNumberForChallenge(active);
  const [log, allLogs] = await Promise.all([
    getDailyLog(userId, active.challengeId, dayNumber),
    listDailyLogs(userId, active.challengeId),
  ]);

  return (
    <Dashboard
      challenge={active}
      dayNumber={dayNumber}
      completedTaskIds={log?.completedTaskIds ?? []}
      allLogs={allLogs}
    />
  );
}
