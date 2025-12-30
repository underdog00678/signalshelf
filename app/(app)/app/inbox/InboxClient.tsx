"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import SignalCard from "../../../../components/signals/SignalCard";

type SignalStatus = "inbox" | "reading" | "done";

type Signal = {
  id: string;
  url: string;
  title: string;
  notes: string;
  tags: string[];
  status: SignalStatus;
  createdAt: string;
  updatedAt: string;
};

type StatusFilter = "all" | SignalStatus;

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Inbox", value: "inbox" },
  { label: "Reading", value: "reading" },
  { label: "Done", value: "done" },
];

export default function InboxClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const tagParam = useMemo(() => {
    const value = searchParams.get("tag");
    return value ? value.trim() : "";
  }, [searchParams]);

  const loadSignals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/signals");
      if (!response.ok) {
        throw new Error("Failed to load signals.");
      }
      const data = (await response.json()) as { items?: Signal[] };
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setError("Unable to load signals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSignals();
  }, [loadSignals]);

  const filteredItems = useMemo(() => {
    const query = q.trim().toLowerCase();
    const tagFilter = tagParam.trim().toLowerCase();
    return items.filter((signal) => {
      if (statusFilter !== "all" && signal.status !== statusFilter) {
        return false;
      }

      if (tagFilter) {
        const matchesTag = signal.tags.some(
          (tag) => tag.toLowerCase() === tagFilter
        );
        if (!matchesTag) {
          return false;
        }
      }

      if (!query) {
        return true;
      }

      const haystack = [
        signal.title,
        signal.url,
        signal.notes,
        signal.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, q, statusFilter, tagParam]);

  const handleClearTag = () => {
    if (!tagParam) {
      return;
    }
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("tag");
    const nextQuery = nextParams.toString();
    router.push(nextQuery ? `/app/inbox?${nextQuery}` : "/app/inbox");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-neutral-100">Inbox</h1>
          <p className="text-neutral-400">
            Review what you saved and decide what to do next.
          </p>
        </div>
        <Link
          href="/app/new"
          className="inline-flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-100 transition hover:bg-neutral-800"
        >
          New signal
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search signals"
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 sm:max-w-xs"
        />
        <div className="flex flex-wrap items-center gap-3">
          {tagParam ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-200">
              Tag: <span className="font-semibold">{tagParam}</span>
              <button
                type="button"
                onClick={handleClearTag}
                className="text-neutral-400 transition hover:text-neutral-100"
                aria-label="Clear tag filter"
              >
                ×
              </button>
            </span>
          ) : null}
          <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/50 p-1">
            {statusFilters.map((filter) => {
              const isActive = filter.value === statusFilter;
              return (
                <button
                  key={filter.value}
                  type="button"
                  className={
                    isActive
                      ? "rounded-md bg-neutral-800 px-3 py-1 text-xs text-neutral-100"
                      : "rounded-md px-3 py-1 text-xs text-neutral-400 transition hover:text-neutral-200"
                  }
                  onClick={() => setStatusFilter(filter.value)}
                  aria-pressed={isActive}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onStatusChanged={loadSignals}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
          <p className="text-sm text-neutral-400">
            No signals yet. Create one from New.
          </p>
        </div>
      )}
    </div>
  );
}
