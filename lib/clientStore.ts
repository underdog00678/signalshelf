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

const STORAGE_KEY = "signalshelf.signals.v1";

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
};

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
    if (normalized.length >= 12) {
      break;
    }
  }

  return normalized;
};

function read(): Signal[] {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Signal[]) : [];
  } catch {
    return [];
  }
}

function write(signals: Signal[]): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(signals));
  } catch {
    return;
  }
}

const buildSeedSignals = (): Signal[] => {
  const now = Date.now();

  return [
    {
      id: createId(),
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
      title: "Fetch API reference",
      notes: "Great refresher on request/response patterns and streaming bodies.",
      tags: ["research", "api"],
      status: "inbox",
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: createId(),
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

export function initIfEmpty(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const current = read();
  if (current.length === 0) {
    write(buildSeedSignals());
  }
}

export function getAll(): Signal[] {
  initIfEmpty();
  const items = [...read()];
  items.sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime;
  });
  return items;
}

export function getById(id: string): Signal | null {
  initIfEmpty();
  return read().find((signal) => signal.id === id) ?? null;
}

export function create(input: {
  url: string;
  title: string;
  notes?: string;
  tags?: string[];
  status?: SignalStatus;
}): Signal {
  const nowIso = new Date().toISOString();
  const created: Signal = {
    id: createId(),
    url: input.url,
    title: input.title,
    notes: input.notes ?? "",
    tags: normalizeTags(Array.isArray(input.tags) ? input.tags : []),
    status: input.status ?? "inbox",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const storage = getStorage();
  if (!storage) {
    return created;
  }

  const signals = read();
  signals.unshift(created);
  write(signals);
  return created;
}

export function update(
  id: string,
  patch: Partial<Omit<Signal, "id" | "createdAt">>
): Signal | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const signals = read();
  const index = signals.findIndex((signal) => signal.id === id);
  if (index === -1) {
    return null;
  }

  const existing = signals[index];
  const nextTags = Array.isArray(patch.tags)
    ? normalizeTags(patch.tags)
    : existing.tags;
  const updated: Signal = {
    ...existing,
    ...patch,
    tags: nextTags,
    updatedAt: new Date().toISOString(),
  };

  signals[index] = updated;
  write(signals);
  return updated;
}

export function remove(id: string): boolean {
  const storage = getStorage();
  if (!storage) {
    return false;
  }

  const signals = read();
  const index = signals.findIndex((signal) => signal.id === id);
  if (index === -1) {
    return false;
  }

  signals.splice(index, 1);
  write(signals);
  return true;
}

export function listTags(): { name: string; count: number }[] {
  initIfEmpty();
  const counts = new Map<string, number>();

  for (const signal of read()) {
    for (const tag of signal.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
