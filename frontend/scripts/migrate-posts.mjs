/**
 * Blog post migration script for AmeriLife.
 *
 * Extracts blog posts from the live amerilife.com WordPress REST API (Divi-based),
 * cleans the HTML, and uploads them to the headless WordPress site.
 *
 * Usage:
 *   pnpm migrate:extract          # Phase 1: extract to JSON
 *   pnpm migrate:upload           # Phase 2: upload from JSON
 *   pnpm migrate:posts            # Both phases
 *   pnpm migrate:posts --dry-run  # Preview without writing
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const CACHE_DIR = path.join(PROJECT_ROOT, ".cache", "migration");

// ---------------------------------------------------------------------------
// Env helpers (reused from sync-wp-images.mjs)
// ---------------------------------------------------------------------------

function env(name, fallback = undefined) {
  const v = process.env[name];
  return v == null || v === "" ? fallback : v;
}

function stripOuterQuotes(v) {
  const s = v.trim();
  if (
    (s.startsWith('"') && s.endsWith('"') && s.length >= 2) ||
    (s.startsWith("'") && s.endsWith("'") && s.length >= 2)
  ) {
    return s.slice(1, -1);
  }
  return s;
}

async function loadDotEnvFiles() {
  const candidates = [
    path.join(PROJECT_ROOT, ".env.local"),
    path.join(PROJECT_ROOT, ".env"),
  ];
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

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function getConfig() {
  const sourceBase = env("WP_SOURCE_URL", "https://amerilife.com").replace(/\/$/, "");
  const gql = env("NEXT_PUBLIC_GRAPHQL_ENDPOINT");
  const wpUrl = env("NEXT_PUBLIC_WORDPRESS_URL");
  const headlessBase = wpUrl
    ? wpUrl.replace(/\/$/, "")
    : gql
      ? gql.replace(/\/graphql\/?$/, "").replace(/\/$/, "")
      : null;

  const wpUser = env("HEADLESS_WP_APP_USER");
  const wpPassword = env("HEADLESS_WP_APP_PASSWORD");
  const delayMs = Number(env("MIGRATE_DELAY_MS", "500"));

  return { sourceBase, headlessBase, wpUser, wpPassword, delayMs };
}

function basicAuthHeader(user, password) {
  const pass = String(password).replace(/\s+/g, "");
  return `Basic ${Buffer.from(`${user}:${pass}`, "utf8").toString("base64")}`;
}

// ---------------------------------------------------------------------------
// Divi HTML cleaner
// ---------------------------------------------------------------------------

function cleanDiviHtml(html) {
  if (!html) return "";

  let cleaned = html;

  // Remove Divi section/row/column wrapper divs but keep inner content.
  // These are nested like: <div class="et_pb_section ..."><div class="et_pb_row ...">...
  // We iteratively strip outer Divi wrappers.
  const diviWrapperRe =
    /<div\s+class="(?:et_pb_section|et_pb_row|et_pb_column|et_pb_with_background|et_section_regular|et_pb_css_mix_blend_mode_passthrough|et_pb_gutters\d*)[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?=<\/div>|$)/gi;

  // Multi-pass stripping since Divi nests deeply.
  for (let i = 0; i < 10; i++) {
    const before = cleaned;
    cleaned = cleaned.replace(diviWrapperRe, "$1");
    if (cleaned === before) break;
  }

  // Strip et_pb_text module wrappers specifically — these directly wrap content.
  cleaned = cleaned.replace(
    /<div\s+class="et_pb_text[^"]*"[^>]*>\s*<div\s+class="et_pb_text_inner[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi,
    "$1"
  );

  // Catch remaining et_pb_ divs generically.
  for (let i = 0; i < 10; i++) {
    const before = cleaned;
    cleaned = cleaned.replace(
      /<div\s+class="et_pb_[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
      "$1"
    );
    if (cleaned === before) break;
  }

  // Strip Divi-specific attributes and classes from remaining tags.
  cleaned = cleaned.replace(/\s+class="et_pb_[^"]*"/gi, "");
  cleaned = cleaned.replace(/\s+class="et-[^"]*"/gi, "");
  cleaned = cleaned.replace(/\s+data-et-[a-z-]+="[^"]*"/gi, "");

  // Remove empty wrapper divs left over.
  for (let i = 0; i < 5; i++) {
    const before = cleaned;
    cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, "");
    if (cleaned === before) break;
  }

  // Remove Divi inline styles on remaining divs (often layout-only).
  cleaned = cleaned.replace(/<div\s+style="[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, "$1");

  // Remove remaining empty divs with no attributes.
  for (let i = 0; i < 5; i++) {
    const before = cleaned;
    cleaned = cleaned.replace(/<div>\s*([\s\S]*?)\s*<\/div>/gi, "$1");
    if (cleaned === before) break;
  }

  // Strip empty paragraphs and excessive whitespace.
  cleaned = cleaned.replace(/<p>\s*&nbsp;\s*<\/p>/gi, "");
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.trim();

  return cleaned;
}

function decodeHtmlEntities(text) {
  return (text || "")
    .replace(/&#038;/g, "&")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#8212;/g, "\u2014")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8220;/g, "\u201c")
    .replace(/&#8221;/g, "\u201d")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtmlTags(html) {
  return decodeHtmlEntities((html || "").replace(/<[^>]+>/g, "")).trim();
}

// ---------------------------------------------------------------------------
// Phase 1: Extract by scraping rendered HTML pages
// (The old site's REST API is restricted to authenticated users.)
// ---------------------------------------------------------------------------

function slugFromUrl(url) {
  const u = new URL(url);
  const segments = u.pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] || null;
}

function categoryFromUrl(url) {
  const u = new URL(url);
  const segments = u.pathname.split("/").filter(Boolean);
  if (segments.length >= 3 && segments[0] === "blog") {
    return segments[1];
  }
  return null;
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Extract content of an HTML attribute from a tag string. */
function attrValue(tagHtml, attr) {
  const re = new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, "i");
  const m = tagHtml.match(re);
  return m ? m[1] : "";
}

/** Extract all meta tag values matching a pattern. */
function extractMeta(html, nameOrProp, value) {
  const re = new RegExp(
    `<meta[^>]*${nameOrProp}\\s*=\\s*["']${value}["'][^>]*>`,
    "gi"
  );
  const tags = html.match(re);
  if (!tags?.length) return "";
  return attrValue(tags[0], "content");
}

/** Parse the published date from the visible "Jul 07, 2025" span. */
function parseDisplayDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

/** Extract all .et_pb_text_inner blocks and concatenate their inner HTML. */
function extractDiviTextBlocks(html) {
  const blocks = [];
  const re = /<div\s+class="et_pb_text_inner"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const inner = m[1].trim();
    if (inner) blocks.push(inner);
  }
  return blocks.join("\n\n");
}

/** Extract the <article> tag content as a fallback. */
function extractArticleContent(html) {
  const m = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  return m ? m[1] : "";
}

async function extractPost(sourceBase, url) {
  const slug = slugFromUrl(url);
  if (!slug) throw new Error(`Cannot derive slug from: ${url}`);

  const res = await fetchWithRetry(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      accept: "text/html",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const html = await res.text();

  // --- Title ---
  let title = "";
  const h1Match = html.match(/<h1[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    title = stripHtmlTags(h1Match[1]);
  }
  if (!title) {
    title = extractMeta(html, "property", "og:title");
  }
  if (!title) {
    const titleTag = html.match(/<title>([^<]+)<\/title>/i);
    if (titleTag) title = titleTag[1].trim();
  }

  // --- Date ---
  let date = null;
  const dateSpan = html.match(/<span\s+class="date"[^>]*>([^<]+)<\/span>/i);
  if (dateSpan) {
    date = parseDisplayDate(dateSpan[1].trim());
  }
  // Fallback: article:published_time meta.
  if (!date) {
    const pubTime = extractMeta(html, "property", "article:published_time");
    if (pubTime) date = pubTime;
  }

  // --- Categories ---
  const categories = [];
  // Primary: <span class="aml-post-tag">
  const tagSpans = html.matchAll(/<span\s+class="aml-post-tag"[^>]*>([^<]+)<\/span>/gi);
  for (const tm of tagSpans) {
    const name = decodeHtmlEntities(tm[1].trim());
    if (name) {
      categories.push({
        name,
        slug: name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      });
    }
  }
  // Fallback: derive from article class (category-announcements).
  if (!categories.length) {
    const articleTag = html.match(/<article[^>]*class="([^"]*)"[^>]*>/i);
    if (articleTag) {
      const catMatches = articleTag[1].matchAll(/category-([a-z0-9-]+)/g);
      for (const cm of catMatches) {
        categories.push({
          name: cm[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          slug: cm[1],
        });
      }
    }
  }
  // Last resort: derive from URL path.
  if (!categories.length) {
    const catSlug = categoryFromUrl(url);
    if (catSlug) {
      categories.push({
        name: catSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        slug: catSlug,
      });
    }
  }

  // --- Author ---
  let authorName = "";
  const authorMatch = html.match(/<p\s+class="name"[^>]*>([^<]+)<\/p>/i);
  if (authorMatch) {
    authorName = authorMatch[1].replace(/^By\s+/i, "").trim();
  }

  // --- Featured image ---
  let featuredImageUrl = extractMeta(html, "property", "og:image") || null;
  let featuredImageAlt = title;

  // --- Content ---
  const articleHtml = extractArticleContent(html);
  let rawContent = extractDiviTextBlocks(articleHtml || html);
  if (!rawContent) {
    rawContent = articleHtml;
  }
  const content = cleanDiviHtml(rawContent);

  // --- Excerpt (first substantial paragraph of content) ---
  let excerpt = "";
  const pTags = content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  for (const pm of pTags) {
    const text = stripHtmlTags(pm[1]);
    if (text.length > 30) {
      excerpt = text.slice(0, 300);
      break;
    }
  }

  // --- SEO ---
  const seoTitle = decodeHtmlEntities(
    extractMeta(html, "property", "og:title")
    || (html.match(/<title>([^<]+)<\/title>/i)?.[1] || "").trim()
  );
  const metaDesc = extractMeta(html, "name", "description")
    || extractMeta(html, "property", "og:description")
    || "";

  return {
    sourceUrl: url,
    slug,
    title,
    content,
    excerpt,
    date,
    modified: null,
    authorName,
    categories,
    featuredImageUrl,
    featuredImageAlt,
    seoTitle,
    metaDesc: decodeHtmlEntities(stripHtmlTags(metaDesc)),
  };
}

async function runExtract({ sourceBase, dryRun, urlsFile }) {
  await fs.mkdir(CACHE_DIR, { recursive: true });

  const urlsPath = urlsFile
    ? path.resolve(urlsFile)
    : path.join(__dirname, "migrate-urls.txt");
  const raw = await fs.readFile(urlsPath, "utf8");
  const urls = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  console.log(`\nExtracting ${urls.length} posts from ${sourceBase}...\n`);

  const results = [];
  const failures = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const label = `[${i + 1}/${urls.length}]`;

    if (dryRun) {
      const slug = slugFromUrl(url);
      console.log(`${label} (dry-run) Would extract: ${slug}`);
      continue;
    }

    try {
      console.log(`${label} Extracting: ${slugFromUrl(url)}...`);
      const data = await extractPost(sourceBase, url);
      results.push(data);
      console.log(`  OK: "${data.title}" (${data.categories.map((c) => c.slug).join(", ")})`);
    } catch (err) {
      const msg = `FAILED: ${url} — ${err.message}`;
      console.error(`  ${msg}`);
      failures.push(msg);
    }

    if (i < urls.length - 1) await sleep(300);
  }

  if (dryRun) {
    console.log(`\nDry run complete. ${urls.length} URLs would be extracted.`);
    return;
  }

  const outPath = path.join(CACHE_DIR, "extracted-posts.json");
  await fs.writeFile(outPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`\nExtracted ${results.length} posts -> ${outPath}`);

  if (failures.length) {
    const failPath = path.join(CACHE_DIR, "extract-failures.txt");
    await fs.writeFile(failPath, failures.join("\n") + "\n", "utf8");
    console.log(`${failures.length} failures logged -> ${failPath}`);
  }

  const reportPath = path.join(CACHE_DIR, "extract-report.txt");
  const reportLines = [
    `Extraction Report`,
    `=================`,
    `Date: ${new Date().toISOString()}`,
    `Source: ${sourceBase}`,
    `Total URLs: ${urls.length}`,
    `Extracted: ${results.length}`,
    `Failed: ${failures.length}`,
    ``,
    `Posts by category:`,
  ];
  const catCounts = {};
  for (const r of results) {
    const cat = r.categories[0]?.slug || "uncategorized";
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  }
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    reportLines.push(`  ${cat}: ${count}`);
  }
  await fs.writeFile(reportPath, reportLines.join("\n") + "\n", "utf8");
  console.log(`Report -> ${reportPath}`);
}

// ---------------------------------------------------------------------------
// Phase 2: Upload to headless WP
// ---------------------------------------------------------------------------

async function wpRestGet(headlessBase, endpoint, authHeader) {
  const url = `${headlessBase}/wp-json${endpoint}`;
  const res = await fetchWithRetry(url, {
    headers: { authorization: authHeader, accept: "application/json" },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${endpoint} -> ${res.status}: ${txt.slice(0, 200)}`);
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
    throw new Error(`POST ${endpoint} -> ${res.status}: ${txt.slice(0, 500)}`);
  }
  return res.json();
}

async function findOrCreateCategory(headlessBase, authHeader, catSlug, catName) {
  // Check if category exists.
  const existing = await wpRestGet(
    headlessBase,
    `/wp/v2/categories?slug=${encodeURIComponent(catSlug)}&per_page=1`,
    authHeader
  );
  if (existing.length) return existing[0].id;

  // Create it.
  const created = await wpRestPost(
    headlessBase,
    "/wp/v2/categories",
    { name: catName, slug: catSlug },
    authHeader
  );
  return created.id;
}

/**
 * Download a remote image and upload it to the headless WP media library.
 * Returns { id, sourceUrl } where sourceUrl is the new URL on headless WP.
 */
async function uploadMediaAsset(headlessBase, authHeader, imageUrl, altText) {
  const imgRes = await fetchWithRetry(imageUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      accept: "image/*,*/*;q=0.8",
    },
  });
  if (!imgRes.ok) {
    throw new Error(`Image download failed ${imgRes.status}: ${imageUrl}`);
  }

  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const parsedUrl = new URL(imageUrl);
  const filename = path.basename(parsedUrl.pathname) || "featured-image.jpg";
  const contentType = imgRes.headers.get("content-type") || "image/jpeg";

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
    throw new Error(`Media upload failed ${uploadRes.status}: ${txt.slice(0, 300)}`);
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
      // Non-fatal.
    }
  }

  return { id: media.id, sourceUrl: media.source_url || "" };
}

/**
 * Find all <img> and <a href="...pdf/image"> in post content that point to the
 * old site (or any wp-content/uploads URL), re-upload them to headless WP,
 * and rewrite the src/href to the new URL. Returns the rewritten HTML.
 *
 * Also handles:
 *  - srcset attributes (each candidate URL)
 *  - CSS background-image: url(...)
 *  - <a> links to uploaded PDFs/documents
 */
async function rewriteContentMedia(headlessBase, authHeader, html, sourceHosts) {
  if (!html) return html;

  // Collect all URLs that reference uploads on the source hosts.
  const urlsToRewrite = new Map(); // originalUrl -> null (filled with newUrl later)

  const uploadsRe = new RegExp(
    `(https?://(?:${sourceHosts.map(escapeRegex).join("|")})/wp-content/uploads/[^\\s"'<>)]+)`,
    "gi"
  );

  let m;
  while ((m = uploadsRe.exec(html)) !== null) {
    const original = m[1].replace(/\\+$/, "").trim();
    if (original && !urlsToRewrite.has(original)) {
      urlsToRewrite.set(original, null);
    }
  }

  if (urlsToRewrite.size === 0) return html;

  console.log(`    Rewriting ${urlsToRewrite.size} content media URL(s)...`);

  // Upload each unique asset and collect the new URL.
  for (const [originalUrl] of urlsToRewrite) {
    try {
      const result = await uploadMediaAsset(headlessBase, authHeader, originalUrl, "");
      urlsToRewrite.set(originalUrl, result.sourceUrl);
    } catch (err) {
      console.warn(`    Warning: content media failed (${path.basename(new URL(originalUrl).pathname)}): ${err.message}`);
    }
  }

  // Replace all occurrences in the HTML.
  let rewritten = html;
  for (const [originalUrl, newUrl] of urlsToRewrite) {
    if (!newUrl) continue;
    rewritten = rewritten.split(originalUrl).join(newUrl);
  }

  return rewritten;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function postExistsOnTarget(headlessBase, authHeader, slug) {
  const existing = await wpRestGet(
    headlessBase,
    `/wp/v2/posts?slug=${encodeURIComponent(slug)}&per_page=1&status=any`,
    authHeader
  );
  return existing.length > 0 ? existing[0] : null;
}

async function createPost(headlessBase, authHeader, postData, dryRun, sourceHosts) {
  const {
    slug,
    title,
    content,
    excerpt,
    date,
    categories,
    featuredImageUrl,
    featuredImageAlt,
    seoTitle,
    metaDesc,
  } = postData;

  if (dryRun) {
    return { status: "dry_run", slug, title };
  }

  // Check for duplicates (requires auth, so only in non-dry-run).
  const existing = await postExistsOnTarget(headlessBase, authHeader, slug);
  if (existing) {
    return { status: "skipped", reason: "already_exists", id: existing.id, slug };
  }

  // Resolve categories.
  const categoryIds = [];
  for (const cat of categories) {
    try {
      const catId = await findOrCreateCategory(headlessBase, authHeader, cat.slug, cat.name);
      categoryIds.push(catId);
    } catch (err) {
      console.warn(`    Warning: Could not create category "${cat.slug}": ${err.message}`);
    }
  }

  // Upload featured image.
  let featuredMediaId = 0;
  if (featuredImageUrl) {
    try {
      const result = await uploadMediaAsset(headlessBase, authHeader, featuredImageUrl, featuredImageAlt);
      featuredMediaId = result.id;
    } catch (err) {
      console.warn(`    Warning: Featured image failed: ${err.message}`);
    }
  }

  // Re-upload any images/PDFs/media in the content that point to old hosts
  // and rewrite their URLs to the headless WP.
  const rewrittenContent = await rewriteContentMedia(
    headlessBase,
    authHeader,
    content,
    sourceHosts
  );

  // Build post body.
  const body = {
    title,
    content: rewrittenContent,
    excerpt,
    slug,
    status: "publish",
    categories: categoryIds.length ? categoryIds : undefined,
    featured_media: featuredMediaId || undefined,
  };

  // Preserve original publish date.
  if (date) body.date = date;

  // Yoast SEO meta (requires Yoast REST API fields to be writable).
  if (seoTitle || metaDesc) {
    body.meta = {};
    if (seoTitle) body.meta._yoast_wpseo_title = seoTitle;
    if (metaDesc) body.meta._yoast_wpseo_metadesc = metaDesc;
  }

  const created = await wpRestPost(headlessBase, "/wp/v2/posts", body, authHeader);
  return { status: "created", id: created.id, slug, title };
}

async function runUpload({ headlessBase, wpUser, wpPassword, delayMs, dryRun, sourceBase }) {
  if (!headlessBase) {
    throw new Error("Set NEXT_PUBLIC_GRAPHQL_ENDPOINT (or NEXT_PUBLIC_WORDPRESS_URL) for the headless WP target.");
  }
  if (!dryRun && (!wpUser || !wpPassword)) {
    throw new Error(
      "Set HEADLESS_WP_APP_USER and HEADLESS_WP_APP_PASSWORD for authenticated uploads."
    );
  }

  // Hosts whose wp-content/uploads URLs should be re-uploaded to headless WP.
  const sourceHostsRaw = env(
    "MIGRATE_SOURCE_HOSTS",
    "amerilife.com,www.amerilife.com"
  );
  const sourceHosts = sourceHostsRaw.split(",").map((h) => h.trim()).filter(Boolean);

  const authHeader = basicAuthHeader(wpUser || "", wpPassword || "");

  // Verify auth works.
  if (!dryRun) {
    console.log(`\nVerifying auth against ${headlessBase}...`);
    try {
      const me = await wpRestGet(headlessBase, "/wp/v2/users/me", authHeader);
      console.log(`Authenticated as: ${me.name} (${me.slug})\n`);
    } catch (err) {
      throw new Error(`Auth failed: ${err.message}\nCheck HEADLESS_WP_APP_USER / HEADLESS_WP_APP_PASSWORD.`);
    }
  }

  const jsonPath = path.join(CACHE_DIR, "extracted-posts.json");
  let posts;
  try {
    posts = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  } catch {
    throw new Error(
      `Cannot read ${jsonPath}. Run "pnpm migrate:extract" first.`
    );
  }

  console.log(`Uploading ${posts.length} posts to ${headlessBase}...\n`);

  const results = { created: 0, skipped: 0, failed: 0, dry_run: 0 };
  const failures = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const label = `[${i + 1}/${posts.length}]`;

    try {
      console.log(`${label} ${dryRun ? "(dry-run) " : ""}${post.slug}...`);
      const result = await createPost(headlessBase, authHeader, post, dryRun, sourceHosts);

      if (result.status === "skipped") {
        console.log(`  Skipped (already exists, ID ${result.id})`);
        results.skipped++;
      } else if (result.status === "dry_run") {
        console.log(`  Would create: "${result.title}"`);
        results.dry_run++;
      } else {
        console.log(`  Created (ID ${result.id}): "${result.title}"`);
        results.created++;
      }
    } catch (err) {
      const msg = `FAILED: ${post.slug} — ${err.message}`;
      console.error(`  ${msg}`);
      failures.push(msg);
      results.failed++;
    }

    if (i < posts.length - 1) await sleep(delayMs);
  }

  console.log(`\n--- Upload Summary ---`);
  console.log(`Created: ${results.created}`);
  console.log(`Skipped: ${results.skipped}`);
  console.log(`Failed:  ${results.failed}`);
  if (results.dry_run) console.log(`Dry run: ${results.dry_run}`);

  if (failures.length) {
    const failPath = path.join(CACHE_DIR, "upload-failures.txt");
    await fs.writeFile(failPath, failures.join("\n") + "\n", "utf8");
    console.log(`\nFailures logged -> ${failPath}`);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  await loadDotEnvFiles();

  const args = process.argv.slice(2);
  const command = args.find((a) => !a.startsWith("-")) || "migrate";
  const dryRun = args.includes("--dry-run");
  const urlsFileArg = args.find((a) => a.startsWith("--urls-file="));
  const urlsFile = urlsFileArg ? urlsFileArg.split("=")[1] : null;

  const config = getConfig();

  if (dryRun) console.log("*** DRY RUN MODE ***\n");

  switch (command) {
    case "extract":
      await runExtract({ sourceBase: config.sourceBase, dryRun, urlsFile });
      break;

    case "upload":
      await runUpload({ ...config, dryRun });
      break;

    case "migrate":
      await runExtract({ sourceBase: config.sourceBase, dryRun, urlsFile });
      if (!dryRun) {
        console.log("\n--- Starting upload phase ---\n");
        await runUpload({ ...config, dryRun });
      }
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error("Usage: node migrate-posts.mjs [extract|upload|migrate] [--dry-run]");
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`\nFATAL: ${err.message}`);
  process.exit(1);
});
