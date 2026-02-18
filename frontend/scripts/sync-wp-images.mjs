import { createWriteStream, promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { Readable } from "node:stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");

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
  // Load .env files so this script works when it runs BEFORE `next build`.
  // Only sets keys that aren't already in process.env.
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

function getHeadlessBaseUrl() {
  const wp = env("NEXT_PUBLIC_WORDPRESS_URL");
  if (wp) return wp.replace(/\/$/, "");
  const gql = env("NEXT_PUBLIC_GRAPHQL_ENDPOINT");
  if (gql) return gql.replace(/\/graphql\/?$/, "").replace(/\/$/, "");
  return null;
}

function parseUrlMaybe(u) {
  try {
    if (u.startsWith("//")) return new URL(`https:${u}`);
    return new URL(u);
  } catch {
    return null;
  }
}

function parseHostList(raw, fallback) {
  const list = (raw ?? fallback ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const out = [];
  for (const item of list) {
    const u = parseUrlMaybe(item.startsWith("http") ? item : `https://${item}`);
    if (u?.hostname) out.push(u.hostname);
  }
  return [...new Set(out)];
}

function buildDownloadCandidates(originalUrl) {
  const parsed = parseUrlMaybe(originalUrl);
  if (!parsed) return [originalUrl];

  const liveHosts = parseHostList(
    env("SYNC_WP_SOURCE_HOSTS"),
    env("NEXT_PUBLIC_LIVE_UPLOAD_HOSTS", "amerilife.com,www.amerilife.com,uatamerilife.wpengine.com")
  );

  const candidates = [originalUrl];

  if (parsed.pathname.includes("/wp-content/")) {
    for (const host of liveHosts) {
      if (!host) continue;
      const u = new URL(originalUrl);
      u.protocol = "https:";
      u.hostname = host;
      candidates.push(u.toString());
    }
  }

  const seen = new Set();
  return candidates.filter((c) => {
    if (seen.has(c)) return false;
    seen.add(c);
    return true;
  });
}

function extractUploadsUrlsFromText(text) {
  // Grab any absolute or protocol-relative URL that includes /wp-content/uploads/
  const re = /(https?:\/\/|\/\/)[a-z0-9.-]+\/wp-content\/uploads\/[^\s"'<>)]*/gi;
  const out = new Set();
  let m;
  while ((m = re.exec(text)) !== null) out.add(m[0]);
  return out;
}

function extractUploadsUrlsFromWpImageSourcesTs(text) {
  // Heuristic for `lib/wp-image-sources.ts` where URLs are composed like:
  //   const UPLOADS = "https://amerilife.com/wp-content/uploads";
  //   `${UPLOADS}/2021/12/logo-1b.png`
  //
  // We do this to avoid duplicating the URL list elsewhere, since the repo-scan only
  // picks up fully materialized URLs.
  const bases = new Map();
  {
    const reBase =
      /const\s+([A-Z0-9_]+)\s*=\s*["'](https?:\/\/[^"']+\/wp-content\/uploads)["']\s*;/g;
    let m;
    while ((m = reBase.exec(text)) !== null) {
      const name = m[1];
      const url = m[2];
      bases.set(name, url.replace(/\/$/, ""));
    }
  }

  if (bases.size === 0) return new Set();

  const out = new Set();
  const reTpl = /\$\{([A-Z0-9_]+)\}\/([0-9]{4}\/[0-9]{2}\/[^\s"'`<>)]*)/g;
  let m;
  while ((m = reTpl.exec(text)) !== null) {
    const baseName = m[1];
    const rel = m[2];
    const base = bases.get(baseName);
    if (!base) continue;
    out.add(`${base}/${rel}`);
  }
  return out;
}

function isProbablyRealUploadsAssetUrl(u) {
  // Filter out placeholder/truncated URLs like ".../wp-content/uploads/..."
  if (u.includes("...") || u.includes("%E2%80%A6")) return false;
  // Must contain at least one "/" segment after uploads and a filename-like suffix
  return /\/wp-content\/uploads\/.+\.[a-z0-9]{2,8}(\?.*)?$/i.test(u);
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function collectFromRepo() {
  const roots = [path.join(PROJECT_ROOT, "app"), path.join(PROJECT_ROOT, "lib")];
  const urls = new Set();
  for (const root of roots) {
    try {
      const files = (await walk(root)).filter((f) =>
        /\.(ts|tsx|js|jsx|md|mdx|css)$/.test(f)
      );
      for (const f of files) {
        const txt = await fs.readFile(f, "utf8");
        for (const u of extractUploadsUrlsFromText(txt)) urls.add(u);
        if (f.endsWith(`${path.sep}lib${path.sep}wp-image-sources.ts`)) {
          for (const u of extractUploadsUrlsFromWpImageSourcesTs(txt)) urls.add(u);
        }
      }
    } catch {
      // ignore missing roots
    }
  }
  return urls;
}

async function fetchGraphQL(query, variables) {
  const endpoint = env("NEXT_PUBLIC_GRAPHQL_ENDPOINT");
  if (!endpoint) throw new Error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not set.");
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GraphQL failed: ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data;
}

async function collectFromWpPages() {
  // Pull pages content from the (headless) WP GraphQL and extract any live uploads URLs referenced inside HTML.
  const urls = new Set();
  const query = /* GraphQL */ `
    query PagesWithContent($first: Int!, $after: String) {
      pages(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          uri
          content
        }
      }
    }
  `;

  let after = null;
  for (;;) {
    const data = await fetchGraphQL(query, { first: 50, after });
    const nodes = data?.pages?.nodes ?? [];
    for (const n of nodes) {
      const html = n?.content ?? "";
      for (const u of extractUploadsUrlsFromText(html)) urls.add(u);
    }
    const pageInfo = data?.pages?.pageInfo;
    if (!pageInfo?.hasNextPage) break;
    after = pageInfo.endCursor;
  }
  return urls;
}

function uploadsRelativePathFromUrl(u) {
  const parsed = parseUrlMaybe(u);
  if (!parsed) return null;
  const idx = parsed.pathname.indexOf("/wp-content/uploads/");
  if (idx === -1) return null;
  return parsed.pathname.slice(idx + 1); // strip leading "/"
}

async function downloadToCache(url, cacheRoot) {
  const rel = uploadsRelativePathFromUrl(url);
  if (!rel) return null;

  const dest = path.join(cacheRoot, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });

  // If it already exists, skip (fast path).
  try {
    const st = await fs.stat(dest);
    if (st.size > 0) return { rel, dest, skipped: true };
  } catch {
    // continue
  }

  const userAgent =
    env(
      "SYNC_WP_USER_AGENT",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ) ?? "";

  const tried = [];
  const candidates = buildDownloadCandidates(url);
  let res = null;
  let usedUrl = null;

  for (const candidate of candidates) {
    const u = parseUrlMaybe(candidate);
    const defaultReferer = u ? `${u.origin}/` : undefined;
    const headers = {
      "user-agent": userAgent,
      accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "accept-language": env("SYNC_WP_ACCEPT_LANGUAGE", "en-US,en;q=0.9") ?? "",
      referer: env("SYNC_WP_REFERER", defaultReferer ?? "") ?? "",
    };

    let r = await fetch(candidate, { headers });
    // Some hosts reject certain combinations; retry once without referer if we get forbidden.
    if (!r.ok && r.status === 403) {
      const retryHeaders = { ...headers };
      delete retryHeaders.referer;
      r = await fetch(candidate, { headers: retryHeaders });
    }

    if (r.ok) {
      res = r;
      usedUrl = candidate;
      break;
    }

    tried.push(`${r.status} ${candidate}`);
    // Common cases: headless 404, live 403, headless 429.
    if (![404, 403, 429].includes(r.status)) break;
  }

  if (!res || !res.ok) {
    throw new Error(
      `Download failed for ${url}. Tried: ${tried.slice(0, 6).join(" | ")}`
    );
  }

  const ct = res.headers.get("content-type") ?? "";
  if (ct && !ct.startsWith("image/") && !ct.includes("octet-stream")) {
    // Not fatal; some CDNs send odd types. Keep going.
  }

  await new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    if (!res.body) {
      reject(new Error(`Empty response body: ${usedUrl ?? url}`));
      return;
    }
    const nodeStream = Readable.fromWeb(res.body);
    nodeStream.on("error", reject);
    nodeStream.pipe(file);
    file.on("finish", resolve);
    file.on("error", reject);
  });

  return { rel, dest, skipped: false };
}

function runSftpBatch({ host, port, user, keyPath, batchPath }) {
  const args = [
    "-i",
    keyPath,
    "-P",
    String(port),
    "-b",
    batchPath,
    `${user}@${host}`,
  ];
  const r = spawnSync("sftp", args, { stdio: "inherit" });
  if (r.status !== 0) {
    throw new Error(`sftp failed with exit code ${r.status ?? "unknown"}`);
  }
}

function which(cmd) {
  const r = spawnSync("which", [cmd], { stdio: "pipe" });
  return r.status === 0;
}

function escapeLftpString(s) {
  // Minimal escaping for lftp script strings.
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function assertSafeRemotePath(remotePath, varName) {
  const v = String(remotePath ?? "");
  // We intentionally avoid quoting remote paths in lftp commands due to evidence that quotes are
  // being treated literally by the remote sftp subsystem in this environment.
  if (!v) throw new Error(`${varName} is empty.`);
  if (v.includes('"') || v.includes("'")) {
    throw new Error(`${varName} contains quotes which are not supported: ${v}`);
  }
  if (/\s/.test(v)) {
    throw new Error(`${varName} contains whitespace which is not supported: ${v}`);
  }
  if (v.includes("..")) {
    throw new Error(`${varName} contains '..' which is not allowed: ${v}`);
  }
}

function assertSafeLocalPath(localPath, varName) {
  const v = String(localPath ?? "");
  if (!v) throw new Error(`${varName} is empty.`);
  if (v.includes('"') || v.includes("'")) {
    throw new Error(`${varName} contains quotes which are not supported: ${v}`);
  }
  if (/\s/.test(v)) {
    throw new Error(`${varName} contains whitespace which is not supported: ${v}`);
  }
  if (v.includes("..")) {
    throw new Error(`${varName} contains '..' which is not allowed: ${v}`);
  }
}

function runLftpScript({ host, port, user, password, lines }) {
  if (!which("lftp")) {
    throw new Error('Password mode requires "lftp" (e.g. `brew install lftp`).');
  }

  const u = String(user ?? "").trim();
  const p = String(password ?? "").trim();
  const h = String(host ?? "").trim();
  if (!u) throw new Error("HEADLESS_SFTP_USER is empty.");
  if (!p) throw new Error("HEADLESS_SFTP_PASSWORD is empty.");
  if (!h) throw new Error("HEADLESS_SFTP_HOST is empty.");
  // OpenSSH rejects control chars/newlines in usernames.
  if (/[^\x21-\x7E]/.test(u) || /\s/.test(u)) {
    throw new Error(
      `HEADLESS_SFTP_USER contains invalid characters. Re-export it (no spaces/newlines). Value length=${u.length}`
    );
  }

  const script = [
    // Fail fast when a command errors so we get real exit codes.
    "set cmd:fail-exit yes",
    "set sftp:auto-confirm yes",
    "set net:max-retries 3",
    "set net:reconnect-interval-base 5",
    // WP Engine commonly denies chmod/chown over SFTP; don't attempt to preserve/set perms.
    "set mirror:set-permissions no",
    ...lines,
    "bye",
    "",
  ].join("\n");

  // Pass credentials via CLI args to avoid `open -u "user","pass"` parsing edge-cases.
  // NOTE: This exposes the password in process args while running; acceptable here per user request.
  const r = spawnSync(
    "lftp",
    ["-u", `${u},${p}`, "-p", String(Number(port)), `sftp://${h}`, "-e", script],
    { stdio: "pipe", encoding: "utf8" }
  );

  const scrub = (s) =>
    String(s ?? "")
      .replaceAll(p, "***")
      .replaceAll(u, "***")
      .slice(0, 2000);

  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);

  return {
    status: r.status ?? 1,
    stdout: String(r.stdout ?? ""),
    stderr: String(r.stderr ?? ""),
  };
}

function probeLftpRemoteDir({ host, port, user, password, remoteDir }) {
  assertSafeRemotePath(remoteDir, "remoteDir");
  // First try cd only (directory might already exist but be non-creatable).
  const cdOnly = runLftpScript({
    host,
    port,
    user,
    password,
    lines: [`cd ${remoteDir}`],
  });

  if (cdOnly.status === 0) {
    return true;
  }

  // If cd failed, try creating it then cd.
  const r = runLftpScript({
    host,
    port,
    user,
    password,
    lines: [`mkdir -p ${remoteDir}`, `cd ${remoteDir}`],
  });
  return r.status === 0;
}

function runLftpMirrorUpload({
  host,
  port,
  user,
  password,
  localUploadsDir,
  remoteUploadsDir,
}) {
  assertSafeRemotePath(remoteUploadsDir, "remoteUploadsDir");
  assertSafeLocalPath(localUploadsDir, "localUploadsDir");

  const r = runLftpScript({
    host,
    port,
    user,
    password,
    lines: [
      `cd ${remoteUploadsDir}`,
      // Some lftp builds treat quotes literally in local paths too; avoid quoting and set a known local cwd.
      "lcd /",
      // Note: destination is ".", since we've already cd'd into the remote uploads dir.
      `mirror -R --verbose --only-newer --parallel=4 --no-perms --no-umask ${localUploadsDir} .`,
    ],
  });
  if (r.status !== 0) throw new Error(`lftp failed with exit code ${r.status}`);
}

function runLftpPutFile({ host, port, user, password, localPath, remotePath }) {
  assertSafeRemotePath(remotePath, "remotePath");
  assertSafeLocalPath(localPath, "localPath");
  const remoteDir = path.posix.dirname(remotePath);
  assertSafeRemotePath(remoteDir, "remoteDir");

  // Prefer probing existing remote dir (WP Engine often blocks mkdir even when dirs exist).
  const cdProbe = runLftpScript({
    host,
    port,
    user,
    password,
    lines: [`cd ${remoteDir}`],
  });

  if (cdProbe.status === 0) {
    const putOnly = runLftpScript({
      host,
      port,
      user,
      password,
      lines: ["lcd /", `put ${localPath} -o ${remotePath}`],
    });
    return putOnly.status === 0;
  }

  // Directory doesn't exist or isn't accessible; try creating it (best-effort).
  const parts = remoteDir.split("/").filter(Boolean);
  const mkdirLines = [];
  let acc = "";
  for (const part of parts) {
    acc = acc ? `${acc}/${part}` : part;
    mkdirLines.push(`mkdir ${acc}`);
  }

  const r = runLftpScript({
    host,
    port,
    user,
    password,
    lines: [
      "set cmd:fail-exit no",
      ...mkdirLines,
      "set cmd:fail-exit yes",
      `cd ${remoteDir}`,
      "lcd /",
      `put ${localPath} -o ${remotePath}`,
    ],
  });
  return r.status === 0;
}

function listLftpDir({ host, port, user, password, dir }) {
  assertSafeRemotePath(dir, "dir");
  const r = runLftpScript({
    host,
    port,
    user,
    password,
    lines: [
      `cd ${dir}`,
      // One entry per line, names only.
      "cls -1",
    ],
  });
  if (r.status !== 0) return null;
  return r.stdout
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function basicAuthHeader(user, appPassword) {
  // WP Application Passwords are often displayed with spaces; strip them.
  const pass = String(appPassword).replace(/\s+/g, "");
  const token = Buffer.from(`${user}:${pass}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

async function importIntoMediaLibrary({ headlessBaseUrl, authHeader, relPaths }) {
  if (relPaths.length === 0) return;

  const endpoint = `${headlessBaseUrl.replace(/\/$/, "")}/wp-json/amerilife/v1/import-media`;
  const chunkSize = 50;

  for (let i = 0; i < relPaths.length; i += chunkSize) {
    const chunk = relPaths.slice(i, i + chunkSize);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: authHeader,
        "content-type": "application/json",
      },
      body: JSON.stringify({ paths: chunk, dryRun: false }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Media import failed ${res.status}: ${txt || res.statusText}`);
    }
  }
}

async function importIntoMediaLibraryWithBodyAuth({
  headlessBaseUrl,
  username,
  appPassword,
  relPaths,
}) {
  if (relPaths.length === 0) return;

  const endpoint = `${headlessBaseUrl.replace(/\/$/, "")}/wp-json/amerilife/v1/import-media`;
  const chunkSize = 50;

  for (let i = 0; i < relPaths.length; i += chunkSize) {
    const chunk = relPaths.slice(i, i + chunkSize);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        paths: chunk,
        dryRun: false,
        username,
        appPassword,
      }),
    });

    const txt = await res.text().catch(() => "");
    if (!res.ok) {
      throw new Error(`Media import failed ${res.status}: ${txt || res.statusText}`);
    }
  }
}

async function assertWpRestAuthWorks({ headlessBaseUrl, authHeader }) {
  const u = `${headlessBaseUrl.replace(/\/$/, "")}/wp-json/wp/v2/users/me`;
  const res = await fetch(u, { headers: { authorization: authHeader } });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    return { ok: false, status: res.status, body: txt };
  }
  return { ok: true, status: res.status };
}

async function main() {
  await loadDotEnvFiles();

  if (env("SYNC_WP_IMAGES") !== "1") return;

  const headlessBase = getHeadlessBaseUrl();
  if (!headlessBase) {
    throw new Error("Set NEXT_PUBLIC_GRAPHQL_ENDPOINT (or NEXT_PUBLIC_WORDPRESS_URL).");
  }

  const sftpHost = env("HEADLESS_SFTP_HOST", "headlessameril.sftp.wpengine.com");
  const sftpPort = Number(env("HEADLESS_SFTP_PORT", "2222"));
  const sftpUser = env("HEADLESS_SFTP_USER");
  const sftpKeyPath = env("HEADLESS_SFTP_KEY_PATH");
  const sftpPassword = env("HEADLESS_SFTP_PASSWORD");

  // Optional: register uploaded files into WordPress Media Library (requires WP Application Passwords).
  const importMediaLibrary = env("SYNC_WP_IMPORT_MEDIA_LIBRARY", "0") === "1";
  const wpAppUser = env("HEADLESS_WP_APP_USER");
  const wpAppPassword = env("HEADLESS_WP_APP_PASSWORD");

  // Prefix inside the SFTP root. For WP Engine, this is often not needed; keep it configurable.
  const wpRootPrefixRaw = env("HEADLESS_SFTP_WP_ROOT", "").replace(/\/$/, "");
  const uploadsPrefix = env("HEADLESS_SFTP_UPLOADS_PREFIX", "wp-content/uploads").replace(/\/$/, "");

  if (!sftpUser) throw new Error("Set HEADLESS_SFTP_USER.");
  if (!sftpPassword && !sftpKeyPath) {
    throw new Error(
      "Set HEADLESS_SFTP_PASSWORD (password mode) or HEADLESS_SFTP_KEY_PATH (SSH key mode)."
    );
  }
  if (importMediaLibrary) {
    if (!wpAppUser || !wpAppPassword) {
      throw new Error(
        "To import into Media Library, set HEADLESS_WP_APP_USER and HEADLESS_WP_APP_PASSWORD (an Application Password)."
      );
    }
  }

  const cacheRoot = path.join(PROJECT_ROOT, ".cache", "wp-image-sync");
  await fs.mkdir(cacheRoot, { recursive: true });
  const failedPath = path.join(cacheRoot, "failed-downloads.txt");
  // Always reset failure output for this run, so stale errors don't confuse builds.
  await fs.writeFile(failedPath, "", "utf8");

  const urls = new Set();
  for (const u of await collectFromRepo()) urls.add(u);

  // This pulls any uploads URLs referenced inside headless WP page HTML.
  // If the headless WP doesn't expose `pages`, this will throw; you can disable by setting SYNC_WP_WP_PAGES=0.
  if (env("SYNC_WP_WP_PAGES", "1") === "1") {
    try {
      for (const u of await collectFromWpPages()) urls.add(u);
    } catch (e) {
      // Non-fatal for repo-driven sync; still useful for hardcoded images.
      console.warn(String(e));
    }
  }

  // Normalize to absolute https URLs (protocol-relative -> https).
  const normalized = [...urls]
    .map((u) => {
      if (u.startsWith("//")) return `https:${u}`;
      if (u.startsWith("http://")) return `https://${u.slice("http://".length)}`;
      return u;
    })
    .filter((u) => u.includes("/wp-content/uploads/"))
    .filter(isProbablyRealUploadsAssetUrl);

  if (normalized.length === 0) return;

  // Download all referenced images from the live URLs.
  const downloaded = [];
  const failed = [];
  for (const u of normalized) {
    try {
      const info = await downloadToCache(u, cacheRoot);
      if (info) downloaded.push(info);
    } catch (e) {
      const msg = String(e);
      failed.push(`${msg}`);
      console.warn(`WARN: ${msg}`);
    }
  }

  if (failed.length) {
    await fs.writeFile(failedPath, failed.join("\n") + "\n", "utf8");
  }

  if (downloaded.length === 0) return;

  const muPluginLocalPath = path.join(
    PROJECT_ROOT,
    "wp",
    "mu-plugins",
    "amerilife-media-importer.php"
  );

  // If password mode is enabled, use lftp mirror for non-interactive auth.
  if (sftpPassword) {
    const localUploadsDir = path.join(cacheRoot, "wp-content", "uploads");
    // Auto-detect a writable uploads dir. Some WP Engine users are chrooted into the install already.
    // Strategy:
    // - Try explicit HEADLESS_SFTP_WP_ROOT (if provided)
    // - Try relative uploadsPrefix (chrooted case)
    // - If a "sites" dir exists, enumerate `sites/*/` and try each `sites/<site>/<uploadsPrefix>`
    const tried = [];
    const candidates = [];
    if (wpRootPrefixRaw) candidates.push(`${wpRootPrefixRaw}/${uploadsPrefix}`);
    candidates.push(uploadsPrefix);

    const rootEntries = listLftpDir({
      host: sftpHost,
      port: sftpPort,
      user: sftpUser,
      password: sftpPassword,
      dir: ".",
    });

    if (rootEntries?.includes("sites")) {
      const siteEntries = listLftpDir({
        host: sftpHost,
        port: sftpPort,
        user: sftpUser,
        password: sftpPassword,
        dir: "sites",
      });
      if (siteEntries?.length) {
        for (const site of siteEntries) {
          if (!/^[a-zA-Z0-9._-]+$/.test(site)) continue;
          candidates.push(`sites/${site}/${uploadsPrefix}`);
        }
      }
    }

    let chosenPrefix = "";
    let remoteUploadsDir = null;
    for (const candidate of candidates) {
      tried.push(candidate);
      try {
        if (
          probeLftpRemoteDir({
            host: sftpHost,
            port: sftpPort,
            user: sftpUser,
            password: sftpPassword,
            remoteDir: candidate,
          })
        ) {
          remoteUploadsDir = candidate;
          // chosenPrefix is only used to compute mu-plugin path; we can derive it from candidate.
          chosenPrefix = candidate.endsWith(`/${uploadsPrefix}`)
            ? candidate.slice(0, -(`/${uploadsPrefix}`.length))
            : "";
          break;
        }
      } catch (e) {
        // ignore and try next candidate
      }
    }

    if (!remoteUploadsDir) {
      throw new Error(
        `Could not find a writable remote uploads directory. Tried: ${tried.join(", ")}\n` +
          `Set HEADLESS_SFTP_WP_ROOT correctly, or ensure your SFTP user has access to the WP install directory.`
      );
    }

    runLftpMirrorUpload({
      host: sftpHost,
      port: sftpPort,
      user: sftpUser,
      password: sftpPassword,
      localUploadsDir,
      remoteUploadsDir,
    });

    // Try to upload MU plugin; this may be blocked by WP Engine permissions/chroot.
    const muPluginRemotePath =
      (chosenPrefix ? `${chosenPrefix}/` : "") +
      "wp-content/mu-plugins/amerilife-media-importer.php";
    const muOk = runLftpPutFile({
      host: sftpHost,
      port: sftpPort,
      user: sftpUser,
      password: sftpPassword,
      localPath: muPluginLocalPath,
      remotePath: muPluginRemotePath,
    });

    if (importMediaLibrary) {
      if (!muOk) {
        throw new Error(
          `Cannot upload MU plugin to "${muPluginRemotePath}". Your SFTP user may be chrooted or lacks permission to write wp-content/mu-plugins.\n` +
            `Without that plugin (and without SSH), WordPress cannot register existing uploads files into Media Library automatically.`
        );
      }
      const relPaths = downloaded
        .map((f) => f.rel.replace(/^wp-content\/uploads\/?/, ""))
        .filter(Boolean);
      const authHeader = basicAuthHeader(wpAppUser, wpAppPassword);
      const auth = await assertWpRestAuthWorks({ headlessBaseUrl: headlessBase, authHeader });
      if (auth.ok) {
        await importIntoMediaLibrary({
          headlessBaseUrl: headlessBase,
          authHeader,
          relPaths,
        });
      } else {
        await importIntoMediaLibraryWithBodyAuth({
          headlessBaseUrl: headlessBase,
          username: wpAppUser,
          appPassword: wpAppPassword,
          relPaths,
        });
      }
    }
    return;
  }

  // Build an SFTP batch file that creates directories and uploads only the referenced files.
  const dirs = new Set();
  const uploads = [];

  for (const f of downloaded) {
    const relFromUploads = f.rel.replace(/^wp-content\/uploads\/?/, "");
    const remotePath =
      (wpRootPrefix ? `${wpRootPrefix}/` : "") + `${uploadsPrefix}/${relFromUploads}`;

    // mkdir chain for remote directory
    const parts = remotePath.split("/").slice(0, -1);
    let acc = "";
    for (const p of parts) {
      acc = acc ? `${acc}/${p}` : p;
      dirs.add(acc);
    }
    uploads.push({ local: f.dest, remote: remotePath });
  }

  const batchLines = [];
  for (const d of [...dirs].sort((a, b) => a.length - b.length)) {
    batchLines.push(`mkdir ${d}`);
  }
  for (const u of uploads) {
    batchLines.push(`put ${u.local} ${u.remote}`);
  }

  // Ensure MU plugin exists in key-mode too (may still fail depending on permissions).
  const wpRootPrefix = wpRootPrefixRaw;
  const muPluginRemotePath =
    (wpRootPrefix ? `${wpRootPrefix}/` : "") + "wp-content/mu-plugins/amerilife-media-importer.php";
  batchLines.push(`mkdir ${path.posix.dirname(muPluginRemotePath)}`);
  batchLines.push(`put ${muPluginLocalPath} ${muPluginRemotePath}`);

  const batchPath = path.join(cacheRoot, "sftp-batch.txt");
  await fs.writeFile(batchPath, batchLines.join("\n") + "\n", "utf8");

  runSftpBatch({
    host: sftpHost,
    port: sftpPort,
    user: sftpUser,
    keyPath: sftpKeyPath,
    batchPath,
  });

  if (importMediaLibrary) {
    const relPaths = downloaded
      .map((f) => f.rel.replace(/^wp-content\/uploads\/?/, ""))
      .filter(Boolean);
    const authHeader = basicAuthHeader(wpAppUser, wpAppPassword);
    const auth = await assertWpRestAuthWorks({ headlessBaseUrl: headlessBase, authHeader });
    if (auth.ok) {
      await importIntoMediaLibrary({
        headlessBaseUrl: headlessBase,
        authHeader,
        relPaths,
      });
    } else {
      await importIntoMediaLibraryWithBodyAuth({
        headlessBaseUrl: headlessBase,
        username: wpAppUser,
        appPassword: wpAppPassword,
        relPaths,
      });
    }
  }
}

await main();

