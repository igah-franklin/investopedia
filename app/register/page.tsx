"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { ApiError } from "../lib/api";
import { Field, Input, Button, Alert } from "../components/ui";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/apply");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
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
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Create your account</h1>
          <p className="mt-2 text-sm text-muted">Start your application to the Pipeline Program.</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            {error && <Alert kind="error">{error}</Alert>}
            <Field label="Full name" required>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Founder" required autoComplete="name" />
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
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
        </div>
      </div>
    </div>
  );
}
