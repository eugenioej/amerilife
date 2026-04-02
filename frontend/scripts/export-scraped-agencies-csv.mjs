/**
 * Export docs/scraped-agencies.json to CSV (agencies + one row per agent).
 * Usage: node scripts/export-scraped-agencies-csv.mjs
 * Output: docs/scraped-agencies-offices.csv, docs/scraped-agencies-agents.csv
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const JSON_PATH = path.join(REPO_ROOT, "docs/scraped-agencies.json");
const OUT_OFFICES = path.join(REPO_ROOT, "docs/scraped-agencies-offices.csv");
const OUT_AGENTS = path.join(REPO_ROOT, "docs/scraped-agencies-agents.csv");

function escapeCsv(val) {
  if (val == null) return "";
  const s = String(val);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function row(cols) {
  return cols.map(escapeCsv).join(",") + "\n";
}

function walkAgenciesFromRecords(records) {
  const out = [];
  for (const rec of records || []) {
    if (rec.error || rec.scrapeError) continue;
    if (rec.kind === "aggregator" && Array.isArray(rec.subAgencies)) {
      for (const sub of rec.subAgencies) {
        out.push({
          ...sub,
          kind: "sub",
          parentSlug: rec.pageSlug,
          sourceUrl: rec.sourceUrl,
          cmsStatus: rec.cmsStatus,
          locationLabel: rec.locationLabel,
          notes: rec.notes,
          liveFormId: rec.liveFormId,
          headlessFormId: rec.headlessFormId,
          officeImageUrl: rec.officeImageUrl,
        });
      }
    } else if (rec.kind === "single" || rec.slug) {
      const { pageSlug, ...rest } = rec;
      out.push({
        ...rest,
        slug: rest.slug || pageSlug,
        kind: rest.kind || "single",
      });
    }
  }
  return out;
}

async function main() {
  const raw = await fs.readFile(JSON_PATH, "utf8");
  const data = JSON.parse(raw);

  let agencies = Array.isArray(data.agencies) ? [...data.agencies] : [];
  agencies = agencies.filter((a) => a && a.kind !== "aggregator_meta" && !a.scrapeError);
  if (agencies.length === 0 && Array.isArray(data.records)) {
    agencies = walkAgenciesFromRecords(data.records);
  }

  const officeHeaders = [
    "kind",
    "agency_slug",
    "parent_slug",
    "officeName",
    "pageTitle",
    "phone",
    "hours",
    "address_line1",
    "address_line2",
    "city",
    "state",
    "zip",
    "singleLineAddress",
    "mapSearchUrl",
    "sourceUrl",
    "cmsStatus",
    "locationLabel",
    "notes",
    "liveFormId",
    "headlessFormId",
    "officeImageUrl",
    "needsReview",
    "agent_count",
  ];

  const agentHeaders = [
    "agency_kind",
    "agency_slug",
    "parent_slug",
    "officeName",
    "city",
    "state",
    "zip",
    "phone",
    "sourceUrl",
    "locationLabel",
    "notes",
    "liveFormId",
    "agent_name",
    "agent_role",
    "agent_email",
    "agent_amlhCode",
    "agent_slug",
    "agent_imageUrl",
    "mapSearchUrl",
    "needsReview",
  ];

  let officesCsv = row(officeHeaders);
  let agentsCsv = row(agentHeaders);

  for (const A of agencies) {
    const addr = A.address || {};
    const enr = A.enrichment || {};
    const slug = A.slug || "";
    const parent = A.parentSlug || "";
    const needs = Array.isArray(enr.needsReview) ? enr.needsReview.join("; ") : "";
    const agents = Array.isArray(A.agents) ? A.agents : [];

    officesCsv += row([
      A.kind || "",
      slug,
      parent,
      A.officeName || "",
      A.pageTitle || "",
      A.phone ?? "",
      A.hours ?? "",
      addr.line1 ?? "",
      addr.line2 ?? "",
      addr.city ?? "",
      addr.state ?? "",
      addr.zip ?? "",
      enr.singleLineAddress ?? "",
      enr.mapSearchUrl ?? "",
      A.sourceUrl ?? "",
      A.cmsStatus ?? "",
      A.locationLabel ?? "",
      A.notes ?? "",
      A.liveFormId ?? "",
      A.headlessFormId ?? "",
      A.officeImageUrl ?? "",
      needs,
      agents.length,
    ]);

    for (const G of agents) {
      agentsCsv += row([
        A.kind || "",
        slug,
        parent,
        A.officeName || "",
        addr.city ?? "",
        addr.state ?? "",
        addr.zip ?? "",
        A.phone ?? "",
        A.sourceUrl ?? "",
        A.locationLabel ?? "",
        A.notes ?? "",
        A.liveFormId ?? "",
        G.name ?? "",
        G.role ?? "",
        G.email ?? "",
        G.amlhCode ?? "",
        G.slug ?? "",
        G.imageUrl ?? "",
        enr.mapSearchUrl ?? "",
        needs,
      ]);
    }
  }

  await fs.writeFile(OUT_OFFICES, officesCsv, "utf8");
  await fs.writeFile(OUT_AGENTS, agentsCsv, "utf8");
  console.log(`Wrote ${OUT_OFFICES}`);
  console.log(`Wrote ${OUT_AGENTS} (${agencies.reduce((n, a) => n + (a.agents?.length || 0), 0)} agent rows)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
