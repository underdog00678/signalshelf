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
  pinned?: boolean;
};

const KEY = "signalshelf.signals.v1";

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

function safeRead(): Signal[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Signal[]) : [];
  } catch {
    return [];
  }
}

function safeWrite(items: Signal[]): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
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
      pinned: false,
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
      pinned: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
  ];
};

export function initIfEmpty(): void {
  if (typeof window === "undefined") {
    return;
  }
  const current = safeRead();
  if (current.length > 0) {
    return;
  }
  safeWrite(buildSeedSignals());
}

export function resetStore(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(KEY);
}

export function getAll(): Signal[] {
  if (typeof window === "undefined") {
    return [];
  }
  initIfEmpty();
  const items = [...safeRead()];
  items.sort((a, b) => {
    const aPinned = a.pinned ? 1 : 0;
    const bPinned = b.pinned ? 1 : 0;
    if (aPinned !== bPinned) {
      return bPinned - aPinned;
    }
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime;
  });
  return items;
}

export function getById(id: string): Signal | null {
  if (typeof window === "undefined") {
    return null;
  }
  initIfEmpty();
  return safeRead().find((signal) => signal.id === id) ?? null;
}

export function create(input: {
  url: string;
  title: string;
  notes?: string;
  tags?: string[];
  status?: SignalStatus;
}): Signal {
  if (typeof window === "undefined") {
    const nowIso = new Date().toISOString();
    return {
      id: createId(),
      url: input.url,
      title: input.title,
      notes: input.notes ?? "",
      tags: normalizeTags(Array.isArray(input.tags) ? input.tags : []),
      status: input.status ?? "inbox",
      pinned: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  }

  const nowIso = new Date().toISOString();
  const created: Signal = {
    id: createId(),
    url: input.url,
    title: input.title,
    notes: input.notes ?? "",
    tags: normalizeTags(Array.isArray(input.tags) ? input.tags : []),
    status: input.status ?? "inbox",
    pinned: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  initIfEmpty();
  const signals = safeRead();
  signals.unshift(created);
  safeWrite(signals);
  return created;
}

export function update(
  id: string,
  patch: Partial<Omit<Signal, "id" | "createdAt">>
): Signal | null {
  if (typeof window === "undefined") {
    return null;
  }
  initIfEmpty();
  const signals = safeRead();
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
  safeWrite(signals);
  return updated;
}

export function togglePinned(id: string): Signal | null {
  if (typeof window === "undefined") {
    return null;
  }
  initIfEmpty();
  const signals = safeRead();
  const index = signals.findIndex((signal) => signal.id === id);
  if (index === -1) {
    return null;
  }

  const existing = signals[index];
  const updated: Signal = {
    ...existing,
    pinned: !existing.pinned,
    updatedAt: new Date().toISOString(),
  };

  signals[index] = updated;
  safeWrite(signals);
  return updated;
}

export function remove(id: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  initIfEmpty();
  const signals = safeRead();
  const index = signals.findIndex((signal) => signal.id === id);
  if (index === -1) {
    return false;
  }

  signals.splice(index, 1);
  safeWrite(signals);
  return true;
}

export function listTags(): { name: string; count: number }[] {
  if (typeof window === "undefined") {
    return [];
  }
  initIfEmpty();
  const counts = new Map<string, number>();

  for (const signal of safeRead()) {
    for (const tag of signal.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
