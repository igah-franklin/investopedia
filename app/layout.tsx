import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./components/ClientProviders";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pipeline.amstevehouse.com"),
  title: {
    default: "InvestoVilla Pipeline Development Program",
    template: "%s · InvestoVilla Pipeline",
  },
  description:
    "An action-learning fundraising mentorship program helping African startups raising $20k–$1M navigate venture finance, build a fundraising strategy, and close their round in record time.",
  keywords: [
    "African startups",
    "fundraising",
    "venture capital Africa",
    "pre-seed",
    "seed",
    "startup accelerator",
    "InvestoVilla",
    "AmSteveHouse",
  ],
  openGraph: {
    title: "InvestoVilla Pipeline Development Program",
    description:
      "Structured, practical guidance to help African founders raise $20k–$1M and close their round in record time.",
    url: "https://pipeline.amstevehouse.com",
    siteName: "InvestoVilla Pipeline",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08231b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
