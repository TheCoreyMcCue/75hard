import Link from "next/link";
import { Sliders, ListChecks, CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Landing() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="block h-5 w-1 rounded-full accent-gradient" aria-hidden />
            <span className="text-sm font-black uppercase tracking-[0.18em] text-white">
              75 Hard
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 pt-20 pb-12 text-center">
        <div className="mb-6 inline-flex items-center gap-2">
          <span className="block h-6 w-1 rounded-full accent-gradient" aria-hidden />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
            A tracker for 75 Hard
          </span>
        </div>
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
          Run the challenge <span className="accent-text">your way</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
          Standard rules out of the box. Customize before you start, then lock in for the duration.
          Daily checklist, calendar, progress grid — all dark mode.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/signup">
            <Button size="lg">Start a challenge</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              I have an account
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Preview
          </p>
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5">
            <div className="flex items-end justify-between gap-4">
              <div className="flex items-end gap-3">
                <span className="mb-3 block h-16 w-1 rounded-full accent-gradient" aria-hidden />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    Today
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tight text-white">12</span>
                    <span className="text-xl font-bold text-white/30">/ 75</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Progress
                </p>
                <p className="mt-1 text-2xl font-black accent-text">71%</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full accent-gradient shadow-[0_0_12px_rgba(45,212,191,0.6)]"
                style={{ width: "71%" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<Sliders className="h-5 w-5" />}
            title="Your rules"
            body="Standard 75 Hard tasks pre-filled. Edit them all, add new ones, or strip them down. Locked in once you start."
          />
          <Feature
            icon={<ListChecks className="h-5 w-5" />}
            title="Daily checklist"
            body="Check off each task as you complete it. Big celebration when you finish a day."
          />
          <Feature
            icon={<CalendarDays className="h-5 w-5" />}
            title="See your journey"
            body="Grid of every day in the challenge plus a full month calendar. Edit past days if you forgot to log."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5" />}
            title="Custom length"
            body="75 days is the default, but make it 30 or 100. Whatever fits your goal."
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold tracking-tight text-white">Ready when you are.</h2>
          <p className="mt-2 text-white/60">Sign up takes about 30 seconds.</p>
          <div className="mt-5 flex justify-center">
            <Link href="/signup">
              <Button size="lg">Start a challenge</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/40">
        <p>Built as a personal project. No ads, no tracking your data outside this app.</p>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg accent-gradient text-slate-950">
        {icon}
      </div>
      <h3 className="text-base font-bold tracking-tight text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-white/60">{body}</p>
    </div>
  );
}
