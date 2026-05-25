import Link from "next/link";
import { Sliders, ListChecks, CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://sevenfivehard.com";

type FaqItem = { q: string; a: string };

const FAQ: FaqItem[] = [
  {
    q: "Is the 75 Hard Tracker free?",
    a: "Yes — completely free, no ads, no premium tier. It's a personal project. You only need an email and password to sign up.",
  },
  {
    q: "Can I customize the 75 Hard rules?",
    a: "Yes, and this is the main reason this tracker exists. Before you start a challenge, you can edit, add, or remove daily tasks. The seven standard 75 Hard tasks (two workouts, follow a diet, no alcohol, gallon of water, ten pages of reading, progress photo) are pre-filled if you want to follow the original. Once you start, the task list is locked for the duration so you can't soften the rules midway.",
  },
  {
    q: "What happens if I miss a day?",
    a: "You decide. There's an explicit \"I missed a day\" button that resets the challenge to Day 1 — that's the strict 75 Hard rule. Alternatively, you can end the current attempt and start a new challenge with different rules. Failed and abandoned attempts are archived in your history so you can see your full journey.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes — it's a mobile-friendly web app, works in any modern browser. On iPhone you can tap Share → Add to Home Screen for an app-like experience.",
  },
  {
    q: "How is this different from other 75 Hard apps?",
    a: "Most 75 Hard apps strictly enforce the original rules. This one lets you set your own daily tasks at the start. Want fewer workouts, different reading goals, or a 30-day version? You can. Want to follow the standard challenge exactly? The defaults are already set up. The customization is the differentiator.",
  },
  {
    q: "What about a progress photo or alcohol — are those tracked?",
    a: "Yes, both are separate checkboxes in the standard task list. We split \"follow your diet\" from \"no alcohol\" because they're distinct behaviors, and treat the daily photo as its own item. You can remove either one if you don't want to track it.",
  },
  {
    q: "Do you store my data? Is it private?",
    a: "Your account and challenge data are stored in DynamoDB on AWS. No ads, no data sold to third parties, no third-party trackers in your browser beyond standard performance monitoring. The source code is available on GitHub.",
  },
];

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "75 Hard Tracker",
  alternateName: ["Seven Five Hard Tracker", "75 Hard Custom Rules Tracker"],
  description:
    "A free web app to track your 75 Hard challenge with customizable daily rules. Standard rules pre-filled, customize before you start, then lock in for the duration.",
  url: SITE_URL,
  applicationCategory: "HealthApplication",
  applicationSubCategory: "FitnessApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires a modern web browser with JavaScript enabled.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Customizable daily tasks",
    "Standard 75 Hard rules pre-filled",
    "Daily checklist",
    "Calendar view of your full challenge",
    "Progress grid showing every day",
    "Edit past days retroactively",
    "Multiple challenge attempts with history",
    "Custom challenge length (not just 75 days)",
    "Mobile-friendly dark theme",
  ],
  author: { "@type": "Person", name: "Corey McCue" },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Structured data for search engines and LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

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
            A 75 Hard tracker with custom rules
          </span>
        </div>
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
          Run the challenge <span className="accent-text">your way</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
          A free, customizable 75 Hard tracker. Standard rules out of the box. Edit, add, or remove
          daily tasks before you start, then lock in for the duration. Daily checklist, calendar,
          progress grid — all dark mode.
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
        <h2 className="sr-only">Features</h2>
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

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2">
            <span className="block h-5 w-1 rounded-full accent-gradient" aria-hidden />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
              Frequently asked
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Questions, answered.
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-white/20 open:border-white/20"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold tracking-tight text-white">
                <span>{item.q}</span>
                <span
                  className="shrink-0 text-white/40 transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{item.a}</p>
            </details>
          ))}
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
