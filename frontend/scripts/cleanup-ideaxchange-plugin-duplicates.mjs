#!/usr/bin/env node
/**
 * Remove stale ideaXchange plugin copies from wp-content/plugins/.
 * These conflict with mu-plugins/ideaxchange/ (Cannot redeclare function).
 *
 * Usage: node scripts/cleanup-ideaxchange-plugin-duplicates.mjs
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

const STALE_PLUGIN_DIRS = [
  "wp-content/plugins/amerilife-ideaxchange.php_",
  "wp-content/plugins/amerilife-ideaxchange-cpt.php_",
  "wp-content/plugins/amerilife-ideaxchange-company-cpt.php_",
  "wp-content/plugins/amerilife-ideaxchange-case-study-cpt.php_",
  "wp-content/plugins/amerilife-ideaxchange-carrier-cpt.php_",
  "wp-content/plugins/amerilife-ideaxchange-leaderboard-cpt.php_",
  // Also duplicated in mu-plugins — safe to remove if present as .php_ folders
  "wp-content/plugins/amerilife-insights-cpt.php_",
  "wp-content/plugins/amerilife-insights-ads.php_",
  "wp-content/plugins/amerilife-content-importer.php_",
];

const sftp = new SftpClient();
await sftp.connect({
  host: process.env.HEADLESS_SFTP_HOST || "headlessameril.sftp.wpengine.com",
  port: Number(process.env.HEADLESS_SFTP_PORT || "2222"),
  username: process.env.HEADLESS_SFTP_USER?.trim(),
  password: process.env.HEADLESS_SFTP_PASSWORD?.trim(),
});

try {
  for (const remote of STALE_PLUGIN_DIRS) {
    if (!(await sftp.exists(remote))) continue;
    process.stdout.write(`   🗑️  Removing ${remote}/ ... `);
    await sftp.rmdir(remote, true);
    console.log("✅");
  }
  console.log("\n✅  Stale plugin duplicates removed");
} catch (err) {
  console.error("❌  Cleanup failed:", err.message);
  process.exit(1);
} finally {
  await sftp.end();
}
