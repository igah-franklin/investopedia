"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth";

// Top bar for the authenticated app pages (dashboard / apply / admin).
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`rounded-none px-3 py-1.5 text-sm font-medium transition-colors ${
        pathname === href ? "text-forest-700" : "text-muted hover:text-forest-700"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-forest-900/10 bg-cream-soft/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="InvestoVilla home">
            <img
              src="/investovilla-logo.jpg"
              alt="InvestoVilla Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-1">
            {user && navLink("/dashboard", "Dashboard")}
            {user?.role === "admin" && navLink("/admin", "Admin")}
            {user ? (
              <button
                onClick={logout}
                className="ml-2 rounded-none border border-forest-900/15 bg-white/60 px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-white"
              >
                Log out
              </button>
            ) : (
              <Link
                href="/login"
                className="ml-2 rounded-none bg-forest-800 px-4 py-1.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-700"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">{children}</main>
    </div>
  );
}
