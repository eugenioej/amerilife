/**
 * Seed Polk County agency + agents from the same data as `lib/locations-data.ts`
 * into headless WordPress (`agency` + `agent` CPTs).
 *
 * Requires MU plugins: amerilife-agency-cpt.php, amerilife-agent-cpt.php
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_WORDPRESS_URL or NEXT_PUBLIC_GRAPHQL_ENDPOINT
 *   HEADLESS_WP_APP_USER
 *   HEADLESS_WP_APP_PASSWORD
 *
 * Usage:
 *   pnpm import:agency-agents
 *   pnpm import:agency-agents --dry-run
 *   pnpm import:agency-agents --skip-media
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

/** Mirrors `POLK_FEATURES` + `polk-county` in locations-data.ts */
const POLK_FEATURES = [
  {
    heading: "Medicare Plans",
    body: "Navigate your Medicare options with confidence through comprehensive plan choices designed to support your health and wellbeing.",
    icon: "medicare",
  },
  {
    heading: "Voluntary Health Insurance Plans",
    body: "Enhance your coverage with supplemental plans that help protect you from unexpected healthcare expenses and life's surprises.",
    icon: "health",
  },
  {
    heading: "Life Insurance Plans",
    body: "Protect what matters most with life insurance solutions that provide financial security and peace of mind for you and your loved ones.",
    icon: "life",
  },
  {
    heading: "Annuities",
    body: "Strengthen your retirement strategy with annuity options that offer guaranteed income, safeguard your savings, and help build long-term stability.",
    icon: "annuity",
  },
];

const DEFAULT_AREAS = [
  "Medicare Advantage",
  "Part D Prescription Drugs",
  "Medicare Supplement Insurance",
].join(", ");

const AGENCY = {
  slug: "polk-county",
  title: "AmeriLife of Polk County, LLC",
  phone: "(863) 291-4111",
  officeImageUrl:
    "https://headlessameril.wpenginepowered.com/wp-content/uploads/2023/04/AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png",
  address: {
    line1: "6322 Cypress Gardens Blvd.",
    city: "Winter Haven",
    state: "FL",
    zip: "33884",
  },
  hours: "Monday-Friday\n8am-5pm",
};

const AGENTS = [
  {
    slug: "ryan-atkins",
    title: "Ryan Atkins",
    menuOrder: 1,
    role: "AmeriLife Agent",
    city: "Winter Haven",
    state: "FL",
    reviewsCount: 375,
    bioHtml:
      "<p>Ryan Atkins is a licensed AmeriLife agent serving the Winter Haven area. He specializes in Medicare and retirement solutions, helping clients navigate their options with clarity and confidence.</p>",
  },
  {
    slug: "agatha-constanza",
    title: "Agatha Constanza",
    menuOrder: 2,
    role: "AmeriLife Agent",
    city: "Winter Haven",
    state: "FL",
    reviewsCount: 375,
    bioHtml:
      "<p>Agatha Constanza is a dedicated AmeriLife agent committed to helping individuals and families find the right insurance and retirement plans. She brings compassion and expertise to every client interaction.</p>",
  },
  {
    slug: "william-primus",
    title: "William Primus",
    menuOrder: 3,
    role: "AmeriLife Agent",
    city: "Winter Haven",
    state: "FL",
    reviewsCount: 375,
    bioHtml:
      "<p>William Primus has years of experience helping Polk County residents understand their Medicare and health insurance options. His personalized approach ensures every client finds the coverage that fits their needs.</p>",
  },
  {
    slug: "timothy-reynolds",
    title: "Timothy Reynolds",
    menuOrder: 4,
    role: "AmeriLife Agent",
    city: "Winter Haven",
    state: "FL",
    reviewsCount: 375,
    bioHtml:
      "<p>Timothy Reynolds is passionate about helping retirees and pre-retirees plan for a secure financial future. He offers comprehensive guidance on Medicare, life insurance, and annuity products.</p>",
  },
];

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------

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
  const fs = await import("node:fs/promises");
  const candidates = [path.join(PROJECT_ROOT, ".env.local"), path.join(PROJECT_ROOT, ".env")];
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

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const skipMedia = args.includes("--skip-media");

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

  console.log(`Target: ${headlessBase || "(dry-run)"}`);
  console.log(`Agency: ${AGENCY.slug} | Agents: ${AGENTS.length} | dry-run=${dryRun} skip-media=${skipMedia}\n`);

  if (dryRun) {
    console.log("Would create agency + agents with embedded Polk County data.");
    process.exit(0);
  }

  let agencyPostId = 0;
  const existingAgency = await agencyExists(headlessBase, authHeader, AGENCY.slug);
  if (existingAgency) {
    console.log(`Agency "${AGENCY.slug}" already exists (id ${existingAgency.id}). Skipping agency create.`);
    agencyPostId = existingAgency.id;
  } else {
    let featuredMediaId = 0;
    if (!skipMedia) {
      try {
        const media = await uploadMediaAsset(
          headlessBase,
          authHeader,
          AGENCY.officeImageUrl,
          `${AGENCY.title} office`
        );
        featuredMediaId = media.id;
        console.log(`Uploaded office image -> media ${featuredMediaId}`);
      } catch (e) {
        console.warn(`Office image upload failed: ${e.message}`);
      }
    }

    const agencyBody = {
      title: AGENCY.title,
      slug: AGENCY.slug,
      status: "publish",
      menu_order: 0,
      content: "",
      meta: {
        phone: AGENCY.phone,
        address_line1: AGENCY.address.line1,
        address_city: AGENCY.address.city,
        address_state: AGENCY.address.state,
        address_zip: AGENCY.address.zip,
        hours: AGENCY.hours,
        features_json: JSON.stringify(POLK_FEATURES),
      },
    };
    if (featuredMediaId) {
      agencyBody.featured_media = featuredMediaId;
    }

    const created = await wpRestPost(headlessBase, "/wp/v2/agency", agencyBody, authHeader);
    agencyPostId = created.id;
    console.log(`Created agency id=${created.id} slug=${created.slug}`);
  }

  const agencyId = agencyPostId || (await agencyExists(headlessBase, authHeader, AGENCY.slug))?.id;
  if (!agencyId) {
    console.error("Could not resolve agency ID.");
    process.exit(1);
  }

  const aidStr = String(agencyId);

  let createdAgents = 0;
  let skippedAgents = 0;
  let failedAgents = 0;

  for (let i = 0; i < AGENTS.length; i++) {
    const A = AGENTS[i];
    const label = `[${i + 1}/${AGENTS.length}]`;

    try {
      const ex = await agentExists(headlessBase, authHeader, A.slug);
      if (ex) {
        console.log(`${label} Skip agent (exists): ${A.slug} id=${ex.id}`);
        skippedAgents += 1;
        continue;
      }

      const body = {
        title: A.title,
        slug: A.slug,
        status: "publish",
        menu_order: A.menuOrder,
        content: A.bioHtml,
        meta: {
          role: A.role,
          city: A.city,
          state: A.state,
          reviews_count: String(A.reviewsCount),
          areas_of_focus: DEFAULT_AREAS,
          agency_id: aidStr,
        },
      };

      const post = await wpRestPost(headlessBase, "/wp/v2/agent", body, authHeader);
      console.log(`${label} Created agent id=${post.id} slug=${post.slug}`);
      createdAgents += 1;
    } catch (err) {
      console.error(`${label} FAILED ${A.slug}: ${err.message}`);
      failedAgents += 1;
    }

    if (i < AGENTS.length - 1) await sleep(delayMs);
  }

  console.log(`\nDone. agencyId=${agencyId} agents created=${createdAgents} skipped=${skippedAgents} failed=${failedAgents}`);
  process.exit(failedAgents > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
