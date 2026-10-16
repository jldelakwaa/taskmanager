"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LayoutGrid,
  LockKeyhole,
  Mail,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";
import { useMarketingTheme } from "./marketing-theme";
import "@/app/auth.css";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useId, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

function CallbackMessage() {
  const params = useSearchParams();
  if (!params.has("error")) return null;
  return (
    <p role="alert" className="auth-error">
      Google sign-in could not be completed. Please try again, or use your
      original sign-in method if you already have an account.
    </p>
  );
}

export function AuthForm({
  mode,
  googleEnabled,
}: {
  mode: "sign-in" | "sign-up";
  googleEnabled: boolean;
}) {
  const formId = useId();
  const signingUp = mode === "sign-up";
  const { theme, setTheme } = useMarketingTheme();
  const [showPassword, setShowPassword] = useState(false);
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
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();
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
        setError(
          result.error.status === 503
            ? "Sign-in is not available yet. You can explore the sample workspace below."
            : result.error.status === 429
              ? "Too many attempts. Please wait a minute and try again."
              : signingUp
                ? "We could not create your account. Check your details or try signing in."
                : "Unable to sign in. Check your email and password and try again.",
        );
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

  return (
    <div className="auth-page" data-theme={theme}>
      <header className="auth-header">
        <Link href="/" className="auth-brand" aria-label="Coliconstruct home">
          <Image
            src="/brand/coliconstruct-logo.png"
            alt="Coliconstruct Engineering Services"
            width={2135}
            height={736}
            priority
          />
        </Link>
        <span className="auth-product-label">Task Manager</span>
        <div className="auth-header-actions">
          <Link href="/">
            <ArrowLeft size={14} />
            Back to home
          </Link>
          <button
            type="button"
            className="auth-theme-toggle"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      <main className="auth-main">
        <section className="auth-story" aria-label="Your team workspace">
          <span className="auth-eyebrow">
            <i />A LITTLE CLARITY. A LOT OF PROGRESS.
          </span>
          <h2>
            A clear plan.
            <br />
            <span>A connected team.</span>
          </h2>
          <p>
            Bring your tasks, schedules, and daily reports together in one
            shared workspace.
          </p>
          <div className="auth-story-card">
            <div className="auth-story-card-heading">
              <span>
                <LayoutGrid size={17} />
                Your work, in focus.
              </span>
              <small>SAMPLE WORKSPACE</small>
            </div>
            <div>
              <span className="auth-task-mark">
                <span />
              </span>
              <span>Review structural drawings</span>
              <small className="auth-status-progress">In progress</small>
            </div>
            <div>
              <span className="auth-task-mark" />
              <span>Coordinate the site inspection</span>
              <small>To do</small>
            </div>
            <div>
              <span className="auth-task-mark auth-task-done">
                <Check size={11} />
              </span>
              <span>Complete the safety checklist</span>
              <small className="auth-status-done">Done</small>
            </div>
            <footer>
              <span className="auth-sample-avatars">
                <i>AR</i>
                <i>MS</i>
                <i>JC</i>
              </span>
              <span>Shared goals. Clear ownership.</span>
            </footer>
          </div>
          <div className="auth-story-note">
            <span />
            Thoughtfully built for the everyday work of a team.
          </div>
        </section>
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-card-intro">
            <span className="auth-eyebrow">YOUR TEAM WORKSPACE</span>
            <h1 id="auth-title">
              {signingUp ? "Create your account" : "Welcome back"}
            </h1>
            <p>
              {signingUp
                ? "Make room for a more organized day."
                : "Sign in and pick up where your team left off."}
            </p>
          </div>
          <Suspense fallback={null}>
            <CallbackMessage />
          </Suspense>
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={pending || !googleEnabled}
            className="auth-google"
          >
            <GoogleMark />
            Continue with Google
          </button>
          {!googleEnabled && (
            <p className="auth-google-note">Google sign-in is being set up.</p>
          )}
          <div className="auth-divider">
            <span />
            or continue with email
            <span />
          </div>
          <form onSubmit={submit} aria-busy={pending}>
            <fieldset disabled={pending}>
              {signingUp && (
                <label htmlFor={`${formId}-name`}>
                  Full name
                  <div className="auth-input">
                    <UserRound size={16} />
                    <input
                      id={`${formId}-name`}
                      name="name"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                      maxLength={100}
                    />
                  </div>
                </label>
              )}
              <label htmlFor={`${formId}-email`}>
                Email address
                <div className="auth-input">
                  <Mail size={16} />
                  <input
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    required
                    maxLength={254}
                  />
                </div>
              </label>
              <label htmlFor={`${formId}-password`}>
                Password
                <div className="auth-input">
                  <LockKeyhole size={16} />
                  <input
                    id={`${formId}-password`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      signingUp ? "new-password" : "current-password"
                    }
                    placeholder={
                      signingUp
                        ? "Create a strong password"
                        : "Enter your password"
                    }
                    required
                    minLength={signingUp ? 12 : undefined}
                    maxLength={128}
                    aria-describedby={
                      signingUp ? `${formId}-password-help` : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {signingUp && (
                  <small
                    id={`${formId}-password-help`}
                    className="auth-field-help"
                  >
                    Use at least 12 characters.
                  </small>
                )}
              </label>
              {signingUp && (
                <label htmlFor={`${formId}-confirmPassword`}>
                  Confirm password
                  <div className="auth-input">
                    <LockKeyhole size={16} />
                    <input
                      id={`${formId}-confirmPassword`}
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      required
                      minLength={12}
                      maxLength={128}
                    />
                  </div>
                </label>
              )}
            </fieldset>
            {error && (
              <p role="alert" className="auth-error">
                {error}
              </p>
            )}
            <button type="submit" disabled={pending} className="auth-submit">
              {pending
                ? "Please wait…"
                : signingUp
                  ? "Create account"
                  : "Sign In"}
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="auth-switch">
            {signingUp ? "Already have an account? " : "New to the workspace? "}
            <Link href={signingUp ? "/sign-in" : "/sign-up"}>
              {signingUp ? "Sign In" : "Create an account"}
            </Link>
          </p>
          <Link href="/preview" className="auth-preview-link">
            Explore a sample workspace <ArrowRight size={13} />
          </Link>
        </section>
      </main>
      <footer className="auth-footer">
        <span>Coliconstruct Engineering Services</span>
        <span>Your team. Your work. One shared view.</span>
      </footer>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.36Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.23-2.51c-.9.6-2.05.97-3.39.97-2.6 0-4.82-1.76-5.61-4.12H3.05v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.93a6 6 0 0 1 0-3.86V7.48H3.05a10 10 0 0 0 0 9.04l3.34-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.51 3.83 1.52l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.95 5.48l3.34 2.59C7.18 7.71 9.4 5.95 12 5.95Z"
      />
    </svg>
  );
}
