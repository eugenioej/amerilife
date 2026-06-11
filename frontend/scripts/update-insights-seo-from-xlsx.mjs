#!/usr/bin/env node
/**
 * update-insights-seo-from-xlsx.mjs
 *
 * Reads Yoast SEO fields from an Excel spreadsheet and updates matching
 * WordPress insight posts (title, meta description, focus keyphrase).
 *
 * Usage:
 *   node scripts/update-insights-seo-from-xlsx.mjs
 *   node scripts/update-insights-seo-from-xlsx.mjs --dry-run
 *   node scripts/update-insights-seo-from-xlsx.mjs --xlsx="/path/to/file.xlsx"
 *
 * Env (frontend/.env.local):
 *   WORDPRESS_URL or NEXT_PUBLIC_WORDPRESS_URL
 *   WORDPRESS_USER + WORDPRESS_PASSWORD
 */

import { execFile } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, basename } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
}

["../.env", "../.env.local", ".env", ".env.local"].forEach((f) => loadEnv(join(ROOT, f)));

const DRY_RUN = process.argv.includes("--dry-run");
const XLSX_ARG = process.argv.find((a) => a.startsWith("--xlsx="));
const XLSX_PATH =
  XLSX_ARG?.slice("--xlsx=".length) ||
  process.env.INSIGHTS_SEO_XLSX ||
  join(process.env.HOME || "", "Downloads", "AmeriLife.com SEO Yoast Insights (1)-1.xlsx");

function originFromGraphql() {
  const g = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  if (!g) return "";
  try {
    return new URL(g).origin.replace(/\/$/, "");
  } catch {
    return "";
  }
}

const base =
  process.env.WORDPRESS_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "") ||
  originFromGraphql() ||
  "";

const user = process.env.HEADLESS_WP_APP_USER?.trim() || process.env.WORDPRESS_USER?.trim() || "";
const wpPassword = process.env.WORDPRESS_PASSWORD?.trim() || process.env.WP_PASSWORD?.trim() || "";

if (!base || !user || !wpPassword) {
  console.error("❌  Set WORDPRESS_URL, WORDPRESS_USER, and WORDPRESS_PASSWORD in .env.local");
  process.exit(1);
}

if (!existsSync(XLSX_PATH)) {
  console.error(`❌  Excel file not found:\n    ${XLSX_PATH}`);
  process.exit(1);
}

let authCookieJar = "";
let restNonce = "";

async function curlRun(extraArgs, url) {
  const tmpOut = join(tmpdir(), `curl-${Date.now()}-${Math.random().toString(36).slice(2)}.out`);
  const args = ["-sS", ...extraArgs, "-o", tmpOut, "-w", "%{http_code}", url];
  try {
    const { stdout } = await execFileAsync("curl", args, { maxBuffer: 20 * 1024 * 1024 });
    const status = parseInt(String(stdout).trim(), 10);
    const text = existsSync(tmpOut) ? readFileSync(tmpOut, "utf8") : "";
    return { status, text };
  } finally {
    try {
      unlinkSync(tmpOut);
    } catch {
      /**/
    }
  }
}

async function wpFetch(url, opts = {}) {
  const method = opts.method || "GET";
  const extra = [];
  if (method !== "GET") extra.push("-X", method);
  if (authCookieJar) extra.push("-b", authCookieJar, "-c", authCookieJar);
  const needsNonce =
    Boolean(restNonce) &&
    (method !== "GET" || url.includes("context=edit") || url.includes("/wp-admin/"));
  if (needsNonce) extra.push("-H", `X-WP-Nonce: ${restNonce}`);

  let tmpIn = null;
  if (opts.body !== undefined) {
    tmpIn = join(tmpdir(), `body-${Date.now()}.bin`);
    writeFileSync(tmpIn, String(opts.body), "utf8");
    extra.push("-H", "Content-Type: application/json", "--data-binary", `@${tmpIn}`);
  }

  try {
    return await curlRun(extra, url);
  } finally {
    if (tmpIn) {
      try {
        unlinkSync(tmpIn);
      } catch {
        /**/
      }
    }
  }
}

async function publicFetch(url) {
  return curlRun([], url);
}

function extractNonceFromHtml(html) {
  let m = html.match(/"nonce"\s*:\s*"([^"]{6,30})"[^}]{0,80}"versionString"/);
  if (m) return m[1];
  m = html.match(/wpApiSettings\s*=\s*\{[^}]{0,300}"nonce"\s*:\s*"([^"]{6,30})"/);
  if (m) return m[1];
  return null;
}

async function fetchRestNonce(jar) {
  const tmpBodyPath = join(tmpdir(), `nonce-body-${Date.now()}.bin`);
  writeFileSync(tmpBodyPath, "action=rest-nonce", "utf8");
  try {
    const { status, text } = await curlRun(
      ["-b", jar, "-c", jar, "-H", "Content-Type: application/x-www-form-urlencoded", "--data-binary", `@${tmpBodyPath}`],
      `${base}/wp-admin/admin-ajax.php`
    );
    const t = text.trim();
    if (status === 200 && t && t.length >= 6 && t.length < 200 && !/[<>]/.test(t) && t !== "0" && t !== "-1") {
      return t;
    }
  } finally {
    try {
      unlinkSync(tmpBodyPath);
    } catch {
      /**/
    }
  }

  for (const path of [`/wp-admin/post-new.php`, `/wp-admin/`]) {
    const { status, text } = await curlRun(
      ["-b", jar, "-c", jar, "-H", "Cache-Control: no-cache"],
      `${base}${path}?nc=${Date.now()}`
    );
    if (status === 200) {
      const nonce = extractNonceFromHtml(text);
      if (nonce) return nonce;
    }
  }

  return "";
}

async function establishAuth() {
  const jar = join(tmpdir(), `wp-jar-${Date.now()}.txt`);
  const loginUrl = `${base}/wp-login.php`;
  const bodyData = new URLSearchParams({
    log: user,
    pwd: wpPassword,
    "wp-submit": "Log In",
    redirect_to: `${base}/wp-admin/`,
    testcookie: "1",
  }).toString();
  const tmpBody = join(tmpdir(), `login-body-${Date.now()}.bin`);
  writeFileSync(tmpBody, bodyData, "utf8");

  try {
    await execFileAsync(
      "curl",
      [
        "-sS",
        "-b",
        "wordpress_test_cookie=WP+Cookie+check",
        "-c",
        jar,
        "-H",
        "Content-Type: application/x-www-form-urlencoded",
        "--data-binary",
        `@${tmpBody}`,
        "-L",
        "--max-redirs",
        "5",
        "-o",
        "/dev/null",
        loginUrl,
      ],
      { maxBuffer: 5 * 1024 * 1024 }
    );

    const jarContent = existsSync(jar) ? readFileSync(jar, "utf8") : "";
    if (!jarContent.includes("wordpress_logged_in")) {
      throw new Error("WordPress login failed — check WORDPRESS_USER and WORDPRESS_PASSWORD.");
    }

    authCookieJar = jar;
    restNonce = await fetchRestNonce(jar);
    if (!restNonce) {
      throw new Error("Could not obtain REST nonce after login.");
    }
  } finally {
    try {
      unlinkSync(tmpBody);
    } catch {
      /**/
    }
  }
}

async function parseXlsx(filePath) {
  const py = `
import zipfile, xml.etree.ElementTree as ET, json, sys
path = sys.argv[1]
ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def load_shared(z):
    shared = []
    if 'xl/sharedStrings.xml' not in z.namelist():
        return shared
    root = ET.fromstring(z.read('xl/sharedStrings.xml'))
    for si in root.findall('m:si', ns):
        texts = [t.text or '' for t in si.findall('.//m:t', ns)]
        shared.append(''.join(texts))
    return shared

def read_sheet(z, shared, name):
    root = ET.fromstring(z.read(name))
    rows = []
    for row in root.findall('m:sheetData/m:row', ns):
        vals = []
        for c in row.findall('m:c', ns):
            t = c.get('t')
            v = c.find('m:v', ns)
            if v is None:
                vals.append('')
            elif t == 's':
                vals.append(shared[int(v.text)])
            else:
                vals.append(v.text)
        rows.append(vals)
    return rows

def slug_from_url(url):
    url = (url or '').strip().rstrip('/')
    if not url.startswith('http'):
        return ''
    if '/insights/' in url:
        return url.split('/insights/')[-1].split('/')[0]
    if '/insight/' in url:
        return url.split('/insight/')[-1].split('/')[0]
    return url.rsplit('/', 1)[-1]

items = []
with zipfile.ZipFile(path) as z:
    shared = load_shared(z)
    for sheet in sorted(n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')):
        for row in read_sheet(z, shared, sheet):
            if not row or not str(row[0]).startswith('http'):
                continue
            items.append({
                'url': row[0].strip(),
                'slug': slug_from_url(row[0]),
                'focusKeyphrase': row[1].strip() if len(row) > 1 else '',
                'categories': row[2].strip() if len(row) > 2 else '',
                'seoTitle': row[3].strip() if len(row) > 3 else '',
                'metaDescription': row[4].strip() if len(row) > 4 else '',
            })

print(json.dumps(items))
`;

  const tmpPy = join(tmpdir(), `parse-xlsx-${Date.now()}.py`);
  writeFileSync(tmpPy, py, "utf8");
  try {
    const { stdout } = await execFileAsync("python3", [tmpPy, filePath], { maxBuffer: 10 * 1024 * 1024 });
    return JSON.parse(stdout);
  } finally {
    try {
      unlinkSync(tmpPy);
    } catch {
      /**/
    }
  }
}

function dedupeBySlug(items) {
  const map = new Map();
  for (const item of items) {
    if (item.slug) map.set(item.slug, item);
  }
  return [...map.values()];
}

async function findInsightIdBySlug(slug) {
  for (const status of ["publish", "draft", "pending", "private"]) {
    const { status: httpStatus, text } = await publicFetch(
      `${base}/wp-json/wp/v2/insight?slug=${encodeURIComponent(slug)}&status=${status}&per_page=1&_fields=id,slug,title`
    );
    if (httpStatus !== 200) continue;
    const posts = JSON.parse(text);
    if (Array.isArray(posts) && posts.length > 0) return posts[0];
  }

  const prefix = slug.slice(0, 50).replace(/-+$/, "");
  if (prefix.length >= 20) {
    for (let page = 1; page <= 5; page++) {
      const { status: httpStatus, text } = await publicFetch(
        `${base}/wp-json/wp/v2/insight?per_page=100&page=${page}&status=publish&_fields=id,slug,title`
      );
      if (httpStatus !== 200) break;
      const posts = JSON.parse(text);
      if (!Array.isArray(posts) || posts.length === 0) break;
      const match =
        posts.find((p) => p.slug === slug) ||
        posts.find((p) => p.slug.startsWith(prefix)) ||
        posts.find((p) => slug.startsWith(p.slug) || p.slug.startsWith(slug));
      if (match) return match;
    }
  }

  return null;
}

async function getInsightForEdit(postId) {
  const { status, text } = await wpFetch(
    `${base}/wp-json/wp/v2/insight/${postId}?context=edit&_fields=id,slug,status,title,content,excerpt,author`
  );
  if (status !== 200) throw new Error(`GET insight ${postId} → ${status}`);
  return JSON.parse(text);
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function readYoastField(html, field) {
  const m =
    html.match(new RegExp(`name="${field}"[^>]*value="([^"]*)"`, "i")) ||
    html.match(new RegExp(`id="${field}"[^>]*value="([^"]*)"`, "i"));
  return decodeHtmlEntities(m ? m[1] : "");
}

async function updateYoastViaAdmin(postId, seo) {
  const post = await getInsightForEdit(postId);
  const { text: editHtml } = await wpFetch(`${base}/wp-admin/post.php?post=${postId}&action=edit`);
  const wpnonce = (editHtml.match(/name="_wpnonce" value="([^"]+)"/) || [])[1];
  const yoastNonce = (editHtml.match(/name="yoast_free_metabox_nonce" value="([^"]+)"/) || [])[1];
  if (!wpnonce || !yoastNonce) throw new Error("Could not read admin nonces");

  const saveBody = new URLSearchParams({
    _wpnonce: wpnonce,
    _wp_http_referer: `/wp-admin/post.php?post=${postId}&action=edit`,
    user_ID: String(post.author || 1),
    action: "editpost",
    originalaction: "editpost",
    post_type: "insight",
    post_ID: String(postId),
    post_author: String(post.author || 1),
    post_status: post.status,
    post_title: post.title?.raw || post.title?.rendered || "",
    content: post.content?.raw || "",
    excerpt: post.excerpt?.raw || "",
    yoast_free_metabox_nonce: yoastNonce,
    yoast_wpseo_focuskw: seo.focusKeyphrase,
    yoast_wpseo_title: seo.seoTitle,
    yoast_wpseo_metadesc: seo.metaDescription,
    "yoast_wpseo_meta-robots-noindex": "0",
  }).toString();

  const tmp = join(tmpdir(), `save-${postId}.txt`);
  writeFileSync(tmp, saveBody, "utf8");
  try {
    const { status } = await curlRun(
      [
        "-b",
        authCookieJar,
        "-c",
        authCookieJar,
        "-H",
        "Content-Type: application/x-www-form-urlencoded",
        "--data-binary",
        `@${tmp}`,
        "-L",
        "--max-redirs",
        "5",
        "-o",
        "/dev/null",
      ],
      `${base}/wp-admin/post.php`
    );
    if (status >= 400) throw new Error(`Admin save → HTTP ${status}`);
  } finally {
    try {
      unlinkSync(tmp);
    } catch {
      /**/
    }
  }

  const { text: verifyHtml } = await wpFetch(`${base}/wp-admin/post.php?post=${postId}&action=edit`);
  const savedTitle = readYoastField(verifyHtml, "yoast_wpseo_title");
  if (savedTitle !== seo.seoTitle) {
    throw new Error(`Yoast title not saved (got "${savedTitle}")`);
  }
}

async function main() {
  console.log(`📄  Reading: ${XLSX_PATH}`);
  const rawItems = await parseXlsx(XLSX_PATH);
  const items = dedupeBySlug(rawItems);
  console.log(`📊  ${rawItems.length} rows → ${items.length} unique slugs\n`);

  if (DRY_RUN) {
    for (const item of items) {
      console.log(`• ${item.slug}`);
      console.log(`  title: ${item.seoTitle}`);
      console.log(`  desc:  ${item.metaDescription.slice(0, 90)}${item.metaDescription.length > 90 ? "…" : ""}`);
      console.log(`  kw:    ${item.focusKeyphrase}\n`);
    }
    return;
  }

  console.log("🔐  Logging in to WordPress...");
  await establishAuth();
  console.log(`✅  Connected to ${base}\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of items) {
    const label = item.seoTitle || item.slug;
    process.stdout.write(`🔧  ${label} ... `);

    const post = await findInsightIdBySlug(item.slug);
    if (!post) {
      console.log(`⚠️  not found (${item.slug})`);
      skipped++;
      continue;
    }

    try {
      await updateYoastViaAdmin(post.id, item);
      console.log(`✅  ID ${post.id}`);
      updated++;
    } catch (err) {
      console.log(`❌  ${err.message}`);
      failed++;
    }

    await new Promise((r) => setTimeout(r, 400));
  }

  console.log("\n─────────────────────────────────────");
  console.log(`✅  Updated: ${updated}`);
  if (skipped > 0) console.log(`⚠️   Skipped:  ${skipped}`);
  if (failed > 0) console.log(`❌  Failed:   ${failed}`);
  console.log("─────────────────────────────────────");
}

main().catch((err) => {
  console.error("❌  Fatal:", err);
  process.exit(1);
});
