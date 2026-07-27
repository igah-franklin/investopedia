"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../lib/auth";
import { applications, ApiError, type FormConfig, type ApplicationType } from "../lib/api";
import AppShell from "../components/AppShell";
import { Field, Input, TextArea, Select, Combobox, Button, Alert } from "../components/ui";
import { COUNTRIES } from "../lib/countries";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

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

const RAISE_TYPE_OPTIONS = [
  "Grants",
  "Equity Investment",
  "Venture Debt",
  "Revenue-Based Financing",
  "Convertible Note/SAFE",
  "Crowdfunding",
  "Strategic Partnerships",
  "Not Yet Sure",
  "Others"
];

const AMOUNT_OPTIONS = [
  "Less than $20,000",
  "$20,000–$50,000",
  "$50,001–$100,000",
  "$100,001–$250,000",
  "$250,001–$500,000",
  "$500,001–$1M",
  "Above $1M"
];

const HOW_HEARD_OPTIONS = [
  "LinkedIn",
  "Google Search",
  "Twitter / X",
  "Facebook",
  "Instagram",
  "YouTube",
  "WhatsApp / Telegram Group",
  "Referral / Friend or Colleague",
  "Partner Organization / Incubator / Hub",
  "Email Newsletter / News Article",
  "Other"
];

type FormShape = {
  founderName: string;
  email: string;
  phone: string;
  startupName: string;
  website: string;
  applicationType: ApplicationType;
  founders: "single" | "duo";
  coFounderName: string;
  coFounderEmail: string;
  coFounderSocialLinks: string;
  stage: string;
  raiseType: string[];
  raiseAmountUsd: string;
  raiseAmountUsdSelect: string;
  raiseAmountUsdCustom: string;
  buildingForAfrica: string;
  headquarteredInAfrica: string;
  incorporatedInAfrica: string;
  country: string;
  oneLiner: string;
  aboutVenture: string;
  pitchDeckUrl: string;
  videoUrl: string;
  founderSocialLinks: string;
  commitmentReason: string;
  howDidYouHearSource: string;
  howDidYouHearDetails: string;
  needBasedReason: string;
  agreeToTerms: boolean;
};

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
  coFounderSocialLinks: "",
  stage: "pre-seed",
  raiseType: [],
  raiseAmountUsd: "",
  raiseAmountUsdSelect: "",
  raiseAmountUsdCustom: "",
  buildingForAfrica: "african-in-africa",
  headquarteredInAfrica: "yes",
  incorporatedInAfrica: "yes",
  country: "",
  oneLiner: "",
  aboutVenture: "",
  pitchDeckUrl: "",
  videoUrl: "",
  founderSocialLinks: "",
  commitmentReason: "",
  howDidYouHearSource: "",
  howDidYouHearDetails: "",
  needBasedReason: "",
  agreeToTerms: false,
};

export default function ApplyPage() {
  const { user, loading } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const [form, setForm] = useState<FormShape>(initial);
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string, value: string | boolean | string[]) => setForm((f) => ({ ...f, [key]: value }));

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
    applications.formConfig().then(setConfig).catch(() => { });
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

    if (!executeRecaptcha) {
      setError("reCAPTCHA not loaded yet. Please try again in a moment.");
      setSubmitting(false);
      return;
    }

    if (!form.howDidYouHearSource) {
      setError("Please select how you heard about this program.");
      setFieldErrors({ howDidYouHearSource: "Selection required" });
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("submit_application");
      const { raiseAmountUsdSelect, raiseAmountUsdCustom, howDidYouHearSource, howDidYouHearDetails, ...formToSubmit } = form;
      const combinedHowDidYouHear = form.howDidYouHearDetails.trim()
        ? `${form.howDidYouHearSource} — ${form.howDidYouHearDetails.trim()}`
        : form.howDidYouHearSource;

      const payload = {
        ...formToSubmit,
        howDidYouHear: combinedHowDidYouHear,
        agreeToTerms: form.agreeToTerms === true,
        recaptchaToken,
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
          optional Venture Backability Clinic carries a subsidized fee.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-none border border-gold/30 bg-gold-soft/20 p-4 sm:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-forest-800">
              Have questions before applying?
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Join one of our free 30–45-minute Ask Me Anything (AMA) sessions or request a private 15-minute 1-on-1 consultation.
            </p>
          </div>
          <a
            href="https://bit.ly/4wqSoJV"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-none bg-forest-800 px-4 py-2.5 text-xs font-semibold text-cream hover:bg-forest-700 transition-colors"
          >
            Register for AMA
          </a>
        </div>

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
              <Field label="Phone" hint="Must be WhatsApp-enabled" error={fieldErrors.phone}>
                <Input type="tel" value={form.phone as string} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 000 0000" />
              </Field>
              <Field label="Country" required error={fieldErrors.country}>
                <Combobox
                  value={form.country as string}
                  onChange={(v) => set("country", v)}
                  options={COUNTRIES}
                  placeholder="Search for your country"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Founder social media/online links" hint="Optional" error={fieldErrors.founderSocialLinks}>
                  <Input value={form.founderSocialLinks as string} onChange={(e) => set("founderSocialLinks", e.target.value)} placeholder="LinkedIn, Twitter, Github, etc." />
                </Field>
              </div>
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
                  <div className="sm:col-span-2">
                    <Field label="Co-founder social media/online links" hint="Optional" error={fieldErrors.coFounderSocialLinks}>
                      <Input value={form.coFounderSocialLinks as string} onChange={(e) => set("coFounderSocialLinks", e.target.value)} placeholder="LinkedIn, Twitter, etc." />
                    </Field>
                  </div>
                </>
              )}
            </div>
            {price && (
              <div className="rounded-none border border-gold/30 bg-gold-soft/25 px-5 py-4 text-sm text-ink-soft">
                {price.requiresPayment ? (
                  <>
                    Founder Commitment Contribution fee:{" "}
                    <span className="font-display text-lg font-semibold text-forest-800">
                      USD {price.amount}
                    </span>{" "}
                    — payable only after you&apos;re approved.
                  </>
                ) : (
                  <>The Venture Backability Clinic fee is <span className="font-semibold text-forest-800">waived</span> for venture-backed founders. The accelerator is free.</>
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
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Stage" required error={fieldErrors.stage}>
                  <Select value={form.stage as string} onChange={(e) => set("stage", e.target.value)}>
                    {Object.entries(STAGE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Amount (USD)" required hint="$20k – $1M" error={fieldErrors.raiseAmountUsd}>
                  <Select
                    value={form.raiseAmountUsdSelect || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      set("raiseAmountUsdSelect", val);
                      if (val === "Above $1M") {
                        set("raiseAmountUsd", "Above $1M");
                      } else {
                        set("raiseAmountUsd", val);
                      }
                    }}
                    required
                  >
                    <option value="">Select range</option>
                    {AMOUNT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Select>
                  {form.raiseAmountUsdSelect === "Above $1M" && (
                    <div className="mt-2">
                      <Input
                        value={form.raiseAmountUsdCustom || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          set("raiseAmountUsdCustom", val);
                          set("raiseAmountUsd", `Above $1M (${val})`);
                        }}
                        placeholder="Please specify (e.g., $1.5M, $2M)"
                        required
                      />
                    </div>
                  )}
                </Field>
              </div>

              <Field label="Raise Type(s)" required hint="Select all that apply" error={fieldErrors.raiseType}>
                <div className="grid gap-2 sm:grid-cols-2 mt-2">
                  {RAISE_TYPE_OPTIONS.map((opt) => {
                    const checked = (form.raiseType || []).includes(opt);
                    return (
                      <label key={opt} className="flex items-center gap-3 text-sm text-ink-soft cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const current = form.raiseType || [];
                            const next = e.target.checked
                              ? [...current, opt]
                              : current.filter((x) => x !== opt);
                            set("raiseType", next);
                          }}
                          className="h-4 w-4 accent-emerald rounded border-forest-900/20"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
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
                  <option value="yes">Yes</option>
                  <option value="planning">Planning to</option>
                  <option value="no">No</option>
                </Select>
              </Field>
              <Field label="Incorporated in Africa?" required error={fieldErrors.incorporatedInAfrica}>
                <Select value={form.incorporatedInAfrica as string} onChange={(e) => set("incorporatedInAfrica", e.target.value)}>
                  <option value="yes">Yes</option>
                  <option value="planning">Planning to</option>
                  <option value="no">No</option>
                </Select>
              </Field>
            </div>
          </section>

          {/* Pitch */}
          <section className="space-y-5 rounded-none border border-forest-900/10 bg-white/60 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">Your pitch</h2>
            <Field label="One-liner" hint="What you do, in a sentence" required error={fieldErrors.oneLiner}>
              <Input value={form.oneLiner as string} onChange={(e) => set("oneLiner", e.target.value)} placeholder="We help X do Y so they can Z." maxLength={280} required />
            </Field>
            <Field label="Tell us about your venture" required hint="Max 3000 characters. Please describe the problem, solution, traction, and team." error={fieldErrors.aboutVenture}>
              <TextArea
                value={form.aboutVenture as string}
                onChange={(e) => set("aboutVenture", e.target.value)}
                placeholder="Describe what your venture does, the problem you solve, your current traction, and why you are the team to build this."
                maxLength={3000}
                required
              />
            </Field>
            <Field label="Link to Pitch Deck, Business Plan or any Other Supporting Document" hint="Optional" error={fieldErrors.pitchDeckUrl}>
              <Input value={form.pitchDeckUrl as string} onChange={(e) => set("pitchDeckUrl", e.target.value)} placeholder="https://drive.google.com/..." />
            </Field>
            <Field label="Link to Your Video Presentation, Product Demo, etc." hint="Optional" error={fieldErrors.videoUrl}>
              <Input value={form.videoUrl as string} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://youtube.com/... or https://loom.com/..." />
            </Field>
          </section>

          {/* Commitment */}
          <section className="space-y-5 rounded-none border border-forest-900/10 bg-white/60 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">Commitment &amp; timing</h2>
            <Field label="Why is now the right time for you to join this program?" required hint="Max 2000 characters" error={fieldErrors.commitmentReason}>
              <TextArea
                value={form.commitmentReason as string}
                onChange={(e) => set("commitmentReason", e.target.value)}
                placeholder="Explain why this cohort's timing fits your fundraising goals and what you hope to achieve."
                maxLength={2000}
                required
              />
            </Field>
          </section>

          {/* Discovery */}
          <section className="space-y-5 rounded-none border border-forest-900/10 bg-white/60 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">Discovery</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="How did you hear about this program?"
                required
                error={fieldErrors.howDidYouHearSource || fieldErrors.howDidYouHear}
              >
                <Select
                  value={form.howDidYouHearSource || ""}
                  onChange={(e) => set("howDidYouHearSource", e.target.value)}
                  required
                >
                  <option value="">Select platform / source</option>
                  {HOW_HEARD_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Specific details, handle, or reference link"
                hint="Please include organization name, account handle, individual, or link if applicable"
                error={fieldErrors.howDidYouHearDetails}
              >
                <Input
                  value={form.howDidYouHearDetails as string}
                  onChange={(e) => set("howDidYouHearDetails", e.target.value)}
                  placeholder="e.g. Specific post, page, person name, or link"
                />
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
              I confirm that the information I have provided is accurate to the best of my knowledge and that I agree to the Program&apos;s{" "}
              <Link href="/agreement" target="_blank" className="font-semibold text-emerald hover:underline">
                Founder Participation Agreement
              </Link>
              . If accepted into the program, I will pay the applicable Founder Commitment Contribution within seven (7) days of admission.
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
