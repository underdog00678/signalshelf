"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { formatDate, hostnameFromUrl } from "../../lib/utils";

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

type SignalCardProps = {
  signal: Signal;
  onStatusChanged?: () => void;
};

const statusOptions: { label: string; value: SignalStatus }[] = [
  { label: "Inbox", value: "inbox" },
  { label: "Reading", value: "reading" },
  { label: "Done", value: "done" },
];

export default function SignalCard({ signal, onStatusChanged }: SignalCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<SignalStatus>(signal.status);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setStatus(signal.status);
  }, [signal.status]);

  const handleStatusChange = async (
    nextStatus: SignalStatus,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    if (nextStatus === status || isUpdating) {
      return;
    }

    const previous = status;
    setStatus(nextStatus);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/signals/${signal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status.");
      }

      onStatusChanged?.();
    } catch {
      setStatus(previous);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="cursor-pointer rounded-xl border border-neutral-800 bg-neutral-950 p-5 transition hover:bg-neutral-900"
      onClick={() => router.push(`/app/inbox/${signal.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/app/inbox/${signal.id}`);
        }
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-neutral-50">
              {signal.title}
            </h3>
            <p className="text-sm text-neutral-400">
              {hostnameFromUrl(signal.url)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-xs text-neutral-500">
              {formatDate(signal.createdAt)}
            </p>
            <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/50 p-1">
              {statusOptions.map((option) => {
                const isActive = option.value === status;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      isActive
                        ? "rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-100"
                        : "rounded-md px-2 py-1 text-xs text-neutral-400 transition hover:text-neutral-200"
                    }
                    onClick={(event) => handleStatusChange(option.value, event)}
                    aria-pressed={isActive}
                    disabled={isUpdating}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <p className="text-sm text-neutral-300">{signal.notes}</p>
        {signal.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {signal.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-700 px-2 py-1 text-xs text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
