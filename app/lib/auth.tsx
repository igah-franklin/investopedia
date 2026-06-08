"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth as authApi, type User } from "./api";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  // Creates the account and triggers a verification email. Does NOT log in —
  // the user must verify before they can sign in. Returns the server message.
  register: (name: string, email: string, password: string) => Promise<{ message: string; email: string }>;
  verifyEmail: (token: string) => Promise<User>;
  resendVerification: (email: string) => Promise<string>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the server who we are. The auth cookie (if any) rides
  // along automatically; a 401 simply means we're logged out.
  useEffect(() => {
    authApi
      .me()
      .then((r) => setUser(r.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await authApi.login({ email, password });
    setUser(user);
    return user;
  };

  const register = async (name: string, email: string, password: string) => {
    return authApi.register({ name, email, password });
  };

  const verifyEmail = async (token: string) => {
    const { user } = await authApi.verifyEmail(token);
    setUser(user);
    return user;
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
    const { user } = await authApi.resetPassword(token, password);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
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
