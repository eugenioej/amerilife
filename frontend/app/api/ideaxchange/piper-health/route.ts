import { NextResponse } from "next/server";
import {
  fetchPiperLeaderboard,
  getCurrentPiperPeriod,
  getPiperApiDiagnostics,
  getPiperLeaderboardRows,
  getPiperLeaderboardUpdatedAt,
  isPiperApiConfigured,
} from "@/lib/ideaxchange-piper-api";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";

/**
 * Authenticated smoke test for Piper (local + Atlas production).
 * Never returns the API key. Use while signed into ideaXchange:
 *   GET /api/ideaxchange/piper-health
 */
export async function GET() {
  await requireIdeaxchangeAuth();

  const diagnostics = getPiperApiDiagnostics();
  const { year, month } = getCurrentPiperPeriod();
  const samplePath = `/embed-leaderboard?incentive=kickoff&year=${year}&month=${month}`;

  if (!isPiperApiConfigured()) {
    return NextResponse.json({
      environment: process.env.NODE_ENV ?? "unknown",
      ...diagnostics,
      year,
      month,
      sampleUrl: `${diagnostics.baseUrl}${samplePath}`,
      ok: false,
      status: 0,
      error: null,
      rowCount: 0,
      diagnosis: "missing_env",
      message:
        "PIPER_API_KEY is not set in this environment (Atlas → Environment Variables / Secrets). Add it and redeploy.",
      nextStep:
        "In WP Engine Atlas, set PIPER_API_KEY (and optionally PIPER_API_BASE_URL), then Redeploy. No need to contact Mark until the key is present.",
    });
  }

  const sample = await fetchPiperLeaderboard("kickoff", year, month);

  if (sample.ok) {
    return NextResponse.json({
      environment: process.env.NODE_ENV ?? "unknown",
      ...diagnostics,
      year,
      month,
      sampleUrl: `${diagnostics.baseUrl}${samplePath}`,
      ok: true,
      status: sample.status,
      error: null,
      rowCount: getPiperLeaderboardRows(sample.data).length,
      updated: getPiperLeaderboardUpdatedAt(sample.data),
      period: sample.data?.period ?? null,
      diagnosis: "ok",
      message: "Piper accepted the key and returned data.",
      nextStep: "Career Leaderboard should show live rows (no demo banner).",
    });
  }

  const unauthorized = sample.status === 401 || sample.status === 403;

  return NextResponse.json({
    environment: process.env.NODE_ENV ?? "unknown",
    ...diagnostics,
    year,
    month,
    sampleUrl: `${diagnostics.baseUrl}${samplePath}`,
    ok: false,
    status: sample.status,
    error: sample.error ?? null,
    rowCount: 0,
    diagnosis: unauthorized ? "unauthorized" : "request_failed",
    message: unauthorized
      ? "PIPER_API_KEY is present, but Piper rejected the request (401/403)."
      : `Piper request failed with HTTP ${sample.status || "network error"}.`,
    nextStep: unauthorized
      ? "Config on our side looks set. Ask AmeriLife IT (Mark) to validate the key, usage plan, and whitelist for amerilife.com / Atlas egress."
      : "Check sampleUrl and error; retry after confirming PIPER_API_BASE_URL.",
  });
}
