"use client";

import { useEffect, useId, useRef, useState } from "react";
import type {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ButtonHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";

const labelCls = "block text-sm font-semibold text-ink-soft";
const hintCls = "mt-1 text-xs text-muted";
const errCls = "mt-1 text-xs font-medium text-red-600";
const controlCls =
  "mt-1.5 w-full rounded-none border border-forest-900/15 bg-white/80 px-4 py-2.5 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-emerald focus:ring-2 focus:ring-emerald/20";

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {required && <span className="text-emerald"> *</span>}
      </span>
      {children}
      {hint && !error && <span className={hintCls}>{hint}</span>}
      {error && <span className={errCls}>{error}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlCls} ${props.className || ""}`} />;
}

// A password field with a show/hide toggle.
export function PasswordInput({
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${controlCls} pr-12 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 mt-1.5 grid w-11 place-items-center text-muted transition-colors hover:text-forest-700"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a18 18 0 0 1-2.16 3.19M6.6 6.6A18 18 0 0 0 2 12s3.5 7 10 7a9.3 9.3 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

// A searchable single-select dropdown (combobox). Filters `options` by the
// typed query and lets the user pick one. The selected value is the option string.
export function Combobox({
  value,
  onChange,
  options,
  placeholder,
  id,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  id?: string;
  required?: boolean;
}) {
  const generatedId = useId();
  const listId = id || generatedId;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  // The text shown in the box: while open and searching, the live query;
  // otherwise the committed value.
  const display = open ? query : value;

  const filtered = (() => {
    const q = query.trim().toLowerCase();
    if (!open || !q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  })();

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (opt: string) => {
    onChange(opt);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (open && filtered[active]) {
        e.preventDefault();
        choose(filtered[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        className={`${controlCls} pr-10`}
        placeholder={placeholder}
        value={display}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {/* Hidden field so the value participates in native required validation. */}
      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value}
          onChange={() => {}}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
      )}
      <span className="pointer-events-none absolute inset-y-0 right-0 mt-1.5 grid w-9 place-items-center text-muted">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto border border-forest-900/15 bg-white shadow-[0_24px_70px_-44px_rgba(8,35,27,0.5)]"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-2.5 text-sm text-muted">No matches</li>
          ) : (
            filtered.map((opt, i) => (
              <li
                key={opt}
                role="option"
                aria-selected={opt === value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(opt);
                }}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer px-4 py-2.5 text-sm ${
                  i === active ? "bg-emerald/10 text-forest-800" : "text-ink"
                } ${opt === value ? "font-semibold" : ""}`}
              >
                {opt}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${controlCls} min-h-24 ${props.className || ""}`} />;
}

export function Select({
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select {...props} className={`${controlCls} ${props.className || ""}`}>
      {children}
    </select>
  );
}

export function Button({
  children,
  variant = "primary",
  loading,
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "danger";
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "btn-sheen inline-flex items-center justify-center gap-2 rounded-none px-6 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60";
  const variants: Record<string, string> = {
    primary: "bg-gold text-forest-950 hover:bg-gold-bright shadow-lg shadow-gold/20",
    outline: "border border-forest-900/20 bg-white/60 text-ink hover:bg-white",
    ghost: "text-forest-700 hover:bg-forest-900/5",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button
      {...props}
      type={props.type || "button"}
      disabled={props.disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold-soft/50 text-forest-800 ring-gold/40",
  approved: "bg-emerald/12 text-forest-700 ring-emerald/30",
  rejected: "bg-red-100 text-red-700 ring-red-300",
  paid: "bg-emerald/12 text-forest-700 ring-emerald/30",
  waived: "bg-emerald/12 text-forest-700 ring-emerald/30",
  failed: "bg-red-100 text-red-700 ring-red-300",
  not_required: "bg-forest-900/5 text-muted ring-forest-900/10",
  verified: "bg-emerald text-white ring-emerald",
};

export function Badge({ status, children }: { status: string; children?: ReactNode }) {
  const cls = STATUS_STYLES[status] || "bg-forest-900/5 text-muted ring-forest-900/10";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-none px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${cls}`}
    >
      {children || status.replace(/_/g, " ")}
    </span>
  );
}

export function Alert({ kind = "info", children }: { kind?: "info" | "success" | "error"; children: ReactNode }) {
  const styles: Record<string, string> = {
    info: "border-forest-900/15 bg-white/60 text-ink-soft",
    success: "border-emerald/30 bg-emerald/8 text-forest-700",
    error: "border-red-300 bg-red-50 text-red-700",
  };
  return <div className={`rounded-none border px-4 py-3 text-sm ${styles[kind]}`}>{children}</div>;
}
