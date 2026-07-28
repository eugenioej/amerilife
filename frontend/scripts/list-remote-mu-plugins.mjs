#!/usr/bin/env node
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

const sftp = new SftpClient();
await sftp.connect({ host, port, username: user, password });

async function listDir(remote, indent = "") {
  const items = await sftp.list(remote);
  for (const item of items.sort((a, b) => a.name.localeCompare(b.name))) {
    console.log(`${indent}${item.name}${item.type === "d" ? "/" : ""}`);
    if (item.type === "d" && item.name !== "." && item.name !== "..") {
      await listDir(`${remote}/${item.name}`, indent + "  ");
    }
  }
}

try {
  console.log("wp-content/mu-plugins/");
  await listDir("wp-content/mu-plugins");
} finally {
  await sftp.end();
}
