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

const sftp = new SftpClient();
await sftp.connect({
  host: process.env.HEADLESS_SFTP_HOST || "headlessameril.sftp.wpengine.com",
  port: Number(process.env.HEADLESS_SFTP_PORT || "2222"),
  username: process.env.HEADLESS_SFTP_USER?.trim(),
  password: process.env.HEADLESS_SFTP_PASSWORD?.trim(),
});

async function listDir(remote, indent = "") {
  const items = await sftp.list(remote);
  for (const item of items.sort((a, b) => a.name.localeCompare(b.name))) {
    if (item.name === "." || item.name === "..") continue;
    console.log(`${indent}${item.name}${item.type === "d" ? "/" : ""}`);
    if (item.type === "d") {
      await listDir(`${remote}/${item.name}`, indent + "  ");
    }
  }
}

try {
  console.log("wp-content/plugins/ (amerilife + ideaxchange matches):\n");
  const items = await sftp.list("wp-content/plugins");
  for (const item of items.sort((a, b) => a.name.localeCompare(b.name))) {
    const n = item.name.toLowerCase();
    if (n.includes("amerilife") || n.includes("ideaxchange")) {
      console.log(`${item.name}${item.type === "d" ? "/" : ""}`);
      if (item.type === "d") await listDir(`wp-content/plugins/${item.name}`, "  ");
    }
  }
} finally {
  await sftp.end();
}
