#!/usr/bin/env node
/**
 * deploy-mu-plugins.mjs
 *
 * Uploads updated mu-plugins to WP Engine via SFTP.
 *
 * Usage:
 *   node scripts/deploy-mu-plugins.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import SftpClient from "ssh2-sftp-client";

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

const host = process.env.HEADLESS_SFTP_HOST || "headlessameril.sftp.wpengine.com";
const port = Number(process.env.HEADLESS_SFTP_PORT || "2222");
const user = process.env.HEADLESS_SFTP_USER?.trim();
const password = process.env.HEADLESS_SFTP_PASSWORD?.trim();

if (!user || !password) {
  console.error("❌  Set HEADLESS_SFTP_USER and HEADLESS_SFTP_PASSWORD in .env.local");
  process.exit(1);
}

const files = [
  ["wp/mu-plugins/amerilife-content-importer.php", "wp-content/mu-plugins/amerilife-content-importer.php"],
  ["wp/mu-plugins/amerilife-insights-cpt.php", "wp-content/mu-plugins/amerilife-insights-cpt.php"],
];

const sftp = new SftpClient();

try {
  console.log(`🔗  Connecting to ${host}:${port} as ${user}...`);
  await sftp.connect({ host, port, username: user, password });
  for (const [localRel, remoteRel] of files) {
    const localPath = join(ROOT, localRel);
    if (!existsSync(localPath)) {
      console.warn(`⚠️  Missing local file: ${localRel}`);
      continue;
    }
    process.stdout.write(`   📤  ${localRel} → ${remoteRel} ... `);
    await sftp.put(localPath, remoteRel);
    console.log("✅");
  }
  console.log("\n✅  mu-plugins deployed");
} catch (err) {
  console.error("❌  SFTP deploy failed:", err.message);
  process.exit(1);
} finally {
  await sftp.end();
}
