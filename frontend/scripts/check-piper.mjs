#!/usr/bin/env node
/**
 * Smoke-test Piper Career leaderboard connectivity (server-side).
 * Usage: node scripts/check-piper.mjs
 * Reads PIPER_* from frontend/.env.local (never prints the key).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const env = {};
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    env[trimmed.slice(0, i)] = trimmed.slice(i + 1);
  }
}

const apiKey = (process.env.PIPER_API_KEY || env.PIPER_API_KEY || "").trim();
const baseUrl = (
  process.env.PIPER_API_BASE_URL ||
  env.PIPER_API_BASE_URL ||
  "https://api-incentives-prod.piper.tools"
).replace(/\/$/, "");
const keyHeader = (
  process.env.PIPER_API_KEY_HEADER ||
  env.PIPER_API_KEY_HEADER ||
  "x-api-key"
).trim();

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const samplePath = `/leaderboard/kickoff/${year}/${month}`;
const url = `${baseUrl}${samplePath}`;

const headers = { Accept: "application/json" };
const normalized = keyHeader.toLowerCase();
if (normalized === "authorization" || normalized === "authorization-bearer") {
  headers.Authorization = `Bearer ${apiKey}`;
} else if (normalized === "authorization-apikey") {
  headers.Authorization = `ApiKey ${apiKey}`;
} else {
  headers[keyHeader] = apiKey;
}

console.log("Piper connectivity check");
console.log(`  baseUrl:    ${baseUrl}`);
console.log(`  keyHeader:  ${keyHeader}`);
console.log(`  keyLength:  ${apiKey.length}`);
console.log(`  sampleUrl:  ${url}`);

if (!apiKey) {
  console.error("\nFAIL: PIPER_API_KEY is missing");
  process.exit(1);
}

try {
  const res = await fetch(url, { headers, cache: "no-store" });
  const body = await res.text();
  console.log(`\n  HTTP:       ${res.status}`);
  console.log(`  body:       ${body.slice(0, 240)}`);

  if (!res.ok) {
    console.error(
      "\nFAIL: Piper rejected the request. Typical causes:\n" +
        "  1) Invalid/revoked API key\n" +
        "  2) Key not on the incentives API usage plan\n" +
        "  3) FQDN/egress IP not whitelisted by AmeriLife IT (Mark)\n" +
        "Ask IT to authorize this environment, then re-run this script.",
    );
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    console.error("\nFAIL: Response was not JSON");
    process.exit(1);
  }

  const rows = Array.isArray(parsed?.data) ? parsed.data.length : 0;
  console.log(`  rowCount:   ${rows}`);
  console.log(`  updated:    ${parsed?.updated ?? "(none)"}`);
  console.log("\nOK: Piper is returning leaderboard data.");
} catch (error) {
  console.error("\nFAIL:", error instanceof Error ? error.message : error);
  process.exit(1);
}
