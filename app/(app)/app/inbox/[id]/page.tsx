"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SignalForm from "../../../../../components/signals/SignalForm";
import { formatDate, hostnameFromUrl } from "../../../../../lib/utils";
import { getById, initIfEmpty, remove, update } from "../../../../../lib/clientStore";

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

type SignalFormValue = {
  url: string;
  title: string;
  notes: string;
  tags: string[];
  status: SignalStatus;
};

type PageProps = { params: { id: string } };

export default function Page({ params }: PageProps) {
  const id = decodeURIComponent(params.id);
  const router = useRouter();
  const [item, setItem] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      initIfEmpty();
      const found = getById(id);
      setItem(found);
      setNotFound(!found);
    } catch {
      setError("Unable to load the signal.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    if (!item) {
      return;
    }
    const confirmed = window.confirm("Delete this signal?");
    if (!confirmed) {
      return;
    }

    const deleted = remove(id);
    if (deleted) {
      router.push("/app/inbox");
      return;
    }
    setError("Unable to delete the signal.");
  };

  const handleUpdate = async (value: SignalFormValue) => {
    if (!item) {
      return;
    }

    setApiErrors(undefined);

    const updated = update(id, value);
    if (!updated) {
      setError("Unable to save changes.");
      return;
    }

    setItem(getById(id));
    setIsEditing(false);
  };

  const emptyValue: SignalFormValue = {
    url: "",
    title: "",
    notes: "",
    tags: [],
    status: "inbox",
  };

  const initialValue = useMemo<SignalFormValue>(() => {
    if (!item) {
      return emptyValue;
    }

    return {
      url: item.url,
      title: item.title,
      notes: item.notes ?? "",
      tags: Array.isArray(item.tags) ? item.tags : [],
      status: item.status ?? "inbox",
    };
  }, [item]);

  if (loading) {
    return <p className="text-sm text-neutral-400">Loading…</p>;
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <Link
          href="/app/inbox"
          className="text-sm text-neutral-400 transition hover:text-neutral-200"
        >
          Back to inbox
        </Link>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
          <p className="text-sm text-neutral-400">Signal not found.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link
          href="/app/inbox"
          className="text-sm text-neutral-400 transition hover:text-neutral-200"
        >
          Back to inbox
        </Link>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="space-y-6">
      {process.env.NODE_ENV !== "production" && (
        <div className="text-xs text-neutral-500">debug: loaded {id}</div>
      )}
      <div className="flex flex-col gap-2">
        <Link
          href="/app/inbox"
          className="text-sm text-neutral-400 transition hover:text-neutral-200"
        >
          Back to inbox
        </Link>
      </div>

      {isEditing ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
          <SignalForm
            mode="edit"
            initialValue={initialValue}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditing(false);
              setApiErrors(undefined);
            }}
            apiErrors={apiErrors}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold text-neutral-100">
                  {item.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener"
                    className="text-neutral-200 transition hover:text-white"
                  >
                    {item.url}
                  </a>
                  <span>•</span>
                  <span>{hostnameFromUrl(item.url)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                <span className="rounded-full border border-neutral-700 px-2 py-1 text-xs text-neutral-300">
                  {item.status}
                </span>
                <span>Created {formatDate(item.createdAt)}</span>
                <span>Updated {formatDate(item.updatedAt)}</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-neutral-200">
                  Notes
                </h2>
                {item.notes ? (
                  <p className="whitespace-pre-line text-sm text-neutral-300">
                    {item.notes}
                  </p>
                ) : (
                  <p className="text-sm text-neutral-500">No notes yet.</p>
                )}
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-neutral-200">Tags</h2>
                {item.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-neutral-700 px-2 py-1 text-xs text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">No tags yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition hover:bg-neutral-900"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              type="button"
              className="rounded-lg border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
