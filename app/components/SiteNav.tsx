"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#who", label: "Who it's for" },
  { href: "#structure", label: "Structure" },
  { href: "#pricing", label: "Cost" },
  { href: "#apply", label: "Apply" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled
        ? "border-b border-forest-900/10 bg-cream-soft/85 backdrop-blur-xl py-3 shadow-[0_8px_30px_-18px_rgba(8,35,27,0.45)]"
        : "py-5"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="InvestoVilla home">
          <img
            src="/investovilla-logo.png"
            alt="InvestoVilla Logo"
            className="h-9 w-auto object-contain"
          />
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative rounded-none px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-forest-700"
            >
              <span className="relative z-10">{l.label}</span>
              <span className="absolute inset-0 scale-90 rounded-none bg-emerald/0 opacity-0 transition-all duration-300 hover:bg-emerald/8 hover:opacity-100" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden text-sm font-semibold text-ink transition-colors hover:text-forest-700 sm:inline-flex"
          >
            Log in
          </a>
          <a
            href="/apply"
            className="btn-sheen hidden rounded-none bg-forest-800 px-5 py-2.5 text-sm font-semibold text-cream shadow-lg shadow-forest-900/20 transition-all duration-300 hover:bg-forest-700 hover:shadow-forest-900/30 sm:inline-flex"
          >
            Apply now
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-none border border-forest-900/12 bg-white/60 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="flex flex-col gap-[5px]">
              <span
                className={`h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""
                  }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ${open ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
              />
            </div>
          </button>
        </div>
      </nav>
      </header>

      {/* Mobile drawer — slides in from the right (rendered outside the
          header so its background never inherits a nested backdrop-filter) */}
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-[60] bg-forest-950/50 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      />
      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-[70] flex w-[82%] max-w-sm flex-col border-l border-forest-900/10 bg-cream-soft shadow-[-20px_0_60px_-30px_rgba(8,35,27,0.55)] transition-transform duration-500 ease-out lg:hidden ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b border-forest-900/8 px-5 py-4 sm:px-8">
          <span className="flex items-center gap-2.5">
            <img
              src="/investovilla-icon.png"
              alt="InvestoVilla Icon"
              className="h-8 w-auto object-contain"
            />
            <span className="font-display text-[1.05rem] font-semibold tracking-tight text-ink">
              Pipeline
            </span>
          </span>
          <button
            onClick={close}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-none border border-forest-900/12 bg-white/60 text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 px-5 py-6 sm:px-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="rounded-none px-4 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-emerald/8 hover:text-forest-700"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/apply"
            onClick={close}
            className="mt-2 rounded-none bg-forest-800 px-4 py-3 text-center text-base font-semibold text-cream"
          >
            Apply now
          </a>
          <a
            href="/login"
            onClick={close}
            className="rounded-none border border-forest-900/15 px-4 py-3 text-center text-base font-semibold text-ink"
          >
            Log in
          </a>
        </div>
      </aside>
    </>
  );
}
