"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth";
import { ApiError } from "../lib/api";
import { Field, Input, PasswordInput, Button, Alert } from "../components/ui";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function RegisterPage() {
  const { register, resendVerification } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!executeRecaptcha) {
      setError("reCAPTCHA not loaded yet. Please try again in a moment.");
      setLoading(false);
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("register");
      const { email: registeredEmail } = await register(name, email, password, recaptchaToken);
      setSentTo(registeredEmail || email);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (!sentTo) return;
    setResent(false);
    try {
      await resendVerification(sentTo);
    } finally {
      setResent(true);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center">
          <img
            src="/investovilla-logo.png"
            alt="InvestoVilla Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="rounded-none border border-forest-900/10 bg-white/70 p-8 shadow-[0_24px_70px_-44px_rgba(8,35,27,0.5)] backdrop-blur">
          {sentTo ? (
            <div className="space-y-5">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Check your email</h1>
              <Alert kind="success">
                We&apos;ve sent a verification link to <strong>{sentTo}</strong>. Click it to activate your account, then
                log in.
              </Alert>
              <p className="text-sm text-muted">Didn&apos;t get it? Check your spam folder, or request a new link.</p>
              {resent && <Alert kind="info">If that account isn&apos;t verified yet, a new link is on its way.</Alert>}
              <div className="flex flex-col gap-3">
                <Button variant="outline" onClick={onResend} className="w-full">
                  Resend verification email
                </Button>
                <Link href="/login" className="text-center text-sm font-semibold text-forest-700 hover:text-emerald">
                  Go to login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Create your account</h1>
              <p className="mt-2 text-sm text-muted">Start your application to the Pipeline Program.</p>

              <form onSubmit={onSubmit} className="mt-7 space-y-4">
                {error && <Alert kind="error">{error}</Alert>}
                <Field label="Full name" required>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Founder"
                    required
                    autoComplete="name"
                  />
                </Field>
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
                <Field label="Password" hint="At least 8 characters" required>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </Field>
                <Button type="submit" loading={loading} className="w-full">
                  Create account
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-forest-700 hover:text-emerald">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
