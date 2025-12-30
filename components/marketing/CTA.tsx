import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-10 text-center">
          <h2 className="text-3xl font-semibold text-neutral-100 sm:text-4xl">
            Turn saved links into decisions.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-400">
            SignalShelf keeps your signals organized so you can review them when
            it matters most.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/app/inbox"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 no-underline hover:no-underline"
            >
              Open SignalShelf
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
