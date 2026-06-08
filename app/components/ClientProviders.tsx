"use client";

import React, { type ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AuthProvider } from "../lib/auth";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
      scriptProps={{ async: true, defer: true }}
    >
      <AuthProvider>{children}</AuthProvider>
    </GoogleReCaptchaProvider>
  );
}
