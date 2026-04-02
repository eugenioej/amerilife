/**
 * Two-phase agency image fix:
 *
 * PHASE 1 — Move current agency featured images → their agents.
 *   For each agency that has a featured_media (other than the default),
 *   find the agents belonging to that agency and set the same image on them.
 *
 * PHASE 2 — Set default hero image on ALL agencies.
 *   Media ID 13398 = AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png
 *
 * Usage:
 *   pnpm -C frontend patch:agency-images             # full two-phase run
 *   pnpm -C frontend patch:agency-images -- --dry-run
 *   pnpm -C frontend patch:agency-images -- --phase=1  # only move to agents
 *   pnpm -C frontend patch:agency-images -- --phase=2  # only set default on agencies
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(__dirname, "..");

const DEFAULT_MEDIA_ID = 13398;
const WP_BASE = "https://headlessameril.wpenginepowered.com";
const DELAY_MS = 300;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function stripOuterQuotes(v) {
  const s = String(v).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))
    return s.slice(1, -1);
  return s;
}

async function loadDotEnv() {
  for (const f of [".env.local", ".env"]) {
    let raw = "";
    try { raw = await fs.readFile(path.join(FRONTEND_ROOT, f), "utf8"); } catch { continue; }
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const k = t.slice(0, eq).trim();
      const v = stripOuterQuotes(t.slice(eq + 1));
      if (k && process.env[k] == null) process.env[k] = v;
    }
  }
}

function basicAuth(user, pass) {
  return "Basic " + Buffer.from(`${user}:${pass.replace(/\s+/g, "")}`, "utf8").toString("base64");
}

async function wpGetAll(path, auth) {
  let page = 1;
  const all = [];
  while (true) {
    const res = await fetch(`${WP_BASE}/wp-json${path}${path.includes("?") ? "&" : "?"}page=${page}&per_page=100`, {
      headers: { authorization: auth, accept: "application/json" },
    });
    if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return all;
}

async function wpUpdate(postType, id, body, auth) {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/${postType}/${id}`, {
    method: "POST",
    headers: { authorization: auth, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`POST /wp/v2/${postType}/${id} → ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.json();
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const phaseArg = (args.find((a) => a.startsWith("--phase=")) ?? "").replace("--phase=", "");
  const runPhase1 = !phaseArg || phaseArg === "1";
  const runPhase2 = !phaseArg || phaseArg === "2";

  await loadDotEnv();
  const user = process.env.HEADLESS_WP_APP_USER;
  const pass = process.env.HEADLESS_WP_APP_PASSWORD;
  if (!user || !pass) {
    console.error("Missing HEADLESS_WP_APP_USER / HEADLESS_WP_APP_PASSWORD");
    process.exit(1);
  }
  const auth = basicAuth(user, pass);

  const me = await fetch(`${WP_BASE}/wp-json/wp/v2/users/me`, {
    headers: { authorization: auth, accept: "application/json" },
  });
  if (!me.ok) { console.error("Auth failed"); process.exit(1); }
  console.log("Auth OK\n");

  // ── Fetch all agencies ──────────────────────────────────────────────────────
  const agencies = await wpGetAll(
    "/wp/v2/agency?status=publish,draft&_fields=id,slug,featured_media",
    auth
  );
  console.log(`Agencies: ${agencies.length}`);

  // ── PHASE 1: move current agency image → agents ─────────────────────────────
  if (runPhase1) {
    console.log("\n── Phase 1: copy current agency images to their agents ──");

    // Agencies that have a real image (not 0, not already the default)
    const withImage = agencies.filter(
      (a) => a.featured_media && a.featured_media !== 0 && a.featured_media !== DEFAULT_MEDIA_ID
    );
    console.log(`Agencies with non-default image: ${withImage.length}`);

    // Fetch all agents once (with agency_id meta)
    const agents = await wpGetAll(
      "/wp/v2/agent?status=publish,draft&_fields=id,slug,featured_media,meta",
      auth
    );
    console.log(`Agents total: ${agents.length}\n`);

    // Build map: agency_id (as number) → agents[]
    const agentsByAgencyId = new Map();
    for (const ag of agents) {
      const aid = parseInt(ag.meta?.agency_id ?? "0", 10);
      if (!aid) continue;
      if (!agentsByAgencyId.has(aid)) agentsByAgencyId.set(aid, []);
      agentsByAgencyId.get(aid).push(ag);
    }

    let p1Updated = 0, p1Skipped = 0, p1Failed = 0;
    for (const agency of withImage) {
      const mediaId = agency.featured_media;
      const myAgents = agentsByAgencyId.get(agency.id) ?? [];

      if (myAgents.length === 0) {
        console.log(`  [skip] agency ${agency.slug} — no agents found`);
        p1Skipped++;
        continue;
      }

      for (const ag of myAgents) {
        if (ag.featured_media && ag.featured_media !== 0) {
          console.log(`  [skip] agent ${ag.slug} already has image ${ag.featured_media}`);
          p1Skipped++;
          continue;
        }
        if (dryRun) {
          console.log(`  [dry] Would set media ${mediaId} on agent ${ag.slug} (agency: ${agency.slug})`);
          p1Updated++;
          continue;
        }
        try {
          await wpUpdate("agent", ag.id, { featured_media: mediaId }, auth);
          console.log(`  ✓ agent ${ag.slug} ← media ${mediaId} (agency: ${agency.slug})`);
          p1Updated++;
        } catch (err) {
          console.error(`  ✗ agent ${ag.slug}: ${err.message}`);
          p1Failed++;
        }
        await sleep(DELAY_MS);
      }
    }
    console.log(`\nPhase 1 done. agents updated=${p1Updated} skipped=${p1Skipped} failed=${p1Failed}`);
  }

  // ── PHASE 2: set default image on ALL agencies ──────────────────────────────
  if (runPhase2) {
    console.log("\n── Phase 2: set default hero image on ALL agencies ──");
    console.log(`Default media ID: ${DEFAULT_MEDIA_ID}\n`);

    let p2Updated = 0, p2Failed = 0;
    for (let i = 0; i < agencies.length; i++) {
      const a = agencies[i];
      const label = `[${i + 1}/${agencies.length}]`;
      if (dryRun) {
        console.log(`${label} Would set media ${DEFAULT_MEDIA_ID} on agency ${a.slug}`);
        p2Updated++;
        continue;
      }
      try {
        await wpUpdate("agency", a.id, { featured_media: DEFAULT_MEDIA_ID }, auth);
        console.log(`${label} ✓ agency ${a.slug}`);
        p2Updated++;
      } catch (err) {
        console.error(`${label} ✗ agency ${a.slug}: ${err.message}`);
        p2Failed++;
      }
      if (i < agencies.length - 1) await sleep(DELAY_MS);
    }
    console.log(`\nPhase 2 done. agencies updated=${p2Updated} failed=${p2Failed}`);
  }

  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
