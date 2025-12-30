import { promises as fs } from "fs";
import path from "path";

import { makeId } from "./utils";

export type SignalStatus = "inbox" | "reading" | "done";

export type Signal = {
  id: string;
  url: string;
  title: string;
  notes: string;
  tags: string[];
  status: SignalStatus;
  createdAt: string;
  updatedAt: string;
};

const dataPath = path.join(process.cwd(), "data", "signals.json");

let writeLock: Promise<unknown> = Promise.resolve();

const normalizeTags = (tags: string[]): string[] => {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const tag of tags) {
    const value = tag.trim().toLowerCase();
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    normalized.push(value);
  }

  return normalized;
};

const buildSeedSignals = (): Signal[] => {
  const now = Date.now();

  return [
    {
      id: makeId(),
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
      title: "Fetch API reference",
      notes: "Great refresher on request/response patterns and streaming bodies.",
      tags: ["research", "api"],
      status: "inbox",
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: makeId(),
      url: "https://stripe.com/blog/checkout-ux",
      title: "Checkout UX patterns",
      notes: "Potential ideas for reducing friction in the onboarding flow.",
      tags: ["product", "ux"],
      status: "reading",
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
  ];
};

const ensureDataFile = async () => {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  try {
    await fs.access(dataPath);
  } catch {
    await fs.writeFile(dataPath, "[]", "utf8");
  }
};

const readRawSignals = async (): Promise<Signal[]> => {
  await ensureDataFile();

  let raw = "[]";
  try {
    raw = await fs.readFile(dataPath, "utf8");
  } catch {
    return [];
  }

  if (!raw.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Signal[]) : [];
  } catch {
    return [];
  }
};

const writeSignals = async (signals: Signal[]) => {
  await ensureDataFile();
  await fs.writeFile(dataPath, JSON.stringify(signals, null, 2), "utf8");
};

const loadSignals = async (): Promise<Signal[]> => {
  await writeLock;
  const signals = await readRawSignals();
  if (signals.length > 0) {
    return signals;
  }

  let seeded: Signal[] = [];

  writeLock = writeLock.then(async () => {
    const current = await readRawSignals();
    if (current.length === 0) {
      seeded = buildSeedSignals();
      await writeSignals(seeded);
    } else {
      seeded = current;
    }
  });

  await writeLock;
  return seeded;
};

export async function listSignals(opts?: {
  q?: string;
  tag?: string;
  status?: SignalStatus;
  sort?: "newest" | "oldest";
}): Promise<Signal[]> {
  const signals = await loadSignals();
  let items = [...signals];

  const query = opts?.q?.trim().toLowerCase();
  if (query) {
    items = items.filter((signal) => {
      const haystack = [signal.url, signal.title, signal.notes]
        .join(" ")
        .toLowerCase();
      const tagMatch = signal.tags.some((tag) => tag.includes(query));
      return haystack.includes(query) || tagMatch;
    });
  }

  const tagFilter = opts?.tag?.trim().toLowerCase();
  if (tagFilter) {
    items = items.filter((signal) => signal.tags.includes(tagFilter));
  }

  if (opts?.status) {
    items = items.filter((signal) => signal.status === opts.status);
  }

  const sort = opts?.sort ?? "newest";
  items.sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sort === "newest" ? bTime - aTime : aTime - bTime;
  });

  return items;
}

export async function getSignal(id: string): Promise<Signal | null> {
  const signals = await loadSignals();
  return signals.find((signal) => signal.id === id) ?? null;
}

export async function createSignal(input: {
  url: string;
  title: string;
  notes?: string;
  tags?: string[];
  status?: SignalStatus;
}): Promise<Signal> {
  return await (writeLock = writeLock.then(async () => {
    let signals = await readRawSignals();
    if (signals.length === 0) {
      signals = buildSeedSignals();
    }

    const nowIso = new Date().toISOString();
    const signal: Signal = {
      id: makeId(),
      url: input.url,
      title: input.title,
      notes: input.notes ?? "",
      tags: normalizeTags(input.tags ?? []),
      status: input.status ?? "inbox",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    signals.unshift(signal);
    await writeSignals(signals);
    return signal;
  }));
}

export async function updateSignal(
  id: string,
  patch: Partial<Omit<Signal, "id" | "createdAt">>
): Promise<Signal | null> {
  let updated: Signal | null = null;

  writeLock = writeLock.then(async () => {
    let signals = await readRawSignals();
    if (signals.length === 0) {
      signals = buildSeedSignals();
    }

    const index = signals.findIndex((signal) => signal.id === id);
    if (index === -1) {
      await writeSignals(signals);
      return;
    }

    const existing = signals[index];
    const nowIso = new Date().toISOString();
    const next: Signal = {
      ...existing,
      ...patch,
      tags: normalizeTags(patch.tags ?? existing.tags),
      updatedAt: nowIso,
    };

    signals[index] = next;
    await writeSignals(signals);
    updated = next;
  });

  await writeLock;
  return updated;
}

export async function deleteSignal(id: string): Promise<boolean> {
  let deleted = false;

  writeLock = writeLock.then(async () => {
    let signals = await readRawSignals();
    if (signals.length === 0) {
      signals = buildSeedSignals();
    }

    const index = signals.findIndex((signal) => signal.id === id);
    if (index === -1) {
      await writeSignals(signals);
      return;
    }

    signals.splice(index, 1);
    await writeSignals(signals);
    deleted = true;
  });

  await writeLock;
  return deleted;
}

export async function listTags(): Promise<{ name: string; count: number }[]> {
  const signals = await loadSignals();
  const counts = new Map<string, number>();

  for (const signal of signals) {
    for (const tag of signal.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
