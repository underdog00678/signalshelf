import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-neutral-800 bg-neutral-950/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-neutral-400">
              <span className="text-neutral-200">SignalShelf</span>
              <span className="h-1 w-1 rounded-full bg-neutral-600" />
              <span>Personal signal inbox</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-6xl">
                Save what matters. Act on it later.
              </h1>
              <p className="max-w-2xl text-lg text-neutral-300 sm:text-xl">
                SignalShelf is a lightweight inbox for links, ideas, and notes —
                tagged and organized so you can come back with clarity.
              </p>
            </div>

            <ul className="space-y-2 text-sm text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">•</span>
                <span>Capture in seconds</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">•</span>
                <span>Tag for context</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">•</span>
                <span>Move from Inbox → Reading → Done</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/app/inbox"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 no-underline hover:no-underline"
              >
                Open SignalShelf
              </Link>
              <Link
                href="/app/new"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-700 px-5 py-3 text-sm font-semibold text-neutral-100 transition hover:bg-neutral-900 no-underline hover:no-underline"
              >
                New signal
              </Link>
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Works offline (local storage)
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-500">
                <span>Inbox preview</span>
                <span className="rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-[10px]">
                  SignalShelf
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                  <div className="text-sm font-semibold text-neutral-100">
                    Learning sprint ideas
                  </div>
                  <div className="mt-2 text-xs text-neutral-400">
                    tags: research, reading
                  </div>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                  <div className="text-sm font-semibold text-neutral-100">
                    Checkout UX article
                  </div>
                  <div className="mt-2 text-xs text-neutral-400">
                    status: reading
                  </div>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                  <div className="text-sm font-semibold text-neutral-100">
                    Gear shortlist
                  </div>
                  <div className="mt-2 text-xs text-neutral-400">
                    status: inbox
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Inbox", tone: "bg-neutral-900/80" },
                { label: "Reading", tone: "bg-neutral-900/60" },
                { label: "Done", tone: "bg-neutral-900/40" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border border-neutral-800 p-4 text-center text-sm text-neutral-300 ${item.tone}`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
