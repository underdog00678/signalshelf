const faqs = [
  {
    question: "Is this a real app or a demo?",
    answer:
      "It is a working app with a focused feature set designed for quick capture and review.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "Your signals stay in your browser using local storage, so you can work offline.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes. Export and import JSON anytime from the Settings page.",
  },
  {
    question: "Why not a database?",
    answer:
      "Local storage keeps the demo reliable, fast, and easy to run anywhere.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            FAQ
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-neutral-100 sm:text-3xl">
            Answers for the curious.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6"
            >
              <h3 className="text-base font-semibold text-neutral-100">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
