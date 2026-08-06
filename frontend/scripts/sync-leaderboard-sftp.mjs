#!/usr/bin/env node
/**
 * Pull brokerage Sales Leaderboard CSVs from AmeriLife outbound SFTP.
 *
 * Files land in /outbound as Product_MMDDYYYY.csv (usually weekly). This job is
 * safe to run daily: it downloads only new/changed files, archives them, and
 * writes a sync log + latest parsed tables.json.
 *
 * Usage (from frontend/):
 *   pnpm sync:leaderboard-sftp
 *   pnpm sync:leaderboard-sftp -- --list
 *   pnpm sync:leaderboard-sftp -- --dry-run
 *
 * Env (frontend/.env.local or repo root .env.local):
 *   LEADERBOARD_SFTP_HOST=sftp.amerilife.com
 *   LEADERBOARD_SFTP_PORT=22
 *   LEADERBOARD_SFTP_USER=tab_idxch
 *   LEADERBOARD_SFTP_PASSWORD=***
 *   LEADERBOARD_SFTP_REMOTE_DIR=/outbound
 *   LEADERBOARD_SFTP_LOCAL_DIR=  (optional; default frontend/.cache/leaderboard-sftp)
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
  copyFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import SftpClient from "ssh2-sftp-client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const PRODUCT_MAP = {
  Life: "life",
  "Life-FE": "life-fe",
  "Life-Non-FE": "life-non-fe",
  Annuity: "annuity-production",
  MedSup: "medicare-supplement",
  MA: "medicare-advantage",
  "Health-Specialty": "health-specialty",
  // Brooke: one more O&E file coming. EO_*.csv is present today with a different schema.
  EO: "oe",
  OE: "oe",
  "O&E": "oe",
};

const STANDARD_PRODUCTS = new Set([
  "life",
  "life-fe",
  "life-non-fe",
  "annuity-production",
  "medicare-supplement",
  "medicare-advantage",
  "health-specialty",
]);

/** E&O / O&E uses Affiliate + New Policies (ranked names), not YTD/%. */
const EO_PRODUCTS = new Set(["oe"]);

function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
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
    if (!process.env[key]) process.env[key] = val;
  }
}

["../.env", "../.env.local", ".env", ".env.local"].forEach((f) =>
  loadEnv(join(ROOT, f)),
);

const args = new Set(process.argv.slice(2));
const listOnly = args.has("--list") || args.has("-l");
const dryRun = args.has("--dry-run");

const host = (process.env.LEADERBOARD_SFTP_HOST || "sftp.amerilife.com").trim();
const port = Number(process.env.LEADERBOARD_SFTP_PORT || "22");
const username = process.env.LEADERBOARD_SFTP_USER?.trim();
const password = process.env.LEADERBOARD_SFTP_PASSWORD?.trim();
const remoteDir = (process.env.LEADERBOARD_SFTP_REMOTE_DIR || "/outbound").trim();
const localRoot = (
  process.env.LEADERBOARD_SFTP_LOCAL_DIR || join(ROOT, ".cache/leaderboard-sftp")
).trim();

if (!username || !password) {
  console.error(
    "Missing LEADERBOARD_SFTP_USER / LEADERBOARD_SFTP_PASSWORD in .env.local",
  );
  process.exit(1);
}

function ensureDir(p) {
  mkdirSync(p, { recursive: true });
}

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function stripBom(text) {
  return text.replace(/^\uFEFF/, "");
}

/** Filename: Product_MMDDYYYY.csv → { productKey, reportDate, slug } */
function parseRemoteName(name) {
  const m = /^(.+)_(\d{8})\.csv$/i.exec(name);
  if (!m) return null;
  const productKey = m[1];
  const mmddyyyy = m[2];
  const slug = PRODUCT_MAP[productKey];
  if (!slug) return null;
  const mm = mmddyyyy.slice(0, 2);
  const dd = mmddyyyy.slice(2, 4);
  const yyyy = mmddyyyy.slice(4, 8);
  const reportDate = `${yyyy}-${mm}-${dd}`;
  if (Number.isNaN(Date.parse(reportDate))) return null;
  return { productKey, reportDate, slug, mmddyyyy };
}

function parseCsv(text) {
  const content = stripBom(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = content.split("\n").filter((l) => l.trim() !== "");
  if (lines.length < 2) return { header: [], rows: [] };

  const rows = [];
  for (const line of lines) {
    rows.push(parseCsvLine(line));
  }
  return { header: rows[0], rows: rows.slice(1) };
}

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function normalizeHeader(cell) {
  return String(cell || "")
    .toLowerCase()
    .trim()
    .replace(/[\s\-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function headerIndices(rawHeader) {
  const normalized = rawHeader.map(normalizeHeader);
  const find = (...names) => {
    for (const name of names) {
      const i = normalized.indexOf(name);
      if (i !== -1) return i;
    }
    return null;
  };

  const affiliate = find(
    "affiliate",
    "affiliate_name",
    "affiliate_group",
    "name",
    "company",
  );
  let trend = find(
    "trend",
    "trend_indicator",
    "indicator",
    "arrow",
    "direction",
    "status",
  );
  if (trend === null) {
    const sym = rawHeader.findIndex((h) => /[▲▼⬤]/.test(String(h || "")));
    if (sym !== -1) trend = sym;
  }

  // Prefer the literal "vs LYTD" column over a symbol header that normalizes to vs_lytd.
  let vsLytd = null;
  for (let i = 0; i < rawHeader.length; i++) {
    if (normalizeHeader(rawHeader[i]) === "vs_lytd" && !/[▲▼⬤]/.test(String(rawHeader[i] || ""))) {
      vsLytd = i;
      break;
    }
  }
  if (vsLytd === null) vsLytd = find("vs_lytd", "vslytd", "vs_ly", "vs_last_year", "vs_last_ytd");

  const newPolicies = find(
    "new_policies",
    "new_policy",
    "newpolicies",
    "policies",
    "policy_count",
  );

  return {
    affiliate,
    ytd: find("ytd", "ytd_amount", "ytd_production"),
    lytd: find("lytd", "lytd_amount", "lytd_production"),
    vs_lytd: vsLytd,
    vs_lqtd: find("vs_lqtd", "vslqtd", "vs_last_quarter", "vs_lq"),
    vs_lmtd: find("vs_lmtd", "vslmtd", "vs_last_month", "vs_lm"),
    trend,
    new_policies: newPolicies,
  };
}

function isEoSchema(idx) {
  return idx.new_policies !== null && idx.ytd === null;
}

/** "1. Pinnacle Financial Services" → { rank: "1", affiliate: "Pinnacle Financial Services" } */
function splitRankedAffiliate(raw) {
  const s = String(raw || "").trim();
  const m = /^(\d+)\.\s*(.+)$/.exec(s);
  if (!m) return { rank: "", affiliate: s };
  return { rank: m[1], affiliate: m[2].trim() };
}

function mapTrend(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  if (/▲/.test(s) || /^up$/i.test(s)) return "up";
  if (/▼/.test(s) || /^down$/i.test(s)) return "down";
  if (/[⬤●○◯]/.test(s) || /^flat$/i.test(s)) return "flat";
  return s;
}

function rowsFromCsv(text) {
  const { header, rows } = parseCsv(text);
  const idx = headerIndices(header);
  if (idx.affiliate === null) {
    return { error: "missing affiliate column", rows: [] };
  }

  const cell = (cells, key) =>
    idx[key] !== null && idx[key] !== undefined
      ? String(cells[idx[key]] ?? "").trim()
      : "";

  // E&O schema: Affiliate + New Policies (names often ranked "1. Name").
  if (isEoSchema(idx)) {
    const out = [];
    for (const cells of rows) {
      const rawAffiliate = String(cells[idx.affiliate] ?? "").trim();
      if (!rawAffiliate) continue;
      const newPolicies = cell(cells, "new_policies");
      if (!newPolicies) continue;
      const { rank, affiliate } = splitRankedAffiliate(rawAffiliate);
      out.push({
        affiliate,
        rank,
        ytd: newPolicies,
        lytd: "",
        vs_lytd: "",
        vs_lqtd: "",
        vs_lmtd: "",
        trend: "",
        schema: "eo",
      });
    }
    return { error: null, rows: out, header, schema: "eo" };
  }

  const out = [];
  for (const cells of rows) {
    const affiliate = String(cells[idx.affiliate] ?? "").trim();
    if (!affiliate) continue;
    out.push({
      affiliate,
      ytd: cell(cells, "ytd"),
      lytd: cell(cells, "lytd"),
      vs_lytd: cell(cells, "vs_lytd"),
      vs_lqtd: cell(cells, "vs_lqtd"),
      vs_lmtd: cell(cells, "vs_lmtd"),
      trend: mapTrend(cell(cells, "trend")),
    });
  }
  return { error: null, rows: out, header, schema: "standard" };
}

function loadManifest(path) {
  if (!existsSync(path)) return { files: {} };
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return { files: {} };
  }
}

function appendLog(logPath, entry) {
  appendFileSync(logPath, `${JSON.stringify(entry)}\n`, "utf8");
}

function isoNow() {
  return new Date().toISOString();
}

async function main() {
  ensureDir(localRoot);
  const archiveRoot = join(localRoot, "archive");
  const latestRoot = join(localRoot, "latest");
  const manifestPath = join(localRoot, "manifest.json");
  const logPath = join(localRoot, "sync-log.jsonl");
  ensureDir(archiveRoot);
  ensureDir(latestRoot);

  const sftp = new SftpClient();
  const started = isoNow();
  console.log(`Connecting ${username}@${host}:${port} …`);

  await sftp.connect({
    host,
    port,
    username,
    password,
    readyTimeout: 30000,
  });

  try {
    const items = await sftp.list(remoteDir);
    const csvFiles = items
      .filter((i) => i.type === "-" && /\.csv$/i.test(i.name) && !i.name.startsWith("."))
      .sort((a, b) => (b.modifyTime || 0) - (a.modifyTime || 0));

    console.log(`Remote ${remoteDir}: ${csvFiles.length} CSV file(s)`);

    if (listOnly) {
      for (const f of csvFiles) {
        const meta = parseRemoteName(f.name);
        const mtime = f.modifyTime ? new Date(f.modifyTime).toISOString() : "";
        console.log(
          [
            f.name.padEnd(36),
            String(f.size).padStart(8),
            mtime,
            meta ? `${meta.slug} @ ${meta.reportDate}` : "(unmapped)",
          ].join("  "),
        );
      }
      return;
    }

    const manifest = loadManifest(manifestPath);
    const downloaded = [];
    const skipped = [];
    const byReportDate = new Map();

    for (const f of csvFiles) {
      const meta = parseRemoteName(f.name);
      const remotePath = `${remoteDir.replace(/\/$/, "")}/${f.name}`;
      const prev = manifest.files[f.name];
      const same =
        prev &&
        prev.size === f.size &&
        prev.modifyTime === f.modifyTime;

      if (same && existsSync(join(archiveRoot, prev.reportDate || "unknown", f.name))) {
        skipped.push(f.name);
        if (meta) {
          const list = byReportDate.get(meta.reportDate) || [];
          list.push({ ...meta, name: f.name, size: f.size, modifyTime: f.modifyTime });
          byReportDate.set(meta.reportDate, list);
        }
        continue;
      }

      if (dryRun) {
        console.log(`[dry-run] would download ${f.name}`);
        downloaded.push({ name: f.name, dryRun: true });
        continue;
      }

      const buf = await sftp.get(remotePath);
      const hash = sha256(buf);
      const reportDate = meta?.reportDate || "unknown";
      const dayDir = join(archiveRoot, reportDate);
      ensureDir(dayDir);
      const localPath = join(dayDir, f.name);
      writeFileSync(localPath, buf);

      const parsed = rowsFromCsv(buf.toString("utf8"));
      manifest.files[f.name] = {
        size: f.size,
        modifyTime: f.modifyTime,
        mtimeIso: f.modifyTime ? new Date(f.modifyTime).toISOString() : null,
        sha256: hash,
        reportDate,
        slug: meta?.slug || null,
        productKey: meta?.productKey || null,
        rowCount: parsed.rows.length,
        parseError: parsed.error,
        localPath: localPath.replace(ROOT + "/", ""),
        downloadedAt: isoNow(),
      };

      downloaded.push({
        name: f.name,
        reportDate,
        slug: meta?.slug || null,
        rows: parsed.rows.length,
        error: parsed.error,
      });

      if (meta) {
        const list = byReportDate.get(meta.reportDate) || [];
        list.push({ ...meta, name: f.name, size: f.size, modifyTime: f.modifyTime, localPath, parsed });
        byReportDate.set(meta.reportDate, list);
      }

      console.log(
        `↓ ${f.name} → archive/${reportDate}/ (${parsed.rows.length} rows${parsed.error ? `; ${parsed.error}` : ""})`,
      );
    }

    // Rebuild latest/ + tables.json from newest report date that has standard products.
    // E&O may ship on a different cadence/date — attach the newest EO file separately.
    const reportDates = [...byReportDate.keys()]
      .filter((d) => d !== "unknown")
      .sort()
      .reverse();

    let latestReportDate = null;
    let latestTables = [];

    for (const rd of reportDates) {
      const files = byReportDate.get(rd) || [];
      const standard = files.filter((f) => STANDARD_PRODUCTS.has(f.slug));
      if (standard.length === 0) continue;
      latestReportDate = rd;
      for (const f of standard) {
        const src =
          f.localPath ||
          join(archiveRoot, rd, f.name);
        if (!existsSync(src)) continue;
        const dest = join(latestRoot, f.name);
        if (!dryRun) copyFileSync(src, dest);
        const text = readFileSync(src, "utf8");
        const parsed = f.parsed || rowsFromCsv(text);
        if (STANDARD_PRODUCTS.has(f.slug) && !parsed.error) {
          latestTables.push({
            slug: f.slug,
            productKey: f.productKey,
            filename: f.name,
            report_date: rd,
            schema: parsed.schema || "standard",
            rows: parsed.rows,
          });
        }
      }
      break;
    }

    let latestEo = null;
    for (const rd of reportDates) {
      const files = byReportDate.get(rd) || [];
      const eoFile = files.find((f) => EO_PRODUCTS.has(f.slug));
      if (!eoFile) continue;
      const src = eoFile.localPath || join(archiveRoot, rd, eoFile.name);
      if (!existsSync(src)) continue;
      const text = readFileSync(src, "utf8");
      const parsed = eoFile.parsed || rowsFromCsv(text);
      if (parsed.error || parsed.rows.length === 0) continue;
      if (!dryRun) copyFileSync(src, join(latestRoot, eoFile.name));
      latestEo = {
        slug: eoFile.slug,
        productKey: eoFile.productKey,
        filename: eoFile.name,
        report_date: rd,
        schema: "eo",
        rows: parsed.rows,
      };
      break;
    }
    if (latestEo) latestTables.push(latestEo);

    if (!dryRun && latestTables.length) {
      const tablesPath = join(latestRoot, "tables.json");
      writeFileSync(
        tablesPath,
        JSON.stringify(
          {
            source: "sftp.amerilife.com/outbound",
            report_date: latestReportDate,
            eo_report_date: latestEo?.report_date ?? null,
            pulled_at: isoNow(),
            tables: latestTables,
          },
          null,
          2,
        ),
      );
      console.log(
        `latest tables.json: report_date=${latestReportDate}, tables=${latestTables.length}` +
          (latestEo ? `, eo@${latestEo.report_date} (${latestEo.rows.length} rows)` : ", no eo"),
      );
    }

    manifest.lastSyncAt = isoNow();
    manifest.latestReportDate = latestReportDate;
    manifest.host = host;
    manifest.remoteDir = remoteDir;
    if (!dryRun) {
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    }

    const summary = {
      at: started,
      finishedAt: isoNow(),
      host,
      remoteDir,
      remoteCsvCount: csvFiles.length,
      downloaded: downloaded.length,
      skippedUnchanged: skipped.length,
      latestReportDate,
      latestTableCount: latestTables.length,
      dryRun,
      files: downloaded,
    };
    if (!dryRun) appendLog(logPath, summary);

    console.log(
      JSON.stringify(
        {
          ok: true,
          downloaded: downloaded.length,
          skippedUnchanged: skipped.length,
          latestReportDate,
          tables: latestTables.map((t) => ({
            slug: t.slug,
            rows: t.rows.length,
          })),
        },
        null,
        2,
      ),
    );
  } finally {
    await sftp.end();
  }
}

main().catch((err) => {
  console.error("sync-leaderboard-sftp failed:", err?.message || err);
  process.exit(2);
});
