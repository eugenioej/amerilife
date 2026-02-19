/**
 * Verify the Media Library import endpoint is reachable and auth works.
 * Run: pnpm -C frontend run verify:media-import
 *
 * Requires HEADLESS_WP_APP_USER and HEADLESS_WP_APP_PASSWORD in .env.local.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

async function loadDotEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(PROJECT_ROOT, name);
    try {
      const raw = await fs.readFile(p, "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
        if (key && process.env[key] == null) process.env[key] = val;
      }
    } catch {
      // ignore
    }
  }
}

function getHeadlessBase() {
  const gql = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  if (!gql) return null;
  return gql.replace(/\/graphql\/?$/, "").replace(/\/$/, "");
}

async function main() {
  await loadDotEnv();
  const base = getHeadlessBase();
  const user = process.env.HEADLESS_WP_APP_USER?.trim();
  const pass = process.env.HEADLESS_WP_APP_PASSWORD?.trim();

  if (!base) {
    console.error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not set.");
    process.exit(1);
  }
  if (!user || !pass) {
    console.error("HEADLESS_WP_APP_USER and HEADLESS_WP_APP_PASSWORD must be set in .env.local");
    process.exit(1);
  }

  const url = `${base}/wp-json/amerilife/v1/import-media`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paths: ["2023/01/agb-logo.png"],
      dryRun: true,
      username: user,
      appPassword: pass,
    }),
  });

  const txt = await res.text();
  let json;
  try {
    json = JSON.parse(txt);
  } catch {
    json = null;
  }

  if (!res.ok) {
    console.error(`Import endpoint returned ${res.status}:`, txt.slice(0, 500));
    process.exit(1);
  }

  if (json?.ok === true) {
    console.log("OK  Import endpoint reachable and auth valid.");
    console.log("    Sample dry-run result:", JSON.stringify(json.results?.[0], null, 2));
  } else {
    console.error("Unexpected response:", json ?? txt);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
