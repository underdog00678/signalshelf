const useCases = [
  {
    title: "Learning & research",
    description: "Collect articles, tutorials, and references in one place.",
  },
  {
    title: "Product ideas",
    description: "Capture insights, tag them, and surface the best ones.",
  },
  {
    title: "Shopping / decisions",
    description: "Keep comparisons, notes, and links together before buying.",
  },
];

export default function UseCases() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Use cases
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-neutral-100 sm:text-3xl">
            Built for the signals you actually keep.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6"
            >
              <h3 className="text-lg font-semibold text-neutral-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
