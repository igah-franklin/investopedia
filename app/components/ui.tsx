"use client";

import type {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ButtonHTMLAttributes,
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
