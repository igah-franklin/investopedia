"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { ApiError } from "../lib/api";
import { Button, Alert } from "../components/ui";

type Status = "verifying" | "success" | "error" | "missing";

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");
  // Guard against React Strict Mode running the effect twice (the token is single-use).
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setStatus("missing");
      return;
    }

    verifyEmail(token)
      .then((user) => {
        setStatus("success");
        // Verified + logged in — send them on to the next step.
        const dest = user.role === "admin" ? "/admin" : "/apply";
        setTimeout(() => router.replace(dest), 1500);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof ApiError ? err.message : "We couldn't verify your email.");
      });
  }, [verifyEmail, router]);

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center">
          <img
            src="/investovilla-logo.jpg"
            alt="InvestoVilla Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="rounded-none border border-forest-900/10 bg-white/70 p-8 text-center shadow-[0_24px_70px_-44px_rgba(8,35,27,0.5)] backdrop-blur">
          {status === "verifying" && (
            <>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Verifying your email…</h1>
              <p className="mt-3 text-sm text-muted">Hang tight while we activate your account.</p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Email verified ✅</h1>
              <p className="mt-3 text-sm text-muted">
                Your account is active. Redirecting you to your application…
              </p>
            </>
          )}

          {status === "missing" && (
            <>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Invalid link</h1>
              <div className="mt-5">
                <Alert kind="error">This verification link is missing its token. Please use the link from your email.</Alert>
              </div>
              <div className="mt-6">
                <Link href="/login">
                  <Button variant="outline" className="w-full">Back to login</Button>
                </Link>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Verification failed</h1>
              <div className="mt-5">
                <Alert kind="error">{message}</Alert>
              </div>
              <p className="mt-4 text-sm text-muted">
                The link may have expired. You can request a new one from the login page.
              </p>
              <div className="mt-6">
                <Link href="/login">
                  <Button variant="outline" className="w-full">Back to login</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
