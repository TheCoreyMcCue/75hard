"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut, auth } from "@/auth";
import { createUser } from "@/lib/db/users";
import { log } from "@/lib/log";

export type AuthFormState = {
  error?: string;
};

const credentialsSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function allowlistContains(email: string): boolean {
  const raw = process.env.ALLOWED_EMAILS ?? "";
  if (!raw.trim()) return false;
  const allowed = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export async function signupAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    log.warn("signup.invalid_input", { issue: parsed.error.issues[0]?.message });
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const confirm = formData.get("confirm");
  if (typeof confirm !== "string" || confirm !== parsed.data.password) {
    log.warn("signup.password_mismatch", { email: parsed.data.email });
    return { error: "Passwords don't match" };
  }

  const { email, password } = parsed.data;
  log.info("signup.attempt", { email });

  if (!allowlistContains(email)) {
    log.warn("signup.rejected_allowlist", { email });
    return { error: "Signups are restricted. Contact the owner if you need access." };
  }

  try {
    const user = await createUser(email, password);
    log.info("signup.created", { userId: user.userId, email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create account";
    log.error("signup.failed", { email, error: message });
    return { error: message };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
    log.info("signup.auto_login_success", { email });
  } catch (err) {
    if (err instanceof AuthError) {
      log.error("signup.auto_login_failed", { email, error: err.message });
      return { error: "Account created but sign-in failed. Try logging in." };
    }
    throw err;
  }

  redirect("/");
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    log.warn("login.invalid_input", { issue: parsed.error.issues[0]?.message });
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  log.info("login.attempt", { email: parsed.data.email });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    log.info("login.success", { email: parsed.data.email });
  } catch (err) {
    if (err instanceof AuthError) {
      log.warn("login.failed", { email: parsed.data.email, reason: err.type });
      return { error: "Invalid email or password" };
    }
    throw err;
  }

  redirect("/");
}

export async function logoutAction() {
  const session = await auth();
  log.info("logout", { userId: session?.user?.id });
  await signOut({ redirect: false });
  redirect("/login");
}
