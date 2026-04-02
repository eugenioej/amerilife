/**
 * Normalize and enrich docs/scraped-agencies.json for consistent import / headless use.
 * - Phones, hours, address lines, state (2-letter), ZIP
 * - mapSearchUrl (Google Maps search) + singleLineAddress for maps / embeds
 * - Texas / Florida sub-office display names
 * - Known gaps (e.g. California Vista) from public locator data
 * - Agent emails lowercase; amlHCode from email; better names from aboutOffice when possible
 *
 * Usage: pnpm -C frontend enrich:agencies
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAgentSlug } from "./lib/agent-slug.mjs";
import { dedupeAgentsByEmailOrName } from "./lib/dedupe-agents.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const JSON_PATH = path.join(REPO_ROOT, "docs/scraped-agencies.json");
const CSV_PATH = path.join(REPO_ROOT, "docs/gf-form-mapping.csv");

const ENRICH_VERSION = 1;

/** Manual fixes verified against amerilife.com / locator (fill scrape gaps). */
const SLUG_OVERRIDES = {
  california: {
    address: {
      line1: "380 S. Melrose Dr., Suite 306",
      line2: null,
      city: "Vista",
      state: "CA",
      zip: "92081",
    },
    phone: "(760) 517-6002",
  },
  polk: {
    address: {
      line1: "6322 Cypress Gardens Blvd.",
      line2: null,
      city: "Winter Haven",
      state: "FL",
      zip: "33884",
    },
  },
};

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function formatPhone(raw) {
  if (raw == null || raw === "") return null;
  const d = String(raw).replace(/\D/g, "");
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d.startsWith("1")) {
    const x = d.slice(1);
    return `(${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
  }
  return String(raw).trim();
}

function cleanHours(h) {
  if (h == null) return "Monday-Friday 8am-5pm";
  let s = String(h).replace(/\s+/g, " ").trim();
  const pmSplit = s.split(/(?<=\d\s*pm)(?=[A-Za-z])/i);
  if (pmSplit.length > 1 && /^[A-Za-z]/.test(pmSplit[1].trim())) {
    s = pmSplit[0].trim();
  }
  const m = s.match(
    /Monday\s*[-–]?\s*Friday\s+[^A-Za-z]{0,6}\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*[-–]?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)/i
  );
  if (m) return m[0].replace(/\s+/g, " ").trim();
  const m2 = s.match(/Monday\s*[-–]?\s*Friday\s+[^]{0,50}/i);
  if (m2 && m2[0].length < 55) return m2[0].trim();
  if (s.length < 8) return "Monday-Friday 8am-5pm";
  return s.slice(0, 80);
}

function cleanLine1(line) {
  if (!line) return "";
  return String(line).replace(/,\s*$/, "").trim();
}

function parseCityStateZipFromText(text) {
  const t = String(text || "");
  const m = t.match(/([0-9]{2,}[^,\n]+?),\s*([A-Z]{2})\s*(\d{5})(?:-\d{4})?/);
  if (m) {
    return { line1: m[1].trim(), city: "", state: m[2], zip: m[3] };
  }
  const m2 = t.match(/([A-Za-z .'\-]+),\s*([A-Z]{2})\s*(\d{5})/);
  if (m2) {
    return { line1: "", city: m2[1].trim(), state: m2[2], zip: m2[3] };
  }
  return null;
}

function parseParenCityFromLocationLabel(label) {
  const m = String(label || "").match(/\(([^)]+)\)\s*$/);
  if (!m) return null;
  const inner = m[1].trim();
  if (/satellite|inactive|old template/i.test(inner)) return null;
  const cityOnly = inner.split(/[\/,]/)[0].trim();
  return cityOnly || null;
}

function buildSingleLineAddress(addr) {
  const street = [addr.line1, addr.line2].filter(Boolean).join(", ");
  const csz = [addr.city, addr.state].filter(Boolean).join(", ");
  const tail = [csz, addr.zip].filter(Boolean).join(" ");
  return [street, tail].filter(Boolean).join(", ");
}

function buildMapSearchUrl(addr) {
  const single = buildSingleLineAddress(addr);
  if (!single || single.length < 8) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(single)}`;
}

function inferParentSlugFromSubSlug(slug) {
  if (!slug) return null;
  if (String(slug).startsWith("texas-")) return "texas";
  if (String(slug).startsWith("florida-")) return "florida";
  return null;
}

function texasFloridaOfficeTitle(kind, parentSlug, addr, slug) {
  const p = parentSlug || inferParentSlugFromSubSlug(slug);
  const k = kind || (p ? "sub" : "single");
  const city = addr.city || "";
  if (k === "sub" && p === "texas" && city) {
    return `AmeriLife of Texas Market — ${city}`;
  }
  if (k === "sub" && p === "florida" && city) {
    return `AmeriLife of Florida Market — ${city}`;
  }
  return null;
}

function extractManagerFromAbout(about) {
  const t = String(about || "");
  const m = t.match(
    /(?:Managing Director|Agency Manager|Office Manager)\s*:\s*([^\n]+?)(?:\n|$)/im
  );
  if (!m) return null;
  return m[1].replace(/\s+/g, " ").replace(/\s*Phone:.*$/i, "").trim();
}

function enrichAddress(addr, locationLabel, slug, aboutOffice) {
  let a = {
    line1: cleanLine1(addr?.line1),
    line2: addr?.line2 ?? null,
    city: (addr?.city || "").trim(),
    state: (addr?.state || "").trim().toUpperCase().slice(0, 2),
    zip: (addr?.zip || "").replace(/\D/g, "").slice(0, 5),
  };

  if (SLUG_OVERRIDES[slug]?.address) {
    const o = SLUG_OVERRIDES[slug].address;
    if (!a.line1 && o.line1) a.line1 = o.line1;
    if (!a.city && o.city) a.city = o.city;
    if (!a.state && o.state) a.state = o.state;
    if (!a.zip && o.zip) a.zip = o.zip;
  }

  if ((!a.city || !a.zip) && locationLabel) {
    const hint = parseParenCityFromLocationLabel(locationLabel);
    if (hint && !a.city) a.city = hint;
  }

  if ((!a.line1 || !a.city || !a.zip) && aboutOffice) {
    const parsed = parseCityStateZipFromText(aboutOffice);
    if (parsed) {
      if (!a.line1 && parsed.line1) a.line1 = cleanLine1(parsed.line1);
      if (!a.city && parsed.city) a.city = parsed.city;
      if (!a.state && parsed.state) a.state = parsed.state;
      if (!a.zip && parsed.zip) a.zip = parsed.zip;
    }
  }

  return a;
}

function enrichAgents(agents, aboutOffice, agencySlug) {
  if (!Array.isArray(agents)) return [];
  agents = dedupeAgentsByEmailOrName(agents);
  const manager = extractManagerFromAbout(aboutOffice);
  const resolved = agents.map((ag) => {
    let name = ag.name;
    if (name === "Office Contact" && manager) name = manager;
    return { name };
  });
  return agents.map((ag, i) => {
    const email = ag.email ? String(ag.email).trim().toLowerCase() : null;
    const name = resolved[i].name;
    let amlhCode = ag.amlhCode;
    if (email && !amlhCode) {
      const mm = email.match(/^(amlh[a-z0-9]*)/i);
      if (mm) amlhCode = mm[1].toUpperCase();
    }
    const role =
      ag.role === "Contact" && email?.includes("amlh")
        ? "Licensed Insurance Agent"
        : ag.role;
    const slug = buildAgentSlug(slugify, agencySlug, resolved, i);
    return {
      ...ag,
      name,
      role,
      email,
      amlhCode,
      slug,
    };
  });
}

function enrichAgency(obj) {
  const slug = obj.slug || obj.pageSlug || "";
  if (!slug) return obj;
  const addr = enrichAddress(obj.address, obj.locationLabel, slug, obj.aboutOffice);

  let phone = formatPhone(obj.phone);
  if (!phone && SLUG_OVERRIDES[slug]?.phone) phone = formatPhone(SLUG_OVERRIDES[slug].phone);

  const hours = cleanHours(obj.hours);
  let officeName = obj.officeName;
  const inferredParent = obj.parentSlug || inferParentSlugFromSubSlug(slug);
  const titleHint = texasFloridaOfficeTitle(obj.kind, inferredParent, addr, slug);
  if (titleHint) {
    officeName = titleHint;
  }
  if (
    officeName &&
    /DallasOffice|One AmeriLife, many possibilities/i.test(officeName) &&
    titleHint
  ) {
    officeName = titleHint;
  }

  let pageTitle = obj.pageTitle;
  if (pageTitle === "Connect with an Agent" && officeName) {
    pageTitle = officeName;
  }
  if (
    titleHint &&
    pageTitle &&
    /DallasOffice|One AmeriLife, many possibilities/i.test(pageTitle)
  ) {
    pageTitle = titleHint;
  }

  const aboutOffice = String(obj.aboutOffice || "").trim();
  const agents = enrichAgents(obj.agents, aboutOffice, slug);

  const singleLineAddress = buildSingleLineAddress(addr);
  const mapSearchUrl = buildMapSearchUrl(addr);

  const needsReview = [];
  if (!phone) needsReview.push("missing_phone");
  if (!addr.city || !addr.state || !addr.zip) needsReview.push("incomplete_address");
  if (!addr.line1) needsReview.push("missing_street_line");

  const out = {
    ...obj,
    pageTitle,
    officeName,
    phone,
    hours,
    address: addr,
    agents,
    aboutOffice,
    enrichment: {
      version: ENRICH_VERSION,
      enrichedAt: new Date().toISOString(),
      singleLineAddress: singleLineAddress || null,
      mapSearchUrl,
      needsReview,
    },
  };
  if (inferredParent && !out.parentSlug) out.parentSlug = inferredParent;
  if (inferParentSlugFromSubSlug(slug) && !out.kind) out.kind = "sub";
  return out;
}

function walkRecord(rec) {
  if (rec.kind === "aggregator" && Array.isArray(rec.subAgencies)) {
    return {
      ...rec,
      subAgencies: rec.subAgencies.map((s) => enrichAgency(s)),
    };
  }
  return enrichAgency(rec);
}

async function main() {
  const raw = await fs.readFile(JSON_PATH, "utf8");
  const data = JSON.parse(raw);

  data.records = (data.records || []).map((r) => walkRecord(r));
  data.agencies = (data.agencies || []).map((a) => {
    if (a.kind === "aggregator_meta") {
      return {
        ...a,
        enrichment: {
          version: ENRICH_VERSION,
          enrichedAt: new Date().toISOString(),
          note: "Market hub — child offices listed in subSlugs",
        },
      };
    }
    return enrichAgency(a);
  });

  data.enrichedAt = new Date().toISOString();
  data.enrichVersion = ENRICH_VERSION;

  await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf8");

  const lines = ["slug,live_form_id,headless_form_id,source_url,single_line_address,map_search_url"];
  for (const a of data.agencies || []) {
    if (a.kind === "aggregator_meta" || a.scrapeError) continue;
    const slug = a.slug || "";
    const lid = a.liveFormId ?? "";
    const hid = a.headlessFormId ?? "";
    const src = String(a.sourceUrl || "").replace(/"/g, '""');
    const sla = String(a.enrichment?.singleLineAddress || "").replace(/"/g, '""');
    const mapu = String(a.enrichment?.mapSearchUrl || "").replace(/"/g, '""');
    lines.push(`"${slug}",${lid},${hid},"${src}","${sla}","${mapu}"`);
  }
  await fs.writeFile(CSV_PATH, lines.join("\n") + "\n", "utf8");

  const need = (data.agencies || []).filter(
    (a) => a.enrichment?.needsReview?.length && !a.scrapeError && a.kind !== "aggregator_meta"
  );
  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Wrote ${CSV_PATH} (${lines.length - 1} rows)`);
  console.log(`Agencies with needsReview flags: ${need.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
