import { NextResponse } from "next/server";
import { getIdeaxchangeAuth } from "@/lib/ideaxchange-auth";

/** Authenticated session snapshot — use after login to validate Entra groups/roles. */
export async function GET() {
  const state = await getIdeaxchangeAuth();
  if (!state) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    mode: state.mode,
    persona: state.persona,
    homePath: state.homePath,
    user: state.user,
  });
}
