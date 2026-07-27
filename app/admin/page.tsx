"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { admin, ApiError, type Application } from "../lib/api";
import AppShell from "../components/AppShell";
import { Button, Badge, Alert, TextArea } from "../components/ui";

const FILTERS = ["pending", "approved", "rejected", "all"] as const;
type Filter = (typeof FILTERS)[number];

function ReviewRow({ app, onReviewed }: { app: Application; onReviewed: () => void }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState("");

  const founder = (app.user && typeof app.user === "object") ? app.user.email : app.email;

  async function decide(decision: "approved" | "rejected") {
    if (decision === "rejected" && !reason.trim()) {
      setError("A reason is required to reject.");
      return;
    }
    setError("");
    setBusy(decision);
    try {
      await admin.review(app._id, decision, reason);
      onReviewed();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed");
      setBusy(null);
    }
  }

  return (
    <div className="rounded-none border border-forest-900/10 bg-white/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{app.startupName}</h3>
          <p className="mt-1 text-sm text-muted">
            {app.founderName} · {founder} · {app.applicationType.replace("-", " ")} · {Array.isArray(app.raiseType) ? app.raiseType.join(", ") : app.raiseType} · USD {typeof app.raiseAmountUsd === "number" ? app.raiseAmountUsd.toLocaleString() : app.raiseAmountUsd}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge status={app.status} />
          <Badge status={app.payment.status} />
          {app.verified && <Badge status="verified">verified</Badge>}
        </div>
      </div>

      {/* details */}
      <div className="mt-4 grid gap-x-8 gap-y-1 text-sm text-ink-soft sm:grid-cols-2">
        {app.oneLiner && <p className="sm:col-span-2"><span className="text-muted">One-liner:</span> {app.oneLiner}</p>}
        <p><span className="text-muted">Stage:</span> {app.stage}</p>
        <p><span className="text-muted">Founders:</span> {app.founders}{app.coFounderName ? ` (+${app.coFounderName})` : ""}</p>
        <p>
          <span className="text-muted">hq in Africa:</span>{" "}
          {typeof app.headquarteredInAfrica === "boolean"
            ? app.headquarteredInAfrica
              ? "Yes"
              : "No"
            : app.headquarteredInAfrica === "yes"
            ? "Yes"
            : app.headquarteredInAfrica === "planning"
            ? "Planning to"
            : "No"}
        </p>
        <p>
          <span className="text-muted">Incorporated:</span>{" "}
          {typeof app.incorporatedInAfrica === "boolean"
            ? app.incorporatedInAfrica
              ? "Yes"
              : "No"
            : app.incorporatedInAfrica === "yes"
            ? "Yes"
            : app.incorporatedInAfrica === "planning"
            ? "Planning to"
            : "No"}
        </p>
        {app.founderSocialLinks && (
          <p className="sm:col-span-2">
            <span className="text-muted">Founder Links:</span> {app.founderSocialLinks}
          </p>
        )}
        {app.coFounderSocialLinks && (
          <p className="sm:col-span-2">
            <span className="text-muted">Co-founder Links:</span> {app.coFounderSocialLinks}
          </p>
        )}
        {(app.pitchDeckUrl || app.businessPlanUrl) && (
          <p className="sm:col-span-2">
            <span className="text-muted">Deck/Plan:</span>{" "}
            <a
              href={app.pitchDeckUrl || app.businessPlanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald hover:underline font-medium"
            >
              {app.pitchDeckUrl || app.businessPlanUrl}
            </a>
          </p>
        )}
        {app.videoUrl && (
          <p className="sm:col-span-2">
            <span className="text-muted">Video Presentation:</span>{" "}
            <a
              href={app.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald hover:underline font-medium"
            >
              {app.videoUrl}
            </a>
          </p>
        )}
        {app.aboutVenture ? (
          <p className="sm:col-span-2">
            <span className="text-muted">About Venture:</span> {app.aboutVenture}
          </p>
        ) : (
          <>
            {app.problem && (
              <p className="sm:col-span-2">
                <span className="text-muted">Problem:</span> {app.problem}
              </p>
            )}
            {app.solution && (
              <p className="sm:col-span-2">
                <span className="text-muted">Solution:</span> {app.solution}
              </p>
            )}
            {app.traction && (
              <p className="sm:col-span-2">
                <span className="text-muted">Traction:</span> {app.traction}
              </p>
            )}
            {app.whyYou && (
              <p className="sm:col-span-2">
                <span className="text-muted">Why You:</span> {app.whyYou}
              </p>
            )}
          </>
        )}
        {app.commitmentReason && (
          <p className="sm:col-span-2">
            <span className="text-muted">Commitment Reason:</span> {app.commitmentReason}
          </p>
        )}
        {app.howDidYouHear && (
          <p className="sm:col-span-2">
            <span className="text-muted">How did they hear:</span> {app.howDidYouHear}
          </p>
        )}
        {app.review?.reason && (
          <p className="sm:col-span-2"><span className="text-muted">Decision note:</span> {app.review.reason}</p>
        )}
      </div>

      {app.status === "pending" && (
        <div className="mt-5 border-t border-forest-900/10 pt-5">
          {!open ? (
            <Button variant="outline" onClick={() => setOpen(true)}>Review</Button>
          ) : (
            <div className="space-y-3">
              <TextArea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason / note sent to the applicant (required to reject)…"
              />
              {error && <Alert kind="error">{error}</Alert>}
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" loading={busy === "approved"} onClick={() => decide("approved")}>
                  Approve
                </Button>
                <Button variant="danger" loading={busy === "rejected"} onClick={() => decide("rejected")}>
                  Reject
                </Button>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
              <p className="text-xs text-muted">
                Approving a paid tier emails the applicant a payment link. Free tier verifies immediately.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("pending");
  const [apps, setApps] = useState<Application[] | null>(null);
  const [stats, setStats] = useState<{ pending: number; approved: number; rejected: number; verified: number } | null>(null);
  const [error, setError] = useState("");

  const load = (f: Filter) => {
    setApps(null);
    admin
      .list(f === "all" ? {} : { status: f })
      .then((r) => setApps(r.applications))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load"));
    admin.stats().then((r) => setStats(r.stats)).catch(() => {});
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }
    load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, filter]);

  if (loading || !user || user.role !== "admin") {
    return (
      <AppShell>
        <p className="text-muted">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald">Admin</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">Applications</h1>

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: "pending", v: stats.pending },
            { k: "approved", v: stats.approved },
            { k: "rejected", v: stats.rejected },
            { k: "verified", v: stats.verified },
          ].map((s) => (
            <div key={s.k} className="rounded-none border border-forest-900/10 bg-white/60 px-5 py-4">
              <div className="font-display text-3xl font-semibold text-forest-700">{s.v}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted">{s.k}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-none px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              filter === f ? "bg-forest-800 text-cream" : "border border-forest-900/15 bg-white/60 text-ink hover:bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6">
          <Alert kind="error">{error}</Alert>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {apps === null && <p className="text-muted">Loading…</p>}
        {apps?.length === 0 && <p className="text-muted">No {filter === "all" ? "" : filter} applications.</p>}
        {apps?.map((app) => (
          <ReviewRow key={app._id} app={app} onReviewed={() => load(filter)} />
        ))}
      </div>
    </AppShell>
  );
}
