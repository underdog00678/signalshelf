import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    name: "signalshelf",
    timestamp: Date.now(),
  });
}
