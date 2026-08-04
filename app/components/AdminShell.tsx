"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";

export default function AdminShell({
  children,
  stats,
}: {
  children: React.ReactNode;
  stats?: { pending: number; approved: number; rejected: number; verified: number; usersCount?: number } | null;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Desktop sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    {
      label: "Applications",
      href: "/admin",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      badge: stats ? stats.pending + stats.approved + stats.rejected : null,
    },
    {
      label: "User Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: "Public Site",
      href: "/",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row text-ink">
      {/* ── MOBILE BACKDROP OVERLAY ── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-forest-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── COLLAPSIBLE SIDEBAR ── */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen flex flex-col bg-forest-950 text-cream transition-all duration-300 ease-in-out border-r border-white/10 ${
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Sidebar Header & Brand */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <img
              src="/investovilla-icon.png"
              alt="InvestoVilla Logo"
              className="h-8 w-8 shrink-0 object-contain"
            />
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-base tracking-tight text-cream">
                  InvestoVilla
                </span>
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-gold-bright">
                  Admin Portal
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-none bg-white/5 text-cream/70 hover:text-cream hover:bg-white/10 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-cream/70 hover:text-cream"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <p className="px-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cream/40 mb-2">
                Main Menu
              </p>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-gold text-forest-950 font-semibold shadow-md shadow-gold/20"
                        : "text-cream/75 hover:bg-white/10 hover:text-cream"
                    } ${isCollapsed && !isMobileOpen ? "justify-center px-0" : ""}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={`shrink-0 ${isActive ? "text-forest-950" : "text-emerald-bright"}`}>
                      {item.icon}
                    </span>
                    {(!isCollapsed || isMobileOpen) && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {(!isCollapsed || isMobileOpen) && item.badge !== undefined && item.badge !== null && (
                      <span
                        className={`px-2 py-0.5 text-xs font-bold rounded-none ${
                          isActive ? "bg-forest-950 text-gold" : "bg-white/10 text-cream"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Stats Widget (when expanded) */}
          {(!isCollapsed || isMobileOpen) && stats && (
            <div className="border-t border-white/10 pt-5">
              <p className="px-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cream/40 mb-3">
                Review Status
              </p>
              <div className="space-y-2 px-1">
                <div className="flex items-center justify-between text-xs px-2 py-1.5 bg-white/5 rounded-none border border-white/5">
                  <span className="flex items-center gap-2 text-cream/70">
                    <span className="h-2 w-2 rounded-full bg-amber-400" /> Pending
                  </span>
                  <span className="font-bold text-amber-400">{stats.pending}</span>
                </div>
                <div className="flex items-center justify-between text-xs px-2 py-1.5 bg-white/5 rounded-none border border-white/5">
                  <span className="flex items-center gap-2 text-cream/70">
                    <span className="h-2 w-2 rounded-full bg-emerald-bright" /> Approved
                  </span>
                  <span className="font-bold text-emerald-bright">{stats.approved}</span>
                </div>
                <div className="flex items-center justify-between text-xs px-2 py-1.5 bg-white/5 rounded-none border border-white/5">
                  <span className="flex items-center gap-2 text-cream/70">
                    <span className="h-2 w-2 rounded-full bg-red-400" /> Rejected
                  </span>
                  <span className="font-bold text-red-400">{stats.rejected}</span>
                </div>
                {stats.usersCount !== undefined && (
                  <div className="flex items-center justify-between text-xs px-2 py-1.5 bg-white/5 rounded-none border border-white/5">
                    <span className="flex items-center gap-2 text-cream/70">
                      👥 Total Users
                    </span>
                    <span className="font-bold text-gild">{stats.usersCount}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="border-t border-white/10 p-3 bg-forest-900/60">
          <div className={`flex items-center ${isCollapsed && !isMobileOpen ? "justify-center" : "gap-3"}`}>
            <div className="grid h-9 w-9 shrink-0 place-items-center bg-gold text-forest-950 font-bold text-sm rounded-none shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-cream truncate">{user?.name || "Admin User"}</p>
                <p className="text-[0.7rem] text-cream/50 truncate">{user?.email}</p>
              </div>
            )}
            {(!isCollapsed || isMobileOpen) && (
              <button
                onClick={logout}
                className="p-1.5 text-cream/50 hover:text-red-400 transition-colors"
                title="Log out"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-forest-900/10 bg-cream-soft/90 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-forest-800 hover:bg-forest-900/5 rounded-none"
              aria-label="Open navigation sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <Link href="/admin" className="text-forest-700 hover:underline">
                Admin
              </Link>
              <span>/</span>
              <span className="text-ink font-bold">Applications Overview</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-none border border-emerald/30 bg-emerald/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest-800">
              <span className="h-2 w-2 rounded-full bg-emerald" /> Admin Verified
            </span>
            <button
              onClick={logout}
              className="rounded-none border border-forest-900/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-forest-900/5"
            >
              Log out
            </button>
          </div>
        </header>

        {/* Wide Main Content Container */}
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-10 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
