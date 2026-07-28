import { NextResponse } from "next/server";
import { ideaxchangeSessionCookieOptions } from "@/lib/ideaxchange-auth";
import { isMicrosoftIdeaxchangeAuthEnabled } from "@/lib/ideaxchange-auth-config";
import {
  IDEAXCHANGE_HOME_PATH,
  IDEAXCHANGE_GATE_PASSWORD,
  IDEAXCHANGE_SESSION_COOKIE,
  IDEAXCHANGE_SESSION_VALUE,
  isIdeaxchangeReturnPath,
} from "@/lib/ideaxchange-constants";

export async function POST(req: Request) {
  if (isMicrosoftIdeaxchangeAuthEnabled()) {
    return NextResponse.json(
      { error: "Password login is disabled. Use Sign in with Microsoft." },
      { status: 403 },
    );
  }

  try {
    const body = (await req.json()) as { password?: unknown; next?: unknown };
    const password = typeof body.password === "string" ? body.password : "";
    if (password !== IDEAXCHANGE_GATE_PASSWORD) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const next =
      typeof body.next === "string" && isIdeaxchangeReturnPath(body.next)
        ? body.next
        : IDEAXCHANGE_HOME_PATH;

    const res = NextResponse.json({ ok: true, redirect: next });
    res.cookies.set(
      IDEAXCHANGE_SESSION_COOKIE,
      IDEAXCHANGE_SESSION_VALUE,
      ideaxchangeSessionCookieOptions(),
    );
    return res;
  } catch (err) {
    console.error("[api/ideaxchange/login]", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
