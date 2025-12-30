import { NextResponse } from "next/server";

import { listTags } from "../../../lib/db";

export async function GET() {
  return NextResponse.json({ tags: await listTags() });
}
