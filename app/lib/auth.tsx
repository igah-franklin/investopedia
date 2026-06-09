"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { auth as authApi, setAccessToken, type User } from "./api";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, recaptchaToken: string) => Promise<User>;
  // Creates the account and triggers a verification email. Does NOT log in —
  // the user must verify before they can sign in. Returns the server message.
  register: (name: string, email: string, password: string, recaptchaToken: string) => Promise<{ message: string; email: string }>;
  verifyEmail: (token: string) => Promise<User>;
  resendVerification: (email: string) => Promise<string>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const loading = status === "loading";

  // Map the NextAuth session to the User interface
  const user: User | null = session?.user && (session as any).accessToken
    ? {
        _id: (session.user as any).id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user as any).role || "applicant",
      }
    : null;

  // Synchronize the access token with the API helper on load/change
  useEffect(() => {
    const token = (session as any)?.accessToken || null;
    setAccessToken(token);
  }, [session]);

  const login = async (email: string, password: string, recaptchaToken: string) => {
    // 1. Authenticate with backend directly to catch specific errors (like 403, 401)
    const { user: backendUser, token: backendToken } = (await authApi.login({
      email,
      password,
      recaptchaToken,
    })) as any;

    // 2. Establish NextAuth session using backend credentials
    const res = await signIn("credentials", {
      type: "login-success",
      user: JSON.stringify(backendUser),
      token: backendToken,
      redirect: false,
    });

    if (res?.error) {
      throw new Error(res.error);
    }

    return backendUser as User;
  };

  const register = async (name: string, email: string, password: string, recaptchaToken: string) => {
    return authApi.register({ name, email, password, recaptchaToken });
  };

  const verifyEmail = async (token: string) => {
    // 1. Authenticate with backend directly to verify email and get user + token
    const { user: backendUser, token: backendToken } = (await authApi.verifyEmail(token)) as any;

    // 2. Establish NextAuth session
    const res = await signIn("credentials", {
      type: "login-success",
      user: JSON.stringify(backendUser),
      token: backendToken,
      redirect: false,
    });

    if (res?.error) {
      throw new Error(res.error);
    }

    return backendUser as User;
  };

  const resendVerification = async (email: string) => {
    const { message } = await authApi.resendVerification(email);
    return message;
  };

  const forgotPassword = async (email: string) => {
    const { message } = await authApi.forgotPassword(email);
    return message;
  };

  const resetPassword = async (token: string, password: string) => {
    // 1. Reset password on backend and get user + token
    const { user: backendUser, token: backendToken } = (await authApi.resetPassword(token, password)) as any;

    // 2. Establish NextAuth session
    const res = await signIn("credentials", {
      type: "login-success",
      user: JSON.stringify(backendUser),
      token: backendToken,
      redirect: false,
    });

    if (res?.error) {
      throw new Error(res.error);
    }

    return backendUser as User;
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      await authApi.logout().catch(() => {});
    } finally {
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, verifyEmail, resendVerification, forgotPassword, resetPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
