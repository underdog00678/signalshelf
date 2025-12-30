import { NextResponse } from "next/server";

import type { SignalStatus } from "../../../lib/db";
import { createSignal, listSignals } from "../../../lib/db";
import { validateSignalInput } from "../../../lib/validators";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const isSignalStatus = (value: string | null): value is SignalStatus =>
  value === "inbox" || value === "reading" || value === "done";

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const statusParam = searchParams.get("status");
  const sortParam = searchParams.get("sort");
  const status = isSignalStatus(statusParam) ? statusParam : undefined;
  const sort =
    sortParam === "newest" || sortParam === "oldest" ? sortParam : undefined;

  const items = await listSignals({ q, tag, status, sort });
  return NextResponse.json({ items }, { headers: noStoreHeaders });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { body: "Invalid JSON." } },
      { status: 400, headers: noStoreHeaders }
    );
  }

  const result = validateSignalInput(payload);
  if (!result.ok || !result.value) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400, headers: noStoreHeaders }
    );
  }

  const item = await createSignal(result.value);
  return NextResponse.json({ item }, { status: 201, headers: noStoreHeaders });
}
