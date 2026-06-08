// Typed client for the InvestoVilla backend API.
// Talks to the Express server at NEXT_PUBLIC_API_URL.

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Auth is carried by an httpOnly cookie set by the backend — the JWT is never
// exposed to JavaScript (no localStorage), which mitigates XSS token theft.
// Every request sends credentials so the browser attaches that cookie.

// ── domain types ──────────────────────────────────────────────
export type UserRole = "applicant" | "admin";
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ApplicationType = "standard" | "need-based" | "venture-backed";
export type ApplicationStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "not_required" | "pending" | "paid" | "failed" | "waived";

export interface Application {
  _id: string;
  user: string | User;
  founderName: string;
  email: string;
  phone?: string;
  startupName: string;
  website?: string;
  applicationType: ApplicationType;
  founders: "single" | "duo";
  coFounderName?: string;
  coFounderEmail?: string;
  stage: string;
  raiseType: "equity" | "debt";
  raiseAmountUsd: number;
  buildingForAfrica: string;
  headquarteredInAfrica: boolean;
  incorporatedInAfrica: boolean;
  country?: string;
  oneLiner?: string;
  problem?: string;
  solution?: string;
  traction?: string;
  whyYou?: string;
  pitchDeckUrl?: string;
  businessPlanUrl?: string;
  videoUrl?: string;
  needBasedReason?: string;
  status: ApplicationStatus;
  review?: { reason?: string; reviewedAt?: string };
  payment: {
    required: boolean;
    status: PaymentStatus;
    amount?: number;
    currency?: string;
    reference?: string;
    paidAt?: string;
  };
  verified: boolean;
  createdAt: string;
}

export interface Tier {
  label: string;
  single: number;
  duo: number;
  requiresPayment: boolean;
}
export interface FormConfig {
  currency: string;
  pricing: Record<ApplicationType, Tier>;
  fields: Record<string, unknown>;
}

// ── core request helper ───────────────────────────────────────
export class ApiError extends Error {
  status: number;
  details?: { field: string; message: string }[];
  constructor(status: number, message: string, details?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", // send/receive the httpOnly auth cookie
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* no body */
  }

  if (!res.ok) {
    const b = (body || {}) as { message?: string; details?: { field: string; message: string }[] };
    throw new ApiError(res.status, b.message || `Request failed (${res.status})`, b.details);
  }
  return body as T;
}

// ── auth ──────────────────────────────────────────────────────
export const auth = {
  // Registration no longer logs the user in — the account must be verified by
  // email first, so the response carries a message instead of a token.
  register: (data: { name: string; email: string; password: string }) =>
    request<{ message: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // Sets the auth cookie server-side; the user object comes back in the body.
  login: (data: { email: string; password: string }) =>
    request<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () => request<{ status: string }>("/api/auth/logout", { method: "POST" }),
  verifyEmail: (token: string) =>
    request<{ user: User }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  resendVerification: (email: string) =>
    request<{ message: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  forgotPassword: (email: string) =>
    request<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    request<{ user: User }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  me: () => request<{ user: User }>("/api/auth/me"),
};

// ── applications ──────────────────────────────────────────────
export const applications = {
  formConfig: () => request<FormConfig>("/api/applications/form-config"),
  create: (data: Record<string, unknown>) =>
    request<{ application: Application }>("/api/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  mine: () => request<{ applications: Application[] }>("/api/applications/mine"),
  get: (id: string) => request<{ application: Application }>(`/api/applications/${id}`),
};

// ── admin ─────────────────────────────────────────────────────
export const admin = {
  stats: () =>
    request<{ stats: { pending: number; approved: number; rejected: number; verified: number } }>(
      "/api/admin/stats"
    ),
  list: (params: { status?: string; page?: number } = {}) => {
    const q = new URLSearchParams();
    if (params.status) q.set("status", params.status);
    if (params.page) q.set("page", String(params.page));
    const qs = q.toString();
    return request<{ applications: Application[]; total: number; page: number }>(
      `/api/admin/applications${qs ? `?${qs}` : ""}`
    );
  },
  review: (id: string, decision: "approved" | "rejected", reason: string) =>
    request<{ application: Application; payUrl?: string }>(`/api/admin/applications/${id}/review`, {
      method: "PATCH",
      body: JSON.stringify({ decision, reason }),
    }),
};

// ── payments ──────────────────────────────────────────────────
export const payments = {
  initialize: (applicationId: string) =>
    request<{ authorization_url: string }>("/api/payments/initialize", {
      method: "POST",
      body: JSON.stringify({ applicationId }),
    }),
};
