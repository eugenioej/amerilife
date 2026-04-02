/**
 * Push `gravity_form_id` (and optional `map_search_url`) from docs/scraped-agencies.json
 * to existing headless WordPress `agency` posts via REST API.
 *
 * Requires (frontend/.env.local):
 *   NEXT_PUBLIC_WORDPRESS_URL or NEXT_PUBLIC_GRAPHQL_ENDPOINT
 *   HEADLESS_WP_APP_USER
 *   HEADLESS_WP_APP_PASSWORD
 *
 * Usage:
 *   pnpm -C frontend sync:agency-gf-ids
 *   pnpm -C frontend sync:agency-gf-ids -- --dry-run
 *   pnpm -C frontend sync:agency-gf-ids -- --default-id=31
 *   pnpm -C frontend sync:agency-gf-ids -- --slug=polk-county
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const FRONTEND_ROOT = path.resolve(__dirname, "..");
const JSON_PATH = path.join(REPO_ROOT, "docs/scraped-agencies.json");

function env(name, fallback = undefined) {
  const v = process.env[name];
  return v == null || v === "" ? fallback : v;
}

function stripOuterQuotes(v) {
  const s = String(v).trim();
  if (
    (s.startsWith('"') && s.endsWith('"') && s.length >= 2) ||
    (s.startsWith("'") && s.endsWith("'") && s.length >= 2)
  ) {
    return s.slice(1, -1);
  }
  return s;
}

async function loadDotEnvFiles() {
  const candidates = [path.join(FRONTEND_ROOT, ".env.local"), path.join(FRONTEND_ROOT, ".env")];
  for (const p of candidates) {
    let raw = "";
    try {
      raw = await fs.readFile(p, "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = stripOuterQuotes(trimmed.slice(eq + 1));
      if (!key) continue;
      if (process.env[key] == null) process.env[key] = val;
    }
  }
}

function getConfig() {
  const gql = env("NEXT_PUBLIC_GRAPHQL_ENDPOINT");
  const wpUrl = env("NEXT_PUBLIC_WORDPRESS_URL");
  const headlessBase = wpUrl
    ? wpUrl.replace(/\/$/, "")
    : gql
      ? gql.replace(/\/graphql\/?$/, "").replace(/\/$/, "")
      : null;
  const wpUser = env("HEADLESS_WP_APP_USER");
  const wpPassword = env("HEADLESS_WP_APP_PASSWORD");
  const delayMs = Number(env("SYNC_AGENCY_GF_DELAY_MS", "200"));
  return { headlessBase, wpUser, wpPassword, delayMs };
}

function basicAuthHeader(user, password) {
  const pass = String(password).replace(/\s+/g, "");
  return `Basic ${Buffer.from(`${user}:${pass}`, "utf8").toString("base64")}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        const wait = Math.pow(2, i + 1) * 1000;
        console.warn(`  Rate limited, waiting ${wait}ms...`);
        await sleep(wait);
        continue;
      }
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(1000 * (i + 1));
    }
  }
}

async function wpRestGet(headlessBase, endpoint, authHeader) {
  const url = `${headlessBase}/wp-json${endpoint}`;
  const res = await fetchWithRetry(url, {
    headers: { authorization: authHeader, accept: "application/json" },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${endpoint} -> ${res.status}: ${txt.slice(0, 300)}`);
  }
  return res.json();
}

async function wpRestPatch(headlessBase, endpoint, body, authHeader) {
  const url = `${headlessBase}/wp-json${endpoint}`;
  const opts = {
    headers: {
      authorization: authHeader,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  };
  let res = await fetchWithRetry(url, { method: "PATCH", ...opts });
  if (res.status === 405 || res.status === 501) {
    res = await fetchWithRetry(url, { method: "PUT", ...opts });
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`PATCH/PUT ${endpoint} -> ${res.status}: ${txt.slice(0, 600)}`);
  }
  return res.json();
}

async function agencyExists(headlessBase, authHeader, slug) {
  const rows = await wpRestGet(
    headlessBase,
    `/wp/v2/agency?slug=${encodeURIComponent(slug)}&per_page=1&status=publish,draft,pending`,
    authHeader
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

function sanitizeSlug(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/--+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const includeInactive = args.includes("--include-inactive");
  let slugFilter = null;
  let defaultId = null;
  for (const a of args) {
    if (a.startsWith("--slug=")) slugFilter = a.slice("--slug=".length).trim().toLowerCase();
    if (a.startsWith("--default-id=")) {
      const n = Number(a.slice("--default-id=".length).trim());
      if (Number.isFinite(n) && n > 0) defaultId = n;
    }
  }

  await loadDotEnvFiles();
  const { headlessBase, wpUser, wpPassword, delayMs } = getConfig();

  if (!dryRun) {
    if (!headlessBase) {
      console.error("Missing NEXT_PUBLIC_WORDPRESS_URL or NEXT_PUBLIC_GRAPHQL_ENDPOINT.");
      process.exit(1);
    }
    if (!wpUser || !wpPassword) {
      console.error("Set HEADLESS_WP_APP_USER and HEADLESS_WP_APP_PASSWORD in .env.local");
      process.exit(1);
    }
  }

  const authHeader = wpUser && wpPassword ? basicAuthHeader(wpUser, wpPassword) : "";

  if (!dryRun && headlessBase) {
    try {
      await wpRestGet(headlessBase, "/wp/v2/users/me", authHeader);
      console.log("Auth OK (headless WordPress).\n");
    } catch (e) {
      console.error("WordPress auth failed:", e.message);
      process.exit(1);
    }
  }

  let raw = "";
  try {
    raw = await fs.readFile(JSON_PATH, "utf8");
  } catch {
    console.error(`Missing ${JSON_PATH}`);
    process.exit(1);
  }

  const data = JSON.parse(raw);
  const agencies = data.agencies || [];

  const toSync = agencies.filter((a) => {
    if (a.scrapeError) return false;
    if (a.kind === "aggregator_meta") return false;
    if (!includeInactive && String(a.cmsStatus).toLowerCase() === "inactive") return false;
    const slug = sanitizeSlug(a.slug);
    if (slugFilter && slug !== slugFilter) return false;
    return true;
  });

  console.log(`Target: ${headlessBase || "(dry-run)"}`);
  console.log(`Agencies: ${toSync.length} | dry-run=${dryRun} default-id=${defaultId ?? "(none)"}\n`);

  let updated = 0;
  let missingWp = 0;
  let failed = 0;

  for (let i = 0; i < toSync.length; i++) {
    const A = toSync[i];
    const slug = sanitizeSlug(A.slug);
    const label = `[${i + 1}/${toSync.length}]`;

    let gfRaw = A.headlessFormId ?? A.liveFormId;
    if ((gfRaw == null || gfRaw === "") && defaultId != null) {
      gfRaw = defaultId;
    }
    if (gfRaw == null || gfRaw === "") {
      console.log(`${label} Skip (no form id in JSON): ${slug}`);
      continue;
    }
    const gravityFormId = Number(gfRaw);

    const mapSearchUrl = String(A.enrichment?.mapSearchUrl || "").trim();
    const meta = { gravity_form_id: gravityFormId };
    if (mapSearchUrl) meta.map_search_url = mapSearchUrl;

    if (dryRun) {
      console.log(`${label} Would PATCH ${slug} -> gravity_form_id=${gravityFormId}`);
      updated += 1;
      continue;
    }

    try {
      const ex = await agencyExists(headlessBase, authHeader, slug);
      if (!ex) {
        console.warn(`${label} No WP agency for slug=${slug} (import it first)`);
        missingWp += 1;
        continue;
      }
      await wpRestPatch(headlessBase, `/wp/v2/agency/${ex.id}`, { meta }, authHeader);
      console.log(`${label} OK ${slug} (wp id=${ex.id}) gravity_form_id=${gravityFormId}`);
      updated += 1;
      await sleep(delayMs);
    } catch (e) {
      console.error(`${label} FAIL ${slug}: ${e.message}`);
      failed += 1;
    }
  }

  console.log(`\nDone. updated=${updated} missing_in_wp=${missingWp} failed=${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
