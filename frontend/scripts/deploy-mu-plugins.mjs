#!/usr/bin/env node
/**
 * deploy-mu-plugins.mjs
 *
 * Uploads updated mu-plugins to WP Engine via SFTP.
 *
 * Usage:
 *   node scripts/deploy-mu-plugins.mjs
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
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

/** Walk a directory and return [localAbs, remoteRel] pairs (skips .zip). */
function collectMuPluginFiles(localDir, remotePrefix) {
  const out = [];
  if (!existsSync(localDir)) return out;

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name.startsWith(".") || name.endsWith(".zip")) continue;
      const abs = join(dir, name);
      if (statSync(abs).isDirectory()) {
        walk(abs);
        continue;
      }
      const rel = relative(localDir, abs).split("\\").join("/");
      out.push([abs, `${remotePrefix}/${rel}`]);
    }
  };

  walk(localDir);
  return out;
}

const STALE_ROOT_MU_PLUGINS = [
  "wp-content/mu-plugins/amerilife-ideaxchange-cpt.php",
  "wp-content/mu-plugins/amerilife-ideaxchange-case-study-cpt.php",
  "wp-content/mu-plugins/amerilife-ideaxchange-company-cpt.php",
  "wp-content/mu-plugins/amerilife-ideaxchange-carrier-cpt.php",
  "wp-content/mu-plugins/amerilife-ideaxchange-leaderboard-cpt.php",
];

const files = [
  [join(ROOT, "wp/mu-plugins/amerilife-content-importer.php"), "wp-content/mu-plugins/amerilife-content-importer.php"],
  [join(ROOT, "wp/mu-plugins/amerilife-insights-cpt.php"), "wp-content/mu-plugins/amerilife-insights-cpt.php"],
  [join(ROOT, "wp/mu-plugins/amerilife-insights-ads.php"), "wp-content/mu-plugins/amerilife-insights-ads.php"],
  [join(ROOT, "wp/mu-plugins/amerilife-ideaxchange.php"), "wp-content/mu-plugins/amerilife-ideaxchange.php"],
  ...collectMuPluginFiles(join(ROOT, "wp/mu-plugins/ideaxchange"), "wp-content/mu-plugins/ideaxchange"),
];

const sftp = new SftpClient();

try {
  console.log(`🔗  Connecting to ${host}:${port} as ${user}...`);
  await sftp.connect({ host, port, username: user, password });

  for (const remote of STALE_ROOT_MU_PLUGINS) {
    try {
      if (await sftp.exists(remote)) {
        process.stdout.write(`   🗑️  Removing stale duplicate ${remote} ... `);
        await sftp.delete(remote);
        console.log("✅");
      }
    } catch (err) {
      console.warn(`⚠️  Could not remove ${remote}: ${err.message}`);
    }
  }

  for (const [localPath, remoteRel] of files) {
    if (!existsSync(localPath)) {
      console.warn(`⚠️  Missing local file: ${localPath}`);
      continue;
    }
    const remoteDir = remoteRel.split("/").slice(0, -1).join("/");
    if (remoteDir) await sftp.mkdir(remoteDir, true);
    const label = relative(ROOT, localPath);
    process.stdout.write(`   📤  ${label} → ${remoteRel} ... `);
    await sftp.put(localPath, remoteRel);
    console.log("✅");
  }
  console.log("\n✅  mu-plugins deployed (including ideaXchange/ folder + loader)");
} catch (err) {
  console.error("❌  SFTP deploy failed:", err.message);
  process.exit(1);
} finally {
  await sftp.end();
}
