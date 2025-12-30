export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_rgba(15,23,42,0)_60%)]" />
        <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <main className="relative max-w-5xl mx-auto px-6 py-24">
          <div className="flex flex-col gap-16">
            <header className="flex flex-col gap-8">
              <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-300">
                <span className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2">
                  SignalShelf
                </span>
                <span className="text-xs text-slate-400">
                  Personal signal inbox
                </span>
              </div>
              <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
                  Save signals. Ship decisions.
                </h1>
                <p className="max-w-2xl text-lg text-slate-300 sm:text-xl">
                  SignalShelf is a lightweight inbox for links and
                  ideas—tag them, summarize them, and turn them into next
                  actions.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Get started
                </a>
                <a
                  href="/app"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white"
                >
                  Open app
                </a>
              </div>
            </header>

            <section className="grid gap-6 md:grid-cols-3">
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/20">
                <h2 className="text-lg font-semibold text-slate-100">
                  Capture
                </h2>
                <p className="text-sm leading-relaxed text-slate-300">
                  Clip links, notes, and highlights into a single shelf without
                  breaking your flow.
                </p>
              </div>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/20">
                <h2 className="text-lg font-semibold text-slate-100">
                  Organize
                </h2>
                <p className="text-sm leading-relaxed text-slate-300">
                  Tag, summarize, and group signals so the best ideas surface
                  when you need them.
                </p>
              </div>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-black/20">
                <h2 className="text-lg font-semibold text-slate-100">Act</h2>
                <p className="text-sm leading-relaxed text-slate-300">
                  Convert insights into next actions and ship decisions with a
                  clear trail of context.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
