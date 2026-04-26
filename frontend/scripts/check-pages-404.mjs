#!/usr/bin/env node
/**
 * Audit *page* URLs for HTTP 404s (excludes blog posts).
 *
 * - Fetches /sitemap.xml; if it is a sitemap *index*, follows child sitemaps.
 * - Skips any child sitemap whose URL looks like a WordPress *post* sitemap
 *   (e.g. post-sitemap.xml, post-sitemap2.xml).
 * - For URL sets, drops URLs that look like blog *articles*:
 *   /blog/{category}/{post-slug}/  (≥3 segments under blog).
 *
 * Usage:
 *   node scripts/check-pages-404.mjs
 *   node scripts/check-pages-404.mjs https://amerilife.com
 *   BASE_URL=https://preview.example.com node scripts/check-pages-404.mjs
 */

const DEFAULT_BASE =
  process.env.BASE_URL?.trim() ||
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://amerilife.com";

/** Blog article paths only; keeps /blog, /blog/foo (listings). */
function isBlogPostPathname(pathname) {
  const segs = pathname.split("/").filter(Boolean);
  return segs[0] === "blog" && segs.length >= 3;
}

function parseLocs(xml) {
  const locs = [];
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
    locs.push(m[1].trim());
  }
  return locs;
}

function isSitemapIndex(xml) {
  return /<sitemapindex[\s>]/i.test(xml);
}

/** WordPress-style post-only sitemap — skip entirely. */
function isPostChildSitemapUrl(href) {
  try {
    const u = new URL(href);
    const base = u.pathname.split("/").pop() || "";
    return /post-sitemap\d*\.xml$/i.test(base);
  } catch {
    return false;
  }
}

async function fetchText(url, label) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(90_000),
    headers: { "user-agent": "AmeriLife-check-pages-404/1.0" },
  });
  if (!res.ok) {
    throw new Error(`${label}: ${res.status} ${res.statusText} (${url})`);
  }
  return res.text();
}

/**
 * Collect all page <loc> URLs from a sitemap entry point (recursive for indexes).
 */
async function collectPageLocsFromSitemap(sitemapUrl, origin, depth = 0) {
  if (depth > 5) throw new Error("Sitemap nested too deeply");
  const xml = await fetchText(sitemapUrl, "sitemap");

  if (isSitemapIndex(xml)) {
    const childLocs = parseLocs(xml);
    const out = [];
    for (const loc of childLocs) {
      if (isPostChildSitemapUrl(loc)) {
        console.error(`Skip post sitemap: ${loc}`);
        continue;
      }
      const nested = await collectPageLocsFromSitemap(loc, origin, depth + 1);
      out.push(...nested);
    }
    return out;
  }

  return parseLocs(xml);
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(25_000),
      headers: { "user-agent": "AmeriLife-check-pages-404/1.0" },
    });
    if (res.status === 405 || res.status === 501) {
      const getRes = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(25_000),
        headers: {
          "user-agent": "AmeriLife-check-pages-404/1.0",
          Range: "bytes=0-0",
        },
      });
      return { url, status: getRes.status, ok: getRes.ok };
    }
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return {
      url,
      status: 0,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function pool(items, limit, fn) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return out;
}

async function main() {
  const baseStr = process.argv[2]?.trim() || DEFAULT_BASE;
  const origin = new URL(
    baseStr.includes("://") ? baseStr : `https://${baseStr}`,
  );
  const sitemapUrl = new URL("/sitemap.xml", origin).href;

  console.error(`Sitemap entry: ${sitemapUrl}\n`);

  let allLocs;
  try {
    allLocs = await collectPageLocsFromSitemap(sitemapUrl, origin);
  } catch (e) {
    console.error(String(e));
    process.exit(1);
  }

  const pageUrls = [];
  const skippedPosts = [];
  const seen = new Set();

  for (const loc of allLocs) {
    let u;
    try {
      u = new URL(loc);
    } catch {
      continue;
    }
    if (u.origin !== origin.origin) continue;
    if (isBlogPostPathname(u.pathname)) {
      skippedPosts.push(loc);
      continue;
    }
    const key = u.pathname + u.search;
    if (seen.has(key)) continue;
    seen.add(key);
    pageUrls.push(u.href);
  }

  console.error(
    `Raw <loc> count (after index expansion, excl. post-*.xml): ${allLocs.length}`,
  );
  console.error(`Skipped as blog post URLs (path): ${skippedPosts.length}`);
  console.error(`Unique page URLs to check: ${pageUrls.length}\n`);

  const results = await pool(pageUrls, 10, (url) => checkUrl(url));

  const bad = results.filter(
    (r) => !r.ok || r.status === 404 || (r.status >= 400 && r.status < 500),
  );
  const notFound = results.filter((r) => r.status === 404);
  const errors = results.filter((r) => r.error);

  for (const r of bad.sort((a, b) => a.url.localeCompare(b.url))) {
    const extra = r.error ? ` (${r.error})` : "";
    console.log(`${r.status}\t${r.url}${extra}`);
  }

  if (bad.length === 0) {
    console.error("No 4xx client errors or failed requests on checked page URLs.");
  } else {
    console.error(
      `\nSummary: ${notFound.length} not found (404), ${bad.length} total problems, ${errors.length} fetch errors`,
    );
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
