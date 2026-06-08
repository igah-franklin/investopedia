"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { applications, payments, ApiError, type Application } from "../lib/api";
import AppShell from "../components/AppShell";
import { Button, Badge, Alert } from "../components/ui";

function PaymentNotice() {
  const [notice, setNotice] = useState<{ kind: "success" | "error" | "info"; text: string } | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p = q.get("payment");
    if (q.get("submitted")) setNotice({ kind: "success", text: "Application submitted! We'll email you once it's reviewed." });
    else if (p === "success") setNotice({ kind: "success", text: "Payment received — your application is now verified." });
    else if (p === "already") setNotice({ kind: "info", text: "This application was already paid." });
    else if (p === "failed" || p === "error") setNotice({ kind: "error", text: "Payment didn't complete. You can try again below." });
    if (q.toString()) window.history.replaceState({}, "", "/dashboard");
  }, []);
  if (!notice) return null;
  return (
    <div className="mb-6">
      <Alert kind={notice.kind === "info" ? "info" : notice.kind}>{notice.text}</Alert>
    </div>
  );
}

function ApplicationCard({ app }: { app: Application }) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setError("");
    setPaying(true);
    try {
      const { authorization_url } = await payments.initialize(app._id);
      window.location.href = authorization_url;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start payment");
      setPaying(false);
    }
  }

  const needsPayment =
    app.status === "approved" && app.payment.required && app.payment.status === "pending" && !app.verified;

  return (
    <div className="rounded-none border border-forest-900/10 bg-white/70 p-6 shadow-[0_18px_50px_-36px_rgba(8,35,27,0.45)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">{app.startupName}</h3>
          <p className="mt-1 text-sm text-muted">
            {app.applicationType.replace("-", " ")} · {app.raiseType} · ${app.raiseAmountUsd.toLocaleString()} ·{" "}
            applied {new Date(app.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge status={app.status} />
          {app.verified && <Badge status="verified">verified</Badge>}
        </div>
      </div>

      {/* Review reason */}
      {app.review?.reason && (
        <div className="mt-5 rounded-none border-l-4 border-forest-700/40 bg-forest-900/[0.03] px-4 py-3 text-sm text-ink-soft">
          <span className="font-semibold text-forest-800">Reviewer note:</span> {app.review.reason}
        </div>
      )}

      {/* Payment row */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/10 pt-5">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>Payment:</span>
          <Badge status={app.payment.status} />
          {app.payment.amount ? (
            <span className="text-ink-soft">
              ₦{app.payment.amount.toLocaleString()}
              {app.payment.amountUsd ? (
                <span className="ml-1 text-muted">(${app.payment.amountUsd.toLocaleString()} USD)</span>
              ) : null}
            </span>
          ) : null}
        </div>

        {needsPayment && (
          <Button onClick={pay} loading={paying}>
            Pay &amp; confirm seat
          </Button>
        )}
        {app.status === "approved" && app.verified && (
          <span className="text-sm font-semibold text-forest-700">You&apos;re all set 🎉</span>
        )}
        {app.status === "pending" && <span className="text-sm text-muted">Under review</span>}
      </div>

      {error && (
        <div className="mt-4">
          <Alert kind="error">{error}</Alert>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [apps, setApps] = useState<Application[] | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    applications
      .mine()
      .then((r) => setApps(r.applications))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load"));
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    load();
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <AppShell>
        <p className="text-muted">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PaymentNotice />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald">Dashboard</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
            Hi {user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-muted">Track your application, payment and verification status.</p>
        </div>
        <Link href="/apply">
          <Button variant="outline">+ New application</Button>
        </Link>
      </div>

      {error && (
        <div className="mt-6">
          <Alert kind="error">{error}</Alert>
        </div>
      )}

      <div className="mt-8 space-y-5">
        {apps === null && <p className="text-muted">Loading applications…</p>}
        {apps?.length === 0 && (
          <div className="rounded-none border border-dashed border-forest-900/20 bg-white/40 p-10 text-center">
            <p className="text-muted">You haven&apos;t applied yet.</p>
            <Link href="/apply" className="mt-4 inline-block">
              <Button>Start your application</Button>
            </Link>
          </div>
        )}
        {apps?.map((app) => (
          <ApplicationCard key={app._id} app={app} />
        ))}
      </div>
    </AppShell>
  );
}
