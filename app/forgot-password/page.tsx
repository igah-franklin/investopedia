"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth";
import { ApiError } from "../lib/api";
import { Field, Input, Button, Alert } from "../components/ui";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
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
          {sent ? (
            <div className="space-y-5">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Check your email</h1>
              <Alert kind="success">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset your password. It
                expires in 1 hour.
              </Alert>
              <p className="text-sm text-muted">Didn&apos;t get it? Check your spam folder, or try again.</p>
              <Link href="/login" className="block text-center text-sm font-semibold text-forest-700 hover:text-emerald">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Forgot your password?</h1>
              <p className="mt-2 text-sm text-muted">
                Enter your account email and we&apos;ll send you a link to reset it.
              </p>

              <form onSubmit={onSubmit} className="mt-7 space-y-4">
                {error && <Alert kind="error">{error}</Alert>}
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
                <Button type="submit" loading={loading} className="w-full">
                  Send reset link
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                Remembered it?{" "}
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
