import { NextResponse } from "next/server";
import { getIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import {
  fetchIdeaxchangeAfterCursor,
  fetchIdeaxchangeCategoryAfterCursor,
  fetchIdeaxchangeSalesAfterCursor,
  fetchIdeaxchangeRecruitAfterCursor,
  fetchIdeaxchangeInitiativeAfterCursor,
  IDEAXCHANGE_LOAD_MORE_FIRST,
  IDEAXCHANGE_RECRUIT_TAG_SLUG,
  IDEAXCHANGE_SALES_TAG_SLUG,
  IDEAXCHANGE_INITIATIVE_TAG_SLUG,
} from "@/lib/ideaxchange-data";

export async function POST(req: Request) {
  const auth = await getIdeaxchangeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { after?: unknown; topicSlug?: unknown; tagSlug?: unknown };
    const after = typeof body.after === "string" ? body.after.trim() : "";
    if (!after) {
      return NextResponse.json({ error: "Missing or invalid after cursor" }, { status: 400 });
    }

    const topicSlug = typeof body.topicSlug === "string" ? body.topicSlug.trim() : "";
    const tagSlug = typeof body.tagSlug === "string" ? body.tagSlug.trim() : "";
    const persona = auth.persona;

    const result =
      tagSlug === IDEAXCHANGE_SALES_TAG_SLUG
        ? await fetchIdeaxchangeSalesAfterCursor(after, IDEAXCHANGE_LOAD_MORE_FIRST, persona)
        : tagSlug === IDEAXCHANGE_RECRUIT_TAG_SLUG
          ? await fetchIdeaxchangeRecruitAfterCursor(after, IDEAXCHANGE_LOAD_MORE_FIRST, persona)
          : tagSlug === IDEAXCHANGE_INITIATIVE_TAG_SLUG
            ? await fetchIdeaxchangeInitiativeAfterCursor(after, IDEAXCHANGE_LOAD_MORE_FIRST, persona)
            : topicSlug
          ? await fetchIdeaxchangeCategoryAfterCursor(
              topicSlug,
              after,
              IDEAXCHANGE_LOAD_MORE_FIRST,
              persona,
            )
          : await fetchIdeaxchangeAfterCursor(after, IDEAXCHANGE_LOAD_MORE_FIRST, persona);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/ideaxchange/load-more]", err);
    return NextResponse.json({ error: "Failed to load articles" }, { status: 500 });
  }
}
