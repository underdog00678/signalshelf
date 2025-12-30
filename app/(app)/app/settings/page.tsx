"use client";

import { useMemo, useState } from "react";

import { create, getAll, initIfEmpty, SignalStatus } from "../../../../lib/clientStore";

type ImportProgress = {
  done: number;
  total: number;
  errors: number;
};

export default function Page() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(
    null
  );

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      initIfEmpty();
      const payload = {
        exportedAt: new Date().toISOString(),
        items: getAll(),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "signalshelf-export.json";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setExportError("Unable to export signals.");
    } finally {
      setIsExporting(false);
    }
  };

  const parseImport = () => {
    setImportError(null);
    setImportProgress(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(importText);
    } catch {
      setImportError("Invalid JSON.");
      return null;
    }

    const list = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && Array.isArray((parsed as any).items)
      ? (parsed as any).items
      : null;

    if (!list || !Array.isArray(list)) {
      setImportError("JSON must be an array or an object with items.");
      return null;
    }

    const payloads = list
      .map((entry) => {
        if (!entry || typeof entry !== "object") {
          return null;
        }
        const candidate = entry as Record<string, unknown>;
        if (
          typeof candidate.url !== "string" ||
          typeof candidate.title !== "string"
        ) {
          return null;
        }

        const tags = Array.isArray(candidate.tags)
          ? (candidate.tags as unknown[]).filter(
              (tag) => typeof tag === "string"
            )
          : [];
        const status =
          candidate.status === "reading" ||
          candidate.status === "done" ||
          candidate.status === "inbox"
            ? (candidate.status as SignalStatus)
            : "inbox";

        return {
          url: candidate.url as string,
          title: candidate.title as string,
          notes: typeof candidate.notes === "string" ? candidate.notes : "",
          tags,
          status,
        };
      })
      .filter(Boolean) as Array<{
      url: string;
      title: string;
      notes: string;
      tags: string[];
      status: SignalStatus;
    }>;

    if (payloads.length === 0) {
      setImportError("No valid items found to import.");
      return null;
    }

    return payloads;
  };

  const handleImport = async () => {
    if (isImporting) {
      return;
    }

    const payloads = parseImport();
    if (!payloads) {
      return;
    }

    setIsImporting(true);
    setImportProgress({ done: 0, total: payloads.length, errors: 0 });

    let done = 0;
    let errors = 0;

    initIfEmpty();

    for (const payload of payloads) {
      try {
        create(payload);
      } catch {
        errors += 1;
      } finally {
        done += 1;
        setImportProgress({ done, total: payloads.length, errors });
      }
    }

    setIsImporting(false);
  };

  const importStatus = useMemo(() => {
    if (!importProgress) {
      return null;
    }
    const base = `Imported ${importProgress.done} of ${importProgress.total}`;
    if (importProgress.errors > 0) {
      return `${base} • Errors: ${importProgress.errors}`;
    }
    return base;
  }, [importProgress]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-neutral-100">Settings</h1>
        <p className="text-neutral-400">Export and import your signals.</p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">Export</h2>
            <p className="text-sm text-neutral-400">
              Download your signals as JSON.
            </p>
          </div>
          {exportError ? (
            <p className="text-sm text-rose-300">{exportError}</p>
          ) : null}
          <button
            type="button"
            className="w-fit rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? "Preparing…" : "Download JSON"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">Import</h2>
            <p className="text-sm text-neutral-400">
              Paste JSON to add more signals to your inbox.
            </p>
          </div>
          <p className="text-xs text-neutral-500">
            Import will add new items; it won't delete existing ones.
          </p>
          <textarea
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            placeholder="Paste JSON here"
            className="min-h-[160px] w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500"
          />
          {importError ? (
            <p className="text-sm text-rose-300">{importError}</p>
          ) : null}
          {importStatus ? (
            <p className="text-sm text-neutral-400">{importStatus}</p>
          ) : null}
          <button
            type="button"
            className="w-fit rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting ? "Importing…" : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
