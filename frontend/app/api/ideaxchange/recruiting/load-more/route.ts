import { NextResponse } from "next/server";
import { hasIdeaxchangeAccess } from "@/lib/ideaxchange-auth";
import {
  fetchCaseStudiesAfterCursor,
} from "@/lib/ideaxchange-recruiting-data";
import { RECRUITING_LOAD_MORE_FIRST } from "@/lib/ideaxchange-recruiting-utils";

export async function POST(req: Request) {
  if (!(await hasIdeaxchangeAccess())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { after?: unknown };
    const after = typeof body.after === "string" ? body.after.trim() : "";
    if (!after) {
      return NextResponse.json({ error: "Missing or invalid after cursor" }, { status: 400 });
    }

    const result = await fetchCaseStudiesAfterCursor(after, RECRUITING_LOAD_MORE_FIRST);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/ideaxchange/recruiting/load-more]", err);
    return NextResponse.json({ error: "Failed to load case studies" }, { status: 500 });
  }
}
