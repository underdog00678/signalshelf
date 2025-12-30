import type { SignalStatus } from "./db";

const allowedStatuses: SignalStatus[] = ["inbox", "reading", "done"];

export function validateSignalInput(input: any): {
  ok: boolean;
  errors: Record<string, string>;
  value?: {
    url: string;
    title: string;
    notes: string;
    tags: string[];
    status: SignalStatus;
  };
} {
  const errors: Record<string, string> = {};
  const payload = input && typeof input === "object" ? input : {};

  let url = "";
  if (typeof payload.url !== "string" || payload.url.trim().length === 0) {
    errors.url = "URL is required.";
  } else {
    const trimmedUrl = payload.url.trim();
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      errors.url = "URL must start with http:// or https://.";
    } else {
      url = trimmedUrl;
    }
  }

  let title = "";
  if (typeof payload.title !== "string" || payload.title.trim().length === 0) {
    errors.title = "Title is required.";
  } else {
    const trimmedTitle = payload.title.trim();
    if (trimmedTitle.length < 2 || trimmedTitle.length > 120) {
      errors.title = "Title must be between 2 and 120 characters.";
    } else {
      title = trimmedTitle;
    }
  }

  let notes = "";
  if (payload.notes === undefined) {
    notes = "";
  } else if (typeof payload.notes !== "string") {
    errors.notes = "Notes must be a string.";
  } else if (payload.notes.length > 2000) {
    errors.notes = "Notes must be 2000 characters or less.";
  } else {
    notes = payload.notes;
  }

  let tags: string[] = [];
  if (payload.tags === undefined) {
    tags = [];
  } else if (!Array.isArray(payload.tags)) {
    errors.tags = "Tags must be an array.";
  } else if (payload.tags.length > 12) {
    errors.tags = "Tags must have at most 12 items.";
  } else {
    const normalized: string[] = [];
    let tagError = "";

    for (const rawTag of payload.tags) {
      if (typeof rawTag !== "string") {
        tagError = "Each tag must be a string.";
        break;
      }
      const trimmed = rawTag.trim().toLowerCase();
      if (trimmed.length < 1 || trimmed.length > 24) {
        tagError = "Each tag must be 1 to 24 characters.";
        break;
      }
      normalized.push(trimmed);
    }

    if (tagError) {
      errors.tags = tagError;
    } else {
      tags = normalized;
    }
  }

  let status: SignalStatus = "inbox";
  if (payload.status === undefined || payload.status === null || payload.status === "") {
    status = "inbox";
  } else if (typeof payload.status !== "string") {
    errors.status = "Status must be a string.";
  } else if (!allowedStatuses.includes(payload.status as SignalStatus)) {
    errors.status = "Status must be inbox, reading, or done.";
  } else {
    status = payload.status as SignalStatus;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors,
    value: {
      url,
      title,
      notes,
      tags,
      status,
    },
  };
}
