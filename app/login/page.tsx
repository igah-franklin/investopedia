"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { ApiError } from "../lib/api";
import { Field, Input, PasswordInput, Button, Alert } from "../components/ui";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function LoginPage() {
  const { login, resendVerification } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resent, setResent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    setResent(false);
    setLoading(true);

    if (!executeRecaptcha) {
      setError("reCAPTCHA not loaded yet. Please try again in a moment.");
      setLoading(false);
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("login");
      const user = await login(email, password, recaptchaToken);
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        // Account exists but the email hasn't been verified yet.
        setNeedsVerification(true);
        setError(err.message);
      } else {
        setError(err instanceof ApiError ? err.message : "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    setResent(false);
    try {
      await resendVerification(email);
    } finally {
      setResent(true);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-none bg-forest-800 ring-1 ring-emerald/30">
            <span className="font-display text-lg font-semibold text-gold-bright">iV</span>
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">InvestoVilla</span>
        </Link>

        <div className="rounded-none border border-forest-900/10 bg-white/70 p-8 shadow-[0_24px_70px_-44px_rgba(8,35,27,0.5)] backdrop-blur">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Log in to track your application and payment.</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            {error && <Alert kind="error">{error}</Alert>}
            {needsVerification && (
              <div className="space-y-2">
                {resent ? (
                  <Alert kind="info">If that account isn&apos;t verified yet, a new link is on its way.</Alert>
                ) : (
                  <button
                    type="button"
                    onClick={onResend}
                    className="text-sm font-semibold text-forest-700 underline-offset-2 hover:text-emerald hover:underline"
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            )}
            <Field label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@startup.com"
                required
                autoComplete="email"
              />
            </Field>
            <Field label="Password" required>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
            </Field>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-semibold text-forest-700 hover:text-emerald">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" loading={loading} className="w-full">
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            New here?{" "}
            <Link href="/register" className="font-semibold text-forest-700 hover:text-emerald">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
