#!/usr/bin/env node
/**
 * Seed ideaXchange Magazine demo content in WordPress (ideaxchange_article CPT).
 *
 * Usage (from frontend/):
 *   node scripts/seed-ideaxchange-magazine.mjs
 *
 * Reads repo root .env.local: NEXT_PUBLIC_WORDPRESS_URL, HEADLESS_WP_APP_USER,
 * HEADLESS_WP_APP_PASSWORD (or WP_URL / WP_APP_USER / WP_APP_PASSWORD).
 *
 * Add --force to re-import:
 *   node scripts/seed-ideaxchange-magazine.mjs --force
 */
import { getWpSeedCredentials, postWpSeed, formatSeedAuthHelp } from "./lib/wp-seed-env.mjs";

const { wpUrl, user, appPass, loginPassword } = getWpSeedCredentials();
const force = process.argv.includes("--force");

if (!wpUrl || !user || (!appPass && !loginPassword)) {
  console.error(
    "Set NEXT_PUBLIC_WORDPRESS_URL + WORDPRESS_APP_PASSWORD (or WORDPRESS_PASSWORD) in .env.local.",
  );
  process.exit(1);
}

const { ok, status, json } = await postWpSeed("/wp-json/amerilife/v1/seed-ideaxchange-magazine", {
  force,
});
if (!ok) {
  console.error("Seed failed:", status, json);
  if (json?.code === "auth_failed") console.error("\n" + formatSeedAuthHelp(user));
  process.exit(1);
}

console.log("ideaXchange magazine seed:", json);
