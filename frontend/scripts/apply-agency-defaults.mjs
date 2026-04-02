/**
 * One-shot patch of docs/scraped-agencies.json (no scrape, no LLM):
 * - liveFormId + headlessFormId → 31 for every agency row
 * - officeImageUrl → fixed headless hero image
 *
 * Walks `records` (single, aggregator + subAgencies) and `agencies`.
 *
 * Afterward runs `pnpm enrich:agencies` to refresh gf-form-mapping.csv + addresses.
 *
 * Usage: pnpm -C frontend apply:agency-defaults
 */

import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const FRONTEND_ROOT = path.resolve(__dirname, "..");
const JSON_PATH = path.join(REPO_ROOT, "docs/scraped-agencies.json");

const DEFAULT_GF_ID = 31;
const DEFAULT_OFFICE_IMAGE =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2023/04/AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png";

function patchAgencyFields(obj) {
  if (obj == null || typeof obj !== "object") return;
  obj.liveFormId = DEFAULT_GF_ID;
  obj.headlessFormId = DEFAULT_GF_ID;
  obj.officeImageUrl = DEFAULT_OFFICE_IMAGE;
}

function walkRecords(records) {
  for (const rec of records || []) {
    if (rec.error) continue;
    if (rec.kind === "aggregator" && Array.isArray(rec.subAgencies)) {
      patchAgencyFields(rec);
      for (const sub of rec.subAgencies) {
        patchAgencyFields(sub);
      }
    } else {
      patchAgencyFields(rec);
    }
  }
}

function walkAgencies(agencies) {
  for (const a of agencies || []) {
    if (a.scrapeError) continue;
    if (a.kind === "aggregator_meta") continue;
    patchAgencyFields(a);
  }
}

async function main() {
  const raw = await fs.readFile(JSON_PATH, "utf8");
  const data = JSON.parse(raw);

  walkRecords(data.records);
  walkAgencies(data.agencies);

  data.agencyDefaultsAppliedAt = new Date().toISOString();
  data.agencyDefaults = {
    gravityFormId: DEFAULT_GF_ID,
    officeImageUrl: DEFAULT_OFFICE_IMAGE,
  };

  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf8");
  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Set liveFormId/headlessFormId=${DEFAULT_GF_ID} and officeImageUrl on all agency rows.`);

  console.log("\nRunning pnpm enrich:agencies ...");
  execSync("pnpm enrich:agencies", { cwd: FRONTEND_ROOT, stdio: "inherit" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
