"use client";

import { useEffect, useMemo, useState } from "react";

import TagPicker from "./TagPicker";

type SignalStatus = "inbox" | "reading" | "done";

type SignalFormValue = {
  url: string;
  title: string;
  notes: string;
  tags: string[];
  status: SignalStatus;
};

type SignalFormProps = {
  mode: "create" | "edit";
  initialValue: SignalFormValue;
  submitLabel: string;
  onSubmit: (value: SignalFormValue) => Promise<void>;
  onCancel?: () => void;
  apiErrors?: Record<string, string>;
};

export default function SignalForm({
  mode,
  initialValue,
  submitLabel,
  onSubmit,
  onCancel,
  apiErrors,
}: SignalFormProps) {
  const isEditMode = mode === "edit";
  const [formValue, setFormValue] = useState<SignalFormValue>(initialValue);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormValue(initialValue);
    setFieldErrors({});
  }, [initialValue]);

  const apiErrorEntries = useMemo(() => {
    if (!apiErrors) {
      return [];
    }
    return Object.entries(apiErrors).filter(([, message]) => message);
  }, [apiErrors]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const trimmedUrl = formValue.url.trim();
    const trimmedTitle = formValue.title.trim();

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      nextErrors.url = "URL must start with http:// or https://.";
    }

    if (trimmedTitle.length < 2 || trimmedTitle.length > 120) {
      nextErrors.title = "Title must be 2 to 120 characters.";
    }

    setFieldErrors(nextErrors);
    return { nextErrors, trimmedUrl, trimmedTitle };
  };

  const updateUrl = (value: string) => {
    setFormValue((prev) => ({ ...prev, url: value }));
    if (fieldErrors.url && /^https?:\/\//i.test(value.trim())) {
      setFieldErrors((prev) => {
        const { url, ...rest } = prev;
        return rest;
      });
    }
  };

  const updateTitle = (value: string) => {
    setFormValue((prev) => ({ ...prev, title: value }));
    if (fieldErrors.title) {
      const length = value.trim().length;
      if (length >= 2 && length <= 120) {
        setFieldErrors((prev) => {
          const { title, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { nextErrors, trimmedUrl, trimmedTitle } = validate();

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formValue,
        url: trimmedUrl,
        title: trimmedTitle,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label={isEditMode ? "Edit signal" : "Create signal"}
    >
      {apiErrorEntries.length > 0 ? (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {apiErrorEntries.map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm text-neutral-300" htmlFor="signal-url">
          URL
        </label>
        <input
          id="signal-url"
          value={formValue.url}
          onChange={(event) => updateUrl(event.target.value)}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          placeholder="https://"
          required
        />
        {fieldErrors.url ? (
          <p className="text-xs text-rose-300">{fieldErrors.url}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300" htmlFor="signal-title">
          Title
        </label>
        <input
          id="signal-title"
          value={formValue.title}
          onChange={(event) => updateTitle(event.target.value)}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          placeholder="Short descriptive title"
          required
        />
        {fieldErrors.title ? (
          <p className="text-xs text-rose-300">{fieldErrors.title}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300" htmlFor="signal-notes">
          Notes
        </label>
        <textarea
          id="signal-notes"
          value={formValue.notes}
          onChange={(event) =>
            setFormValue((prev) => ({ ...prev, notes: event.target.value }))
          }
          className="min-h-[120px] w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          placeholder="Add context, highlights, or next steps"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300">Tags</label>
        <TagPicker
          value={formValue.tags}
          onChange={(tags) => setFormValue((prev) => ({ ...prev, tags }))}
          placeholder="Add a tag and press Enter"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-neutral-300" htmlFor="signal-status">
          Status
        </label>
        <select
          id="signal-status"
          value={formValue.status}
          onChange={(event) =>
            setFormValue((prev) => ({
              ...prev,
              status: event.target.value as SignalStatus,
            }))
          }
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
        >
          <option value="inbox">Inbox</option>
          <option value="reading">Reading</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
          disabled={isSubmitting}
        >
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition hover:bg-neutral-900"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
