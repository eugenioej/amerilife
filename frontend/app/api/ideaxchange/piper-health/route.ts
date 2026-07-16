import { NextResponse } from "next/server";
import {
  fetchPiperLeaderboard,
  getCurrentPiperPeriod,
  isPiperApiConfigured,
} from "@/lib/ideaxchange-piper-api";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { isIdeaxchangeDevUnlockEnabled } from "@/lib/ideaxchange-dev";

/** Dev/staging smoke test — confirms Piper env + one live request. */
export async function GET() {
  if (!isIdeaxchangeDevUnlockEnabled()) {
    return NextResponse.json({ error: "Enable IDEAXCHANGE_DEV_UNLOCK=1" }, { status: 403 });
  }

  await requireIdeaxchangeAuth();

  const configured = isPiperApiConfigured();
  const { year, month } = getCurrentPiperPeriod();

  if (!configured) {
    return NextResponse.json({
      configured: false,
      year,
      month,
      message: "PIPER_API_KEY is missing in server environment. Restart after adding it.",
    });
  }

  const sample = await fetchPiperLeaderboard("kickoff", year, month);

  return NextResponse.json({
    configured: true,
    year,
    month,
    sampleUrl: `/leaderboard/kickoff/${year}/${month}`,
    ok: sample.ok,
    status: sample.status,
    error: sample.error ?? null,
    rowCount: sample.data?.data?.length ?? 0,
    updated: sample.data?.updated ?? null,
    hint:
      sample.ok
        ? "Piper is returning data. Career Leaderboard should show live rows."
        : "401/403 usually means FQDN whitelist or wrong API key header — contact AmeriLife IT (Mark).",
  });
}
