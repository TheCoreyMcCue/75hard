import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { getActiveChallenge } from "@/lib/db/challenges";
import { listDailyLogs } from "@/lib/db/daily-logs";
import { dayNumberForChallenge } from "@/lib/challenge-helpers";
import { Button } from "@/components/ui/button";
import { CalendarView } from "./calendar-view";

export default async function CalendarPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const active = await getActiveChallenge(userId);

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 backdrop-blur-md bg-black/20 sticky top-0 z-30">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="block h-4 w-1 rounded-full accent-gradient" aria-hidden />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
              Calendar
            </span>
          </div>
          <span className="w-16" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {!active ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <p className="text-white/60">No active challenge to show.</p>
            <Link href="/setup" className="mt-4 inline-block">
              <Button>Start a challenge</Button>
            </Link>
          </div>
        ) : (
          <CalendarPanel userId={userId} challenge={active} />
        )}
      </main>
    </div>
  );
}

async function CalendarPanel({
  userId,
  challenge,
}: {
  userId: string;
  challenge: Awaited<ReturnType<typeof getActiveChallenge>>;
}) {
  if (!challenge) return null;
  const logs = await listDailyLogs(userId, challenge.challengeId);
  const today = dayNumberForChallenge(challenge);
  return <CalendarView challenge={challenge} logs={logs} today={today} />;
}
