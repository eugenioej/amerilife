#!/usr/bin/env node
/**
 * upload-new-articles.mjs
 *
 * Lee new-articles-seed.json, sube cada imagen local a WP Media,
 * y crea los posts en el CPT "insight" con status: publish.
 *
 * Usa cookie auth (wp-login.php) — igual que seed-insights-wp.mjs —
 * porque WP Engine bloquea Authorization headers (Application Password).
 *
 * Usage:
 *   node scripts/upload-new-articles.mjs
 *   node scripts/upload-new-articles.mjs --dry-run    # imprime posts sin subir
 *   node scripts/upload-new-articles.mjs --only=3     # sube solo el artículo #3
 *   node scripts/upload-new-articles.mjs --update-seo  # actualiza Yoast SEO en insights existentes
 *
 * Env (frontend/.env.local o raíz .env.local):
 *   WORDPRESS_URL o NEXT_PUBLIC_WORDPRESS_URL
 *   WORDPRESS_PASSWORD   — contraseña de wp-admin (preferida; login vía cookie)
 *   HEADLESS_WP_APP_USER + HEADLESS_WP_APP_PASSWORD  — fallback Application Password vía curl
 *   o WORDPRESS_USER + WORDPRESS_APP_PASSWORD
 */

import { execFile } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename, dirname } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ─── Cargar .env ──────────────────────────────────────────────────────────────

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
    process.env[key] = val;
  }
}
// Orden: raíz primero, luego frontend/ (frontend sobrescribe)
loadEnv(join(ROOT, "..", ".env"));
loadEnv(join(ROOT, "..", ".env.local"));
loadEnv(join(ROOT, ".env"));
loadEnv(join(ROOT, ".env.local"));

// ─── Config ───────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes("--dry-run");
const UPDATE_SEO = process.argv.includes("--update-seo");
const FORCE = process.env.FORCE === "1";
const ONLY_IDX = (() => {
  const arg = process.argv.find((a) => a.startsWith("--only="));
  return arg ? parseInt(arg.split("=")[1], 10) - 1 : null;
})();
// --from=N  --to=M  (1-based, inclusive) — process a range of articles
const FROM_IDX = (() => {
  const arg = process.argv.find((a) => a.startsWith("--from="));
  return arg ? parseInt(arg.split("=")[1], 10) - 1 : null;
})();
const TO_IDX = (() => {
  const arg = process.argv.find((a) => a.startsWith("--to="));
  return arg ? parseInt(arg.split("=")[1], 10) - 1 : null;
})();

const SEED_FILE = join(ROOT, "scripts", "new-articles-seed.json");

function originFromGraphql() {
  const g = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  if (!g) return "";
  try { return new URL(g).origin.replace(/\/$/, ""); } catch { return ""; }
}

const base =
  process.env.WORDPRESS_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "") ||
  originFromGraphql() ||
  "";

if (!base) {
  console.error("❌  Falta WORDPRESS_URL o NEXT_PUBLIC_WORDPRESS_URL en .env.local");
  process.exit(1);
}

const user =
  process.env.HEADLESS_WP_APP_USER?.trim() ||
  process.env.WORDPRESS_USER?.trim() ||
  "";

const wpPassword =
  process.env.WORDPRESS_PASSWORD?.trim() ||
  process.env.WP_PASSWORD?.trim() ||
  "";

const appPass =
  (process.env.HEADLESS_WP_APP_PASSWORD?.replace(/\s+/g, "")) ||
  (process.env.WORDPRESS_APP_PASSWORD?.replace(/\s+/g, "")) ||
  "";

if (!user) {
  console.error("❌  Falta WORDPRESS_USER o HEADLESS_WP_APP_USER en .env.local");
  process.exit(1);
}

if (!wpPassword && !appPass) {
  console.error("❌  Faltan credenciales en .env.local:");
  console.error("    WORDPRESS_PASSWORD   ← contraseña de wp-admin (recomendado para WP Engine)");
  console.error("    o HEADLESS_WP_APP_PASSWORD / WORDPRESS_APP_PASSWORD");
  process.exit(1);
}

const api = `${base}/wp-json/wp/v2`;

// ─── Auth state ───────────────────────────────────────────────────────────────

let authCookieJar = ""; // path to curl cookie-jar file (cookie auth)
let restNonce = "";
let useCurlTransport = false; // fallback: Application Password via curl -u

// ─── curl helper ──────────────────────────────────────────────────────────────

async function curlRun(extraArgs, url) {
  const tmpOut = join(tmpdir(), `curl-${Date.now()}-${Math.random().toString(36).slice(2)}.out`);
  const args = ["-sS", ...extraArgs, "-o", tmpOut, "-w", "%{http_code}", url];
  try {
    const { stdout } = await execFileAsync("curl", args, { maxBuffer: 20 * 1024 * 1024 });
    const status = parseInt(String(stdout).trim(), 10);
    const text = existsSync(tmpOut) ? readFileSync(tmpOut, "utf8") : "";
    return { status, text };
  } finally {
    try { unlinkSync(tmpOut); } catch { /**/ }
  }
}

// ─── Session cookie auth (wp-login.php via curl) ──────────────────────────────

async function loginWithPassword(password) {
  const jar = join(tmpdir(), `wp-jar-${Date.now()}.txt`);
  const loginUrl = `${base}/wp-login.php`;

  // Write POST body to temp file — avoids shell-escaping issues with special chars
  const bodyData = new URLSearchParams({
    log: user,
    pwd: password,
    "wp-submit": "Log In",
    redirect_to: `${base}/wp-admin/`,
    testcookie: "1",
  }).toString();
  const tmpBody = join(tmpdir(), `login-body-${Date.now()}.bin`);
  const tmpOut  = join(tmpdir(), `login-out-${Date.now()}.html`);
  writeFileSync(tmpBody, bodyData, "utf8");

  try {
    await execFileAsync("curl", [
      "-sS",
      "-b", "wordpress_test_cookie=WP+Cookie+check", // preflight cookie WP requires
      "-c", jar,                                      // save session cookies here
      "-H", "Content-Type: application/x-www-form-urlencoded",
      "--data-binary", `@${tmpBody}`,
      "-L", "--max-redirs", "5",                      // follow redirect to /wp-admin/
      "-o", tmpOut,
      loginUrl,
    ], { maxBuffer: 5 * 1024 * 1024 });

    const jarContent = existsSync(jar) ? readFileSync(jar, "utf8") : "";
    if (!jarContent.includes("wordpress_logged_in")) {
      const html = existsSync(tmpOut) ? readFileSync(tmpOut, "utf8") : "";
      if (/login_error|incorrect.password|Invalid.username|Unknown.email/i.test(html)) {
        throw new Error("WordPress login failed — verifica WORDPRESS_USER y WORDPRESS_PASSWORD.");
      }
      throw new Error(`Login no devolvió cookie de sesión.\n   Respuesta (100 chars): ${html.slice(0, 100)}`);
    }

    return jar; // caller uses this path for all subsequent curl -b/-c calls
  } finally {
    try { unlinkSync(tmpBody); } catch { /**/ }
    try { unlinkSync(tmpOut);  } catch { /**/ }
    // NOTE: do NOT delete `jar` — it's used for every subsequent request
  }
}

/** Extract the wp_rest nonce from a WordPress admin page HTML string.
 *  wpApiSettings = {"root":"...","nonce":"XXXXXXXXXX","versionString":"wp\/v2\/"} */
function extractNonceFromHtml(html) {
  // Most specific: nonce appears right before versionString inside wpApiSettings
  let m = html.match(/"nonce"\s*:\s*"([^"]{6,30})"[^}]{0,80}"versionString"/);
  if (m) return m[1];
  // Specific: var wpApiSettings = { ... "nonce": "..." ... }
  m = html.match(/wpApiSettings\s*=\s*\{[^}]{0,300}"nonce"\s*:\s*"([^"]{6,30})"/);
  if (m) return m[1];
  // apiFetch nonce middleware call (newer WP block editor)
  m = html.match(/createNonceMiddleware\s*\(\s*["']([^"']{6,30})["']\s*\)/);
  if (m) return m[1];
  return null;
}

async function fetchRestNonce(jar) {
  // Method 1: admin-ajax.php action=rest-nonce (available in some WP installs)
  {
    const tmpBody = join(tmpdir(), `nonce-body-${Date.now()}.bin`);
    writeFileSync(tmpBody, "action=rest-nonce", "utf8");
    try {
      const { status, text } = await curlRun([
        "-b", jar, "-c", jar,
        "-H", "Content-Type: application/x-www-form-urlencoded",
        "--data-binary", `@${tmpBody}`,
      ], `${base}/wp-admin/admin-ajax.php`);
      const t = text.trim();
      if (status === 200 && t && t.length >= 6 && t.length < 200 && !/[<>]/.test(t) && t !== "0" && t !== "-1") {
        console.log(`   🔑  Nonce obtenido vía admin-ajax: ${t}`);
        return t;
      }
      console.log(`   ℹ️   admin-ajax nonce → status=${status} resp="${t.slice(0, 30)}"`);
    } catch (e) {
      console.log(`   ℹ️   admin-ajax nonce → error: ${e.message}`);
    } finally {
      try { unlinkSync(tmpBody); } catch { /**/ }
    }
  }

  // Method 2: heartbeat AJAX → returns rest_nonce in JSON response
  {
    const tmpBody = join(tmpdir(), `hb-body-${Date.now()}.bin`);
    writeFileSync(tmpBody, "action=heartbeat&has_focus=1&interval=15", "utf8");
    try {
      const { status, text } = await curlRun([
        "-b", jar, "-c", jar,
        "-H", "Content-Type: application/x-www-form-urlencoded",
        "--data-binary", `@${tmpBody}`,
      ], `${base}/wp-admin/admin-ajax.php`);
      if (status === 200) {
        const data = JSON.parse(text);
        if (data?.rest_nonce && data.rest_nonce.length >= 6) {
          console.log(`   🔑  Nonce obtenido vía heartbeat: ${data.rest_nonce}`);
          return data.rest_nonce;
        }
      }
    } catch { /**/ } finally {
      try { unlinkSync(tmpBody); } catch { /**/ }
    }
  }

  // Method 3: parse nonce from wp-admin/post-new.php (always has block editor + wpApiSettings)
  //           Use cache-busting to avoid stale cached pages
  for (const path of [`/wp-admin/post-new.php`, `/wp-admin/`]) {
    try {
      const { status, text } = await curlRun([
        "-b", jar, "-c", jar,
        "-H", "Cache-Control: no-cache",
        "-H", "Pragma: no-cache",
      ], `${base}${path}?nc=${Date.now()}`);
      if (status === 200) {
        const nonce = extractNonceFromHtml(text);
        if (nonce) {
          console.log(`   🔑  Nonce extraído de ${path} HTML: ${nonce}`);
          return nonce;
        }
        console.log(`   ℹ️   ${path} HTML no contiene nonce reconocible`);
      } else {
        console.log(`   ℹ️   ${path} → status=${status}`);
      }
    } catch (e) {
      console.log(`   ℹ️   ${path} nonce → error: ${e.message}`);
    }
  }

  console.warn("   ⚠️   No se pudo obtener REST nonce — los writes pueden fallar");
  return "";
}

// ─── Fallback: Application Password via curl -u ───────────────────────────────

async function curlProbeUsersMe() {
  try {
    const { status, text } = await curlRun(["-u", `${user}:${appPass}`], `${api}/users/me`);
    if (status !== 200) return false;
    return Boolean(JSON.parse(text)?.id);
  } catch { return false; }
}

// ─── Inicializar auth ──────────────────────────────────────────────────────────

async function establishAuth() {
  if (wpPassword) {
    console.log("🔐  Autenticando con WORDPRESS_PASSWORD vía curl (cookie jar)...");
    authCookieJar = await loginWithPassword(wpPassword);
    restNonce = await fetchRestNonce(authCookieJar);
    if (restNonce) {
      console.log("   ✅  Sesión establecida + REST nonce OK\n");
    } else {
      console.warn("   ⚠️   Sin REST nonce — algunos writes pueden fallar\n");
    }
    return;
  }

  // Fallback: Application Password vía curl
  console.log("🔐  Probando Application Password vía curl...");
  const ok = await curlProbeUsersMe();
  if (ok) {
    useCurlTransport = true;
    console.log("   ✅  Application Password OK (curl)\n");
  } else {
    console.warn("   ⚠️   Application Password no autenticó — WP Engine puede estar bloqueando Authorization.");
    console.warn("   💡  Agrega WORDPRESS_PASSWORD a .env.local para usar cookie auth.\n");
  }
}

// ─── wpFetch: todas las llamadas REST usan curl ───────────────────────────────

async function wpFetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${api}${path.startsWith("/") ? "" : "/"}${path}`;
  const method = opts.method || "GET";
  const extra = [];

  if (method !== "GET") extra.push("-X", method);

  // Auth
  if (authCookieJar) {
    extra.push("-b", authCookieJar, "-c", authCookieJar);
    // Only send nonce for write operations — sending an invalid nonce on GETs causes 403
    if (restNonce && method !== "GET") extra.push("-H", `X-WP-Nonce: ${restNonce}`);
  } else if (useCurlTransport) {
    extra.push("-u", `${user}:${appPass}`);
  }

  // Body
  let tmpIn = null;
  if (opts.body !== undefined && opts.body !== null) {
    tmpIn = join(tmpdir(), `body-${Date.now()}.bin`);
    if (Buffer.isBuffer(opts.body)) {
      writeFileSync(tmpIn, opts.body);
      extra.push("-H", `Content-Type: ${opts.contentType || "application/octet-stream"}`);
      if (opts.contentDisposition) extra.push("-H", `Content-Disposition: ${opts.contentDisposition}`);
    } else {
      writeFileSync(tmpIn, String(opts.body), "utf8");
      extra.push("-H", "Content-Type: application/json");
    }
    extra.push("--data-binary", `@${tmpIn}`);
  }

  try {
    const { status, text } = await curlRun(extra, url);
    return { ok: status >= 200 && status < 300, status, text };
  } finally {
    if (tmpIn) { try { unlinkSync(tmpIn); } catch { /**/ } }
  }
}

// ─── Helpers REST ─────────────────────────────────────────────────────────────

async function wpGet(path) {
  const { ok, status, text } = await wpFetch(path);
  if (!ok) throw new Error(`GET ${path} → ${status} ${text?.slice(0, 300)}`);
  return JSON.parse(text);
}

async function wpPost(path, body) {
  const bodyStr = typeof body === "string" ? body : JSON.stringify(body);
  const { ok, status, text } = await wpFetch(path, { method: "POST", body: bodyStr });
  if (!ok) throw new Error(`POST ${path} → ${status} ${text?.slice(0, 500)}`);
  return JSON.parse(text);
}

async function wpPatch(path, body) {
  const bodyStr = typeof body === "string" ? body : JSON.stringify(body);
  const { ok, status, text } = await wpFetch(path, { method: "PATCH", body: bodyStr });
  if (!ok) throw new Error(`PATCH ${path} → ${status} ${text?.slice(0, 500)}`);
  return JSON.parse(text);
}

function buildYoastMeta(article) {
  const seo = article.seo || {};
  const meta = {};
  if (seo.seoTitle?.trim()) meta._yoast_wpseo_title = seo.seoTitle.trim();
  if (seo.metaDescription?.trim()) meta._yoast_wpseo_metadesc = seo.metaDescription.trim();
  if (seo.focusKeyphrase?.trim()) meta._yoast_wpseo_focuskw = seo.focusKeyphrase.trim();
  return meta;
}

async function bulkUpdateInsightSeo(articles) {
  const items = articles
    .map((article) => {
      const yoastMeta = buildYoastMeta(article);
      if (Object.keys(yoastMeta).length === 0) return null;
      return {
        slug: article.slug,
        seoTitle: yoastMeta._yoast_wpseo_title,
        metaDescription: yoastMeta._yoast_wpseo_metadesc,
        focusKeyphrase: yoastMeta._yoast_wpseo_focuskw,
      };
    })
    .filter(Boolean);

  if (items.length === 0) return null;

  const { ok, status, text } = await wpFetch(`${base}/wp-json/amerilife/v1/insights-seo`, {
    method: "POST",
    body: JSON.stringify({ items }),
  });

  if (!ok) {
    if (status === 404) return null;
    throw new Error(`Bulk SEO → ${status} ${text?.slice(0, 300)}`);
  }

  return JSON.parse(text);
}

async function findInsightBySlug(slug) {
  for (const status of ["publish", "draft", "pending", "private"]) {
    const posts = await wpGet(`/insight?slug=${encodeURIComponent(slug)}&status=${status}&per_page=1`);
    if (Array.isArray(posts) && posts.length > 0) return posts[0];
  }
  return null;
}

async function wpDelete(path) {
  const { ok, status, text } = await wpFetch(path, { method: "DELETE" });
  if (!ok) throw new Error(`DELETE ${path} → ${status} ${text?.slice(0, 300)}`);
}

// ─── Subir imagen a WP Media ─────────────────────────────────────────────────

async function uploadMedia(localPath) {
  if (!existsSync(localPath)) throw new Error(`Imagen no encontrada: ${localPath}`);
  const filename = basename(localPath);
  const imageBytes = readFileSync(localPath);

  const { ok, status, text } = await wpFetch("/media", {
    method: "POST",
    body: imageBytes,
    contentType: "image/jpeg",
    contentDisposition: `attachment; filename="${filename}"`,
  });

  if (!ok) throw new Error(`Media upload → ${status} ${text?.slice(0, 500)}`);
  return JSON.parse(text).id;
}

// ─── Taxonomy terms ───────────────────────────────────────────────────────────

const termCache = {};

async function ensureTerm(taxonomy, name) {
  const key = `${taxonomy}::${name}`;
  if (termCache[key]) return termCache[key];

  const existing = await wpGet(`/${taxonomy}?search=${encodeURIComponent(name)}&per_page=5`);
  const found = Array.isArray(existing)
    ? existing.find((t) => t.name.toLowerCase() === name.toLowerCase())
    : null;

  if (found) { termCache[key] = found.id; return found.id; }

  const created = await wpPost(`/${taxonomy}`, {
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  });
  termCache[key] = created.id;
  return created.id;
}

// ─── Borrar insights existentes (FORCE) ──────────────────────────────────────

async function wipeAllInsights() {
  console.log("🗑️   FORCE=1 — borrando insights existentes...");
  let page = 1, deleted = 0;
  while (true) {
    let posts;
    try { posts = await wpGet(`/insight?per_page=100&page=${page}&status=any`); }
    catch { break; }
    if (!Array.isArray(posts) || !posts.length) break;
    for (const p of posts) { await wpDelete(`/insight/${p.id}?force=true`); deleted++; }
    page++;
  }
  console.log(`   ✅  ${deleted} insights borrados\n`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(SEED_FILE)) {
    console.error(`❌  No encontré ${SEED_FILE}`);
    console.error(`    Primero corre: node scripts/prepare-new-articles.mjs`);
    process.exit(1);
  }

  const articles = JSON.parse(readFileSync(SEED_FILE, "utf8"));

  if (DRY_RUN) {
    console.log(`🔎  DRY RUN — ${articles.length} artículos en seed:`);
    articles.forEach((a, i) =>
      console.log(`  ${i + 1}. [${a.topic}] ${a.title} → ${a.date} | ${basename(a._image_local_path || "")}`)
    );
    return;
  }

  // Autenticar
  await establishAuth();

  // Verificar conexión WP
  console.log(`🔗  Conectando con WordPress: ${base}`);
  try {
    const info = await wpGet("/types/insight");
    console.log(`✅  WordPress OK — CPT "insight": ${info.name}\n`);
  } catch (err) {
    console.error(`❌  No puedo conectar con WordPress:\n   ${err.message}`);
    process.exit(1);
  }

  if (FORCE) await wipeAllInsights();

  if (UPDATE_SEO) {
    let updated = 0;
    let skipped = 0;
    let failed = 0;

    let seoArticles = articles;
    if (FROM_IDX !== null) {
      const end = TO_IDX !== null ? TO_IDX + 1 : articles.length;
      seoArticles = articles.slice(FROM_IDX, end);
    } else if (ONLY_IDX !== null) {
      seoArticles = [articles[ONLY_IDX]];
    }

    console.log(`📝  Actualizando Yoast SEO en ${seoArticles.length} insights...\n`);

    const bulkResult = await bulkUpdateInsightSeo(seoArticles);
    if (bulkResult) {
      console.log(`✅  Bulk endpoint: ${bulkResult.updated} actualizados, ${bulkResult.skipped} omitidos`);
      if (bulkResult.errors?.length) {
        console.log(`⚠️   Errores (${bulkResult.errors.length}):`);
        bulkResult.errors.slice(0, 10).forEach((e) => console.log(`   - ${e.slug}: ${e.error}`));
      }
      return;
    }

    console.log("ℹ️   Bulk endpoint no disponible — usando PATCH por post\n");

    for (const article of seoArticles) {
      const yoastMeta = buildYoastMeta(article);
      if (Object.keys(yoastMeta).length === 0) {
        console.log(`⏭️   ${article.title} — sin datos SEO en seed`);
        skipped++;
        continue;
      }

      const slugCandidates = [article.slug, article.seo?.pageSlug].filter(Boolean);
      let existing = null;
      for (const slug of slugCandidates) {
        existing = await findInsightBySlug(slug);
        if (existing) break;
      }

      if (!existing) {
        console.log(`⚠️   No encontrado en WP: ${article.title} (${slugCandidates.join(" | ")})`);
        skipped++;
        continue;
      }

      try {
        process.stdout.write(`   🔧  ${existing.slug} (ID ${existing.id})... `);
        await wpPatch(`/insight/${existing.id}`, { meta: yoastMeta });
        console.log("✅ (rest-meta)");
        console.log(
          `      title: ${yoastMeta._yoast_wpseo_title || "(sin cambio)"}\n      desc:  ${(yoastMeta._yoast_wpseo_metadesc || "").slice(0, 80)}\n      kw:    ${yoastMeta._yoast_wpseo_focuskw || "(sin cambio)"}`
        );
        updated++;
      } catch (err) {
        console.log(`❌  ${err.message}`);
        failed++;
      }

      await new Promise((r) => setTimeout(r, 300));
    }

    console.log(`\n─────────────────────────────────────`);
    console.log(`✅  SEO actualizados: ${updated}`);
    if (skipped > 0) console.log(`⏭️   Omitidos:         ${skipped}`);
    if (failed > 0) console.log(`❌  Fallidos:         ${failed}`);
    console.log(`─────────────────────────────────────`);
    return;
  }

  let toProcess, startIdx;
  if (ONLY_IDX !== null) {
    toProcess = [articles[ONLY_IDX]];
    startIdx = ONLY_IDX;
  } else if (FROM_IDX !== null) {
    const end = TO_IDX !== null ? TO_IDX + 1 : articles.length;
    toProcess = articles.slice(FROM_IDX, end);
    startIdx = FROM_IDX;
  } else {
    toProcess = articles;
    startIdx = 0;
  }

  let uploaded = 0, failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const article = toProcess[i];
    const idx = startIdx + i + 1;
    console.log(`\n[${idx}/${articles.length}] ${article.title}`);
    console.log(`   topic: ${article.topic} | date: ${article.date} | spotlight: ${article.spotlight}`);

    // 1. Subir imagen
    let featuredMediaId = null;
    if (article._image_local_path && existsSync(article._image_local_path)) {
      try {
        process.stdout.write(`   📤  Subiendo imagen ${basename(article._image_local_path)}... `);
        featuredMediaId = await uploadMedia(article._image_local_path);
        console.log(`✅  ID: ${featuredMediaId}`);
      } catch (err) {
        console.log(`❌  ${err.message}`);
        console.log(`   ⚠️   Continuando sin imagen featured`);
      }
    }

    // 2. Taxonomy terms
    let topicId = null, tagIds = [];
    try {
      topicId = await ensureTerm("insight_topic", article.topic);
      tagIds = await Promise.all((article.tags || []).map((tag) => ensureTerm("insight_tag", tag)));
    } catch (err) {
      console.warn(`   ⚠️   Error con taxonomías: ${err.message}`);
    }

    // 3. Crear post
    const yoastMeta = buildYoastMeta(article);
    const postBody = {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      slug: article.slug,
      status: "publish",
      date: article.date,
      ...(topicId ? { insight_topic: [topicId] } : {}),
      ...(tagIds.length ? { insight_tag: tagIds } : {}),
      ...(featuredMediaId ? { featured_media: featuredMediaId } : {}),
      meta: {
        ...(article.featured_image_url && !featuredMediaId
          ? { _featured_image_url: article.featured_image_url }
          : {}),
        spotlight: article.spotlight ? "1" : "0",
        ...yoastMeta,
      },
    };

    try {
      process.stdout.write(`   📝  Creando post... `);
      const created = await wpPost("/insight", postBody);
      console.log(`✅  ID: ${created.id} | ${base}/?p=${created.id}`);
      uploaded++;
    } catch (err) {
      console.log(`❌  ${err.message}`);
      failed++;
    }

    // Pausa para no saturar
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`✅  Subidos:  ${uploaded}`);
  if (failed > 0) console.log(`❌  Fallidos: ${failed}`);
  console.log(`─────────────────────────────────────`);
}

main().catch((err) => {
  console.error("❌  Error fatal:", err);
  process.exit(1);
});
