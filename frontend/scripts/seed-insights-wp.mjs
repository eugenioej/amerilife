#!/usr/bin/env node
/**
 * Creates demo Insight posts in WordPress via the core REST API (no custom MU route required).
 * Same content as wp/mu-plugins/insights-demo-seed.json.
 *
 * Requires: insight CPT + insight_topic + insight_tag taxonomies on WordPress (amerilife-insights-cpt.php deployed).
 *
 * Usage:
 *   pnpm seed:insights:wp
 *   FORCE=1 pnpm seed:insights:wp   # delete all existing insights, then import
 *
 * Env (repo root or frontend/.env.local):
 *   WORDPRESS_URL, WORDPRESS_USER
 *   WORDPRESS_PASSWORD — preferred; logs in via wp-login.php and uses session cookies for REST
 *   WORDPRESS_APP_PASSWORD — Application Password (HTTP Basic / curl)
 *   HEADLESS_WP_APP_USER / HEADLESS_WP_APP_PASSWORD — preferred for this script when set (same as sync:wp-images); overrides WORDPRESS_* if both exist.
 */

import { execFile } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

/** Later files override earlier (monorepo root .env then frontend/.env.local). */
function loadEnvFile(envPath) {
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnvFile(join(root, "..", ".env"));
loadEnvFile(join(root, "..", ".env.local"));
loadEnvFile(join(root, ".env"));
loadEnvFile(join(root, ".env.local"));

function originFromGraphqlEndpoint() {
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
  originFromGraphqlEndpoint() ||
  "";

/** Headless sync creds win over WORDPRESS_* so repo-root .env.local can drive automation. */
const headlessUser = process.env.HEADLESS_WP_APP_USER?.trim() || "";
const wpUserOnly = process.env.WORDPRESS_USER?.trim() || "";
const user = headlessUser || wpUserOnly;

const wpPassword =
  process.env.WORDPRESS_PASSWORD?.trim() ||
  process.env.WP_PASSWORD?.trim() ||
  process.env.WORDPRESS_USER_PASSWORD?.trim() ||
  "";

const headlessAppPass =
  process.env.HEADLESS_WP_APP_PASSWORD?.replace(/\s+/g, "") || "";
const wpAppPass =
  process.env.WORDPRESS_APP_PASSWORD?.replace(/\s+/g, "") || "";
const appPass = headlessAppPass || wpAppPass;

const force = process.env.FORCE === "1" || process.argv.includes("--force");

if (headlessUser || headlessAppPass) {
  console.log(
    "Using HEADLESS_WP_APP_USER / HEADLESS_WP_APP_PASSWORD when set (overrides WORDPRESS_USER / WORDPRESS_APP_PASSWORD for this script).",
  );
}

if (!base || !user) {
  console.error(
    "Missing WORDPRESS_URL / NEXT_PUBLIC_WORDPRESS_URL / NEXT_PUBLIC_GRAPHQL_ENDPOINT origin, and HEADLESS_WP_APP_USER or WORDPRESS_USER.",
  );
  process.exit(1);
}

if (!wpPassword && !appPass) {
  console.error(
    "Set WORDPRESS_PASSWORD (wp-admin password) or WORDPRESS_APP_PASSWORD / HEADLESS_WP_APP_PASSWORD (Application Password).",
  );
  process.exit(1);
}

/** Session cookie string from wp-login.php, or empty when using Basic auth. */
let authCookie = "";
/** Set when using Application Password only. */
let basicAuthHeader = "";
/** WP REST nonce for cookie auth (POST/PATCH/DELETE). */
let restNonce = "";
/** Node fetch often fails Application Password auth when hosts strip Authorization; curl works. */
let useCurlTransport = false;

const api = `${base}/wp-json/wp/v2`;

function apiUrl(path) {
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${api}${p}`;
}

const seedPath = join(root, "wp/mu-plugins/insights-demo-seed.json");
if (!existsSync(seedPath)) {
  console.error("Missing seed file:", seedPath);
  process.exit(1);
}
const rows = JSON.parse(readFileSync(seedPath, "utf8"));

function getSetCookieLines(res) {
  if (typeof res.headers.getSetCookie === "function") {
    return res.headers.getSetCookie();
  }
  const single = res.headers.get("set-cookie");
  return single ? [single] : [];
}

function mergeCookiePairs(lines) {
  const map = new Map();
  for (const line of lines) {
    if (!line || typeof line !== "string") continue;
    const segment = line.split(";")[0].trim();
    const eq = segment.indexOf("=");
    if (eq < 1) continue;
    const name = segment.slice(0, eq);
    map.set(name, segment);
  }
  return Array.from(map.values()).join("; ");
}

/**
 * WordPress REST accepts cookie auth for the same origin (wordpress_logged_in_*).
 */
async function establishSessionWithLoginPassword(password) {
  const loginUrl = `${base}/wp-login.php`;
  const body = new URLSearchParams({
    log: user,
    pwd: password,
    "wp-submit": "Log In",
    redirect_to: `${base}/wp-admin/`,
    testcookie: "1",
  });
  const res = await fetch(loginUrl, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  let allLines = [...getSetCookieLines(res)];
  let merged = mergeCookiePairs(allLines);

  if (res.status === 302 || res.status === 301) {
    const loc = res.headers.get("location");
    if (loc) {
      const nextUrl = new URL(loc, base).href;
      const r2 = await fetch(nextUrl, {
        method: "GET",
        redirect: "manual",
        headers: { Cookie: merged },
      });
      allLines = [...allLines, ...getSetCookieLines(r2)];
      merged = mergeCookiePairs(allLines);
    }
  }

  if (res.status === 200) {
    const text = await res.text();
    if (
      /login_error|incorrect password|Invalid username|Unknown email|The password you entered/i.test(
        text,
      )
    ) {
      throw new Error(
        "WordPress login failed: check WORDPRESS_USER and WORDPRESS_PASSWORD.",
      );
    }
  }

  if (!merged.includes("wordpress_logged_in")) {
    throw new Error(
      "WordPress login did not return a session cookie. Try WORDPRESS_APP_PASSWORD (Users → Profile → Application Passwords), or disable plugins that block programmatic login.",
    );
  }

  return merged;
}

/**
 * Cookie-authenticated REST writes require X-WP-Nonce (wp_rest).
 */
async function fetchRestNonce(cookie) {
  try {
    const r = await fetch(`${base}/wp-admin/admin-ajax.php`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ action: "rest-nonce" }).toString(),
    });
    const t = (await r.text()).trim();
    if (t && t.length >= 8 && t.length < 200 && !/[<>]/.test(t) && t !== "0" && t !== "-1") {
      return t;
    }
  } catch {
    // ignore
  }
  return "";
}

async function establishAuth() {
  if (wpPassword) {
    authCookie = await establishSessionWithLoginPassword(wpPassword);
    restNonce = await fetchRestNonce(authCookie);
    if (!restNonce) {
      console.warn(
        "Could not load REST nonce via admin-ajax (rest-nonce). POST/PATCH may fail; if so, set WORDPRESS_APP_PASSWORD or check security plugins.",
      );
    } else {
      console.log("Loaded REST nonce for cookie session (X-WP-Nonce).");
    }
    console.log(
      "Authenticated with WORDPRESS_PASSWORD (session cookie; same as logging in to wp-admin).",
    );
    return;
  }
  basicAuthHeader = `Basic ${Buffer.from(`${user}:${appPass}`, "utf8").toString("base64")}`;
  const appSource = headlessAppPass ? "HEADLESS_WP_APP_PASSWORD" : "WORDPRESS_APP_PASSWORD";
  console.log(
    `Authenticated with ${appSource} (HTTP Basic; will try curl if fetch is rejected by the host).`,
  );
}

/**
 * Run curl with -u user:app_password; response body written to a temp file, HTTP code on stdout.
 */
async function curlHttp(url, curlArgs) {
  const tmpOut = join(
    tmpdir(),
    `curl-${Date.now()}-${Math.random().toString(36).slice(2)}.out`,
  );
  const args = [
    "-sS",
    "-u",
    `${user}:${appPass}`,
    ...curlArgs,
    "-o",
    tmpOut,
    "-w",
    "%{http_code}",
    url,
  ];
  try {
    const { stdout } = await execFileAsync("curl", args, { maxBuffer: 1e6 });
    const status = parseInt(String(stdout).trim(), 10);
    const text = readFileSync(tmpOut, "utf8");
    return { status, text };
  } finally {
    try {
      unlinkSync(tmpOut);
    } catch {
      // ignore
    }
  }
}

async function curlProbeUsersMe() {
  try {
    const { status, text } = await curlHttp(apiUrl("/users/me"), []);
    if (status !== 200) return false;
    const j = JSON.parse(text);
    return Boolean(j?.id);
  } catch {
    return false;
  }
}

function wrapCurlResponse(status, text) {
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  const res = {
    ok: status >= 200 && status < 300,
    status,
  };
  return { res, data };
}

async function wpFetchCurl(path, opts = {}) {
  const url = apiUrl(path);
  const method = opts.method || "GET";
  const extra = [];
  if (method !== "GET") {
    extra.push("-X", method);
  }

  const hdrs = { ...(opts.headers || {}) };
  let tmpIn = null;

  if (opts.body !== undefined && opts.body !== null) {
    if (Buffer.isBuffer(opts.body)) {
      tmpIn = join(
        tmpdir(),
        `up-${Date.now()}-${Math.random().toString(36).slice(2)}.bin`,
      );
      writeFileSync(tmpIn, opts.body);
      extra.push(
        "-H",
        `Content-Type: ${hdrs["Content-Type"] || "application/octet-stream"}`,
      );
      if (hdrs["Content-Disposition"]) {
        extra.push("-H", `Content-Disposition: ${hdrs["Content-Disposition"]}`);
      }
      extra.push("--data-binary", `@${tmpIn}`);
    } else {
      tmpIn = join(
        tmpdir(),
        `body-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
      );
      writeFileSync(tmpIn, String(opts.body));
      extra.push("-H", "Content-Type: application/json");
      extra.push("--data-binary", `@${tmpIn}`);
    }
  }

  try {
    const { status, text } = await curlHttp(url, extra);
    return wrapCurlResponse(status, text);
  } finally {
    if (tmpIn) {
      try {
        unlinkSync(tmpIn);
      } catch {
        // ignore
      }
    }
  }
}

async function wpFetchFetch(path, opts = {}) {
  const url = apiUrl(path);
  const headers = { ...(opts.headers || {}) };
  if (authCookie) {
    headers.Cookie = authCookie;
    if (restNonce) {
      headers["X-WP-Nonce"] = restNonce;
    }
  } else if (basicAuthHeader) {
    headers.Authorization = basicAuthHeader;
  }
  const res = await fetch(url, {
    ...opts,
    headers,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  return { res, data };
}

/**
 * Validates REST auth. Cookie sessions use GET /users/me (reliable).
 * Application Password: some hosts (e.g. WP Engine) return rest_not_logged_in for GET /users/me
 * even when Basic auth is valid for writes — so we only hard-fail when cookie auth breaks.
 */
async function ensureRestAuthWorks() {
  const first = await wpFetchFetch("/users/me");
  if (first.res.ok && first.data?.id) {
    return;
  }

  if (
    first.data?.code === "rest_not_logged_in" &&
    basicAuthHeader &&
    !authCookie &&
    user &&
    appPass
  ) {
    const ok = await curlProbeUsersMe();
    if (ok) {
      useCurlTransport = true;
      console.log(
        "Using curl for WordPress REST (Node fetch did not authenticate; curl works with Application Password on this host).",
      );
      const second = await wpFetchCurl("/users/me");
      if (second.res.ok && second.data?.id) {
        return;
      }
    }
    console.warn(
      "GET /wp/v2/users/me returned rest_not_logged_in for Application Password auth. Some hosts never authenticate this endpoint with app passwords, even when POST works. Continuing — if credentials are wrong, the first insight create will fail.",
    );
    return;
  }

  console.error(
    "Authentication failed for GET /wp/v2/users/me:",
    first.res.status,
    first.data,
  );
  if (first.data?.code === "rest_not_logged_in") {
    console.error(`
WordPress did not accept your credentials for the REST API.

• With WORDPRESS_APP_PASSWORD: Node fetch often fails when the host strips Authorization; this script then tries curl (install curl if missing).

• Or add WORDPRESS_PASSWORD (your normal wp-admin password) so the script can log in via wp-login.php (cookies + REST nonce).

• WORDPRESS_USER must be your WordPress login, case-sensitive.

• Confirm the Application Password was created while logged in as an Administrator.
`);
  } else {
    console.error(
      "Check WORDPRESS_USER and WORDPRESS_PASSWORD (or WORDPRESS_APP_PASSWORD).",
    );
  }
  process.exit(1);
}

async function wpFetch(path, opts = {}) {
  if (useCurlTransport) {
    return wpFetchCurl(path, opts);
  }
  return wpFetchFetch(path, opts);
}

/** WordPress core REST collection for the insight CPT (rest base = "insight"). */
const INSIGHTS_PATH = "/insight";

function printPermissionHelp() {
  console.error(`
Permission denied (rest_cannot_create / upload).

The WordPress user must be able to create Insights (capability_type post) and upload media — typically Administrator or Editor, not a media-only or subscriber role.

Check:
• HEADLESS_WP_APP_USER / WORDPRESS_USER is the correct login (case-sensitive).
• With WORDPRESS_PASSWORD: use the same password you use for wp-admin (not an Application Password).
• Or use HEADLESS_WP_APP_PASSWORD / WORDPRESS_APP_PASSWORD from Users → Profile → Application Passwords (not your login password).

Log in to ${base}/wp-admin/ as an Administrator, open Users → the account you use for seeding, and set the role to Editor (or Author if that is enough for your site). Then run the seed again.
`);
}

function exitIfPermissionDenied(data, context) {
  const code = data?.code;
  if (
    code === "rest_cannot_create" ||
    code === "rest_cannot_edit" ||
    code === "rest_cannot_upload_file" ||
    code === "rest_forbidden" ||
    code === "rest_cookie_invalid_nonce"
  ) {
    console.error(`\n${context}`);
    printPermissionHelp();
    process.exit(1);
  }
}

async function verifyAuthAndRoles() {
  const { res, data } = await wpFetch("/users/me");
  if (!res.ok || !data?.id) {
    if (basicAuthHeader && !authCookie && data?.code === "rest_not_logged_in") {
      console.warn(
        "Skipping REST user/role check: GET /users/me is not available for Application Password auth on this host. If the account cannot create posts, the import will fail with rest_cannot_create (grant Editor/Author or use an Administrator Application Password).",
      );
      return;
    }
    console.error("Unexpected: GET /users/me failed after auth probe:", res.status, data);
    process.exit(1);
  }
  const roles = Array.isArray(data.roles) ? data.roles : [];
  console.log(
    `REST authenticated as: ${data.name ?? "?"} (@${data.slug ?? "?"}) — roles: ${roles.join(", ") || "(none)"}`,
  );
  const okRole =
    roles.includes("administrator") ||
    roles.includes("editor") ||
    roles.includes("author");
  if (roles.length > 0 && !okRole) {
    console.error(
      "\nThis WordPress user does not look like an Administrator, Editor, or Author.",
    );
    printPermissionHelp();
    process.exit(1);
  }
  if (roles.length === 0) {
    console.log(
      "(Roles not exposed by REST; if the next step fails with permission errors, use an Administrator account.)",
    );
  }
}

async function checkInsightEndpoint() {
  const { res, data } = await wpFetch(`${INSIGHTS_PATH}?per_page=1`);
  if (res.status === 404) {
    console.error(
      "WordPress returned 404 for /wp-json/wp/v2/insight — the Insight post type is not registered on this site.",
    );
    console.error(
      "Deploy frontend/wp/mu-plugins/amerilife-insights-cpt.php (and insights-demo-seed.json) to WordPress mu-plugins, then try again.",
    );
    process.exit(1);
  }
  if (!res.ok) {
    console.error("Could not reach Insights REST endpoint:", res.status, data);
    process.exit(1);
  }
}

async function getInsightTagTermId(tagSlug) {
  const { res, data } = await wpFetch(
    `/insight_tag?slug=${encodeURIComponent(tagSlug)}`,
  );
  if (!res.ok || !Array.isArray(data) || data.length === 0) {
    return null;
  }
  return data[0].id;
}

async function getTermId(topicSlug) {
  const { res, data } = await wpFetch(
    `/insight_topic?slug=${encodeURIComponent(topicSlug)}`,
  );
  if (!res.ok || !Array.isArray(data) || data.length === 0) {
    return null;
  }
  return data[0].id;
}

async function findInsightIdBySlug(slug) {
  const { res, data } = await wpFetch(
    `${INSIGHTS_PATH}?slug=${encodeURIComponent(slug)}&_fields=id`,
  );
  if (!res.ok || !Array.isArray(data)) return null;
  return data[0]?.id ?? null;
}

async function deleteAllInsights() {
  let page = 1;
  let total = 0;
  for (;;) {
    const { res, data } = await wpFetch(
      `${INSIGHTS_PATH}?per_page=100&page=${page}&_fields=id`,
    );
    if (!res.ok) {
      console.error("Failed to list insights for delete:", res.status, data);
      process.exit(1);
    }
    if (!Array.isArray(data) || data.length === 0) break;
    for (const row of data) {
      const del = await wpFetch(`${INSIGHTS_PATH}/${row.id}?force=true`, {
        method: "DELETE",
      });
      if (!del.res.ok) {
        console.error("Failed to delete insight", row.id, del.data);
        process.exit(1);
      }
      total++;
    }
    if (data.length < 100) break;
    page++;
  }
  if (total) console.log(`Deleted ${total} existing insight(s).`);
}

async function uploadMediaFromUrl(imageUrl, title) {
  const imgRes = await fetch(imageUrl, { redirect: "follow" });
  if (!imgRes.ok) {
    console.error("  (skip featured image: could not download)", imageUrl);
    return null;
  }
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const ct =
    imgRes.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
  const ext =
    ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : "jpg";
  const filename = `insight-${title.slice(0, 24).replace(/\W+/g, "-")}.${ext}`;

  const { res, data } = await wpFetch("/media", {
    method: "POST",
    headers: {
      "Content-Type": ct,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
    body: buf,
  });
  if (!res.ok) {
    exitIfPermissionDenied(data, "Media upload");
    console.error("  (skip featured image: media upload failed)", data);
    return null;
  }
  return data.id;
}

function wpDateFromSeed(dateStr) {
  const t = dateStr.trim();
  if (t.includes("T")) return t;
  return t.replace(" ", "T");
}

async function createInsight(row) {
  const termId = await getTermId(row.topic);
  let featuredId = null;
  if (row.featured_image_url) {
    featuredId = await uploadMediaFromUrl(
      row.featured_image_url,
      row.slug || row.title,
    );
  }

  const body = {
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    slug: row.slug,
    status: "publish",
    date: wpDateFromSeed(row.date),
  };
  if (termId) {
    body.insight_topic = [termId];
  }
  if (Array.isArray(row.tags) && row.tags.length > 0) {
    const tagIds = [];
    for (const tagSlug of row.tags) {
      const tid = await getInsightTagTermId(String(tagSlug));
      if (tid != null) tagIds.push(tid);
    }
    if (tagIds.length > 0) {
      body.insight_tag = tagIds;
    }
  }
  if (featuredId) {
    body.featured_media = featuredId;
  }

  const { res, data } = await wpFetch(INSIGHTS_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    exitIfPermissionDenied(data, `Create insight "${row.slug}"`);
    console.error("Failed to create insight:", row.slug, res.status, data);
    return false;
  }

  const id = data.id;
  if (id != null) {
    const patch = await wpFetch(`${INSIGHTS_PATH}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meta: {
            is_spotlight: Boolean(row.spotlight),
            is_featured:
              Array.isArray(row.tags) &&
              row.tags.some((t) => String(t).toLowerCase() === "featured"),
          },
        }),
    });
    if (!patch.res.ok) {
      console.error(
        "  (warning: could not set is_spotlight meta)",
        patch.res.status,
        patch.data,
      );
    }
  }

  return true;
}

async function main() {
  await establishAuth();
  await ensureRestAuthWorks();
  await checkInsightEndpoint();
  await verifyAuthAndRoles();

  if (force) {
    await deleteAllInsights();
  }

  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    if (!force) {
      const existing = await findInsightIdBySlug(row.slug);
      if (existing) {
        console.log("Skip (exists):", row.slug);
        skipped++;
        continue;
      }
    }
    process.stdout.write(`Create: ${row.slug} ... `);
    const ok = await createInsight(row);
    if (ok) {
      console.log("ok");
      created++;
    } else {
      console.log("FAILED");
    }
  }

  console.log(
    JSON.stringify(
      { ok: true, created, skipped, force: Boolean(force) },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
