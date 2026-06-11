import { NextResponse } from "next/server";
import { ideaxchangeSessionCookieOptions } from "@/lib/ideaxchange-auth";
import {
  IDEAXCHANGE_MAGAZINE_PATH,
  IDEAXCHANGE_SESSION_COOKIE,
  IDEAXCHANGE_SESSION_VALUE,
} from "@/lib/ideaxchange-constants";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { next?: unknown };
    const next =
      typeof body.next === "string" && body.next.startsWith("/ideaxchange/magazine")
        ? body.next
        : IDEAXCHANGE_MAGAZINE_PATH;

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
