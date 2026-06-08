"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { applications, ApiError, type FormConfig, type ApplicationType } from "../lib/api";
import AppShell from "../components/AppShell";
import { Field, Input, TextArea, Select, Combobox, Button, Alert } from "../components/ui";
import { COUNTRIES } from "../lib/countries";

const TYPE_LABELS: Record<ApplicationType, string> = {
  standard: "Standard pilot",
  "need-based": "Need-based (reduced rate)",
  "venture-backed": "Already venture-backed",
};
const STAGE_LABELS: Record<string, string> = {
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a": "Series A",
  bootstrapped: "Bootstrapped (beyond Series A)",
};
const AFRICA_LABELS: Record<string, string> = {
  "african-in-africa": "African building for Africa",
  "african-diaspora": "African in the diaspora, building for Africa",
  "non-african-for-africa": "Non-African building for an African market",
};

type FormShape = Record<string, string | boolean>;

const initial: FormShape = {
  founderName: "",
  email: "",
  phone: "",
  startupName: "",
  website: "",
  applicationType: "standard",
  founders: "single",
  coFounderName: "",
  coFounderEmail: "",
  stage: "pre-seed",
  raiseType: "equity",
  raiseAmountUsd: "",
  buildingForAfrica: "african-in-africa",
  headquarteredInAfrica: "true",
  incorporatedInAfrica: "true",
  country: "",
  oneLiner: "",
  problem: "",
  solution: "",
  traction: "",
  whyYou: "",
  pitchDeckUrl: "",
  businessPlanUrl: "",
  videoUrl: "",
  needBasedReason: "",
  agreeToTerms: false,
};

export default function ApplyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FormShape>(initial);
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  // Gate + prefill.
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    setForm((f) => ({ ...f, founderName: f.founderName || user.name, email: f.email || user.email }));
  }, [user, loading, router]);

  useEffect(() => {
    applications.formConfig().then(setConfig).catch(() => {});
  }, []);

  const price = useMemo(() => {
    if (!config) return null;
    const tier = config.pricing[form.applicationType as ApplicationType];
    if (!tier) return null;
    const amount = form.founders === "duo" ? tier.duo : tier.single;
    return { amount, currency: config.currency, requiresPayment: tier.requiresPayment && amount > 0 };
  }, [config, form.applicationType, form.founders]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        raiseAmountUsd: Number(form.raiseAmountUsd),
        headquarteredInAfrica: form.headquarteredInAfrica === "true",
        incorporatedInAfrica: form.incorporatedInAfrica === "true",
        agreeToTerms: form.agreeToTerms === true,
      };
      await applications.create(payload);
      router.push("/dashboard?submitted=1");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.details) {
          const map: Record<string, string> = {};
          err.details.forEach((d) => (map[d.field] = d.message));
          setFieldErrors(map);
        }
      } else {
        setError("Something went wrong");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
      <AppShell>
        <p className="text-muted">Loading…</p>
      </AppShell>
    );
  }

  const isDuo = form.founders === "duo";
  const isNeedBased = form.applicationType === "need-based";

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald">Application</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          Apply to the Pipeline Program
        </h1>
        <p className="mt-3 text-muted">
          Be honest and detailed — this is reviewed for fit and venture-backability. The accelerator is free; only the
          optional design clinic carries a subsidized fee.
        </p>

        {error && (
          <div className="mt-6">
            <Alert kind="error">{error}</Alert>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-10">
          {/* Founder & venture */}
          <section className="space-y-5 rounded-none border border-forest-900/10 bg-white/60 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">You &amp; your venture</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Founder name" required error={fieldErrors.founderName}>
                <Input value={form.founderName as string} onChange={(e) => set("founderName", e.target.value)} placeholder="Ada Founder" required />
              </Field>
              <Field label="Contact email" hint="Defaults to your account email" error={fieldErrors.email}>
                <Input type="email" value={form.email as string} onChange={(e) => set("email", e.target.value)} placeholder="you@startup.com" />
              </Field>
              <Field label="Startup name" required error={fieldErrors.startupName}>
                <Input value={form.startupName as string} onChange={(e) => set("startupName", e.target.value)} placeholder="Acme Inc." required />
              </Field>
              <Field label="Website" error={fieldErrors.website}>
                <Input value={form.website as string} onChange={(e) => set("website", e.target.value)} placeholder="https://yourstartup.com" />
              </Field>
              <Field label="Phone" error={fieldErrors.phone}>
                <Input type="tel" value={form.phone as string} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 000 0000" />
              </Field>
              <Field label="Country" error={fieldErrors.country}>
                <Combobox
                  value={form.country as string}
                  onChange={(v) => set("country", v)}
                  options={COUNTRIES}
                  placeholder="Search for your country"
                />
              </Field>
            </div>
          </section>

          {/* Tier */}
          <section className="space-y-5 rounded-none border border-forest-900/10 bg-white/60 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">Application type</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tier" required error={fieldErrors.applicationType}>
                <Select value={form.applicationType as string} onChange={(e) => set("applicationType", e.target.value)}>
                  {Object.entries(TYPE_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Founders" error={fieldErrors.founders}>
                <Select value={form.founders as string} onChange={(e) => set("founders", e.target.value)}>
                  <option value="single">Just me</option>
                  <option value="duo">Two co-founders</option>
                </Select>
              </Field>
              {isDuo && (
                <>
                  <Field label="Co-founder name" required error={fieldErrors.coFounderName}>
                    <Input value={form.coFounderName as string} onChange={(e) => set("coFounderName", e.target.value)} placeholder="Co-founder full name" />
                  </Field>
                  <Field label="Co-founder email" error={fieldErrors.coFounderEmail}>
                    <Input type="email" value={form.coFounderEmail as string} onChange={(e) => set("coFounderEmail", e.target.value)} placeholder="cofounder@startup.com" />
                  </Field>
                </>
              )}
            </div>
            {price && (
              <div className="rounded-none border border-gold/30 bg-gold-soft/25 px-5 py-4 text-sm text-ink-soft">
                {price.requiresPayment ? (
                  <>
                    Business Design Clinic fee:{" "}
                    <span className="font-display text-lg font-semibold text-forest-800">
                      {price.currency} {price.amount}
                    </span>{" "}
                    — payable only after you&apos;re approved. The 12-week accelerator is free.
                  </>
                ) : (
                  <>The design-clinic fee is <span className="font-semibold text-forest-800">waived</span> for venture-backed founders. The accelerator is free.</>
                )}
              </div>
            )}
            {isNeedBased && (
              <Field label="Why do you need the reduced rate?" required error={fieldErrors.needBasedReason}>
                <TextArea value={form.needBasedReason as string} onChange={(e) => set("needBasedReason", e.target.value)} placeholder="Briefly explain your circumstances and why the standard fee is a barrier." />
              </Field>
            )}
          </section>

          {/* Raise */}
          <section className="space-y-5 rounded-none border border-forest-900/10 bg-white/60 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">Your raise</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Stage" required error={fieldErrors.stage}>
                <Select value={form.stage as string} onChange={(e) => set("stage", e.target.value)}>
                  {Object.entries(STAGE_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Raise type" required error={fieldErrors.raiseType}>
                <Select value={form.raiseType as string} onChange={(e) => set("raiseType", e.target.value)}>
                  <option value="equity">Equity</option>
                  <option value="debt">Debt</option>
                </Select>
              </Field>
              <Field label="Amount (USD)" required hint="$20k – $1M" error={fieldErrors.raiseAmountUsd}>
                <Input
                  type="number"
                  value={form.raiseAmountUsd as string}
                  onChange={(e) => set("raiseAmountUsd", e.target.value)}
                  placeholder="50000"
                  min={1000}
                  required
                />
              </Field>
            </div>
          </section>

          {/* Africa qualifiers */}
          <section className="space-y-5 rounded-none border border-forest-900/10 bg-white/60 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">Building for Africa</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Which best describes you?" required error={fieldErrors.buildingForAfrica}>
                <Select value={form.buildingForAfrica as string} onChange={(e) => set("buildingForAfrica", e.target.value)}>
                  {Object.entries(AFRICA_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </Select>
              </Field>
              <div />
              <Field label="Headquartered in Africa?" required error={fieldErrors.headquarteredInAfrica}>
                <Select value={form.headquarteredInAfrica as string} onChange={(e) => set("headquarteredInAfrica", e.target.value)}>
                  <option value="true">Yes (or planning to)</option>
                  <option value="false">No</option>
                </Select>
              </Field>
              <Field label="Incorporated in Africa?" required error={fieldErrors.incorporatedInAfrica}>
                <Select value={form.incorporatedInAfrica as string} onChange={(e) => set("incorporatedInAfrica", e.target.value)}>
                  <option value="true">Yes (or planning to)</option>
                  <option value="false">No</option>
                </Select>
              </Field>
            </div>
          </section>

          {/* Pitch */}
          <section className="space-y-5 rounded-none border border-forest-900/10 bg-white/60 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">Your pitch</h2>
            <Field label="One-liner" hint="What you do, in a sentence" error={fieldErrors.oneLiner}>
              <Input value={form.oneLiner as string} onChange={(e) => set("oneLiner", e.target.value)} placeholder="We help X do Y so they can Z." maxLength={280} />
            </Field>
            <Field label="The problem" error={fieldErrors.problem}>
              <TextArea value={form.problem as string} onChange={(e) => set("problem", e.target.value)} placeholder="What painful, urgent problem are you solving, and for whom?" />
            </Field>
            <Field label="Your solution" error={fieldErrors.solution}>
              <TextArea value={form.solution as string} onChange={(e) => set("solution", e.target.value)} placeholder="How does your product solve it? What makes your approach different?" />
            </Field>
            <Field label="Traction so far" error={fieldErrors.traction}>
              <TextArea value={form.traction as string} onChange={(e) => set("traction", e.target.value)} placeholder="Revenue, users, growth, pilots, LOIs — share the numbers that matter." />
            </Field>
            <Field label="Why you?" error={fieldErrors.whyYou}>
              <TextArea value={form.whyYou as string} onChange={(e) => set("whyYou", e.target.value)} placeholder="What makes you and your team uniquely able to win this market?" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Pitch deck URL" error={fieldErrors.pitchDeckUrl}>
                <Input value={form.pitchDeckUrl as string} onChange={(e) => set("pitchDeckUrl", e.target.value)} placeholder="https://docs.google.com/…" />
              </Field>
              <Field label="Business plan URL" error={fieldErrors.businessPlanUrl}>
                <Input value={form.businessPlanUrl as string} onChange={(e) => set("businessPlanUrl", e.target.value)} placeholder="https://docs.google.com/…" />
              </Field>
              <Field label="Video URL" error={fieldErrors.videoUrl}>
                <Input value={form.videoUrl as string} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://youtu.be/…" />
              </Field>
            </div>
          </section>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={form.agreeToTerms as boolean}
              onChange={(e) => set("agreeToTerms", e.target.checked)}
              className="mt-1 h-4 w-4 accent-emerald"
              required
            />
            <span className="text-sm text-ink-soft">
              I confirm the information is accurate and I agree to the program terms. If approved, I&apos;ll pay the
              (subsidized) design-clinic fee within 7 days where applicable.
            </span>
          </label>
          {fieldErrors.agreeToTerms && <p className="text-xs font-medium text-red-600">{fieldErrors.agreeToTerms}</p>}

          <div className="flex justify-end">
            <Button type="submit" loading={submitting}>Submit application</Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
