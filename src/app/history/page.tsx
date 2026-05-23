import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { listChallenges } from "@/lib/db/challenges";
import { Button } from "@/components/ui/button";
import type { ChallengeStatus } from "@/lib/types";

function statusStyle(status: ChallengeStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
    case "completed":
      return "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30";
    case "failed":
      return "bg-red-500/10 text-red-300/80 border border-red-500/20";
    case "abandoned":
      return "bg-white/5 text-white/50 border border-white/10";
  }
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function HistoryPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const all = await listChallenges(userId);
  const sorted = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

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
              History
            </span>
          </div>
          <span className="w-16" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <p className="text-white/60">No challenges yet.</p>
            <Link href="/setup" className="mt-4 inline-block">
              <Button>Start your first challenge</Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {sorted.map((c) => (
              <li
                key={c.challengeId}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyle(
                      c.status,
                    )}`}
                  >
                    {c.status}
                  </span>
                  <p className="text-xs text-white/40">{c.durationDays}-day challenge</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                      Started
                    </p>
                    <p className="font-semibold text-white mt-0.5">{formatDate(c.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                      Ended
                    </p>
                    <p className="font-semibold text-white mt-0.5">{formatDate(c.endDate)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.tasks.map((t) => (
                    <span
                      key={t.id}
                      className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs text-white/70"
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
