import fs from "fs";
import path from "path";
import Link from "next/link";

export default function AgreementPage() {
  const filePath = path.join(process.cwd(), "public", "agreement.txt");
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    content = "Agreement text is temporarily unavailable.";
  }

  return (
    <div className="min-h-screen bg-cream text-ink py-16 px-5 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between border-b border-forest-900/10 pb-5">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/investovilla-logo.png"
              alt="InvestoVilla Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <Link href="/apply" className="rounded-none border border-forest-900/15 bg-white/60 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white">
            Back to application
          </Link>
        </div>

        <article className="prose prose-slate max-w-none rounded-none border border-forest-900/10 bg-white/70 p-8 shadow-[0_24px_70px_-44px_rgba(8,35,27,0.5)] backdrop-blur sm:p-12">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink mb-6 text-center">
            Founder Participation Agreement
          </h1>
          <div className="whitespace-pre-line text-sm leading-relaxed text-ink-soft font-sans">
            {content}
          </div>
        </article>

        <div className="mt-8 text-center text-xs text-muted">
          © 2026 InvestoVilla. All rights reserved.
        </div>
      </div>
    </div>
  );
}
