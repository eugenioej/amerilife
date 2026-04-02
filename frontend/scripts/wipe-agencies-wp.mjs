/**
 * Delete ALL `agent` and `agency` posts from headless WordPress via REST API (permanent delete).
 * Agents are removed first, then agencies (order avoids broken references in meta).
 *
 * Requires frontend/.env.local (same as import:all-agencies):
 *   NEXT_PUBLIC_WORDPRESS_URL or NEXT_PUBLIC_GRAPHQL_ENDPOINT
 *   HEADLESS_WP_APP_USER
 *   HEADLESS_WP_APP_PASSWORD
 *
 * Usage:
 *   pnpm -C frontend wipe:agencies-wp -- --dry-run     # counts only
 *   pnpm -C frontend wipe:agencies-wp -- --confirm     # actually delete (required)
 *
 * import:all-agencies supports --wipe-first to run this automatically before importing.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_ROOT = path.resolve(__dirname, "..");

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
  const delayMs = Number(env("WIPE_AGENCY_AGENTS_DELAY_MS", "120"));
  return { headlessBase, wpUser, wpPassword, delayMs };
}

function basicAuthHeader(user, password) {
  const pass = String(password).replace(/\s+/g, "");
  return `Basic ${Buffer.from(`${user}:${password}`, "utf8").toString("base64")}`;
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

async function wpRestDelete(headlessBase, endpoint, authHeader) {
  const url = `${headlessBase}/wp-json${endpoint}`;
  const res = await fetchWithRetry(url, {
    method: "DELETE",
    headers: { authorization: authHeader, accept: "application/json" },
  });
  if (!res.ok && res.status !== 200) {
    const txt = await res.text().catch(() => "");
    throw new Error(`DELETE ${endpoint} -> ${res.status}: ${txt.slice(0, 400)}`);
  }
  return res.json().catch(() => ({}));
}

/**
 * @param {string} restBase `agent` or `agency`
 */
async function listAllPosts(headlessBase, authHeader, restBase) {
  /** @type {{ id: number, slug?: string }[]} */
  const out = [];
  let page = 1;
  const perPage = 100;
  const status = "publish,draft,pending";
  while (true) {
    const rows = await wpRestGet(
      headlessBase,
      `/wp/v2/${restBase}?per_page=${perPage}&page=${page}&status=${encodeURIComponent(status)}&_fields=id,slug`,
      authHeader
    );
    if (!Array.isArray(rows) || rows.length === 0) break;
    for (const r of rows) {
      if (r?.id) out.push({ id: r.id, slug: r.slug });
    }
    if (rows.length < perPage) break;
    page += 1;
  }
  return out;
}

async function deletePosts(headlessBase, authHeader, restBase, posts, delayMs) {
  let deleted = 0;
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    try {
      await wpRestDelete(headlessBase, `/wp/v2/${restBase}/${p.id}?force=true`, authHeader);
      deleted += 1;
      if ((i + 1) % 25 === 0 || i === posts.length - 1) {
        console.log(`  Deleted ${i + 1}/${posts.length} ${restBase} posts...`);
      }
    } catch (e) {
      console.error(`  FAILED delete ${label}: ${e.message}`);
    }
    if (i < posts.length - 1) await sleep(delayMs);
  }
  return deleted;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const confirm = args.includes("--confirm");

  await loadDotEnvFiles();
  const { headlessBase, wpUser, wpPassword, delayMs } = getConfig();

  if (!headlessBase) {
    console.error("Missing NEXT_PUBLIC_WORDPRESS_URL or NEXT_PUBLIC_GRAPHQL_ENDPOINT.");
    process.exit(1);
  }
  if (!wpUser || !wpPassword) {
    console.error("Set HEADLESS_WP_APP_USER and HEADLESS_WP_APP_PASSWORD in frontend/.env.local");
    process.exit(1);
  }

  if (!dryRun && !confirm) {
    console.error(
      "Refusing to delete: pass --confirm to permanently remove all agency + agent posts, or --dry-run to preview."
    );
    process.exit(1);
  }

  const authHeader = basicAuthHeader(wpUser, wpPassword);

  try {
    await wpRestGet(headlessBase, "/wp/v2/users/me", authHeader);
    console.log(`Target: ${headlessBase}\n`);
  } catch (e) {
    console.error("WordPress auth failed:", e.message);
    process.exit(1);
  }

  console.log("Listing posts...");
  const agents = await listAllPosts(headlessBase, authHeader, "agent");
  const agencies = await listAllPosts(headlessBase, authHeader, "agency");

  console.log(`Found ${agents.length} agent(s), ${agencies.length} agency(ies).`);

  if (agents.length === 0 && agencies.length === 0) {
    console.log("Nothing to delete.");
    process.exit(0);
  }

  if (dryRun) {
    console.log("\nDry-run: no deletes performed.\n");
    for (const p of agents.slice(0, 30)) {
      console.log(`  [dry-run] would delete agent id=${p.id} slug=${p.slug || ""}`);
    }
    if (agents.length > 30) console.log(`  ... and ${agents.length - 30} more agents`);
    for (const p of agencies.slice(0, 30)) {
      console.log(`  [dry-run] would delete agency id=${p.id} slug=${p.slug || ""}`);
    }
    if (agencies.length > 30) console.log(`  ... and ${agencies.length - 30} more agencies`);
    process.exit(0);
  }

  console.log("\nDeleting agents first...");
  const da = await deletePosts(headlessBase, authHeader, "agent", agents, delayMs, false);
  console.log(`Agents deleted: ${da}/${agents.length}`);

  console.log("\nDeleting agencies...");
  const dg = await deletePosts(headlessBase, authHeader, "agency", agencies, delayMs, false);
  console.log(`Agencies deleted: ${dg}/${agencies.length}`);

  console.log("\nDone. WordPress agency + agent posts are empty (featured media files may still exist in Media Library).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
