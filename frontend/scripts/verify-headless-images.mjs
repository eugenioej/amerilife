/**
 * Verify that key images exist on the headless WP after sync.
 * Run after production build: pnpm -C frontend run verify:headless-images
 *
 * Uses NEXT_PUBLIC_GRAPHQL_ENDPOINT to derive headless base URL.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

// Representative upload paths used by the app (from wp-image-sources, home, header, etc.)
const SAMPLE_PATHS = [
  "/wp-content/uploads/2023/01/agb-logo.png",
  "/wp-content/uploads/2021/12/logo-1b.png",
  "/wp-content/uploads/2021/12/banner-image.png",
  "/wp-content/uploads/2022/01/amerilife.svg",
];

async function loadDotEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(PROJECT_ROOT, name);
    try {
      const raw = await fs.readFile(p, "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
        if (key && process.env[key] == null) process.env[key] = val;
      }
    } catch {
      // ignore
    }
  }
}

function getHeadlessBase() {
  const gql = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  if (!gql) return null;
  return gql.replace(/\/graphql\/?$/, "").replace(/\/$/, "");
}

async function main() {
  await loadDotEnv();
  const base = getHeadlessBase();
  if (!base) {
    console.error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not set.");
    process.exit(1);
  }

  let ok = 0;
  let fail = 0;

  for (const p of SAMPLE_PATHS) {
    const url = `${base}${p}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        console.log(`OK  ${p}`);
        ok++;
      } else {
        console.log(`404 ${p}`);
        fail++;
      }
    } catch (e) {
      console.log(`ERR ${p} - ${e.message}`);
      fail++;
    }
  }

  console.log(`\n${ok} ok, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
