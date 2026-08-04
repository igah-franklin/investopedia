"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { admin, ApiError, type Application, type User } from "../lib/api";
import AdminShell from "../components/AdminShell";
import { Button, Badge, Alert, TextArea, Select } from "../components/ui";

// Helper for formatting date strings cleanly
function formatDate(dateStr?: string | Date): { date: string; time: string; full: string } {
  if (!dateStr) return { date: "—", time: "", full: "—" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { date: "—", time: "", full: "—" };

  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time, full: `${date} at ${time}` };
}

/* ─────────────────────────────────────────────────────────────
   Confirmation Modal for User or Application Deletion
───────────────────────────────────────────────────────────── */
function ConfirmDeleteModal({
  isOpen,
  title,
  message,
  itemName,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/80 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-md rounded-none border border-red-300 bg-white p-6 shadow-2xl text-ink">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center bg-red-100 rounded-full font-bold text-lg">
            ⚠️
          </div>
          <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
        </div>

        {itemName && (
          <div className="mb-3 rounded-none bg-red-50 p-3 border border-red-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-800 block">Target Account / Record</span>
            <span className="font-mono text-sm font-bold text-red-950">{itemName}</span>
          </div>
        )}

        <p className="text-sm leading-relaxed text-ink-soft mb-6">{message}</p>

        <div className="flex justify-end gap-3 border-t border-forest-900/10 pt-4">
          <Button variant="ghost" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" loading={isDeleting} onClick={onConfirm}>
            Delete Permanently
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Detail Modal & Review Drawer Component
───────────────────────────────────────────────────────────── */
function ApplicationDetailModal({
  app,
  onClose,
  onReviewed,
  onRequestDeleteUser,
  onRequestDeleteApp,
}: {
  app: Application;
  onClose: () => void;
  onReviewed: () => void;
  onRequestDeleteUser: (userId: string, userName: string) => void;
  onRequestDeleteApp: (appId: string, startupName: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState("");

  const submittedDate = formatDate(app.createdAt);
  const reviewedDate = formatDate(app.review?.reviewedAt);
  const founderEmail = typeof app.user === "object" && app.user ? app.user.email : app.email;
  const userId = typeof app.user === "object" && app.user ? app.user._id : typeof app.user === "string" ? app.user : null;

  async function decide(decision: "approved" | "rejected") {
    if (decision === "rejected" && !reason.trim()) {
      setError("A reason is required to reject an application.");
      return;
    }
    setError("");
    setBusy(decision);
    try {
      await admin.review(app._id, decision, reason);
      onReviewed();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit decision.");
      setBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/80 p-4 backdrop-blur-sm transition-all duration-300 overflow-y-auto">
      <div className="relative my-8 w-full max-w-3xl rounded-none border border-gold/30 bg-white shadow-2xl p-6 sm:p-8 text-ink">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-forest-900/10 pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{app.startupName}</h2>
              <Badge status={app.status} />
              <Badge status={app.payment.status} />
              {app.verified && <Badge status="verified">verified</Badge>}
            </div>
            <p className="mt-1 text-sm text-muted">
              Submitted on <span className="font-medium text-ink-soft">{submittedDate.full}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-none p-1.5 text-muted hover:text-ink hover:bg-forest-900/5 transition-colors"
            aria-label="Close detail modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="mt-6 space-y-6 max-h-[65vh] overflow-y-auto pr-2">
          {/* Key Information */}
          <div className="grid gap-4 sm:grid-cols-2 rounded-none bg-cream-soft/60 p-4 border border-forest-900/10 text-sm">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-semibold block">Founder Name</span>
              <span className="font-medium text-ink">{app.founderName}</span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-semibold block">Email Address</span>
              <a href={`mailto:${founderEmail}`} className="font-medium text-emerald hover:underline">
                {founderEmail}
              </a>
            </div>
            {app.phone && (
              <div>
                <span className="text-xs uppercase tracking-wider text-muted font-semibold block">Phone Number</span>
                <span className="font-medium text-ink">{app.phone}</span>
              </div>
            )}
            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-semibold block">Application Tier</span>
              <span className="font-medium text-ink capitalize">{app.applicationType.replace("-", " ")}</span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-semibold block">Stage</span>
              <span className="font-medium text-ink capitalize">{app.stage}</span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-semibold block">Target Raise</span>
              <span className="font-medium text-ink">
                USD {typeof app.raiseAmountUsd === "number" ? app.raiseAmountUsd.toLocaleString() : app.raiseAmountUsd} ({Array.isArray(app.raiseType) ? app.raiseType.join(", ") : app.raiseType})
              </span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-semibold block">HQ in Africa</span>
              <span className="font-medium text-ink">
                {typeof app.headquarteredInAfrica === "boolean"
                  ? app.headquarteredInAfrica ? "Yes" : "No"
                  : app.headquarteredInAfrica === "yes" ? "Yes" : app.headquarteredInAfrica === "planning" ? "Planning to" : "No"}
              </span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted font-semibold block">Incorporated in Africa</span>
              <span className="font-medium text-ink">
                {typeof app.incorporatedInAfrica === "boolean"
                  ? app.incorporatedInAfrica ? "Yes" : "No"
                  : app.incorporatedInAfrica === "yes" ? "Yes" : app.incorporatedInAfrica === "planning" ? "Planning to" : "No"}
              </span>
            </div>
          </div>

          {/* One-Liner */}
          {app.oneLiner && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700">One-Liner pitch</h4>
              <p className="mt-1 text-sm leading-relaxed text-ink bg-white p-3 border border-forest-900/10 italic">
                &ldquo;{app.oneLiner}&rdquo;
              </p>
            </div>
          )}

          {/* Links & Attachments */}
          {(app.pitchDeckUrl || app.businessPlanUrl || app.videoUrl || app.website) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700 mb-2">Links & Materials</h4>
              <div className="flex flex-wrap gap-2 text-sm">
                {app.website && (
                  <a
                    href={app.website.startsWith("http") ? app.website : `https://${app.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-none border border-forest-900/15 bg-white px-3 py-1.5 text-xs font-medium text-forest-800 hover:bg-forest-900/5 transition-colors"
                  >
                    🌐 Website
                  </a>
                )}
                {(app.pitchDeckUrl || app.businessPlanUrl) && (
                  <a
                    href={app.pitchDeckUrl || app.businessPlanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-none border border-emerald/30 bg-emerald/10 px-3 py-1.5 text-xs font-medium text-forest-800 hover:bg-emerald/20 transition-colors"
                  >
                    📄 Pitch Deck / Business Plan
                  </a>
                )}
                {app.videoUrl && (
                  <a
                    href={app.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-none border border-gold/40 bg-gold-soft/30 px-3 py-1.5 text-xs font-medium text-forest-900 hover:bg-gold/20 transition-colors"
                  >
                    🎬 Video Presentation
                  </a>
                )}
              </div>
            </div>
          )}

          {/* About Venture / Problem / Solution */}
          <div className="space-y-3 text-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700 border-b border-forest-900/10 pb-1">Venture Details</h4>
            {app.aboutVenture ? (
              <div>
                <span className="text-xs font-semibold text-muted">About Venture:</span>
                <p className="mt-1 whitespace-pre-wrap text-ink-soft">{app.aboutVenture}</p>
              </div>
            ) : (
              <>
                {app.problem && (
                  <div>
                    <span className="text-xs font-semibold text-muted">Problem:</span>
                    <p className="mt-1 whitespace-pre-wrap text-ink-soft">{app.problem}</p>
                  </div>
                )}
                {app.solution && (
                  <div>
                    <span className="text-xs font-semibold text-muted">Solution:</span>
                    <p className="mt-1 whitespace-pre-wrap text-ink-soft">{app.solution}</p>
                  </div>
                )}
                {app.traction && (
                  <div>
                    <span className="text-xs font-semibold text-muted">Traction:</span>
                    <p className="mt-1 whitespace-pre-wrap text-ink-soft">{app.traction}</p>
                  </div>
                )}
                {app.whyYou && (
                  <div>
                    <span className="text-xs font-semibold text-muted">Why You / Team:</span>
                    <p className="mt-1 whitespace-pre-wrap text-ink-soft">{app.whyYou}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Review Decision Status / History */}
          {app.status !== "pending" && (
            <div className="rounded-none border border-forest-900/15 bg-cream-soft p-4 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">Review Decision</span>
                <span className="text-xs text-muted">Decision on {reviewedDate.full}</span>
              </div>
              <p className="text-ink-soft font-medium">Status: <span className="capitalize font-semibold">{app.status}</span></p>
              {app.review?.reason && (
                <p className="text-ink-soft"><span className="text-muted">Decision Note:</span> {app.review.reason}</p>
              )}
            </div>
          )}

          {/* Decision Form (for Pending apps) */}
          {app.status === "pending" && (
            <div className="border-t border-forest-900/15 pt-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700">Review & Decide</h4>
              <TextArea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason / note sent to the applicant (required to reject)…"
                rows={3}
              />
              {error && <Alert kind="error">{error}</Alert>}
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" loading={busy === "approved"} onClick={() => decide("approved")}>
                  Approve Application
                </Button>
                <Button variant="danger" loading={busy === "rejected"} onClick={() => decide("rejected")}>
                  Reject Application
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/10 pt-4">
          <div className="flex items-center gap-2">
            {/* {userId && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestDeleteUser(userId, app.founderName || founderEmail);
                }}
                className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
              >
                🗑️ Delete Founder Account & All Data
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestDeleteApp(app._id, app.startupName);
              }}
              className="text-xs font-semibold text-muted hover:text-red-600 hover:underline flex items-center gap-1 ml-3"
            >
              🗑️ Delete Application
            </button> */}
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Admin Application Page Component
───────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Active Main Tab ("applications" | "users")
  const [activeTab, setActiveTab] = useState<"applications" | "users">("applications");

  // Application Filter States
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Application Pagination States
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Application Data States
  const [apps, setApps] = useState<Application[] | null>(null);
  const [totalApps, setTotalApps] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [stats, setStats] = useState<{
    pending: number;
    approved: number;
    rejected: number;
    verified: number;
    usersCount?: number;
  } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // User Management States
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");
  const [userPage, setUserPage] = useState<number>(1);
  const [userLimit, setUserLimit] = useState<number>(10);
  const [usersList, setUsersList] = useState<(User & { createdAt?: string; applicationsCount?: number })[] | null>(null);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [userTotalPages, setUserTotalPages] = useState<number>(1);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  // Modal States
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Delete Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: "user" | "application";
    targetId: string;
    targetName: string;
  }>({
    isOpen: false,
    type: "user",
    targetId: "",
    targetName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch applications list
  const loadData = useCallback(() => {
    setIsLoadingData(true);
    setError("");

    admin
      .list({
        status: statusFilter,
        type: typeFilter,
        search: searchQuery.trim(),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit,
      })
      .then((res) => {
        setApps(res.applications || []);
        setTotalApps(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setIsLoadingData(false);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Failed to load applications.");
        setIsLoadingData(false);
      });

    // Refresh stats summary
    admin
      .stats()
      .then((r) => setStats(r.stats))
      .catch(() => { });
  }, [statusFilter, typeFilter, searchQuery, startDate, endDate, page, limit]);

  // Fetch users list
  const loadUsersData = useCallback(() => {
    setIsLoadingUsers(true);
    admin
      .listUsers({
        search: userSearchQuery.trim(),
        page: userPage,
        limit: userLimit,
      })
      .then((res) => {
        setUsersList(res.users || []);
        setTotalUsersCount(res.total || 0);
        setUserTotalPages(res.totalPages || 1);
        setIsLoadingUsers(false);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Failed to load user accounts.");
        setIsLoadingUsers(false);
      });
  }, [userSearchQuery, userPage, userLimit]);

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
    if (activeTab === "applications") {
      loadData();
    } else if (activeTab === "users") {
      loadUsersData();
    }
  }, [user?.role, loading, loadData, loadUsersData, activeTab, router]);

  // Execute deletion upon confirmation
  const handleConfirmDelete = async () => {
    if (!deleteModalState.targetId) return;

    setIsDeleting(true);
    setError("");
    setSuccessMsg("");

    try {
      if (deleteModalState.type === "user") {
        const res = await admin.deleteUser(deleteModalState.targetId);
        setSuccessMsg(
          `User "${deleteModalState.targetName}" and ${res.deletedApplicationsCount} associated application(s) were permanently deleted.`
        );
        if (activeTab === "users") loadUsersData();
        loadData();
      } else {
        await admin.deleteApplication(deleteModalState.targetId);
        setSuccessMsg(`Application "${deleteModalState.targetName}" was permanently deleted.`);
        loadData();
      }
      setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to perform deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset page to 1 when filters change
  const handleFilterChange = (setter: (val: any) => void, value: any) => {
    setter(value);
    setPage(1);
  };

  // Reset all application filters
  const resetFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Quick Date Presets
  const setDatePreset = (preset: "today" | "7days" | "30days" | "all") => {
    if (preset === "all") {
      setStartDate("");
      setEndDate("");
    } else {
      const end = new Date();
      const start = new Date();
      if (preset === "today") {
        start.setHours(0, 0, 0, 0);
      } else if (preset === "7days") {
        start.setDate(end.getDate() - 7);
      } else if (preset === "30days") {
        start.setDate(end.getDate() - 30);
      }
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
    }
    setPage(1);
  };

  // Compute active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (typeFilter !== "all") count++;
    if (searchQuery.trim()) count++;
    if (startDate) count++;
    if (endDate) count++;
    return count;
  }, [statusFilter, typeFilter, searchQuery, startDate, endDate]);

  if (loading || !user || user.role !== "admin") {
    return (
      <AdminShell stats={stats}>
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted">Checking authentication permissions…</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell stats={stats}>
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald">Admin Management</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            System Administration
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (activeTab === "applications") loadData();
              else loadUsersData();
            }}
            loading={isLoadingData || isLoadingUsers}
          >
            🔄 Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Quick Cards Summary */}
      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {/* Registered Users Stat Card */}
          <div className="rounded-none border border-gold/40 bg-gold-soft/20 p-4 text-left shadow-sm">
            <div className="font-display text-3xl font-bold text-forest-900">
              {stats.usersCount ?? 0}
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-forest-800">
              👥 Registered Users
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab("applications");
              handleFilterChange(setStatusFilter, "all");
            }}
            className={`rounded-none border p-4 text-left transition-all ${activeTab === "applications" && statusFilter === "all"
              ? "border-forest-800 bg-forest-950 text-cream shadow-md"
              : "border-forest-900/10 bg-white/70 hover:bg-white text-ink"
              }`}
          >
            <div className={`font-display text-3xl font-semibold ${activeTab === "applications" && statusFilter === "all" ? "text-gild" : "text-forest-700"}`}>
              {stats.pending + stats.approved + stats.rejected}
            </div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider opacity-80">Total Applications</div>
          </button>

          <button
            onClick={() => {
              setActiveTab("applications");
              handleFilterChange(setStatusFilter, "pending");
            }}
            className={`rounded-none border p-4 text-left transition-all ${activeTab === "applications" && statusFilter === "pending"
              ? "border-gold bg-gold/15 text-forest-900 ring-2 ring-gold/40 shadow-md"
              : "border-forest-900/10 bg-white/70 hover:bg-white text-ink"
              }`}
          >
            <div className="font-display text-3xl font-semibold text-amber-600">{stats.pending}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">Pending Review</div>
          </button>

          <button
            onClick={() => {
              setActiveTab("applications");
              handleFilterChange(setStatusFilter, "approved");
            }}
            className={`rounded-none border p-4 text-left transition-all ${activeTab === "applications" && statusFilter === "approved"
              ? "border-emerald bg-emerald/15 text-forest-900 ring-2 ring-emerald/40 shadow-md"
              : "border-forest-900/10 bg-white/70 hover:bg-white text-ink"
              }`}
          >
            <div className="font-display text-3xl font-semibold text-emerald">{stats.approved}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">Approved</div>
          </button>

          <button
            onClick={() => {
              setActiveTab("applications");
              handleFilterChange(setStatusFilter, "rejected");
            }}
            className={`rounded-none border p-4 text-left transition-all ${activeTab === "applications" && statusFilter === "rejected"
              ? "border-red-500 bg-red-50 text-red-900 ring-2 ring-red-300 shadow-md"
              : "border-forest-900/10 bg-white/70 hover:bg-white text-ink"
              }`}
          >
            <div className="font-display text-3xl font-semibold text-red-600">{stats.rejected}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">Rejected</div>
          </button>
        </div>
      )}

      {/* Main Tab Switcher Bar */}
      <div className="mt-8 flex border-b border-forest-900/15">
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-6 py-3 font-display text-base font-semibold transition-all border-b-2 ${activeTab === "applications"
            ? "border-forest-800 text-forest-900 bg-white/60"
            : "border-transparent text-muted hover:text-ink"
            }`}
        >
          📋 Applications ({totalApps})
        </button>
        <button
          onClick={() => {
            setActiveTab("users");
            loadUsersData();
          }}
          className={`px-6 py-3 font-display text-base font-semibold transition-all border-b-2 ${activeTab === "users"
            ? "border-forest-800 text-forest-900 bg-white/60"
            : "border-transparent text-muted hover:text-ink"
            }`}
        >
          👥 User Accounts ({stats?.usersCount ?? totalUsersCount})
        </button>
      </div>

      {error && (
        <div className="mt-4">
          <Alert kind="error">{error}</Alert>
        </div>
      )}

      {successMsg && (
        <div className="mt-4">
          <Alert kind="success">{successMsg}</Alert>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
         TAB 1: APPLICATIONS PIPELINE DATA TABLE
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "applications" && (
        <>
          {/* Filter & Controls Panel */}
          <div className="mt-6 rounded-none border border-forest-900/15 bg-white/80 p-5 shadow-sm space-y-4">
            {/* Row 1: Search & Dropdowns */}
            <div className="grid gap-4 md:grid-cols-12 items-end">
              {/* Text Search */}
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Search Applicants
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search startup name, founder, email, country..."
                    value={searchQuery}
                    onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                    className="w-full rounded-none border border-forest-900/15 bg-white px-3.5 py-2 pl-9 text-sm text-ink outline-none transition-colors focus:border-emerald focus:ring-1 focus:ring-emerald"
                  />
                  <span className="pointer-events-none absolute left-3 top-2.5 text-muted">
                    🔍
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => handleFilterChange(setSearchQuery, "")}
                      className="absolute right-3 top-2 text-xs text-muted hover:text-ink"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Review Status
                </label>
                <Select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                  className="py-2 text-sm bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </div>

              {/* Application Type Filter */}
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Application Type
                </label>
                <Select
                  value={typeFilter}
                  onChange={(e) => handleFilterChange(setTypeFilter, e.target.value)}
                  className="py-2 text-sm bg-white"
                >
                  <option value="all">All Application Types</option>
                  <option value="standard">Standard Pilot ($299)</option>
                  <option value="need-based">Need-Based ($119)</option>
                  <option value="venture-backed">Venture-Backed (Exempt)</option>
                </Select>
              </div>
            </div>

            {/* Row 2: Date Filters & Presets */}
            <div className="flex flex-col gap-4 pt-3 border-t border-forest-900/10 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleFilterChange(setStartDate, e.target.value)}
                    className="rounded-none border border-forest-900/15 bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-emerald"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleFilterChange(setEndDate, e.target.value)}
                    className="rounded-none border border-forest-900/15 bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-emerald"
                  />
                </div>
                <div className="flex items-center gap-1.5 self-end pt-1 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => setDatePreset("today")}
                    className="rounded-none border border-forest-900/15 bg-white px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-forest-900/5"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDatePreset("7days")}
                    className="rounded-none border border-forest-900/15 bg-white px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-forest-900/5"
                  >
                    Last 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setDatePreset("30days")}
                    className="rounded-none border border-forest-900/15 bg-white px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-forest-900/5"
                  >
                    Last 30 Days
                  </button>
                </div>
              </div>

              {/* Reset Filters & Active Count */}
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <span className="text-xs text-emerald font-semibold uppercase tracking-wider">
                    {activeFiltersCount} active filter{activeFiltersCount > 1 ? "s" : ""}
                  </span>
                )}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold text-red-600 hover:underline uppercase tracking-wider"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="mt-6 border border-forest-900/15 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-forest-900/15 bg-forest-950 text-cream text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Startup / Venture</th>
                    <th className="py-3.5 px-4">Founder & Contact</th>
                    <th className="py-3.5 px-4">Tier & Target Raise</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date Submitted</th>
                    <th className="py-3.5 px-4">Reviewed Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-900/10 text-sm">
                  {isLoadingData && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted">
                        <div className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-emerald border-t-transparent animate-spin" />
                          Loading applications dataset…
                        </div>
                      </td>
                    </tr>
                  )}

                  {!isLoadingData && apps && apps.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted">
                        No applications match the current filter criteria.
                        {activeFiltersCount > 0 && (
                          <div className="mt-2">
                            <button
                              onClick={resetFilters}
                              className="text-xs text-emerald font-semibold hover:underline"
                            >
                              Clear filters to see all applications
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}

                  {!isLoadingData &&
                    apps?.map((app) => {
                      const subDate = formatDate(app.createdAt);
                      const revDate = formatDate(app.review?.reviewedAt);
                      const founderEmail = typeof app.user === "object" && app.user ? app.user.email : app.email;
                      const userId = typeof app.user === "object" && app.user ? app.user._id : typeof app.user === "string" ? app.user : null;

                      return (
                        <tr
                          key={app._id}
                          className="hover:bg-cream-soft/60 transition-colors cursor-pointer"
                          onClick={() => setSelectedApp(app)}
                        >
                          {/* Startup Name */}
                          <td className="py-4 px-4 font-medium text-ink">
                            <div className="font-semibold font-display text-base text-forest-900">{app.startupName}</div>
                            {app.oneLiner && (
                              <div className="text-xs text-muted truncate max-w-xs mt-0.5" title={app.oneLiner}>
                                {app.oneLiner}
                              </div>
                            )}
                          </td>

                          {/* Founder & Contact */}
                          <td className="py-4 px-4 text-ink-soft">
                            <div className="font-medium text-ink">{app.founderName}</div>
                            <div className="text-xs text-muted">{founderEmail}</div>
                          </td>

                          {/* Tier & Raise */}
                          <td className="py-4 px-4 text-ink-soft">
                            <span className="inline-block rounded-none bg-forest-900/5 border border-forest-900/10 px-2 py-0.5 text-xs font-semibold capitalize text-forest-800">
                              {app.applicationType.replace("-", " ")}
                            </span>
                            <div className="text-xs text-muted mt-1">
                              USD {typeof app.raiseAmountUsd === "number" ? app.raiseAmountUsd.toLocaleString() : app.raiseAmountUsd} · <span className="capitalize">{app.stage}</span>
                            </div>
                          </td>

                          {/* Status Badges */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <Badge status={app.status} />
                              {app.payment?.status && app.payment.status !== "not_required" && (
                                <span className="text-[0.65rem] font-medium uppercase tracking-wider text-muted">
                                  Pay: {app.payment.status}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Date Submitted */}
                          <td className="py-4 px-4 whitespace-nowrap text-ink-soft text-xs">
                            <div className="font-medium">{subDate.date}</div>
                            <div className="text-muted text-[0.7rem]">{subDate.time}</div>
                          </td>

                          {/* Reviewed Date / Status */}
                          <td className="py-4 px-4 whitespace-nowrap text-xs">
                            {app.status !== "pending" && app.review?.reviewedAt ? (
                              <div>
                                <div className="font-medium text-forest-800">{revDate.date}</div>
                                <div className="text-muted text-[0.7rem]">{revDate.time}</div>
                              </div>
                            ) : (
                              <span className="text-muted italic">Pending decision</span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant={app.status === "pending" ? "primary" : "outline"}
                                className="px-3 py-1 text-xs"
                                onClick={() => setSelectedApp(app)}
                              >
                                {app.status === "pending" ? "Review" : "View"}
                              </Button>
                              {/* 
                              {userId && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteModalState({
                                      isOpen: true,
                                      type: "user",
                                      targetId: userId,
                                      targetName: `${app.founderName} (${founderEmail})`,
                                    })
                                  }
                                  className="p-1.5 text-muted hover:text-red-600 transition-colors"
                                  title="Delete Founder User Account & All Data"
                                >
                                  🗑️
                                </button>
                              )} */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col gap-4 p-4 border-t border-forest-900/15 bg-white sm:flex-row sm:items-center sm:justify-between text-xs text-ink-soft">
              <div className="flex items-center gap-4">
                <div>
                  Showing{" "}
                  <span className="font-bold text-ink">
                    {totalApps === 0 ? 0 : (page - 1) * limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-ink">
                    {Math.min(page * limit, totalApps)}
                  </span>{" "}
                  of <span className="font-bold text-ink">{totalApps}</span> applications
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-muted">Per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="rounded-none border border-forest-900/15 bg-white px-2 py-1 text-xs text-ink outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoadingData}
                  className="rounded-none border border-forest-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest-900/5 transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                  let pNum = page;
                  if (totalPages <= 5) pNum = idx + 1;
                  else if (page <= 3) pNum = idx + 1;
                  else if (page >= totalPages - 2) pNum = totalPages - 4 + idx;
                  else pNum = page - 2 + idx;

                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`rounded-none border px-3 py-1.5 text-xs font-semibold transition-colors ${page === pNum
                        ? "border-forest-800 bg-forest-800 text-cream"
                        : "border-forest-900/15 bg-white text-ink hover:bg-forest-900/5"
                        }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoadingData}
                  className="rounded-none border border-forest-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest-900/5 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
         TAB 2: USER ACCOUNTS MANAGEMENT TABLE
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "users" && (
        <div className="mt-6 space-y-6">
          {/* User Search Bar */}
          <div className="rounded-none border border-forest-900/15 bg-white/80 p-5 shadow-sm">
            <div className="max-w-md">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Search Platform Users
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search user name or email address..."
                  value={userSearchQuery}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    setUserPage(1);
                  }}
                  className="w-full rounded-none border border-forest-900/15 bg-white px-3.5 py-2 pl-9 text-sm text-ink outline-none focus:border-emerald"
                />
                <span className="pointer-events-none absolute left-3 top-2.5 text-muted">🔍</span>
                {userSearchQuery && (
                  <button
                    onClick={() => {
                      setUserSearchQuery("");
                      setUserPage(1);
                    }}
                    className="absolute right-3 top-2 text-xs text-muted hover:text-ink"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="border border-forest-900/15 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-forest-900/15 bg-forest-950 text-cream text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">User Details</th>
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Registered Date</th>
                    <th className="py-3.5 px-4">Applications</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-900/10 text-sm">
                  {isLoadingUsers && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted">
                        <div className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-emerald border-t-transparent animate-spin" />
                          Loading registered users…
                        </div>
                      </td>
                    </tr>
                  )}

                  {!isLoadingUsers && usersList && usersList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted">
                        No registered user accounts found.
                      </td>
                    </tr>
                  )}

                  {!isLoadingUsers &&
                    usersList?.map((u) => {
                      const regDate = formatDate(u.createdAt);
                      return (
                        <tr key={u._id} className="hover:bg-cream-soft/60 transition-colors">
                          <td className="py-4 px-4 font-semibold text-ink">
                            <div className="flex items-center gap-2">
                              <span className="grid h-8 w-8 place-items-center bg-forest-900/10 text-forest-800 font-bold rounded-none text-xs">
                                {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                              </span>
                              <span>{u.name}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-ink-soft">
                            <a href={`mailto:${u.email}`} className="text-emerald hover:underline">
                              {u.email}
                            </a>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border rounded-none ${u.role === "admin"
                                ? "border-gold bg-gold/20 text-forest-950 font-bold"
                                : "border-forest-900/10 bg-forest-900/5 text-muted"
                                }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-xs text-ink-soft whitespace-nowrap">
                            {regDate.date}
                          </td>

                          <td className="py-4 px-4 text-xs font-semibold text-ink">
                            {u.applicationsCount ?? 0} submission(s)
                          </td>

                          <td className="py-4 px-4 text-right">
                            <Button
                              variant="danger"
                              className="px-3 py-1 text-xs"
                              disabled={u._id === user._id}
                              onClick={() =>
                                setDeleteModalState({
                                  isOpen: true,
                                  type: "user",
                                  targetId: u._id,
                                  targetName: `${u.name} (${u.email})`,
                                })
                              }
                            >
                              Delete User
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Users Pagination */}
            <div className="flex flex-col gap-4 p-4 border-t border-forest-900/15 bg-white sm:flex-row sm:items-center sm:justify-between text-xs text-ink-soft">
              <div>
                Showing{" "}
                <span className="font-bold text-ink">
                  {totalUsersCount === 0 ? 0 : (userPage - 1) * userLimit + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-ink">
                  {Math.min(userPage * userLimit, totalUsersCount)}
                </span>{" "}
                of <span className="font-bold text-ink">{totalUsersCount}</span> registered users
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                  disabled={userPage <= 1 || isLoadingUsers}
                  className="rounded-none border border-forest-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest-900/5"
                >
                  Previous
                </button>
                <span className="px-2 font-semibold">
                  Page {userPage} of {userTotalPages}
                </span>
                <button
                  onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                  disabled={userPage >= userTotalPages || isLoadingUsers}
                  className="rounded-none border border-forest-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest-900/5"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail & Review Modal */}
      {selectedApp && (
        <ApplicationDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onReviewed={() => loadData()}
          onRequestDeleteUser={(userId, userName) =>
            setDeleteModalState({
              isOpen: true,
              type: "user",
              targetId: userId,
              targetName: userName,
            })
          }
          onRequestDeleteApp={(appId, startupName) =>
            setDeleteModalState({
              isOpen: true,
              type: "application",
              targetId: appId,
              targetName: startupName,
            })
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        title={
          deleteModalState.type === "user"
            ? "Confirm Permanent User Account Deletion"
            : "Confirm Application Deletion"
        }
        message={
          deleteModalState.type === "user"
            ? "Are you sure you want to delete this user account? This action is permanent and will cascade-delete all associated applications, submission data, and payment records."
            : "Are you sure you want to delete this application record? This action cannot be undone."
        }
        itemName={deleteModalState.targetName}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </AdminShell>
  );
}
