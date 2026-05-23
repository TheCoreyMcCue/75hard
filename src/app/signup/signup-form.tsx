"use client";

import { useActionState, useState } from "react";
import { signupAction, type AuthFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: AuthFormState = {};

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, initialState);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50"
        >
          Email
        </label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50"
        >
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-xs text-white/30">At least 8 characters.</p>
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="confirm"
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50"
        >
          Confirm password
        </label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch}
        />
        {mismatch && (
          <p className="text-xs text-red-400" role="alert">
            Passwords don&apos;t match.
          </p>
        )}
      </div>
      {state.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending || mismatch || !password}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
