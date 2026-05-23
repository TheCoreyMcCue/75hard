"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { createUser } from "@/lib/db/users";

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
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const confirm = formData.get("confirm");
  if (typeof confirm !== "string" || confirm !== parsed.data.password) {
    return { error: "Passwords don't match" };
  }

  const { email, password } = parsed.data;

  if (!allowlistContains(email)) {
    return { error: "Signups are restricted. Contact the owner if you need access." };
  }

  try {
    await createUser(email, password);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create account";
    return { error: message };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
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
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw err;
  }

  redirect("/");
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect("/login");
}
