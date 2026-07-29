#!/usr/bin/env node
/**
 * Push SFTP-parsed Sales Leaderboard tables.json into WordPress CPT posts.
 *
 * Usage (from frontend/):
 *   pnpm import:leaderboard
 *   pnpm import:leaderboard -- --dry-run
 *   pnpm import:leaderboard -- --file .cache/leaderboard-sftp/latest/tables.json
 *
 * Env (frontend/.env.local or repo root .env.local):
 *   NEXT_PUBLIC_WORDPRESS_URL (or WORDPRESS_URL / GraphQL origin)
 *   WORDPRESS_USER / HEADLESS_WP_APP_USER  — user with edit_posts (Editor/Admin)
 *   WORDPRESS_APP_PASSWORD / HEADLESS_WP_APP_PASSWORD
 *
 * CI: set the same vars as GitHub Actions secrets. If WP credentials are missing,
 * exits 0 with skipped=true so the SFTP sync job can still archive artifacts.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getWpSeedCredentials,
  postWpJson,
  formatSeedAuthHelp,
} from "./lib/wp-seed-env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const requireCreds = args.includes("--require-creds");
const fileIdx = args.indexOf("--file");
const fileArg = fileIdx >= 0 ? args[fileIdx + 1] : null;

const defaultPath = join(ROOT, ".cache/leaderboard-sftp/latest/tables.json");
const tablesPath = resolve(fileArg || process.env.LEADERBOARD_TABLES_JSON || defaultPath);

if (!existsSync(tablesPath)) {
  console.error(`tables.json not found: ${tablesPath}`);
  console.error("Run: pnpm sync:leaderboard-sftp");
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(readFileSync(tablesPath, "utf8"));
} catch (err) {
  console.error(`Invalid JSON at ${tablesPath}:`, err?.message || err);
  process.exit(1);
}

if (!payload || !Array.isArray(payload.tables) || payload.tables.length === 0) {
  console.error("tables.json must include a non-empty tables array");
  process.exit(1);
}

const { wpUrl, user, appPass, loginPassword } = getWpSeedCredentials();

if (!wpUrl || !user || (!appPass && !loginPassword)) {
  const msg =
    "Skipping WP import: set NEXT_PUBLIC_WORDPRESS_URL + WORDPRESS_APP_PASSWORD (or HEADLESS_WP_APP_*) for a user with edit_posts.";
  if (requireCreds) {
    console.error(msg);
    process.exit(1);
  }
  console.warn(msg);
  console.log(
    JSON.stringify({
      ok: true,
      skipped: true,
      reason: "missing_wp_credentials",
      report_date: payload.report_date ?? null,
      tables: payload.tables.length,
    }),
  );
  process.exit(0);
}

const summary = {
  source: tablesPath.replace(ROOT + "/", ""),
  report_date: payload.report_date ?? null,
  tables: payload.tables.map((t) => ({
    slug: t.slug,
    rows: Array.isArray(t.rows) ? t.rows.length : 0,
  })),
  wpUrl,
  dryRun,
};

if (dryRun) {
  console.log("Dry run — would import:", JSON.stringify(summary, null, 2));
  process.exit(0);
}

const { ok, status, json } = await postWpJson(
  "/wp-json/amerilife/v1/import-ideaxchange-leaderboard",
  { body: payload },
);

if (!ok) {
  console.error("Import failed:", status, json);
  if (json?.code === "auth_failed") console.error("\n" + formatSeedAuthHelp(user));
  if (json?.code === "rest_no_route") {
    console.error(
      "\nEndpoint missing — deploy MU plugins first:\n  node scripts/deploy-mu-plugins.mjs",
    );
  }
  process.exit(1);
}

console.log(
  "ideaXchange leaderboard import:",
  JSON.stringify({ ...summary, result: json }, null, 2),
);
