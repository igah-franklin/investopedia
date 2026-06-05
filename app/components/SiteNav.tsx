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
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-forest-900/10 bg-cream-soft/85 backdrop-blur-xl py-3 shadow-[0_8px_30px_-18px_rgba(8,35,27,0.45)]"
          : "py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="InvestoVilla home">
          <span className="relative grid h-9 w-9 place-items-center rounded-none bg-forest-800 ring-1 ring-emerald/30">
            <span className="absolute inset-0 rounded-none bg-emerald/0 transition-all duration-500 group-hover:bg-emerald/15" />
            <span className="font-display text-lg font-semibold text-gold-bright">iV</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.05rem] font-semibold tracking-tight text-ink">
              InvestoVilla
            </span>
            <span className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-emerald">
              Pipeline Program
            </span>
          </span>
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
            href="#apply"
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
                className={`h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`overflow-hidden border-t border-forest-900/8 bg-cream-soft/95 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          open ? "max-h-[26rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-none px-4 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-emerald/8 hover:text-forest-700"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#apply"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-none bg-forest-800 px-4 py-3 text-center text-base font-semibold text-cream"
          >
            Apply now
          </a>
        </div>
      </div>
    </header>
  );
}
