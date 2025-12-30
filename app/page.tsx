import Link from "next/link";

import Hero from "../components/marketing/Hero";
import HowItWorks from "../components/marketing/HowItWorks";
import Features from "../components/marketing/Features";
import UseCases from "../components/marketing/UseCases";
import FAQ from "../components/marketing/FAQ";
import CTA from "../components/marketing/CTA";

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <header className="relative z-10">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.4em] text-neutral-200 no-underline hover:no-underline"
            >
              SignalShelf
            </Link>
            <div className="flex items-center gap-6 text-sm text-neutral-300">
              <a href="#features" className="hover:text-neutral-100">
                Features
              </a>
              <a href="#faq" className="hover:text-neutral-100">
                FAQ
              </a>
              <Link
                href="/app/inbox"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-100 transition hover:bg-neutral-900 no-underline hover:no-underline"
              >
                Open app
              </Link>
            </div>
          </nav>
        </header>

        <main className="relative z-10">
          <Hero />
          <HowItWorks />
          <Features />
          <UseCases />
          <FAQ />
          <CTA />
        </main>

        <footer className="relative z-10 border-t border-neutral-900/80">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-xs text-neutral-500">
            <span>Built with Next.js • Deployed on Vercel</span>
            <Link href="/app/inbox" className="text-neutral-300">
              Open SignalShelf
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
