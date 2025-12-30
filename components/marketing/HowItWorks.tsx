const steps = [
  {
    icon: "🔗",
    title: "Save a link",
    description: "Capture a page or idea the moment it sparks.",
  },
  {
    icon: "🏷️",
    title: "Add notes + tags",
    description: "Give it context so future-you knows why it matters.",
  },
  {
    icon: "✅",
    title: "Review and decide",
    description: "Move signals through Inbox, Reading, and Done.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              How it works
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-neutral-100 sm:text-3xl">
              A simple flow, start to finish.
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-400">
            Capture, annotate, and decide with minimal friction.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-lg">
                <span aria-hidden>{step.icon}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
