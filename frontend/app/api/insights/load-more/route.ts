import { NextResponse } from "next/server";
import {
  fetchInsightCategoryAfterCursor,
  fetchInsightsAfterCursor,
  INSIGHTS_LOAD_MORE_FIRST,
} from "@/lib/insights-data";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { after?: unknown; topicSlug?: unknown };
    const after =
      typeof body.after === "string" ? body.after.trim() : "";
    if (!after) {
      return NextResponse.json(
        { error: "Missing or invalid after cursor" },
        { status: 400 },
      );
    }

    const topicSlug =
      typeof body.topicSlug === "string" ? body.topicSlug.trim() : "";

    const result = topicSlug
      ? await fetchInsightCategoryAfterCursor(topicSlug, after, INSIGHTS_LOAD_MORE_FIRST)
      : await fetchInsightsAfterCursor(after, INSIGHTS_LOAD_MORE_FIRST);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/insights/load-more]", err);
    return NextResponse.json(
      { error: "Failed to load insights" },
      { status: 500 },
    );
  }
}
