import { NextResponse } from "next/server";
import {
  IDEAXCHANGE_DEV_VIEW_COOKIE,
  canUseIdeaxchangeDevView,
  devViewCookieOptions,
  type IdeaxchangeDevViewMode,
} from "@/lib/ideaxchange-dev";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";

const VALID_MODES: IdeaxchangeDevViewMode[] = ["all", "brokerage", "career"];

export async function POST(req: Request) {
  const auth = await requireIdeaxchangeAuth();
  if (!canUseIdeaxchangeDevView(auth.user?.email)) {
    return NextResponse.json({ error: "Dev unlock is not enabled" }, { status: 403 });
  }

  let mode: IdeaxchangeDevViewMode = "all";
  try {
    const body = (await req.json()) as { mode?: string };
    if (body.mode && VALID_MODES.includes(body.mode as IdeaxchangeDevViewMode)) {
      mode = body.mode as IdeaxchangeDevViewMode;
    }
  } catch {
    // default to all
  }

  const res = NextResponse.json({ ok: true, mode });
  res.cookies.set(IDEAXCHANGE_DEV_VIEW_COOKIE, mode, devViewCookieOptions());
  return res;
}
