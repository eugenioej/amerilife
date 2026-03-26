/**
 * Scrape https://amerilife.com/our-solutions/affiliates/ (Divi "aml-brands" blocks) and
 * create `affiliate` CPT posts on headless WordPress with featured images, website_url meta,
 * and affiliate_category terms.
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_GRAPHQL_ENDPOINT or NEXT_PUBLIC_WORDPRESS_URL
 *   HEADLESS_WP_APP_USER
 *   HEADLESS_WP_APP_PASSWORD
 *
 * MU plugin `amerilife-affiliates-cpt.php` must be active so terms and REST routes exist.
 *
 * Usage:
 *   pnpm import:affiliates
 *   pnpm import:affiliates --dry-run
 *   pnpm import:affiliates --skip-media          # create posts without uploading logos (no featured image)
 *   pnpm import:affiliates --source=https://...  # alternate page URL
 *
 * Env: optional `AFFILIATES_IMPORT_SOURCE_URL` overrides the default affiliates URL.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

const DEFAULT_SOURCE =
  process.env.AFFILIATES_IMPORT_SOURCE_URL || "https://amerilife.com/our-solutions/affiliates/";

// ---------------------------------------------------------------------------
// Env (same helpers as import-leaders.mjs)
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
  const delayMs = Number(env("IMPORT_AFFILIATES_DELAY_MS", "350"));

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

// ---------------------------------------------------------------------------
// Scrape
// ---------------------------------------------------------------------------

/** Strip tags and collapse whitespace (handles <br /> inside category titles). */
function normalizeCategoryLabel(inner) {
  return inner
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Map scraped heading text to taxonomy slug (must match amerilife-affiliates-cpt.php). */
function labelToCategorySlug(label) {
  const n = label.toLowerCase();
  if (n.includes("medical") && n.includes("health")) return "medical-life-health";
  if (n.includes("wealth") || (n.includes("retirement") && n.includes("planning")))
    return "wealth-management-retirement";
  if (n.includes("worksite")) return "worksite-distribution";
  if (n.includes("direct") && n.includes("consumer")) return "direct-to-consumer";
  return null;
}

function imagePathKey(src) {
  try {
    const u = new URL(src);
    return u.pathname;
  } catch {
    return src;
  }
}

/** Human-readable title from filename-style alt text. */
function titleFromAlt(alt) {
  if (!alt || !String(alt).trim()) return "Affiliate";
  let t = String(alt)
    .replace(/\.(png|jpg|jpeg|webp|gif)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function slugifyBase(title) {
  const s = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return s || "affiliate";
}

/**
 * @param {string} html full page HTML
 * @returns {{ categoryLabel: string; categorySlug: string | null; href: string; src: string; alt: string }[]}
 */
function scrapeAffiliateLogos(html) {
  const cats = [];
  /** Live markup may include newlines between `</p>` and `</div>`. */
  const catRe = /<div class="text style-2"><p>([\s\S]*?)<\/p>\s*<\/div>/g;
  let cm;
  while ((cm = catRe.exec(html)) !== null) {
    cats.push({ index: cm.index, label: normalizeCategoryLabel(cm[1]) });
  }

  const raw = [];
  /** Inner HTML of each `.logo-item` (link + img, or img only). */
  const logoBlockRe = /<div class="logo-item">([\s\S]*?)<\/div>/g;
  let lm;
  while ((lm = logoBlockRe.exec(html)) !== null) {
    const idx = lm.index;
    const inner = lm[1] || "";
    const hrefM = inner.match(/\bhref="([^"]+)"/i);
    const srcM = inner.match(/\bsrc="([^"]+)"/i);
    const altM = inner.match(/\balt="([^"]*)"/i);
    const href = (hrefM?.[1] || "").trim();
    const src = (srcM?.[1] || "").trim();
    const alt = (altM?.[1] || "").trim();
    if (!src) continue;

    const preceding = cats.filter((c) => c.index < idx);
    const category = preceding.length ? preceding[preceding.length - 1] : null;
    if (!category) continue;
    const categorySlug = labelToCategorySlug(category.label);
    raw.push({
      categoryLabel: category.label,
      categorySlug,
      href,
      src: src.replace(/^http:\/\//i, "https://"),
      alt,
    });
  }

  return raw;
}

/**
 * Merge rows that share the same image path; union category slugs.
 * @returns {Map<string, { href: string; src: string; alt: string; categorySlugs: Set<string> }>}
 */
function mergeByImageKey(rows) {
  const map = new Map();
  for (const r of rows) {
    if (!r.categorySlug) {
      console.warn(`Skipping row (unknown category): ${r.categoryLabel} / ${r.alt}`);
      continue;
    }
    const key = imagePathKey(r.src);
    let entry = map.get(key);
    if (!entry) {
      entry = { href: r.href, src: r.src, alt: r.alt, categorySlugs: new Set() };
      map.set(key, entry);
    } else {
      entry.categorySlugs.add(r.categorySlug);
      if (r.href && !entry.href) entry.href = r.href;
      if (r.alt && r.alt.length > entry.alt.length) entry.alt = r.alt;
    }
    entry.categorySlugs.add(r.categorySlug);
  }
  return map;
}

// ---------------------------------------------------------------------------
// WordPress REST
// ---------------------------------------------------------------------------

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
      referer: "https://amerilife.com/",
    },
  });
  if (!imgRes.ok) {
    throw new Error(`Image download failed ${imgRes.status}: ${imageUrl}`);
  }

  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const parsedUrl = new URL(imageUrl);
  const filename = path.basename(parsedUrl.pathname) || "affiliate-logo.png";
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

async function affiliateExists(headlessBase, authHeader, slug) {
  const rows = await wpRestGet(
    headlessBase,
    `/wp/v2/affiliate?slug=${encodeURIComponent(slug)}&per_page=1&status=publish,draft,pending`,
    authHeader
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

async function loadCategoryTermIds(headlessBase, authHeader) {
  const rows = await wpRestGet(headlessBase, `/wp/v2/affiliate_category?per_page=100`, authHeader);
  const bySlug = new Map();
  if (!Array.isArray(rows)) return bySlug;
  for (const t of rows) {
    if (t.slug) bySlug.set(t.slug, t.id);
  }
  return bySlug;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const skipMedia = args.includes("--skip-media");
  const sourceUrl =
    args.find((a) => a.startsWith("--source="))?.replace("--source=", "") || DEFAULT_SOURCE;

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

  console.log(`Fetching: ${sourceUrl}\n`);
  const pageRes = await fetchWithRetry(sourceUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      accept: "text/html",
    },
    redirect: "follow",
  });
  if (!pageRes.ok) {
    console.error(`Failed to fetch page: ${pageRes.status}`);
    process.exit(1);
  }
  const html = await pageRes.text();

  const rows = scrapeAffiliateLogos(html);
  const merged = mergeByImageKey(rows);

  console.log(`Scraped ${rows.length} logo slots -> ${merged.size} unique images (after merging categories).\n`);

  if (!dryRun && headlessBase) {
    try {
      await wpRestGet(headlessBase, "/wp/v2/users/me", authHeader);
      console.log("Auth OK (headless WordPress).\n");
    } catch (e) {
      console.error("WordPress auth failed:", e.message);
      process.exit(1);
    }
  }

  let termBySlug = new Map();
  if (!dryRun && headlessBase) {
    try {
      termBySlug = await loadCategoryTermIds(headlessBase, authHeader);
    } catch (e) {
      console.error("Could not load affiliate_category terms:", e.message);
      process.exit(1);
    }
    for (const slug of [
      "medical-life-health",
      "wealth-management-retirement",
      "worksite-distribution",
      "direct-to-consumer",
    ]) {
      if (!termBySlug.has(slug)) {
        console.warn(`Warning: term "${slug}" not found in REST. Is the MU plugin active?`);
      }
    }
  }

  const usedSlugs = new Set();
  let created = 0;
  let skipped = 0;
  let failed = 0;
  let order = 0;

  for (const [, entry] of merged) {
    order += 1;
    const title = titleFromAlt(entry.alt);
    let baseSlug = slugifyBase(title);
    let slug = baseSlug;
    let n = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${n++}`;
    }
    usedSlugs.add(slug);

    const termIds = [...entry.categorySlugs]
      .map((s) => termBySlug.get(s))
      .filter((id) => typeof id === "number");

    if (!dryRun && termIds.length === 0) {
      console.warn(`Skip (no term IDs): ${title}`);
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(
        `[dry-run] ${title} slug=${slug} categories=${[...entry.categorySlugs].join(",")} url=${entry.href || "(none)"}`
      );
      continue;
    }

    const existing = await affiliateExists(headlessBase, authHeader, slug);
    if (existing) {
      console.log(`Skip (exists): ${slug} id=${existing.id}`);
      skipped += 1;
      continue;
    }

    try {
      let featuredMediaId = 0;
      if (!skipMedia) {
        try {
          const media = await uploadMediaAsset(
            headlessBase,
            authHeader,
            entry.src,
            titleFromAlt(entry.alt)
          );
          featuredMediaId = media.id;
        } catch (imgErr) {
          console.warn(`  Media upload failed (${slug}): ${imgErr.message}`);
        }
      }

      const body = {
        title,
        slug,
        status: "publish",
        menu_order: order,
        meta: {
          website_url: entry.href || "",
        },
        affiliate_category: termIds,
      };
      if (featuredMediaId) {
        body.featured_media = featuredMediaId;
      }

      const post = await wpRestPost(headlessBase, "/wp/v2/affiliate", body, authHeader);
      console.log(
        `Created affiliate id=${post.id} slug=${post.slug} featured=${post.featured_media || featuredMediaId || "none"} terms=${termIds.length}`
      );
      created += 1;
    } catch (err) {
      console.error(`FAILED ${slug}: ${err.message}`);
      failed += 1;
    }

    await sleep(delayMs);
  }

  if (dryRun) {
    console.log(`\nDry run complete. ${merged.size} affiliates would be processed.`);
    return;
  }

  console.log(`\nDone. created=${created} skipped=${skipped} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
