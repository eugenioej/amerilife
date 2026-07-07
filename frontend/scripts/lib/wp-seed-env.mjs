import { execFile } from "node:child_process";
import { readFileSync, existsSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = join(__dirname, "..", "..");

function loadEnvFile(envPath) {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
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

loadEnvFile(join(frontendRoot, ".env"));
loadEnvFile(join(frontendRoot, ".env.local"));
loadEnvFile(join(frontendRoot, "..", ".env"));
loadEnvFile(join(frontendRoot, "..", ".env.local"));

function originFromGraphqlEndpoint() {
  const g = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  if (!g) return "";
  try {
    return new URL(g).origin.replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function getWpSeedCredentials() {
  const wpUrl = (
    process.env.WP_URL ||
    process.env.WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WP_URL ||
    originFromGraphqlEndpoint() ||
    ""
  ).replace(/\/$/, "");

  const user =
    process.env.WP_APP_USER ||
    process.env.WORDPRESS_USER?.trim() ||
    process.env.HEADLESS_WP_APP_USER?.trim() ||
    process.env.WP_USERNAME ||
    "";

  const loginPassword =
    process.env.WORDPRESS_PASSWORD?.trim() ||
    process.env.WP_PASSWORD?.trim() ||
    "";

  const appPassRaw =
    process.env.WP_APP_PASSWORD ||
    process.env.WORDPRESS_APP_PASSWORD ||
    process.env.HEADLESS_WP_APP_PASSWORD ||
    "";

  // HEADLESS_WP_APP_PASSWORD is often the login password by mistake — skip when identical.
  const appPass = (
    appPassRaw === loginPassword ? "" : appPassRaw
  ).replace(/\s+/g, "");

  return { wpUrl, user, appPass, loginPassword };
}

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
    const segment = line.split(";")[0].trim();
    const eq = segment.indexOf("=");
    if (eq < 1) continue;
    map.set(segment.slice(0, eq), segment);
  }
  return Array.from(map.values()).join("; ");
}

async function establishSession(wpUrl, user, loginPassword) {
  if (!loginPassword) return null;

  const body = new URLSearchParams({
    log: user,
    pwd: loginPassword,
    "wp-submit": "Log In",
    redirect_to: `${wpUrl}/wp-admin/`,
    testcookie: "1",
  });

  const res = await fetch(`${wpUrl}/wp-login.php`, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  let lines = [...getSetCookieLines(res)];
  let cookie = mergeCookiePairs(lines);

  if (res.status === 301 || res.status === 302) {
    const loc = res.headers.get("location");
    if (loc) {
      const r2 = await fetch(new URL(loc, wpUrl).href, {
        method: "GET",
        redirect: "manual",
        headers: { Cookie: cookie },
      });
      lines = [...lines, ...getSetCookieLines(r2)];
      cookie = mergeCookiePairs(lines);
    }
  }

  if (res.status === 200) {
    const text = await res.text();
    if (
      /login_error|incorrect password|Invalid username|Unknown email|The password you entered/i.test(
        text,
      )
    ) {
      return null;
    }
  }

  if (!cookie.includes("wordpress_logged_in")) {
    return null;
  }

  return cookie;
}

async function fetchRestNonce(wpUrl, cookie) {
  try {
    const r = await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, {
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
    /* ignore */
  }
  return "";
}

async function postWithCurl(endpoint, user, pass, headers = {}) {
  const outFile = join(tmpdir(), `wp-seed-${Date.now()}.json`);
  const curlHeaders = Object.entries(headers).flatMap(([k, v]) => ["-H", `${k}: ${v}`]);
  try {
    const { stdout } = await execFileAsync("curl", [
      "-s",
      "-o",
      outFile,
      "-w",
      "%{http_code}",
      "-X",
      "POST",
      ...(user && pass ? ["-u", `${user}:${pass}`] : []),
      ...curlHeaders,
      "-H",
      "Content-Type: application/json",
      endpoint,
    ]);
    const status = Number(stdout.trim()) || 0;
    const json = JSON.parse(readFileSync(outFile, "utf8"));
    return { ok: status >= 200 && status < 300, status, json };
  } finally {
    try {
      unlinkSync(outFile);
    } catch {
      /* ignore */
    }
  }
}

/** POST to a WP seed route; tries Application Password, curl, then wp-login session. */
export async function postWpSeed(path, { force = false } = {}) {
  const { wpUrl, user, appPass, loginPassword } = getWpSeedCredentials();
  const endpoint = `${wpUrl}${path}${force ? (path.includes("?") ? "&" : "?") + "force=1" : ""}`;

  const attempts = [];

  if (appPass) {
    const auth = Buffer.from(`${user}:${appPass}`).toString("base64");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, status: res.status, json };
    attempts.push(`Application Password (HTTP ${res.status}: ${json?.code || "error"})`);

    const curlResult = await postWithCurl(endpoint, user, appPass);
    if (curlResult.ok) return curlResult;
    attempts.push(`curl + Application Password (HTTP ${curlResult.status}: ${curlResult.json?.code || "error"})`);
  }

  if (loginPassword) {
    const cookie = await establishSession(wpUrl, user, loginPassword);
    if (cookie) {
      const nonce = await fetchRestNonce(wpUrl, cookie);
      const headers = { Cookie: cookie, "Content-Type": "application/json" };
      if (nonce) headers["X-WP-Nonce"] = nonce;

      const res = await fetch(endpoint, { method: "POST", headers });
      const json = await res.json().catch(() => ({}));
      if (res.ok) return { ok: true, status: res.status, json };
      attempts.push(`wp-login session (HTTP ${res.status}: ${json?.code || "error"})`);
    } else {
      attempts.push("wp-login session (login failed — check WORDPRESS_PASSWORD)");
    }
  }

  return {
    ok: false,
    status: 401,
    json: {
      code: "auth_failed",
      message:
        "WordPress did not accept the credentials in .env.local. Regenerate an Application Password for mediauploader (Users → Profile → Application Passwords) and set WORDPRESS_APP_PASSWORD in frontend/.env.local.",
      attempts,
    },
  };
}

export function formatSeedAuthHelp(user) {
  return [
    `WordPress rejected authentication for "${user}".`,
    "• Regenerate an Application Password: WP Admin → Users → mediauploader → Profile → Application Passwords",
    "• Set WORDPRESS_APP_PASSWORD in frontend/.env.local (format: xxxx xxxx xxxx xxxx xxxx xxxx)",
    "• Do not put the login password in HEADLESS_WP_APP_PASSWORD (repo root .env.local)",
    "• Or set WORDPRESS_PASSWORD to the current wp-admin login password for session-based seeding",
  ].join("\n");
}
