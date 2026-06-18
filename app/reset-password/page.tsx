"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { ApiError } from "../lib/api";
import { Field, PasswordInput, Button, Alert } from "../components/ui";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Grab the token from the email link (matches the codebase's query-reading
  // style). `null` means "not read yet"; "" means the link had no token.
  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (!token) {
      setError("This reset link is missing its token.");
      return;
    }
    setLoading(true);
    try {
      const user = await resetPassword(token, password);
      setDone(true);
      const dest = user.role === "admin" ? "/admin" : "/dashboard";
      setTimeout(() => router.replace(dest), 1200);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const missingToken = token === "";

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
          {done ? (
            <div className="space-y-4 text-center">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Password updated ✅</h1>
              <p className="text-sm text-muted">You&apos;re all set. Signing you in…</p>
            </div>
          ) : missingToken ? (
            <div className="space-y-5">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Invalid link</h1>
              <Alert kind="error">
                This password reset link is missing its token. Request a new one from the login page.
              </Alert>
              <Link href="/forgot-password" className="block text-center text-sm font-semibold text-forest-700 hover:text-emerald">
                Request a new link
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Choose a new password</h1>
              <p className="mt-2 text-sm text-muted">Pick a strong password you don&apos;t use elsewhere.</p>

              <form onSubmit={onSubmit} className="mt-7 space-y-4">
                {error && <Alert kind="error">{error}</Alert>}
                <Field label="New password" hint="At least 8 characters" required>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a new password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </Field>
                <Field label="Confirm new password" required>
                  <PasswordInput
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your new password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </Field>
                <Button type="submit" loading={loading} className="w-full">
                  Reset password
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                <Link href="/login" className="font-semibold text-forest-700 hover:text-emerald">
                  Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
