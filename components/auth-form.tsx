"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

function CallbackMessage() {
  const params = useSearchParams();
  if (!params.has("error")) return null;
  return <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">Google sign-in could not be completed. Please try again, or use your original sign-in method if you already have an account.</p>;
}

export function AuthForm({ mode, googleEnabled }: { mode: "sign-in" | "sign-up"; googleEnabled: boolean }) {
  const signingUp = mode === "sign-up";
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function signInWithGoogle() {
    if (pending || !googleEnabled) return;
    setPending(true);
    setError("");
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/sign-in?error=google",
      });
      if (result.error) {
        setError("Unable to continue with Google. Please try again.");
        setPending(false);
      }
    } catch {
      setError("Unable to connect to Google. Please try again.");
      setPending(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();
    if (signingUp && !name) {
      setError("Enter your name.");
      return;
    }
    if (signingUp && password !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const result = signingUp
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.status === 429
          ? "Too many attempts. Please wait a minute and try again."
          : signingUp
            ? "We could not create your account. Check your details or try signing in."
            : "Unable to sign in. Check your email and password and try again.");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again shortly.");
    } finally {
      setPending(false);
    }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12 text-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <p className="text-sm font-semibold tracking-wide text-indigo-600">TASK MANAGER</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{signingUp ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{signingUp ? "A place to organize your work and plan your day." : "Sign in to your workspace."}</p>
        <Suspense fallback={null}><CallbackMessage /></Suspense>
        <button type="button" onClick={signInWithGoogle} disabled={pending || !googleEnabled} className="mt-7 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Continue with Google</button>
        {!googleEnabled && <p className="mt-2 text-center text-xs text-slate-500">Google sign-in is being set up.</p>}
        <div className="mt-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />or use email<span className="h-px flex-1 bg-slate-200" /></div>
        <form onSubmit={submit} className="mt-8 space-y-5" aria-busy={pending}>
          <fieldset disabled={pending} className="space-y-5">
            {signingUp && <div>
              <label htmlFor="name" className="text-sm font-medium">Full name</label>
              <input id="name" name="name" autoComplete="name" required maxLength={100} className={inputClass} />
            </div>}
            <div>
              <label htmlFor="email" className="text-sm font-medium">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input id="password" name="password" type="password" autoComplete={signingUp ? "new-password" : "current-password"} required minLength={signingUp ? 12 : undefined} maxLength={128} aria-describedby={signingUp ? "password-help" : undefined} className={inputClass} />
              {signingUp && <p id="password-help" className="mt-2 text-xs text-slate-500">Use at least 12 characters.</p>}
            </div>
            {signingUp && <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128} className={inputClass} />
            </div>}
          </fieldset>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={pending} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-60">
            {pending ? "Please wait…" : signingUp ? "Create account" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          {signingUp ? "Already have an account? " : "New here? "}
          <Link href={signingUp ? "/sign-in" : "/sign-up"} className="font-semibold text-indigo-600 hover:underline">{signingUp ? "Sign in" : "Create an account"}</Link>
        </p>
      </section>
    </main>
  );
}
