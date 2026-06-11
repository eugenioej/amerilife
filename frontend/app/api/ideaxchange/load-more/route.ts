import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isIdeaxchangeSession } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_SESSION_COOKIE } from "@/lib/ideaxchange-constants";
import {
  fetchIdeaxchangeAfterCursor,
  fetchIdeaxchangeCategoryAfterCursor,
  IDEAXCHANGE_LOAD_MORE_FIRST,
} from "@/lib/ideaxchange-data";

export async function POST(req: Request) {
  const session = (await cookies()).get(IDEAXCHANGE_SESSION_COOKIE)?.value;
  if (!isIdeaxchangeSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { after?: unknown; topicSlug?: unknown };
    const after = typeof body.after === "string" ? body.after.trim() : "";
    if (!after) {
      return NextResponse.json({ error: "Missing or invalid after cursor" }, { status: 400 });
    }

    const topicSlug = typeof body.topicSlug === "string" ? body.topicSlug.trim() : "";

    const result = topicSlug
      ? await fetchIdeaxchangeCategoryAfterCursor(
          topicSlug,
          after,
          IDEAXCHANGE_LOAD_MORE_FIRST,
        )
      : await fetchIdeaxchangeAfterCursor(after, IDEAXCHANGE_LOAD_MORE_FIRST);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/ideaxchange/load-more]", err);
    return NextResponse.json({ error: "Failed to load articles" }, { status: 500 });
  }
}
