import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
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
          <h1 className="text-3xl font-black tracking-tight text-white">Create an account.</h1>
          <p className="text-sm text-white/50">Signups are limited. Use an allowlisted email.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <SignupForm />
        </div>
        <p className="text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold accent-text hover:opacity-80">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
