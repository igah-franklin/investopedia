import Image from "next/image";
import SiteNav from "./components/SiteNav";
import Reveal from "./components/Reveal";
import Counter from "./components/Counter";
import Faq from "./components/Faq";

/* ── curated, on-theme photography (Unsplash, optimized via next/image) ── */
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const PHOTO = {
  hero: u("1591115765373-5207764f72e7", 1920), // founders pitching in a co-working loft
  heroPortrait: u("1531123897727-8f129e1688ce", 1100), // African founder portrait in Ankara print
  founder: u("1573164713988-8665fc963095", 1000), // African founder with tablet, data centre
  deal: u("1521791136064-7986c2920216", 900), // closing handshake
  mentor: u("1573497491208-6b1acb260507", 900), // one-on-one mentorship by a city window
  strategy: u("1454165804606-c3d57bc86b40", 900), // strategy session with notes
  clinic: u("1542744173-8e7e53415bb0", 900), // boardroom working session
  accelerator: u("1521737711867-e3b97375f902", 900), // team building together at a table
  who: u("1559136555-9303baea8ebd", 1100), // startup studio / open workspace
};

/* ── tiny inline icon set (server-safe, no deps) ───────────────── */
type IconProps = { className?: string };
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Icon = {
  Compass: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.1 5-5 2.1 2.1-5z" />
    </svg>
  ),
  Map: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  ),
  Spark: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  ),
  Globe: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
    </svg>
  ),
  Building: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <path d="M5 21V6l7-3 7 3v15" />
      <path d="M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </svg>
  ),
  Coins: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3" />
      <ellipse cx="15" cy="14" rx="6" ry="3" />
      <path d="M9 17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </svg>
  ),
  Target: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <path d="m5 12.5 4.5 4.5L19 6.5" />
    </svg>
  ),
  Doc: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 13h6M10 17h6" />
    </svg>
  ),
  Users: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M17 15c2.5.4 4 2 4 5" />
    </svg>
  ),
  Rocket: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <path d="M5 15c-1.5 1.5-1.5 5-1.5 5s3.5 0 5-1.5" />
      <path d="M9 15s-1-4 2-7 7-4 9-4c0 2-1 6-4 9s-7 2-7 2Z" />
      <circle cx="14.5" cy="9.5" r="1.4" />
      <path d="M9 15l-1.5-1.5M11 17l-1.5-1.5" />
    </svg>
  ),
  Flag: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <path d="M5 21V4M5 4l8 1.5 6-1V14l-6 1L5 13.5" />
    </svg>
  ),
  Arrow: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Clock: (p: IconProps) => (
    <svg viewBox="0 0 24 24" className={p.className} {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
};

/* ── reusable bits ─────────────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-none border border-emerald/25 bg-emerald/8 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-forest-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
      {children}
    </span>
  );
}

const MARQUEE = [
  "Pre-seed → Series A",
  "Equity or debt",
  "$20k – $1M rounds",
  "Built for Africa",
  "Action-learning",
  "Real market experience",
  "Close in record time",
];

const STATS = [
  { value: 18, suffix: " wks", label: "Full program journey" },
  { value: 12, suffix: " wks", label: "Fundraising accelerator" },
  { value: 2, label: "Live funds you pitch", prefix: "≥" },
  { value: 0, label: "Equity taken — ever", prefix: "" },
];

/* ── page ──────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div id="top" className="relative">
      <SiteNav />

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden bg-forest-950 pt-32 pb-24 text-cream sm:pt-40 sm:pb-28">
        {/* animated aurora orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-10 h-[34rem] w-[34rem] rounded-full bg-emerald/25 blur-[120px] animate-aurora" />
          <div className="absolute right-[-10rem] top-32 h-[30rem] w-[30rem] rounded-full bg-forest-600/40 blur-[120px] animate-aurora [animation-delay:-6s]" />
          <div className="absolute bottom-[-8rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-gold/15 blur-[130px] animate-aurora [animation-delay:-11s]" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-grid-light opacity-60" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            {/* ── text column ── */}
            <div className="lg:col-span-7">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-none border border-mint/25 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-mint backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-bright opacity-75 animate-pulse-ring" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-bright" />
                  </span>
                  Ahead of the InvestoVilla Syndicate · launching Q4 2026
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="mt-7 font-display text-[2.7rem] font-semibold leading-[1.03] tracking-tight sm:text-6xl lg:text-[4.5rem]">
                  Raise smarter.
                  <br />
                  <span className="text-gild">Close faster.</span>
                  <br className="hidden sm:block" /> Build for Africa.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/75">
                  The <span className="font-medium text-cream">InvestoVilla Pipeline Development Program</span> is an
                  action-learning fundraising mentorship that guides African founders through the venture-finance maze —
                  from a fundable story to a closed round, using real market experience.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#apply"
                    className="btn-sheen group inline-flex items-center gap-2 rounded-none bg-gold px-7 py-3.5 text-[0.95rem] font-semibold text-forest-950 shadow-xl shadow-gold/20 transition-all duration-300 hover:bg-gold-bright"
                  >
                    Apply before June 30
                    <Icon.Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#structure"
                    className="inline-flex items-center gap-2 rounded-none border border-cream/20 bg-white/5 px-7 py-3.5 text-[0.95rem] font-semibold text-cream backdrop-blur transition-all duration-300 hover:bg-white/10"
                  >
                    See how it works
                  </a>
                </div>
              </Reveal>

              <Reveal delay={320}>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cream/55">
                  <span className="inline-flex items-center gap-2">
                    <Icon.Check className="h-4 w-4 text-emerald-bright" />
                    Mentorship is <span className="font-semibold text-mint">100% free</span>
                  </span>
                  <span aria-hidden className="hidden h-1 w-1 rounded-full bg-cream/30 sm:block" />
                  <span>only the optional design clinic carries a subsidized fee</span>
                </div>
              </Reveal>
            </div>

            {/* ── image showcase column ── */}
            <Reveal delay={140} className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div aria-hidden className="absolute -inset-4 -z-10 rounded-none bg-gradient-to-br from-emerald/25 via-transparent to-gold/20 blur-2xl" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-none border border-mint/15 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)]">
                  <Image
                    src={PHOTO.heroPortrait}
                    alt="An African founder — building venture-backable companies for the continent"
                    fill
                    preload
                    sizes="(max-width: 1024px) 24rem, 34rem"
                    className="object-cover object-center"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-transparent to-forest-950/10" />
                  <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-white/10" />

                  {/* caption */}
                  <div className="absolute inset-x-5 bottom-5">
                    <p className="font-display text-lg font-semibold leading-tight text-cream">
                      Founders building the African market.
                    </p>
                    <p className="mt-1 text-xs text-cream/70">Pre-seed → Series A · $20k–$1M rounds</p>
                  </div>
                </div>

                {/* floating gold chip */}
                <span className="absolute -left-3 top-6 rounded-none bg-gold px-3.5 py-2 text-[0.7rem] font-bold uppercase tracking-wider text-forest-950 shadow-lg shadow-gold/30 sm:-left-5">
                  0% equity taken
                </span>

                {/* floating glass stat card */}
                <div className="glass-dark absolute -bottom-5 -right-3 flex items-center gap-4 rounded-none px-5 py-3.5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] sm:-right-6">
                  <div>
                    <div className="font-display text-2xl font-semibold leading-none text-gild">≥2</div>
                    <div className="mt-1 text-[0.62rem] font-medium uppercase tracking-wider text-cream/60">
                      Live funds you pitch
                    </div>
                  </div>
                  <div className="h-8 w-px bg-mint/15" />
                  <div>
                    <div className="font-display text-2xl font-semibold leading-none text-mint">12 wks</div>
                    <div className="mt-1 text-[0.62rem] font-medium uppercase tracking-wider text-cream/60">
                      Free accelerator
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* qualifying checklist band */}
          <Reveal delay={200} className="mt-20">
            <div className="glass-dark rounded-none p-6 sm:p-8">
              <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-mint/80">
                This program is right for you if you can say “yes” to all of these
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  "Building a game-changing startup in Africa",
                  "Raising — or planning to raise — capital",
                  "Your round is $20k – $1M (equity or debt)",
                  "You want expert guidance through the raise",
                ].map((q) => (
                  <div
                    key={q}
                    className="flex items-center gap-3 rounded-none bg-white/5 px-4 py-3.5 ring-1 ring-mint/10 transition-colors duration-300 hover:bg-white/10"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald/20 text-emerald-bright">
                      <Icon.Check className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-cream/85">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════ MARQUEE ════════════════ */}
      <div className="relative -mt-px overflow-hidden border-y border-forest-900/10 bg-forest-900 py-4">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-10 text-sm font-medium tracking-wide text-mint/70">
              {m}
              <span className="text-gold/50">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════ STATS ════════════════ */}
      <section className="relative bg-cream py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-none border border-forest-900/10 bg-forest-900/10 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="bg-cream-soft">
                <div className="flex h-full flex-col items-center justify-center px-4 py-9 text-center">
                  <div className="font-display text-4xl font-semibold text-forest-700 sm:text-5xl">
                    <Counter to={s.value} prefix={s.prefix ?? ""} suffix={s.suffix ?? ""} />
                  </div>
                  <div className="mt-2 text-sm font-medium text-muted">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ ABOUT ════════════════ */}
      <section id="about" className="relative scroll-mt-24 overflow-hidden bg-cream py-24 sm:py-32">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
        <div aria-hidden className="pointer-events-none absolute -left-40 top-24 h-[26rem] w-[26rem] rounded-full bg-emerald/8 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -right-40 bottom-10 h-[24rem] w-[24rem] rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          {/* centered header */}
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Eyebrow>About the program</Eyebrow>
              <h2 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-[3rem]">
                Africa&apos;s early-stage founders face a hidden tax on{" "}
                <span className="text-emerald-gild">perceived risk.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
                We close that gap with structure, guidance and real market experience — so the right ventures stop
                getting priced out of the rooms where capital is decided.
              </p>
            </Reveal>
          </div>

          {/* editorial feature: image mosaic + narrative */}
          <div className="mt-16 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* mosaic */}
            <Reveal className="lg:col-span-7">
              <div className="relative">
                <div aria-hidden className="absolute -inset-4 -z-10 rounded-none bg-gradient-to-br from-emerald/12 via-transparent to-gold/14 blur-2xl" />
                <div className="grid grid-cols-12 gap-4 sm:gap-5">
                  {/* primary — tall */}
                  <div className="group relative col-span-7 aspect-[3/4] overflow-hidden rounded-none border border-forest-900/10 shadow-[0_30px_70px_-42px_rgba(8,35,27,0.65)]">
                    <Image
                      src={PHOTO.founder}
                      alt="An African founder reviewing data — building venture-backable companies on the continent"
                      fill
                      sizes="(max-width: 1024px) 60vw, 30rem"
                      className="object-cover transition-transform duration-[1.1s] group-hover:scale-105"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-950/65 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-none bg-gold px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-forest-950">
                      0% equity taken
                    </span>
                    <p className="absolute bottom-4 left-4 right-4 font-display text-lg font-semibold leading-tight text-cream">
                      Real market experience, not just theory.
                    </p>
                  </div>

                  {/* two stacked */}
                  <div className="col-span-5 flex flex-col gap-4 sm:gap-5">
                    <div className="group relative aspect-[4/5] flex-1 overflow-hidden rounded-none border border-forest-900/10 shadow-[0_24px_60px_-40px_rgba(8,35,27,0.6)]">
                      <Image
                        src={PHOTO.mentor}
                        alt="A founder in a one-on-one mentorship session"
                        fill
                        sizes="(max-width: 1024px) 40vw, 18rem"
                        className="object-cover transition-transform duration-[1.1s] group-hover:scale-105"
                      />
                      <div aria-hidden className="absolute inset-0 bg-forest-950/10 transition-colors duration-500 group-hover:bg-forest-950/0" />
                    </div>
                    <div className="group relative aspect-[4/5] flex-1 overflow-hidden rounded-none border border-forest-900/10 shadow-[0_24px_60px_-40px_rgba(8,35,27,0.6)]">
                      <Image
                        src={PHOTO.deal}
                        alt="Two parties shaking hands as a funding round closes"
                        fill
                        sizes="(max-width: 1024px) 40vw, 18rem"
                        className="object-cover transition-transform duration-[1.1s] group-hover:scale-105"
                      />
                      <div aria-hidden className="absolute inset-0 bg-forest-950/10 transition-colors duration-500 group-hover:bg-forest-950/0" />
                    </div>
                  </div>
                </div>

                {/* floating glass stat card */}
                <div className="glass absolute -bottom-7 right-2 hidden rounded-none px-6 py-4 shadow-[0_24px_60px_-30px_rgba(8,35,27,0.55)] sm:block">
                  <div className="flex items-center gap-5">
                    <div>
                      <div className="font-display text-3xl font-semibold text-forest-700">≥2</div>
                      <div className="text-[0.7rem] font-medium uppercase tracking-wider text-muted">Live funds you pitch</div>
                    </div>
                    <div className="h-10 w-px bg-forest-900/12" />
                    <div>
                      <div className="font-display text-3xl font-semibold text-forest-700">$20k–1M</div>
                      <div className="text-[0.7rem] font-medium uppercase tracking-wider text-muted">Target round size</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* narrative */}
            <div className="lg:col-span-5">
              <Reveal delay={120}>
                <p className="text-lg leading-relaxed text-ink-soft">
                  The venture-financing landscape is turning brutal for early-stage African startups — fewer small
                  cheques, relatively more mid-sized ones. That gap is driven by{" "}
                  <span className="font-medium text-forest-700">perceived rather than actual risk</span>, and it hits
                  hardest for founders without structured guidance or deep market experience.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <div className="mt-8 rounded-none border-l-4 border-gold bg-gold-soft/30 p-6">
                  <p className="text-[0.97rem] leading-relaxed text-ink-soft">
                    <span className="font-semibold text-forest-800">Our answer:</span> a practical, action-learning
                    mentorship — built on real market experience — that walks beside you, step by step, until your round
                    closes on the best possible terms.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={280}>
                <div className="mt-8 flex flex-wrap gap-3">
                  {["Action-learning", "Real funds", "Built for Africa"].map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-none border border-forest-900/12 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-forest-700 backdrop-blur"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          {/* capability cards — full-width strip */}
          <div className="mt-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Icon.Map,
                title: "Read the landscape",
                body: "Understand the African venture-finance ecosystem and where your venture truly fits within it.",
              },
              {
                icon: Icon.Compass,
                title: "Build your strategy",
                body: "Develop a funding and fundraising strategy tailored to your stage, sector and geography.",
              },
              {
                icon: Icon.Target,
                title: "Step-by-step guidance",
                body: "Navigate your raise with practical, hands-on support at every checkpoint of the journey.",
              },
              {
                icon: Icon.Coins,
                title: "Close the best deal",
                body: "Aim to close your round in record time — and on the strongest terms with your investors.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <div className="lift group relative h-full overflow-hidden rounded-none border border-forest-900/10 bg-white/70 p-6 shadow-[0_18px_50px_-30px_rgba(8,35,27,0.4)] backdrop-blur hover:shadow-[0_28px_60px_-32px_rgba(8,35,27,0.5)]">
                  <span className="absolute right-5 top-4 font-display text-3xl font-semibold text-forest-900/8">
                    0{i + 1}
                  </span>
                  <div className="grid h-12 w-12 place-items-center rounded-none bg-forest-800 text-mint transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                    <c.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{c.body}</p>
                  <div aria-hidden className="mt-5 h-px w-full bg-gradient-to-r from-emerald/40 via-forest-900/10 to-transparent" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ WHO IT'S FOR ════════════════ */}
      <section id="who" className="relative scroll-mt-24 overflow-hidden bg-forest-900 py-24 text-cream sm:py-32">
        <div aria-hidden className="absolute inset-0 bg-grid-light opacity-50" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-emerald/15 blur-[120px] animate-float-slow" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <Eyebrow>Who it&apos;s for</Eyebrow>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-[2.9rem]">
                Made for founders building the{" "}
                <span className="text-gild">African market.</span>
              </h2>
              <p className="mt-5 text-lg text-cream/70">
                You qualify if your venture checks these boxes — wherever in the world you sit today.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-stretch">
            <Reveal className="lg:col-span-5">
              <div className="group relative h-full min-h-[22rem] overflow-hidden rounded-none border border-mint/15 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.8)]">
                <Image
                  src={PHOTO.who}
                  alt="A modern startup studio where founders build for the African market"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40rem"
                  className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/45 to-forest-950/10" />
                <div aria-hidden className="absolute inset-0 bg-emerald/10 mix-blend-overlay" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="inline-flex items-center gap-2 rounded-none border border-mint/25 bg-white/5 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-mint backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-bright" />
                    Pre-seed → Series A
                  </span>
                  <p className="mt-4 font-display text-2xl font-semibold leading-snug text-cream">
                    Wherever you sit today, you&apos;re building the{" "}
                    <span className="text-gild">African market.</span>
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {[
              {
                icon: Icon.Globe,
                title: "Building for Africa",
                body: "An African building for Africa, an African in the diaspora building for the African market, or a non-African building for an African market.",
              },
              {
                icon: Icon.Building,
                title: "Rooted on the continent",
                body: "Your venture has — or plans to have — its headquarters in Africa.",
              },
              {
                icon: Icon.Flag,
                title: "Incorporated in Africa",
                body: "Incorporated or planning to incorporate in Africa. Ventures incorporated abroad but legally registered in Africa are welcome.",
              },
              {
                icon: Icon.Coins,
                title: "Raising $20k – $1M",
                body: "Raising equity or debt between $20k and $1M, from pre-seed to Series A. Bootstrapped ventures raising beyond Series A are welcome to apply.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <div className="lift group flex h-full gap-5 rounded-none border border-mint/12 bg-white/[0.04] p-6 backdrop-blur transition-colors duration-500 hover:bg-white/[0.07] sm:p-7">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-none bg-emerald/15 text-emerald-bright ring-1 ring-mint/15 transition-transform duration-500 group-hover:scale-110">
                    <c.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-cream">{c.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-cream/65">{c.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ STRUCTURE ════════════════ */}
      <section id="structure" className="relative scroll-mt-24 bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <Eyebrow>Program structure</Eyebrow>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-[2.9rem]">
                Two phases, one outcome:{" "}
                <span className="text-emerald-gild">a closed round.</span>
              </h2>
              <p className="mt-5 text-lg text-muted">
                A diagnostic clinic to sharpen your story, then a 12-week accelerator to run the raise — by doing, not
                just theorizing.
              </p>
            </Reveal>
          </div>

          {/* timeline */}
          <Reveal delay={80} className="mx-auto mt-12 max-w-3xl">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
              {[
                { k: "Clinic", v: "2–4 weeks" },
                { k: "Break", v: "2 weeks" },
                { k: "Accelerator", v: "6–12 weeks" },
              ].map((t, i, arr) => (
                <div key={t.k} className="flex items-center gap-3">
                  <span className="rounded-none border border-forest-900/12 bg-white/70 px-4 py-2 text-forest-700">
                    <span className="font-semibold">{t.k}</span>
                    <span className="text-muted"> · {t.v}</span>
                  </span>
                  {i < arr.length - 1 && <Icon.Arrow className="h-4 w-4 text-emerald" />}
                </div>
              ))}
              <span className="rounded-none bg-forest-800 px-4 py-2 font-semibold text-cream">≈ 18 weeks total</span>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {/* Clinic */}
            <Reveal>
              <div className="lift group relative flex h-full flex-col overflow-hidden rounded-none border border-forest-900/10 bg-white/75 p-8 shadow-[0_24px_70px_-40px_rgba(8,35,27,0.55)] backdrop-blur sm:p-10">
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gold/10 blur-2xl transition-all duration-700 group-hover:scale-150" />
                <div className="relative -mx-8 -mt-8 mb-7 h-44 overflow-hidden sm:-mx-10 sm:-mt-10">
                  <Image
                    src={PHOTO.clinic}
                    alt="Founders in a focused business-design working session"
                    fill
                    sizes="(max-width: 1024px) 100vw, 36rem"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                </div>
                <div className="relative flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-none bg-gold-soft/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest-800">
                    Phase 1
                  </span>
                  <span className="rounded-none bg-forest-900/5 px-3 py-1 text-xs font-medium text-muted">
                    2 or 4 weeks · paid &amp; optional
                  </span>
                </div>
                <h3 className="relative mt-5 font-display text-2xl font-semibold text-ink sm:text-3xl">
                  Business Design Clinic
                </h3>
                <p className="relative mt-3 italic text-forest-700">
                  “You can&apos;t tell a good story if you don&apos;t have a story.”
                </p>

                <div className="relative mt-7 space-y-2.5">
                  {[
                    "Business modelling & design",
                    "Product-market fit",
                    "Venture backability assessment",
                    "Pattern recognition (Froebelian learning)",
                    "Group facilitation & executive peer board",
                    "One-on-one consulting",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald/12 text-emerald">
                        <Icon.Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[0.95rem] text-ink-soft">{t}</span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-7 rounded-none bg-forest-900/[0.04] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest-700">Deliverables</p>
                  <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                    <li className="flex gap-2">
                      <Icon.Doc className="h-[18px] w-[18px] shrink-0 text-emerald" />A pre-approved lean canvas
                    </li>
                    <li className="flex gap-2">
                      <Icon.Coins className="h-[18px] w-[18px] shrink-0 text-emerald" />A funding request submitted to ≥ 2
                      funds actively deploying
                    </li>
                  </ul>
                </div>

                <p className="relative mt-6 text-sm leading-relaxed text-muted">
                  Runs as an <span className="font-medium text-forest-700">intensive (2-week)</span> or{" "}
                  <span className="font-medium text-forest-700">regular (4-week)</span> class. Founders ready to raise
                  immediately can submit requests to two real funds; successful applicants may flow straight into the
                  accelerator.
                </p>
              </div>
            </Reveal>

            {/* Accelerator */}
            <Reveal delay={120}>
              <div className="lift group relative flex h-full flex-col overflow-hidden rounded-none border border-mint/15 bg-forest-900 p-8 text-cream shadow-[0_24px_70px_-36px_rgba(8,35,27,0.8)] sm:p-10">
                <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-emerald/25 blur-3xl transition-all duration-700 group-hover:scale-150" />
                <div aria-hidden className="absolute inset-0 bg-grid-light opacity-40" />
                <div className="relative -mx-8 -mt-8 mb-7 h-44 overflow-hidden sm:-mx-10 sm:-mt-10">
                  <Image
                    src={PHOTO.accelerator}
                    alt="A founding team building together — learning by doing"
                    fill
                    sizes="(max-width: 1024px) 100vw, 36rem"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/45 to-transparent" />
                  <div aria-hidden className="absolute inset-0 bg-emerald/10 mix-blend-overlay" />
                </div>
                <div className="relative flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-none bg-emerald/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-bright">
                    Phase 2
                  </span>
                  <span className="rounded-none bg-white/10 px-3 py-1 text-xs font-medium text-mint">
                    12 weeks · 100% free
                  </span>
                </div>
                <h3 className="relative mt-5 font-display text-2xl font-semibold sm:text-3xl">
                  The Fundraising Accelerator
                </h3>
                <p className="relative mt-3 italic text-mint/85">
                  Learning by doing — action-learning, not just theory.
                </p>

                <div className="relative mt-7 space-y-2.5">
                  {[
                    "Startup funding theories & the venture-finance landscape",
                    "Developing your fundraising strategy",
                    "Fundraising capstone & mentorship",
                    "Flipped classroom + group coaching",
                    "Capstone & fundraising hackathon",
                    "Fortnightly check-ins and field support",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald/25 text-emerald-bright">
                        <Icon.Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[0.95rem] text-cream/85">{t}</span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-7 rounded-none bg-white/[0.06] p-5 ring-1 ring-mint/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-mint">Deliverables</p>
                  <ul className="mt-3 space-y-2 text-sm text-cream/85">
                    <li className="flex gap-2">
                      <Icon.Check className="h-[18px] w-[18px] shrink-0 text-emerald-bright" />
                      Complete the asynchronous fundraising course
                    </li>
                    <li className="flex gap-2">
                      <Icon.Users className="h-[18px] w-[18px] shrink-0 text-emerald-bright" />
                      Build your fundraising plan with your group
                    </li>
                    <li className="flex gap-2">
                      <Icon.Rocket className="h-[18px] w-[18px] shrink-0 text-emerald-bright" />
                      Launch a real raise with expert review & field support
                    </li>
                  </ul>
                </div>

                <p className="relative mt-6 text-sm leading-relaxed text-cream/65">
                  Top performers gain access to curated investors, syndicate programs and allied funds. A shorter 6–8
                  week track exists, but we encourage the full 12 weeks for better synthesis into an actual raise.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════ TIMELINE ════════════════ */}
      <section id="timeline" className="relative scroll-mt-24 bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* header */}
          <Reveal className="max-w-3xl">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald">
              § 05 — Timeline
            </p>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-ink sm:text-[3.1rem]">
              18 weeks, end to end.
            </h2>
            <p className="mt-5 max-w-xl text-[0.97rem] leading-relaxed text-muted">
              Tentative dates — adjusted to cohort needs at the training lead&apos;s discretion.
            </p>
          </Reveal>

          {/* rows */}
          <div className="mt-14 border-t border-forest-900/12">
            {[
              {
                when: "Jul 31, 2026",
                title: "Cohort begins",
                desc: "Design clinic opens for accepted founders.",
              },
              {
                when: "Weeks 1–4",
                title: "Business design clinic",
                desc: "Sharpen the model. Submit first funding requests.",
              },
              {
                when: "+ 2 weeks",
                title: "Break",
                desc: "Synthesis. Investor feedback. Prep for the accelerator.",
              },
              {
                when: "Weeks 7–18",
                title: "Fundraising accelerator",
                desc: "12 weeks of live raising under expert guidance.",
              },
              {
                when: "Dec 4, 2026",
                title: "Cohort closes",
                desc: "Capstone, mentor reviews, investor introductions.",
              },
            ].map((t, i) => (
              <Reveal key={t.title} delay={i * 70}>
                <div className="group relative grid grid-cols-1 gap-2 border-b border-forest-900/12 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                  {/* vertical rail (continuous across rows) */}
                  <div
                    aria-hidden
                    className="absolute left-[6px] top-0 bottom-0 w-px bg-forest-900/12"
                  />
                  {/* date + node */}
                  <div className="relative flex items-center gap-4 sm:col-span-3">
                    <span
                      aria-hidden
                      className="relative z-10 h-3 w-3 shrink-0 rounded-full bg-emerald ring-4 ring-cream transition-transform duration-300 group-hover:scale-125"
                    />
                    <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                      {t.when}
                    </span>
                  </div>
                  {/* milestone */}
                  <h3 className="font-display text-2xl font-medium leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-forest-700 sm:col-span-4 sm:text-[1.6rem]">
                    {t.title}
                  </h3>
                  {/* description */}
                  <p className="text-[0.95rem] leading-relaxed text-muted sm:col-span-5">
                    {t.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PRICING ════════════════ */}
      <section id="pricing" className="relative scroll-mt-24 overflow-hidden bg-cream-soft py-24 sm:py-32">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
        <div aria-hidden className="pointer-events-none absolute -left-40 top-32 h-[26rem] w-[26rem] rounded-full bg-emerald/8 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -right-40 bottom-24 h-[24rem] w-[24rem] rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <Eyebrow>Cost of participation</Eyebrow>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-[2.9rem]">
                The mentorship is <span className="text-emerald-gild">entirely free.</span>
              </h2>
              <p className="mt-5 text-lg text-muted">
                Only the optional Business Design Clinic carries a subsidized, non-refundable fee — a quality filter to
                keep the cohort committed. Here&apos;s how the pilot-cohort pricing works.
              </p>
            </Reveal>
          </div>

          {/* free-accelerator highlight band */}
          <Reveal delay={60} className="mx-auto mt-12 max-w-5xl">
            <div className="group relative overflow-hidden rounded-none border border-mint/15 bg-forest-900 px-7 py-7 text-cream shadow-[0_28px_80px_-44px_rgba(8,35,27,0.85)] sm:px-10">
              <div aria-hidden className="absolute inset-0 bg-grid-light opacity-40" />
              <div aria-hidden className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-emerald/25 blur-3xl transition-transform duration-700 group-hover:scale-125" />
              <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-none bg-emerald/15 text-emerald-bright ring-1 ring-mint/20">
                    <Icon.Rocket className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-mint">
                      The 12-week Fundraising Accelerator
                    </p>
                    <p className="mt-1.5 font-display text-2xl font-semibold leading-tight sm:text-[1.9rem]">
                      Always 100% free — we never take equity.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 border-mint/15 sm:border-l sm:pl-10 sm:text-right">
                  <div className="font-display text-6xl font-semibold leading-none text-gild">$0</div>
                  <p className="mt-2 text-xs text-cream/60">You only pay for the optional clinic</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* deadline banner */}
          <Reveal delay={120} className="mx-auto mt-6 max-w-5xl">
            <div className="flex flex-col items-center gap-3 rounded-none border border-gold/40 bg-gold-soft/30 px-6 py-4 text-center sm:flex-row sm:text-left">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/20 text-forest-800">
                <Icon.Clock className="h-5 w-5" />
              </span>
              <p className="text-sm leading-relaxed text-ink-soft">
                <span className="font-semibold text-forest-800">Introductory deadline · June 30, 2026.</span> Early
                applicants can request a need-based reduction — offered first-come, first-served, and closing
                automatically once half the seats are filled.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid items-center gap-6 lg:grid-cols-3">
            {[
              {
                tag: "Standard pilot",
                single: "$297",
                duo: "$350",
                was: "$495",
                save: "40% pilot discount",
                note: "single · / two co-founders",
                features: [
                  "2 or 4-week Business Design Clinic",
                  "Pre-approved lean canvas",
                  "Funding request to ≥2 active funds",
                  "Free entry to the 12-week accelerator",
                ],
                featured: false,
              },
              {
                tag: "Need-based",
                single: "$108",
                duo: "$162",
                was: "$297",
                save: "Up to 63% off",
                note: "single · / two co-founders",
                features: [
                  "Everything in Standard pilot",
                  "Reserved for early applicants",
                  "Granted by need, first-come first-served",
                  "Closes once 50% of seats fill",
                ],
                featured: true,
              },
              {
                tag: "Already venture-backed",
                single: "Free",
                duo: "Clinic optional",
                was: null as string | null,
                save: "Clinic waived",
                note: "Skip straight to consideration",
                features: [
                  "Skip the design clinic entirely",
                  "Straight to accelerator consideration",
                  "Validated by your prior priced round",
                  "Focus on performance, not re-validation",
                ],
                featured: false,
              },
            ].map((p, i) => (
              <Reveal key={p.tag} delay={i * 110} className={p.featured ? "lg:-my-4" : ""}>
                <div
                  className={`lift group relative flex h-full flex-col overflow-hidden rounded-none p-8 ${
                    p.featured
                      ? "border-2 border-gold bg-forest-900 text-cream shadow-[0_34px_90px_-40px_rgba(199,154,58,0.65)] lg:py-11"
                      : "border border-forest-900/10 bg-white/75 text-ink shadow-[0_20px_60px_-40px_rgba(8,35,27,0.5)] backdrop-blur"
                  }`}
                >
                  {p.featured && (
                    <>
                      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gold/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
                      <span className="absolute right-5 top-5 rounded-none bg-gold px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-forest-950">
                        Best value
                      </span>
                    </>
                  )}

                  <div className="relative flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                        p.featured ? "text-gold-bright" : "text-forest-700"
                      }`}
                    >
                      {p.tag}
                    </span>
                    {!p.featured && (
                      <span className="rounded-none bg-emerald/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700">
                        {p.save}
                      </span>
                    )}
                  </div>

                  <div className="relative mt-6 flex items-end gap-2.5">
                    {p.was && (
                      <span
                        className={`pb-1.5 font-display text-xl font-medium line-through ${
                          p.featured ? "text-cream/35" : "text-muted/55"
                        }`}
                      >
                        {p.was}
                      </span>
                    )}
                    <span className="font-display text-6xl font-semibold leading-none tracking-tight">{p.single}</span>
                  </div>
                  <p className={`relative mt-2 text-xs ${p.featured ? "text-cream/55" : "text-muted"}`}>
                    {p.duo === "Clinic optional" ? p.duo : `${p.duo} for two co-founders`}
                  </p>
                  {p.featured && (
                    <span className="relative mt-3 inline-flex w-fit items-center gap-1.5 rounded-none bg-gold/15 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-bright">
                      {p.save}
                    </span>
                  )}

                  <div
                    aria-hidden
                    className={`relative mt-7 h-px w-full ${
                      p.featured
                        ? "bg-gradient-to-r from-gold/50 via-mint/15 to-transparent"
                        : "bg-gradient-to-r from-emerald/40 via-forest-900/10 to-transparent"
                    }`}
                  />

                  <ul className="relative mt-6 flex-1 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                            p.featured ? "bg-emerald/25 text-emerald-bright" : "bg-emerald/12 text-emerald"
                          }`}
                        >
                          <Icon.Check className="h-3.5 w-3.5" />
                        </span>
                        <span className={`text-[0.92rem] leading-snug ${p.featured ? "text-cream/85" : "text-ink-soft"}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#apply"
                    className={`btn-sheen relative mt-8 inline-flex items-center justify-center gap-2 rounded-none px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
                      p.featured
                        ? "bg-gold text-forest-950 hover:bg-gold-bright"
                        : "bg-forest-800 text-cream hover:bg-forest-700"
                    }`}
                  >
                    Start application
                    <Icon.Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-none border border-forest-900/10 bg-white/50 px-5 py-4 backdrop-blur">
              <Icon.Doc className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" />
              <p className="text-xs leading-relaxed text-muted">
                <span className="font-semibold text-forest-700">Refunds:</span> the $108 need-based rate is
                non-refundable. The $297 rate is fully refundable up to 2 weeks before start, 50% up to 7 days before —
                no refund once the clinic begins, including for no-shows. Acceptance is on a rolling basis.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════ HOW TO APPLY ════════════════ */}
      <section id="apply" className="relative scroll-mt-24 overflow-hidden bg-forest-950 py-24 text-cream sm:py-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-emerald/20 blur-[120px] animate-aurora" />
          <div className="absolute right-[-8rem] top-10 h-[24rem] w-[24rem] rounded-full bg-gold/12 blur-[120px] animate-aurora [animation-delay:-8s]" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-grid-light opacity-50" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <Reveal>
                <Eyebrow>How to apply</Eyebrow>
                <h2 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-[3rem]">
                  Four steps to your <span className="text-gild">strongest raise yet.</span>
                </h2>
                <p className="mt-5 text-lg text-cream/70">
                  The application is simple and honest. Be detailed — once accepted, you&apos;ll create a profile and pay
                  for the design clinic within 7 days.
                </p>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/apply"
                    className="btn-sheen group inline-flex items-center justify-center gap-2 rounded-none bg-gold px-7 py-3.5 text-[0.95rem] font-semibold text-forest-950 shadow-xl shadow-gold/20 transition-all duration-300 hover:bg-gold-bright"
                  >
                    Start your application
                    <Icon.Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
                <p className="mt-4 text-sm text-cream/55">
                  Submit a pitch deck, business plan or any relevant material. Videos optional · request need-based
                  reduction if applicable.
                </p>
              </Reveal>
            </div>

            <div className="relative">
              {/* connecting line */}
              <div aria-hidden className="absolute left-[1.85rem] top-4 bottom-4 w-px bg-gradient-to-b from-emerald/50 via-mint/20 to-transparent" />
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: Icon.Doc,
                    title: "Submit your application",
                    body: "Complete the form at pipeline.amstevehouse.com with a pitch deck, business plan or supporting material.",
                  },
                  {
                    icon: Icon.Check,
                    title: "Get reviewed",
                    body: "We assess your submission for fit and venture-backability. Acceptance is rolling.",
                  },
                  {
                    icon: Icon.Coins,
                    title: "Create a profile & pay",
                    body: "If approved, set up your profile and settle the (subsidized) design-clinic fee within 7 days.",
                  },
                  {
                    icon: Icon.Rocket,
                    title: "Start the journey",
                    body: "Move through the clinic and into the 12-week accelerator — and toward a closed round.",
                  },
                ].map((s, i) => (
                  <Reveal key={s.title} delay={i * 110}>
                    <div className="lift group relative flex gap-5 rounded-none border border-mint/12 bg-white/[0.04] p-5 backdrop-blur transition-colors duration-500 hover:bg-white/[0.08]">
                      <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest-800 text-emerald-bright ring-4 ring-forest-950 transition-transform duration-500 group-hover:scale-110">
                        <s.icon className="h-[22px] w-[22px]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gold-bright">0{i + 1}</span>
                          <h3 className="font-display text-lg font-semibold text-cream">{s.title}</h3>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-cream/65">{s.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ FAQ ════════════════ */}
      <section id="faq" className="relative scroll-mt-24 bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* sticky heading column */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald">
                    § #06 — Questions
                  </p>
                  <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-ink sm:text-[3.1rem]">
                    Frequently asked.
                  </h2>
                  <p className="mt-5 max-w-xs text-[0.97rem] leading-relaxed text-muted">
                    Still unsure? The application is short — answering it often clarifies things.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* scrolling list column */}
            <div className="lg:col-span-8">
              <Faq />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="relative overflow-hidden bg-forest-900 py-20 text-cream">
        <div aria-hidden className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald/20 blur-[110px] animate-float" />
        <div aria-hidden className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-gold/12 blur-[110px] animate-float-slow" />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Your round deserves a <span className="text-gild">real strategy.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-cream/70">
              Join the pilot cohort of the InvestoVilla Pipeline Development Program and raise with structure, guidance
              and real market experience behind you.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/apply"
                className="btn-sheen group inline-flex items-center gap-2 rounded-none bg-gold px-8 py-4 text-base font-semibold text-forest-950 shadow-xl shadow-gold/20 transition-all duration-300 hover:bg-gold-bright"
              >
                Apply now
                <Icon.Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#structure"
                className="inline-flex items-center gap-2 rounded-none border border-cream/20 bg-white/5 px-8 py-4 text-base font-semibold text-cream backdrop-blur transition-all duration-300 hover:bg-white/10"
              >
                Review the program
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="bg-forest-950 py-12 text-cream/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 border-b border-mint/10 pb-8 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-none bg-forest-800 ring-1 ring-emerald/30">
                <span className="font-display text-lg font-semibold text-gold-bright">iV</span>
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-display text-[1.05rem] font-semibold text-cream">InvestoVilla</span>
                <span className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-emerald">
                  Pipeline Program
                </span>
              </div>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              {["About", "Who it's for", "Structure", "Cost", "Apply", "FAQ"].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase().replace(/[^a-z]/g, "").replace("whoitsfor", "who").replace("cost", "pricing")}`}
                  className="transition-colors hover:text-mint"
                >
                  {l}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs sm:flex-row">
            <p>© 2026 InvestoVilla Pipeline Development Program. An AmSteveHouse initiative.</p>
            <a href="https://pipeline.amstevehouse.com" className="font-medium text-mint transition-colors hover:text-emerald-bright">
              pipeline.amstevehouse.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
