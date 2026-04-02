/**
 * Load Gravity Forms from headless WordPress (REST) and suggest headless form IDs
 * for each scraped agency row in docs/scraped-agencies.json.
 *
 * Requires in .env.local (loaded from frontend/):
 *   NEXT_PUBLIC_WORDPRESS_URL or NEXT_PUBLIC_GRAPHQL_ENDPOINT
 *   HEADLESS_WP_APP_USER
 *   HEADLESS_WP_APP_PASSWORD
 *
 * Usage:
 *   pnpm -C frontend map:gf-forms
 *   pnpm -C frontend map:gf-forms -- --dry-run
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const FRONTEND_ROOT = path.resolve(__dirname, "..");
const JSON_PATH = path.join(REPO_ROOT, "docs/scraped-agencies.json");
const CSV_PATH = path.join(REPO_ROOT, "docs/gf-form-mapping.csv");

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

function basicAuthHeader(user, password) {
  const pass = String(password).replace(/\s+/g, "");
  return `Basic ${Buffer.from(`${user}:${pass}`, "utf8").toString("base64")}`;
}

function getConfig() {
  const gql = env("NEXT_PUBLIC_GRAPHQL_ENDPOINT");
  const wpUrl = env("NEXT_PUBLIC_WORDPRESS_URL");
  const headlessBase = wpUrl
    ? wpUrl.replace(/\/$/, "")
    : gql
      ? gql.replace(/\/graphql\/?$/, "").replace(/\/$/, "")
      : null;
  const graphqlUrl =
    gql && /^https?:\/\//i.test(gql)
      ? gql.replace(/\/$/, "")
      : headlessBase
        ? `${headlessBase}/graphql`
        : null;
  const wpUser = env("HEADLESS_WP_APP_USER");
  const wpPassword = env("HEADLESS_WP_APP_PASSWORD");
  return { headlessBase, graphqlUrl, wpUser, wpPassword };
}

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Pick headless form id by fuzzy match against agency labels.
 * @param {{ id: string|number, title?: string }[]} forms
 * @param {Record<string, unknown>} agency
 */
function suggestFormId(forms, agency) {
  const slug = normalize(agency.slug);
  const office = normalize(agency.officeName);
  const loc = normalize(agency.locationLabel);
  const hay = `${slug} ${office} ${loc}`;

  let best = null;
  let bestScore = 0;
  for (const f of forms) {
    const t = normalize(f.title);
    if (!t) continue;
    if (slug && t.includes(slug.replace(/-/g, " "))) {
      return Number(f.id);
    }
    const words = t.split(" ").filter((w) => w.length > 3);
    let score = 0;
    for (const w of words) {
      if (hay.includes(w)) score += 1;
    }
    if (t.includes("connect") && t.includes("agent")) score += 2;
    if (score > bestScore) {
      bestScore = score;
      best = Number(f.id);
    }
  }
  return bestScore >= 2 ? best : null;
}

/**
 * WPGraphQL for Gravity Forms (AxeWP): `gfForms` connection.
 * @param {{ graphqlUrl: string, authHeader: string }} opts
 */
async function fetchFormsViaGraphQL({ graphqlUrl, authHeader }) {
  const query = `
    query ListGfForms {
      gfForms(first: 500) {
        edges {
          node {
            databaseId
            title
          }
        }
      }
    }
  `;
  const res = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      authorization: authHeader,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
  }
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  const gf = json.data?.gfForms;
  if (!gf) {
    throw new Error("No gfForms in GraphQL response (is WPGraphQL for Gravity Forms active?)");
  }
  const edges = gf.edges || [];
  return edges.map((e) => e.node).filter(Boolean).map((n) => ({ id: n.databaseId, title: n.title || "" }));
}

/**
 * Gravity Forms REST API v2 (must be enabled under Forms → Settings → REST API on the WP site).
 */
async function fetchFormsViaRest(headlessBase, authHeader) {
  const url = `${headlessBase}/wp-json/gf/v2/forms`;
  const res = await fetch(url, {
    headers: { authorization: authHeader, accept: "application/json" },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`REST ${res.status}: ${txt.slice(0, 400)}`);
  }
  const body = await res.json();
  return Array.isArray(body) ? body : body.forms || [];
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  await loadDotEnvFiles();
  const { headlessBase, graphqlUrl, wpUser, wpPassword } = getConfig();

  if (!headlessBase || !wpUser || !wpPassword) {
    console.error("Missing NEXT_PUBLIC_WORDPRESS_URL (or GRAPHQL endpoint) or WP app credentials.");
    process.exit(1);
  }

  const auth = basicAuthHeader(wpUser, wpPassword);

  /** @type {{ id: number, title?: string }[]} */
  let forms = [];
  let source = "";

  if (graphqlUrl) {
    try {
      forms = await fetchFormsViaGraphQL({ graphqlUrl, authHeader: auth });
      source = "GraphQL (gfForms)";
    } catch (e) {
      console.warn(`GraphQL gfForms failed: ${e.message}`);
      console.warn("Falling back to REST /wp-json/gf/v2/forms …\n");
    }
  }

  if (forms.length === 0) {
    try {
      const raw = await fetchFormsViaRest(headlessBase, auth);
      forms = raw.map((f) => ({ id: Number(f.id), title: f.title || f.name || "" }));
      source = "REST (gf/v2/forms)";
    } catch (e) {
      console.error(`REST failed: ${e.message}\n`);
      console.error(
        [
          "Could not load Gravity Forms. Typical fixes:",
          "  • Use GraphQL: install & activate WPGraphQL for Gravity Forms (AxeWP) on headless WP.",
          "  • Or enable REST API v2: Gravity Forms → Settings → REST API (and API keys if required).",
          "  • Ensure HEADLESS_WP_APP_USER has permission to list forms.",
        ].join("\n")
      );
      process.exit(1);
    }
  }

  console.log(`Loaded ${forms.length} Gravity Forms via ${source}.\n`);

  let raw = "";
  try {
    raw = await fs.readFile(JSON_PATH, "utf8");
  } catch {
    console.error(`Missing ${JSON_PATH} — run scrape:agencies first.`);
    process.exit(1);
  }

  const data = JSON.parse(raw);
  const agencies = data.agencies || [];
  let updated = 0;

  for (const a of agencies) {
    if (a.kind === "aggregator_meta" || a.scrapeError) continue;
    if (a.headlessFormId != null) continue;
    const suggested = suggestFormId(forms, a);
    if (suggested) {
      a.headlessFormId = suggested;
      updated += 1;
    }
  }

  const lines = ["slug,live_form_id,headless_form_id,source_url"];
  for (const a of agencies) {
    if (a.kind === "aggregator_meta" || a.scrapeError) continue;
    const slug = a.slug || "";
    const lid = a.liveFormId ?? "";
    const hid = a.headlessFormId ?? "";
    const src = String(a.sourceUrl || "").replace(/"/g, '""');
    lines.push(`"${slug}",${lid},${hid},"${src}"`);
  }

  if (!dryRun) {
    await fs.writeFile(JSON_PATH, JSON.stringify({ ...data, agencies }, null, 2), "utf8");
    await fs.writeFile(CSV_PATH, lines.join("\n") + "\n", "utf8");
  }

  console.log(`Suggested headlessFormId for ${updated} agencies (fuzzy match).`);
  console.log(`dry-run=${dryRun}`);
  if (!dryRun) console.log(`Updated ${JSON_PATH} and ${CSV_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
