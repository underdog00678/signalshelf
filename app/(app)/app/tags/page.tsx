"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { initIfEmpty, listTags } from "../../../../lib/clientStore";

type TagItem = { name: string; count: number };

export default function Page() {
  const router = useRouter();
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      setError(null);

      try {
        initIfEmpty();
        setTags(listTags());
      } catch {
        setError("Unable to load tags.");
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-neutral-100">Tags</h1>
        <p className="text-neutral-400">
          Browse topics across your saved signals.
        </p>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : tags.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
          <p className="text-sm text-neutral-400">No tags yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <div
              key={tag.name}
              className="cursor-pointer rounded-xl border border-neutral-800 bg-neutral-950 p-5 transition hover:bg-neutral-900"
              onClick={() =>
                router.push(`/app/inbox?tag=${encodeURIComponent(tag.name)}`)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/app/inbox?tag=${encodeURIComponent(tag.name)}`);
                }
              }}
            >
              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold text-neutral-50">
                  {tag.name}
                </p>
                <p className="text-sm text-neutral-400">
                  {tag.count} {tag.count === 1 ? "signal" : "signals"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
