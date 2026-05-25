import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your 75 Hard Tracker account to continue your challenge.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="block h-6 w-1 rounded-full accent-gradient" aria-hidden />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
              75 Hard
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome back.</h1>
          <p className="text-sm text-white/50">Log in to keep the streak alive.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <LoginForm />
        </div>
        <p className="text-center text-sm text-white/50">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold accent-text hover:opacity-80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
