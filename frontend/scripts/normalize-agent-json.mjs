/**
 * Post-process docs/scraped-agencies.json (no scrape / LLM):
 * 1) Agent slugs: strip trailing "-0" (first agent uses …/name/ not …/name-0/)
 * 2) Known single-agent pages missing imageUrl: set headshot URL from amerilife.com CDN
 *
 * Then runs pnpm enrich:agencies.
 *
 * Usage: pnpm -C frontend normalize:agent-json
 */

import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const FRONTEND_ROOT = path.resolve(__dirname, "..");
const JSON_PATH = path.join(REPO_ROOT, "docs/scraped-agencies.json");

/** Single-agent offices where hero/team image is known on amerilife.com (not in JSON after defaults). */
const SINGLE_AGENT_IMAGE_BY_AGENCY_SLUG = {
  charlotte: "https://amerilife.com/wp-content/uploads/2024/07/daniel-dalke-dupey-headshot-300px.png",
};

function stripTrailingAgentIndexZero(slug) {
  if (typeof slug !== "string" || !slug.endsWith("-0")) return slug;
  return slug.slice(0, -2);
}

function patchAgentsArray(agents, agencySlug) {
  if (!Array.isArray(agents)) return;
  for (const a of agents) {
    if (a?.slug) {
      a.slug = stripTrailingAgentIndexZero(a.slug);
    }
  }
  if (
    agencySlug &&
    SINGLE_AGENT_IMAGE_BY_AGENCY_SLUG[agencySlug] &&
    agents.length === 1 &&
    agents[0] &&
    !agents[0].imageUrl
  ) {
    agents[0].imageUrl = SINGLE_AGENT_IMAGE_BY_AGENCY_SLUG[agencySlug];
  }
}

function walkRecords(records) {
  for (const rec of records || []) {
    if (rec.error) continue;
    const slug = rec.slug || rec.pageSlug;
    if (rec.kind === "aggregator" && Array.isArray(rec.subAgencies)) {
      for (const sub of rec.subAgencies) {
        patchAgentsArray(sub.agents, sub.slug);
      }
    } else {
      patchAgentsArray(rec.agents, slug);
    }
  }
}

function walkAgencies(agencies) {
  for (const a of agencies || []) {
    if (a.scrapeError) continue;
    patchAgentsArray(a.agents, a.slug);
  }
}

async function main() {
  const raw = await fs.readFile(JSON_PATH, "utf8");
  const data = JSON.parse(raw);

  walkRecords(data.records);
  walkAgencies(data.agencies);

  data.agentSlugNormalizedAt = new Date().toISOString();

  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf8");
  console.log(`Wrote ${JSON_PATH} (agent slugs -0 removed, known imageUrl backfills)`);

  execSync("pnpm enrich:agencies", { cwd: FRONTEND_ROOT, stdio: "inherit" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
