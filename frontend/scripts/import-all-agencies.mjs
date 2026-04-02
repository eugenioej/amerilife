/**
 * Import scraped agencies + agents from docs/scraped-agencies.json into headless WordPress.
 *
 * Requires MU plugins: amerilife-agency-cpt.php, amerilife-agent-cpt.php (gravity_form_id, map_search_url meta)
 *
 * Requires in frontend/.env.local:
 *   NEXT_PUBLIC_WORDPRESS_URL or NEXT_PUBLIC_GRAPHQL_ENDPOINT
 *   HEADLESS_WP_APP_USER
 *   HEADLESS_WP_APP_PASSWORD
 *
 * When an agency already exists in WP, this script still PATCHes `meta.gravity_form_id` and
 * `meta.map_search_url` from the JSON so form IDs stay in sync (e.g. after changing headlessFormId).
 *
 * Agent featured images: only `agents[].imageUrl` (per-person headshots from scrape). Agency hero
 * `officeImageUrl` is used for the agency CPT only, never copied onto agents. Use --overwrite to
 * refresh existing agent media from JSON.
 *
 * Usage:
 *   pnpm -C frontend import:all-agencies
 *   pnpm -C frontend import:all-agencies -- --dry-run
 *   pnpm -C frontend import:all-agencies -- --skip-media --skip-agents
 *   pnpm -C frontend import:all-agencies -- --slug=polk-county
 *   pnpm -C frontend import:all-agencies -- --include-inactive
 *   pnpm -C frontend import:all-agencies -- --overwrite   # PATCH existing agencies + agents from JSON (full sync)
 *   pnpm -C frontend import:all-agencies -- --wipe-first --overwrite   # delete ALL agency+agent posts in WP, then import (fresh)
 *   pnpm -C frontend wipe:agencies-wp -- --dry-run   # preview delete counts only
 *   pnpm -C frontend wipe:agencies-wp -- --confirm    # delete all (requires --confirm)
 *   pnpm -C frontend sync:agency-gf-ids   # only gravity_form_id + map_search_url (faster)
 */

import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAgentSlug } from "./lib/agent-slug.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const FRONTEND_ROOT = path.resolve(__dirname, "..");
const JSON_PATH = path.join(REPO_ROOT, "docs/scraped-agencies.json");
const WIPE_SCRIPT = path.join(__dirname, "wipe-agencies-wp.mjs");

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
  const delayMs = Number(env("IMPORT_AGENCY_AGENTS_DELAY_MS", "400"));
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

async function wpRestPost(headlessBase, endpoint, body, authHeader) {
  const url = `${headlessBase}/wp-json${endpoint}`;
  const res = await fetchWithRetry(url, {
    method: "POST",
    headers: {
      authorization: authHeader,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`POST ${endpoint} -> ${res.status}: ${txt.slice(0, 600)}`);
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

async function uploadMediaAsset(headlessBase, authHeader, imageUrl, altText) {
  const imgRes = await fetchWithRetry(imageUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      accept: "image/*,*/*;q=0.8",
    },
  });
  if (!imgRes.ok) {
    throw new Error(`Image download failed ${imgRes.status}: ${imageUrl}`);
  }

  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const parsedUrl = new URL(imageUrl);
  const filename = path.basename(parsedUrl.pathname) || "office-hero.png";
  const contentType = imgRes.headers.get("content-type") || "image/png";

  const uploadUrl = `${headlessBase}/wp-json/wp/v2/media`;
  const uploadRes = await fetchWithRetry(uploadUrl, {
    method: "POST",
    headers: {
      authorization: authHeader,
      "content-disposition": `attachment; filename="${filename}"`,
      "content-type": contentType,
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    const txt = await uploadRes.text().catch(() => "");
    throw new Error(`Media upload failed ${uploadRes.status}: ${txt.slice(0, 400)}`);
  }

  const media = await uploadRes.json();

  if (altText && media.id) {
    try {
      await wpRestPost(
        headlessBase,
        `/wp/v2/media/${media.id}`,
        { alt_text: altText },
        authHeader
      );
    } catch {
      // non-fatal
    }
  }

  return { id: media.id, sourceUrl: media.source_url || "" };
}

async function agencyExists(headlessBase, authHeader, slug) {
  const rows = await wpRestGet(
    headlessBase,
    `/wp/v2/agency?slug=${encodeURIComponent(slug)}&per_page=1&status=publish,draft,pending`,
    authHeader
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

async function agentExists(headlessBase, authHeader, slug) {
  const rows = await wpRestGet(
    headlessBase,
    `/wp/v2/agent?slug=${encodeURIComponent(slug)}&per_page=1&status=publish,draft,pending`,
    authHeader
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

function formatPhone(s) {
  if (s == null || s === "") return "";
  const d = String(s).replace(/\D/g, "");
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return String(s).trim();
}

function sanitizeSlug(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/--+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

/** Same normalization as enrich/scrape scripts for `buildAgentSlug` base segment. */
function slugifyAgentBase(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

const DEFAULT_AREAS = [
  "Medicare Advantage",
  "Part D Prescription Drugs",
  "Medicare Supplement Insurance",
].join(", ");

/**
 * @param {object} A agency from JSON
 * @param {object} addr
 * @param {string} mapSearchUrl
 */
function buildAgencyMeta(A, addr, mapSearchUrl) {
  const gfId = A.headlessFormId ?? A.liveFormId;
  const meta = {
    phone: formatPhone(A.phone),
    address_line1: addr.line1 || "",
    address_line2: addr.line2 || "",
    address_city: addr.city || "",
    address_state: addr.state || "",
    address_zip: addr.zip || "",
    hours: A.hours || "",
    about_office: A.aboutOffice || "",
    features_json: A.featuresJson || "[]",
  };
  if (gfId != null && gfId !== "") {
    meta.gravity_form_id = Number(gfId);
  }
  if (mapSearchUrl) {
    meta.map_search_url = mapSearchUrl;
  }
  return meta;
}

/**
 * @param {object} G agent from JSON
 * @param {object} A agency from JSON
 * @param {object} addr
 * @param {string} aidStr
 * @param {string} agentSlug
 * @param {number} menuOrder
 */
function buildAgentPayload(G, A, addr, aidStr, agentSlug, menuOrder, featuredMediaId) {
  const bioHtml = G.email
    ? `<p><strong>${G.role || "Agent"}</strong><br /><a href="mailto:${G.email}">${G.email}</a></p>`
    : `<p>${G.name}</p>`;
  const body = {
    title: G.name,
    slug: agentSlug,
    status: "publish",
    menu_order: menuOrder,
    content: bioHtml,
    meta: {
      role: G.role || "AmeriLife Agent",
      city: addr.city || "",
      state: addr.state || "",
      agent_phone: formatPhone(A.phone),
      email: G.email || "",
      reviews_count: "0",
      areas_of_focus: DEFAULT_AREAS,
      agency_id: aidStr,
    },
  };
  if (featuredMediaId) {
    body.featured_media = featuredMediaId;
  }
  return body;
}

/**
 * Per-agent headshot only — never the agency `officeImageUrl` (that is Wealth hero / office only).
 * @param {object} G
 */
function resolveAgentImageUrl(G) {
  const direct = G?.imageUrl;
  if (typeof direct === "string" && /^https?:\/\//i.test(direct.trim())) {
    return direct.trim();
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const skipMedia = args.includes("--skip-media");
  const skipAgents = args.includes("--skip-agents");
  const includeInactive = args.includes("--include-inactive");
  const overwrite = args.includes("--overwrite");
  const wipeFirst = args.includes("--wipe-first");
  let slugFilter = null;
  for (const a of args) {
    if (a.startsWith("--slug=")) {
      slugFilter = a.slice("--slug=".length).trim().toLowerCase();
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
    console.error(`Missing ${JSON_PATH} — run scrape:agencies first.`);
    process.exit(1);
  }

  const data = JSON.parse(raw);
  const agencies = data.agencies || [];

  /** @type {object[]} */
  const toImport = agencies.filter((a) => {
    if (a.scrapeError) return false;
    if (a.kind === "aggregator_meta") return false;
    if (!includeInactive && String(a.cmsStatus).toLowerCase() === "inactive") return false;
    const slug = sanitizeSlug(a.slug);
    if (slugFilter && slug !== slugFilter) return false;
    return true;
  });

  if (wipeFirst && !dryRun && headlessBase) {
    console.log("--wipe-first: removing all agency + agent posts in WordPress...\n");
    execSync(`node "${WIPE_SCRIPT}" --confirm`, {
      cwd: FRONTEND_ROOT,
      stdio: "inherit",
      env: process.env,
    });
    console.log("");
  }

  console.log(`Target: ${headlessBase || "(dry-run)"}`);
  console.log(
    `Agencies to process: ${toImport.length} | dry-run=${dryRun} wipe-first=${wipeFirst} overwrite=${overwrite} skip-media=${skipMedia} skip-agents=${skipAgents}\n`
  );

  if (dryRun && wipeFirst) {
    console.log("Note: --wipe-first does not run while --dry-run (no deletes).\n");
  }

  if (dryRun) {
    for (const a of toImport) {
      console.log(
        `Would import agency: ${sanitizeSlug(a.slug)} — ${a.officeName || a.pageTitle}${overwrite ? " (existing posts would be PATCHed)" : ""}`
      );
    }
    process.exit(0);
  }

  let agenciesCreated = 0;
  let agenciesUpdated = 0;
  let agenciesSkipped = 0;
  let agentsCreated = 0;
  let agentsUpdated = 0;
  let agentsSkipped = 0;
  let failed = 0;

  for (let i = 0; i < toImport.length; i++) {
    const A = toImport[i];
    const slug = sanitizeSlug(A.slug);
    const label = `[${i + 1}/${toImport.length}]`;

    try {
      const addr = A.address || {};
      const ex = await agencyExists(headlessBase, authHeader, slug);
      let agencyPostId = ex?.id;

      const mapSearchUrl = String(A.enrichment?.mapSearchUrl || "").trim();

      if (ex && overwrite) {
        let featuredMediaId = 0;
        if (!skipMedia && A.officeImageUrl) {
          try {
            const media = await uploadMediaAsset(
              headlessBase,
              authHeader,
              A.officeImageUrl,
              `${A.officeName || slug} office`
            );
            featuredMediaId = media.id;
            console.log(`  Uploaded office image -> media ${featuredMediaId}`);
          } catch (e) {
            console.warn(`  Office image upload failed: ${e.message}`);
          }
        }

        const meta = buildAgencyMeta(A, addr, mapSearchUrl);
        const patchBody = {
          title: A.officeName || A.pageTitle || slug,
          slug,
          status: "publish",
          menu_order: 0,
          content: "",
          meta,
        };
        if (featuredMediaId) {
          patchBody.featured_media = featuredMediaId;
        }

        try {
          await wpRestPatch(headlessBase, `/wp/v2/agency/${ex.id}`, patchBody, authHeader);
          agencyPostId = ex.id;
          agenciesUpdated += 1;
          console.log(`${label} Updated agency (overwrite) id=${ex.id} slug=${slug}`);
        } catch (e) {
          console.error(`  Agency PATCH failed: ${e.message}`);
          failed += 1;
          continue;
        }
      } else if (ex) {
        console.log(`${label} Skip agency (exists): ${slug} id=${ex.id}`);
        agenciesSkipped += 1;
        const gfId = A.headlessFormId ?? A.liveFormId;
        const meta = {};
        if (mapSearchUrl) {
          meta.map_search_url = mapSearchUrl;
        }
        if (gfId != null && gfId !== "") {
          meta.gravity_form_id = Number(gfId);
        }
        if (Object.keys(meta).length > 0) {
          try {
            await wpRestPatch(headlessBase, `/wp/v2/agency/${ex.id}`, { meta }, authHeader);
            console.log(`  Updated meta: ${Object.keys(meta).join(", ")}`);
          } catch (e) {
            console.warn(`  meta PATCH failed: ${e.message}`);
          }
        }
        agencyPostId = ex.id;
      } else {
        let featuredMediaId = 0;
        if (!skipMedia && A.officeImageUrl) {
          try {
            const media = await uploadMediaAsset(
              headlessBase,
              authHeader,
              A.officeImageUrl,
              `${A.officeName || slug} office`
            );
            featuredMediaId = media.id;
            console.log(`  Uploaded office image -> media ${featuredMediaId}`);
          } catch (e) {
            console.warn(`  Office image upload failed: ${e.message}`);
          }
        }

        const meta = buildAgencyMeta(A, addr, mapSearchUrl);

        const agencyBody = {
          title: A.officeName || A.pageTitle || slug,
          slug,
          status: "publish",
          menu_order: 0,
          content: "",
          meta,
        };
        if (featuredMediaId) {
          agencyBody.featured_media = featuredMediaId;
        }

        const created = await wpRestPost(headlessBase, "/wp/v2/agency", agencyBody, authHeader);
        agencyPostId = created.id;
        agenciesCreated += 1;
        console.log(`${label} Created agency id=${created.id} slug=${created.slug}`);
      }

      if (!agencyPostId) {
        failed += 1;
        continue;
      }

      const agencyId = agencyPostId;
      const aidStr = String(agencyId);

      if (!skipAgents && Array.isArray(A.agents)) {
        const nameForSlug = (A.agents || []).map((x) => ({ name: String(x?.name || "").trim() }));
        for (let j = 0; j < A.agents.length; j++) {
          const G = A.agents[j];
          const agentSlug = sanitizeSlug(
            G.slug || buildAgentSlug(slugifyAgentBase, slug, nameForSlug, j)
          );
          try {
            const aex = await agentExists(headlessBase, authHeader, agentSlug);

            let featuredMediaId = 0;
            if (!skipMedia) {
              const imgUrl = resolveAgentImageUrl(G);
              if (imgUrl) {
                try {
                  const media = await uploadMediaAsset(
                    headlessBase,
                    authHeader,
                    imgUrl,
                    `${G.name || agentSlug} headshot`
                  );
                  featuredMediaId = media.id;
                  console.log(`    Agent image -> media ${featuredMediaId}`);
                } catch (e) {
                  console.warn(`    Agent image upload failed: ${e.message}`);
                }
              }
            }

            const body = buildAgentPayload(G, A, addr, aidStr, agentSlug, j + 1, featuredMediaId);

            if (aex && overwrite) {
              await wpRestPatch(headlessBase, `/wp/v2/agent/${aex.id}`, body, authHeader);
              console.log(`    Updated agent id=${aex.id} slug=${agentSlug}`);
              agentsUpdated += 1;
            } else if (aex) {
              console.log(`    Skip agent (exists): ${agentSlug}`);
              agentsSkipped += 1;
              continue;
            } else {
              const post = await wpRestPost(headlessBase, "/wp/v2/agent", body, authHeader);
              console.log(`    Created agent id=${post.id} slug=${post.slug}`);
              agentsCreated += 1;
            }
          } catch (err) {
            console.error(`    FAILED agent ${agentSlug}: ${err.message}`);
            failed += 1;
          }
          await sleep(delayMs);
        }
      }
    } catch (err) {
      console.error(`${label} FAILED agency ${slug}: ${err.message}`);
      failed += 1;
    }

    if (i < toImport.length - 1) await sleep(delayMs);
  }

  console.log(
    `\nDone. agencies created=${agenciesCreated} updated=${agenciesUpdated} skipped=${agenciesSkipped} | agents created=${agentsCreated} updated=${agentsUpdated} skipped=${agentsSkipped} | failed=${failed}`
  );
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
