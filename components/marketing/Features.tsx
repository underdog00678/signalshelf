const features = [
  {
    title: "Inbox workflow",
    description: "Move signals through Inbox, Reading, and Done.",
  },
  {
    title: "Fast search",
    description: "Scan titles, links, notes, and tags instantly.",
  },
  {
    title: "Tag filtering",
    description: "Jump straight to a topic with a single click.",
  },
  {
    title: "Edit + delete",
    description: "Refine or remove signals whenever priorities shift.",
  },
  {
    title: "Export/Import JSON",
    description: "Own your data and move it between devices.",
  },
  {
    title: "Keyboard shortcuts",
    description: "n, /, and Esc keep you moving without the mouse.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Features
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-neutral-100 sm:text-3xl">
            Everything you need to move from saving to deciding.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6"
            >
              <h3 className="text-lg font-semibold text-neutral-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
