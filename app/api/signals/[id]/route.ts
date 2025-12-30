import { NextResponse } from "next/server";

import { deleteSignal, getSignal, updateSignal } from "../../../../lib/db";
import { validateSignalInput } from "../../../../lib/validators";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function GET(_req: Request, { params }: { params: any }) {
  const resolved = await Promise.resolve(params as any);
  const id = decodeURIComponent(resolved.id);
  const item = await getSignal(id);
  if (!item) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404, headers: noStoreHeaders }
    );
  }

  return NextResponse.json({ item }, { headers: noStoreHeaders });
}

export async function PATCH(req: Request, { params }: { params: any }) {
  const resolved = await Promise.resolve(params as any);
  const id = decodeURIComponent(resolved.id);
  const existing = await getSignal(id);
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404, headers: noStoreHeaders }
    );
  }

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { body: "Invalid JSON." } },
      { status: 400, headers: noStoreHeaders }
    );
  }

  const patch = payload && typeof payload === "object" ? payload : {};
  const merged: {
    url: unknown;
    title: unknown;
    notes: unknown;
    tags: unknown;
    status: unknown;
  } = {
    url: existing.url,
    title: existing.title,
    notes: existing.notes,
    tags: existing.tags,
    status: existing.status,
  };

  if ("url" in patch) {
    merged.url = (patch as Record<string, unknown>).url;
  }
  if ("title" in patch) {
    merged.title = (patch as Record<string, unknown>).title;
  }
  if ("notes" in patch) {
    merged.notes = (patch as Record<string, unknown>).notes;
  }
  if ("tags" in patch) {
    merged.tags = (patch as Record<string, unknown>).tags;
  }
  if ("status" in patch) {
    merged.status = (patch as Record<string, unknown>).status;
  }

  const result = validateSignalInput(merged);
  if (!result.ok || !result.value) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400, headers: noStoreHeaders }
    );
  }

  const item = await updateSignal(id, {
    url: result.value.url,
    title: result.value.title,
    notes: result.value.notes,
    tags: result.value.tags,
    status: result.value.status,
  });

  if (!item) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404, headers: noStoreHeaders }
    );
  }

  return NextResponse.json({ item }, { headers: noStoreHeaders });
}

export async function DELETE(_req: Request, { params }: { params: any }) {
  const resolved = await Promise.resolve(params as any);
  const id = decodeURIComponent(resolved.id);
  const deleted = await deleteSignal(id);
  if (!deleted) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404, headers: noStoreHeaders }
    );
  }

  return NextResponse.json({ deleted: true }, { headers: noStoreHeaders });
}
