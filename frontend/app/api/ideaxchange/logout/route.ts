import { NextResponse } from "next/server";
import { IDEAXCHANGE_LOGIN_PATH, IDEAXCHANGE_SESSION_COOKIE } from "@/lib/ideaxchange-constants";

export async function POST() {
  const res = NextResponse.json({ ok: true, redirect: IDEAXCHANGE_LOGIN_PATH });
  res.cookies.set(IDEAXCHANGE_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
