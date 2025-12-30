export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-neutral-100">Dashboard</h1>
        <p className="text-neutral-400">
          Your saved signals and activity at a glance.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
          <p className="text-sm text-neutral-400">Total Signals</p>
          <p className="mt-3 text-2xl font-semibold text-neutral-100">—</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
          <p className="text-sm text-neutral-400">Signals This Week</p>
          <p className="mt-3 text-2xl font-semibold text-neutral-100">—</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
          <p className="text-sm text-neutral-400">Top Tags</p>
          <p className="mt-3 text-2xl font-semibold text-neutral-100">—</p>
        </div>
      </section>
    </div>
  );
}
