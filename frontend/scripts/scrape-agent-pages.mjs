/**
 * Scrape amerilife.com "Find an Agent" office pages from docs/agent-pages-map.csv.
 * Outputs docs/scraped-agencies.json and docs/gf-form-mapping.csv
 *
 * Usage:
 *   pnpm -C frontend scrape:agencies
 *   pnpm -C frontend scrape:agencies -- --only=polk-county,texas
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";
import { buildAgentSlug } from "./lib/agent-slug.mjs";
import { dedupeAgentsByEmailOrName } from "./lib/dedupe-agents.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const CSV_PATH = path.join(REPO_ROOT, "docs/agent-pages-map.csv");
const OUT_JSON = path.join(REPO_ROOT, "docs/scraped-agencies.json");
const OUT_GF_CSV = path.join(REPO_ROOT, "docs/gf-form-mapping.csv");

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const DEFAULT_FEATURES = [
  {
    heading: "Medicare Plans",
    body: "Navigate your Medicare options with confidence through comprehensive plan choices designed to support your health and wellbeing.",
    icon: "medicare",
  },
  {
    heading: "Voluntary Health Insurance Plans",
    body: "Enhance your coverage with supplemental plans that help protect you from unexpected healthcare expenses and life's surprises.",
    icon: "health",
  },
  {
    heading: "Life Insurance Plans",
    body: "Protect what matters most with life insurance solutions that provide financial security and peace of mind for you and your loved ones.",
    icon: "life",
  },
  {
    heading: "Annuities",
    body: "Strengthen your retirement strategy with annuity options that offer guaranteed income, safeguard your savings, and help build long-term stability.",
    icon: "annuity",
  },
];

/** @typedef {{ location: string, link: string, cmsStatus: string, inSitemap: string, notes: string }} CsvRow */

function parseCsvLine(line) {
  const result = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (c === "," && !inQuotes) {
      result.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  result.push(cur);
  return result;
}

function shouldSkipRow(row) {
  const link = row.link.trim();
  const loc = row.location.toLowerCase();
  const notes = (row.notes || "").toLowerCase();
  if (!link || /^url\s*not\s*found$/i.test(link)) return true;
  if (/find-an-agent-near-you|\/locator\/|find-an-agent-results/i.test(link)) return true;
  if (/centralfloridatv|paid ads|ads-amerilife/i.test(link) || loc.includes("paid ads")) return true;
  if (notes.includes("paid ads")) return true;
  return false;
}

function slugFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1]?.toLowerCase() || "";
  } catch {
    return "";
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/**
 * Page body content (excludes footer global GF embeds).
 * @param {import('node-html-parser').HTMLElement} root
 */
function getContentScope(root) {
  return (
    root.querySelector(".et-l--post") ||
    root.querySelector(".et_builder_inner_content") ||
    root.querySelector("article") ||
    root
  );
}

/**
 * Prefer the in-page "Find an agent" / zip form over newsletter or other GF blocks.
 * @param {import('node-html-parser').HTMLElement} scope
 */
function extractLiveFormId(scope) {
  const forms = scope.querySelectorAll("form[data-formid]");
  if (forms.length === 0) {
    const w = scope.querySelector('div[id^="gform_wrapper_"]');
    const id = w?.getAttribute("id")?.match(/gform_wrapper_(\d+)/);
    return id ? parseInt(id[1], 10) : null;
  }
  if (forms.length === 1) {
    return parseInt(forms[0].getAttribute("data-formid") || "", 10);
  }
  for (const f of forms) {
    const blob = f.toString();
    if (/Enter Zip|placeholder\s*=\s*['\"]Enter Zip|address_zip|gfield--type-address/i.test(blob)) {
      return parseInt(f.getAttribute("data-formid") || "", 10);
    }
  }
  for (const f of forms) {
    const blob = f.toString();
    if (/Connect with an Agent|Find an Agent/i.test(blob)) {
      return parseInt(f.getAttribute("data-formid") || "", 10);
    }
  }
  return parseInt(forms[forms.length - 1].getAttribute("data-formid") || "", 10);
}

/**
 * @param {import('node-html-parser').HTMLElement} scope
 */
function extractHeroImage(scope) {
  const img =
    scope.querySelector(".et_pb_section:first-of-type img[src*='wp-content']") ||
    scope.querySelector("img[src*='wp-content/uploads']");
  const src = img?.getAttribute("src");
  if (src && /^https?:\/\//i.test(src)) return src;
  return null;
}

const EMAIL_RE = /(AMLH[A-Za-z0-9]*@[Aa]meri[Ll]ife\.com)/gi;

function normalizeEmail(s) {
  return s.replace(/mailto:/gi, "").trim();
}

/**
 * Parse one office block from inner HTML of et_pb_text_inner (usually one <p>).
 * @param {string} blockHtml
 */
function parseOfficeParagraph(blockHtml) {
  const root = parse(blockHtml);
  const text = root.text;
  const emails = [];
  let m;
  const re = /(AMLH[A-Za-z0-9]*@[Aa]meri[Ll]ife\.com)/gi;
  while ((m = re.exec(text)) !== null) {
    emails.push(normalizeEmail(m[1]));
  }
  root.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
    const h = a.getAttribute("href") || "";
    const addr = h.replace(/^mailto:/i, "").trim();
    if (/AMLH/i.test(addr) || /@amerilife\.com/i.test(addr)) {
      if (!emails.some((e) => e.toLowerCase() === addr.toLowerCase())) emails.push(addr);
    }
  });

  let phone = null;
  const tel = root.querySelector('a[href^="tel:"]');
  if (tel) {
    const href = tel.getAttribute("href") || "";
    phone = href.replace(/^tel:/i, "").replace(/\D/g, "");
    if (phone.length === 10) phone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    else phone = tel.text.trim();
  } else {
    const pm = text.match(/Phone:?\s*([\d().\s-]{10,})/i);
    if (pm) phone = pm[1].trim();
  }

  let hours = null;
  const hm = text.match(/Hours:\s*([^\n]+)/i);
  if (hm) hours = hm[1].trim();

  /** @type {{ name: string, role: string, email: string, amlhCode: string|null }[]} */
  const agents = [];
  const strongs = root.querySelectorAll("strong");
  for (const s of strongs) {
    const line = s.text;
    const roleMatch = line.match(/^(Managing Director|Agency Manager|Office Manager|Agent)\s*:\s*(.+)$/i);
    if (roleMatch) {
      const role = roleMatch[1].trim();
      let name = roleMatch[2].trim();
      name = name.replace(/\s+/g, " ");
      const p = s.parentNode;
      const block = p ? parse(p.toString()).text : text;
      let email = null;
      const em = block.match(EMAIL_RE);
      if (em && em[0]) email = normalizeEmail(em[0]);

      agents.push({
        name,
        role,
        email: email || emails[0] || null,
        amlhCode: email ? email.match(/^(AMLH[A-Za-z0-9]*)/i)?.[1] ?? null : null,
      });
    }
  }

  if (agents.length === 0 && emails.length > 0) {
    agents.push({
      name: "Office Contact",
      role: "Contact",
      email: emails[0],
      amlhCode: emails[0].match(/^(AMLH[A-Za-z0-9]*)/i)?.[1] ?? null,
    });
  }

  let line1 = "";
  let city = "";
  let state = "";
  let zip = "";
  const lines = text.split(/\n|<br\s*\/?>/i).map((l) => l.trim()).filter(Boolean);
  const streetLine = lines.find(
    (l) =>
      /\d/.test(l) &&
      /(suite|ste\.|blvd|avenue|ave|road|rd\.|street|st\.|dr\.|drive|loop|parkway|hwy|court|ct\.|#)/i.test(
        l
      )
  );
  if (streetLine) line1 = streetLine.replace(/^[\s,]+/, "").trim();

  for (const line of lines) {
    const am = line.match(/^(.+?),?\s*([A-Z]{2})\s*(\d{5})(?:-\d{4})?$/);
    if (am) {
      const left = am[1].replace(/,\s*$/, "").trim();
      if (!city && /[a-z]/i.test(left)) {
        city = left;
        state = am[2];
        zip = am[3];
      }
      break;
    }
  }
  if (!city) {
    const loose = text.match(
      /([A-Za-z0-9\s.#]+(?:Suite|Ste|Rd|Dr|St|Blvd|Ave|Lane|Ln|Loop|Parkway|Court|Hwy)[^,\n]*),?\s*([A-Z]{2})\s*(\d{5})/
    );
    if (loose) {
      if (!line1) line1 = loose[1].trim();
      const tail = text.match(/([A-Za-z .'-]+),\s*([A-Z]{2})\s*(\d{5})/);
      if (tail) {
        city = tail[1].trim();
        state = tail[2];
        zip = tail[3];
      }
    }
  }

  const addrLine = text
    .split(/\n/)
    .find((l) => /\d/.test(l) && /,?\s*[A-Z]{2}\s*\d{5}/.test(l));
  if (addrLine && !line1) line1 = addrLine.split(",")[0].trim();

  return {
    rawText: text.slice(0, 2000),
    phone,
    hours: hours || "Monday-Friday 8am-5pm",
    address: { line1, line2: null, city, state, zip },
    agents,
    emails,
  };
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/**
 * @param {import('node-html-parser').HTMLElement} scope
 */
function extractOfficeInfoBlock(scope) {
  const office = scope.querySelector(".office-info");
  if (!office) return null;
  const text = office.text.replace(/\s+/g, " ").trim();
  let phone = null;
  const tel = office.querySelector('a[href^="tel:"]');
  if (tel) {
    const d = tel.getAttribute("href")?.replace(/^tel:\+?/i, "") || "";
    if (d.length >= 10) {
      const p = d.replace(/\D/g, "");
      if (p.length === 10) phone = `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}`;
    }
  }
  let line1 = "";
  let city = "";
  let state = "";
  let zip = "";
  const addrCol = office.querySelector(".address-inner-col");
  if (addrCol) {
    const lines = addrCol.querySelectorAll("div");
    const parts = [];
    lines.forEach((d) => {
      const t = d.text.trim();
      if (t) parts.push(t);
    });
    if (parts[0]) line1 = parts[0];
    const last = parts[parts.length - 1] || "";
    const m = last.match(/^(.+),\s*([A-Z]{2})\s*(\d{5})(?:,\s*USA)?$/i);
    if (m) {
      city = m[1].trim();
      state = m[2].toUpperCase();
      zip = m[3];
    }
  }
  let hours = "Monday-Friday 8am-5pm";
  const hm = text.match(/Hours:\s*(Monday[^<]+)/i);
  if (hm) hours = hm[1].replace(/\s+/g, " ").trim();
  return { phone, hours, address: { line1, line2: null, city, state, zip }, rawText: text };
}

function normalizeAgentImgSrc(src) {
  if (!src || typeof src !== "string") return null;
  const s = src.trim();
  if (!/^https?:\/\//i.test(s)) return null;
  if (!/\.(jpe?g|png|gif|webp)(\?|$)/i.test(s) && !/\/wp-content\//i.test(s)) return null;
  return s;
}

/**
 * DOM `Node.contains` is not implemented on node-html-parser nodes; walk parent chain.
 * @param {import('node-html-parser').HTMLElement} ancestor
 * @param {import('node-html-parser').HTMLElement} descendant
 */
function nodeContainsDescendant(ancestor, descendant) {
  let n = descendant;
  while (n) {
    if (n === ancestor) return true;
    n = n.parentNode;
  }
  return false;
}

/**
 * Headshot in team row: image in same .et_pb_text_inner, or sibling column in same .et_pb_row.
 * @param {import('node-html-parser').HTMLElement} inner
 */
function pickAgentImageUrl(inner) {
  const img =
    inner.querySelector("img[src*='wp-content']") ||
    inner.querySelector("img[src^='http']");
  let src = normalizeAgentImgSrc(img?.getAttribute("src") || "");
  if (src) return src;

  const row = inner.closest(".et_pb_row");
  if (!row) return null;
  for (const col of row.querySelectorAll(".et_pb_column")) {
    if (nodeContainsDescendant(col, inner)) continue;
    const im = col.querySelector("img[src*='wp-content'], img[src^='http']");
    src = normalizeAgentImgSrc(im?.getAttribute("src") || "");
    if (src) return src;
  }
  return null;
}

/**
 * Team cards: h3 name + mailto (Polk-style).
 * @param {import('node-html-parser').HTMLElement} scope
 */
/**
 * Charlotte-style: bold name + mailto, no h3 team card.
 * @param {import('node-html-parser').HTMLElement} scope
 */
function extractAgentsFromBoldBlocks(scope) {
  /** @type {{ name: string; role: string; email: string | null; amlhCode: string | null; slugHint: string; imageUrl: string | null }[]} */
  const agents = [];
  const inners = scope.querySelectorAll(".et_pb_text_inner");
  for (const inner of inners) {
    if (inner.querySelector("h3")) continue;
    const mail = inner.querySelector('a[href^="mailto:"]');
    const email = mail ? mail.getAttribute("href")?.replace(/^mailto:/i, "").trim() ?? null : null;
    if (!email && !/AMLH/i.test(inner.text)) continue;
    const strong = inner.querySelector("p strong:first-of-type, strong:first-of-type");
    if (!strong) continue;
    let name = strong.text.replace(/\s+/g, " ").trim();
    name = name.replace(/^[*]+|[*]+$/g, "").trim();
    if (!name || name.length < 3) continue;
    if (/connect|find an agent|^hours$/i.test(name)) continue;
    if (/^\(?\d/.test(name) || /^[\d\s().-]+$/.test(name)) continue;
    const blockText = inner.text.replace(/\s+/g, " ");
    let role = "AmeriLife Agent";
    const rm = blockText.match(/(Managing Director|Agency Manager|Licensed [^,\n]+)/i);
    if (rm) role = rm[1].trim();
    if (!/^[A-Z]/.test(name) && !email) continue;
    const imageUrl = pickAgentImageUrl(inner);
    agents.push({
      name,
      role,
      email,
      amlhCode: email ? email.match(/^(AMLH[A-Za-z0-9]*)/i)?.[1] ?? null : null,
      slugHint: name,
      imageUrl: imageUrl || null,
    });
  }
  return agents;
}

function extractAgentsFromTeamSections(scope) {
  /** @type {{ name: string; role: string; email: string | null; amlhCode: string | null; slugHint: string; imageUrl: string | null }[]} */
  const agents = [];
  const inners = scope.querySelectorAll(".et_pb_text_inner");
  for (const inner of inners) {
    const h3 = inner.querySelector("h3");
    if (!h3) continue;
    const name = h3.text.replace(/\s+/g, " ").trim();
    if (!name || /connect|find an agent|^office$/i.test(name)) continue;
    if (/^\(?\d/.test(name) || /^[\d\s().-]+$/.test(name)) continue;
    const mail = inner.querySelector('a[href^="mailto:"]');
    const email = mail ? mail.getAttribute("href")?.replace(/^mailto:/i, "").trim() ?? null : null;
    if (!email && !/^[A-Z][a-z]+ [A-Z][a-z]+/.test(name)) continue;
    const blockText = inner.text.replace(/\s+/g, " ");
    let role = "AmeriLife Agent";
    const rm = blockText.match(/(Managing Director|Agency Manager|Licensed [^,\n]+)/i);
    if (rm) role = rm[1].trim();
    const imageUrl = pickAgentImageUrl(inner);
    agents.push({
      name,
      role,
      email,
      amlhCode: email ? email.match(/^(AMLH[A-Za-z0-9]*)/i)?.[1] ?? null : null,
      slugHint: name,
      imageUrl: imageUrl || null,
    });
  }
  return agents;
}

/**
 * Multi-office: Divi et_pb_text_inner blocks with office paragraphs.
 * @param {import('node-html-parser').HTMLElement} main
 * @param {string} pageSlug
 */
function extractMultiOffices(main, pageSlug) {
  /** @type {ReturnType<typeof parseOfficeParagraph>[]} */
  const offices = [];
  const inners = main.querySelectorAll(".et_pb_text_inner");
  let lastHeading = "";

  for (const inner of inners) {
    const h = inner.querySelector("h2, h3");
    if (h) {
      lastHeading = h.text.replace(/\s+/g, " ").trim();
    }
    const ps = inner.querySelectorAll("p");
    for (const p of ps) {
      const html = p.toString();
      if (!/mailto:|AMLH/i.test(html) && !/@amerilife\.com/i.test(html)) continue;
      const parsed = parseOfficeParagraph(html);
      if (parsed.agents.length === 0 && parsed.emails.length === 0) continue;
      const cityKey =
        parsed.address.city ||
        lastHeading.replace(/\s*office\s*$/i, "").trim() ||
        slugify(parsed.rawText.slice(0, 40));
      const subSlug = `${pageSlug}-${slugify(cityKey || "office-" + offices.length)}`;
      offices.push({
        subSlug,
        sectionHeading: lastHeading,
        ...parsed,
      });
    }
  }
  return offices;
}

/**
 * @param {import('node-html-parser').HTMLElement} scope
 */
function extractSingleOffice(scope, pageSlug) {
  const h1 = scope.querySelector("h1");
  const pageTitle = h1 ? h1.text.replace(/\s+/g, " ").trim() : "";

  let officeName = "";
  const h1span = scope.querySelector("h1 span");
  if (h1span && /LLC|AmeriLife of/i.test(h1span.text)) {
    officeName = h1span.text.replace(/\s+/g, " ").trim();
  }
  if (!officeName) {
    const ps = scope.querySelectorAll("p");
    for (const p of ps) {
      const t = p.text;
      if (/LLC|Inc\.|AmeriLife of/i.test(t) && t.length < 200) {
        officeName = t.replace(/\s+/g, " ").trim();
        break;
      }
    }
  }

  const officeBlock = extractOfficeInfoBlock(scope);
  let aboutOffice = "";
  const ps = scope.querySelectorAll(".et_pb_text_inner p");
  for (const p of ps) {
    const t = p.text.trim();
    if (t.length < 40) continue;
    if (/getElementById|ak_js|Δ|script/i.test(t)) continue;
    if (/mailto:|Phone:\s*\(?/i.test(t) && t.length < 120) continue;
    if (/AmeriLife offers|serves|solutions|insurance and retirement/i.test(t)) {
      aboutOffice = t;
      break;
    }
  }
  if (!aboutOffice) {
    for (const p of ps) {
      const t = p.text.trim();
      if (t.length > 80 && !/getElementById|mailto:/i.test(t)) {
        aboutOffice = t;
        break;
      }
    }
  }

  const innerBlocks = scope.querySelectorAll(".et_pb_text_inner");
  let combined = "";
  for (const el of innerBlocks) {
    const p = el.querySelector("p");
    if (p && /mailto:|AMLH/i.test(p.toString())) {
      combined += p.toString();
    }
  }
  const parsed =
    combined.length > 0
      ? parseOfficeParagraph(combined)
      : parseOfficeParagraph(scope.text.slice(0, 8000));

  let phone = officeBlock?.phone ?? parsed.phone;
  let hours = officeBlock?.hours ?? parsed.hours;
  let address = officeBlock?.address ?? parsed.address;
  if (officeBlock && (!address.city || !address.zip)) {
    address = parsed.address;
  }

  let agents = extractAgentsFromTeamSections(scope);
  const boldAgents = extractAgentsFromBoldBlocks(scope);
  if (agents.length === 0) {
    agents = boldAgents.length ? boldAgents : parsed.agents;
  } else {
    for (const b of boldAgents) {
      const i = agents.findIndex(
        (a) =>
          (a.email && b.email && a.email.toLowerCase() === b.email.toLowerCase()) ||
          (a.name &&
            b.name &&
            a.name.trim().toLowerCase() === b.name.trim().toLowerCase())
      );
      if (i >= 0) {
        if (!agents[i].imageUrl && b.imageUrl) agents[i].imageUrl = b.imageUrl;
        if (!agents[i].email && b.email) {
          agents[i].email = b.email;
          if (!agents[i].amlhCode && b.amlhCode) agents[i].amlhCode = b.amlhCode;
        }
      } else {
        agents.push(b);
      }
    }
  }

  const heroImg = extractHeroImage(scope);
  agents = dedupeAgentsByEmailOrName(agents);
  if (heroImg && agents.length === 1 && !agents[0].imageUrl) {
    if (
      /headshot|300px|300x300|_HR|uploads\/[^/]+\.(png|jpe?g|webp)/i.test(heroImg) &&
      !/Wealth-II|silhouette|Business-Male|gm-120|placeholder/i.test(heroImg)
    ) {
      agents[0].imageUrl = heroImg;
    }
  }

  return {
    slug: pageSlug,
    pageTitle,
    officeName: officeName || pageTitle,
    aboutOffice: aboutOffice || officeName || pageTitle,
    phone,
    hours,
    address,
    agents,
    featuresJson: JSON.stringify(DEFAULT_FEATURES),
  };
}

/**
 * @param {string} html
 * @param {string} pageUrl
 * @param {string} pageSlug
 * @param {CsvRow} row
 */
function scrapePage(html, pageUrl, pageSlug, row) {
  const root = parse(html);
  const scope = getContentScope(root);
  const liveFormId = extractLiveFormId(scope);
  const officeImageUrl = extractHeroImage(scope);

  const AGG = new Set(["texas", "florida"]);

  if (AGG.has(pageSlug)) {
    const multi = extractMultiOffices(scope, pageSlug);
    const h1 =
      scope.querySelector(".et_pb_section_0 h1, .et_pb_section:first-of-type h1") ||
      scope.querySelector("h1");
    let pageTitle = h1 ? h1.text.replace(/\s+/g, " ").trim() : "";
    if (/connect with an agent/i.test(pageTitle)) {
      const h2 = scope.querySelector("h2");
      if (h2 && h2.text.trim()) pageTitle = h2.text.replace(/\s+/g, " ").trim();
    }
    if (multi.length === 0) {
      const single = extractSingleOffice(scope, pageSlug);
      return {
        kind: "single",
        sourceUrl: pageUrl,
        cmsStatus: row.cmsStatus,
        locationLabel: row.location,
        notes: row.notes,
        liveFormId,
        headlessFormId: null,
        officeImageUrl,
        ...single,
      };
    }
    return {
      kind: "aggregator",
      sourceUrl: pageUrl,
      pageSlug,
      pageTitle,
      cmsStatus: row.cmsStatus,
      locationLabel: row.location,
      notes: row.notes,
      liveFormId,
      headlessFormId: null,
      officeImageUrl,
      subAgencies: multi.map((o, i) => ({
        slug: o.subSlug,
        sectionHeading: o.sectionHeading,
        officeName: `${pageTitle} — ${o.sectionHeading || `Office ${i + 1}`}`,
        aboutOffice: o.rawText.slice(0, 500),
        phone: o.phone,
        hours: o.hours,
        address: o.address,
        agents: o.agents.map((a, j) => ({
          ...a,
          slug: buildAgentSlug(slugify, o.subSlug, o.agents, j),
        })),
        featuresJson: JSON.stringify(DEFAULT_FEATURES),
      })),
    };
  }

  const single = extractSingleOffice(scope, pageSlug);
  return {
    kind: "single",
    sourceUrl: pageUrl,
    cmsStatus: row.cmsStatus,
    locationLabel: row.location,
    notes: row.notes,
    liveFormId,
    headlessFormId: null,
    officeImageUrl,
    ...single,
  };
}

function flattenForOutput(records) {
  /** @type {object[]} */
  const agencies = [];
  for (const r of records) {
    if (r.error) {
      agencies.push({ scrapeError: true, ...r });
      continue;
    }
    if (r.kind === "aggregator" && r.subAgencies?.length) {
      for (const sub of r.subAgencies) {
        agencies.push({
          kind: "sub",
          parentSlug: r.pageSlug,
          sourceUrl: r.sourceUrl,
          slug: sub.slug,
          pageTitle: sub.officeName,
          officeName: sub.officeName,
          aboutOffice: sub.aboutOffice,
          phone: sub.phone,
          hours: sub.hours,
          address: sub.address,
          agents: sub.agents,
          featuresJson: sub.featuresJson,
          cmsStatus: r.cmsStatus,
          locationLabel: r.locationLabel,
          notes: r.notes,
          liveFormId: r.liveFormId,
          headlessFormId: null,
          officeImageUrl: r.officeImageUrl,
        });
      }
      agencies.push({
        kind: "aggregator_meta",
        slug: r.pageSlug,
        sourceUrl: r.sourceUrl,
        pageTitle: r.pageTitle,
        cmsStatus: r.cmsStatus,
        locationLabel: r.locationLabel,
        notes: r.notes,
        liveFormId: r.liveFormId,
        headlessFormId: null,
        officeImageUrl: r.officeImageUrl,
        subSlugs: r.subAgencies.map((s) => s.slug),
      });
    } else if (r.kind === "single") {
      agencies.push({
        kind: "single",
        slug: r.slug,
        sourceUrl: r.sourceUrl,
        pageTitle: r.pageTitle,
        officeName: r.officeName,
        aboutOffice: r.aboutOffice,
        phone: r.phone,
        hours: r.hours,
        address: r.address,
        agents: (r.agents || []).map((a, j) => ({
          ...a,
          slug: buildAgentSlug(slugify, r.slug, r.agents || [], j),
        })),
        featuresJson: r.featuresJson,
        cmsStatus: r.cmsStatus,
        locationLabel: r.locationLabel,
        notes: r.notes,
        liveFormId: r.liveFormId,
        headlessFormId: null,
        officeImageUrl: r.officeImageUrl,
      });
    }
  }
  return agencies;
}

async function readCsvRows() {
  const raw = await fs.readFile(CSV_PATH, "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  const header = lines[0];
  if (!header.toLowerCase().includes("location")) throw new Error("Unexpected CSV header");
  /** @type {CsvRow[]} */
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 5) continue;
    rows.push({
      location: cols[0] || "",
      link: cols[1] || "",
      cmsStatus: cols[2] || "",
      inSitemap: cols[3] || "",
      notes: cols[4] || "",
    });
  }
  return rows;
}

async function main() {
  const args = process.argv.slice(2);
  let only = null;
  for (const a of args) {
    if (a.startsWith("--only=")) {
      only = new Set(
        a
          .slice("--only=".length)
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      );
    }
  }

  const csvRows = await readCsvRows();
  const toScrape = csvRows.filter((r) => !shouldSkipRow(r));
  /** @type {object[]} */
  const records = [];
  const delayMs = 450;

  for (const row of toScrape) {
    const url = row.link.trim();
    if (!url || !/^https?:\/\//i.test(url)) {
      console.warn(`Skip row (invalid URL): ${row.location.slice(0, 50)}`);
      continue;
    }
    const pageSlug = slugFromUrl(url);
    if (!pageSlug) {
      console.warn(`Skip row (no slug): ${row.location.slice(0, 40)}`);
      continue;
    }
    if (only && !only.has(pageSlug)) continue;

    process.stdout.write(`Scraping ${pageSlug} ... `);
    try {
      const html = await fetchHtml(url);
      const data = scrapePage(html, url, pageSlug, row);
      records.push({ pageSlug, ...data });
      console.log("ok");
    } catch (e) {
      console.log("FAIL", e.message);
      records.push({
        pageSlug,
        error: e.message,
        sourceUrl: url,
        cmsStatus: row.cmsStatus,
      });
    }
    await sleep(delayMs);
  }

  const agencies = flattenForOutput(records);
  const scrapedAt = new Date().toISOString();

  await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });
  await fs.writeFile(
    OUT_JSON,
    JSON.stringify({ scrapedAt, records, agencies }, null, 2),
    "utf8"
  );

  const lines = ["slug,live_form_id,headless_form_id,source_url"];
  for (const a of agencies) {
    if (a.scrapeError || a.kind === "aggregator_meta") continue;
    const slug = a.slug || "";
    const lid = a.liveFormId ?? "";
    const src = (a.sourceUrl || "").replace(/"/g, '""');
    lines.push(`"${slug}",${lid},,"${src}"`);
  }
  await fs.writeFile(OUT_GF_CSV, lines.join("\n") + "\n", "utf8");

  console.log(`\nWrote ${OUT_JSON}`);
  console.log(`Wrote ${OUT_GF_CSV}`);
  console.log(`Agency entries: ${agencies.filter((a) => !a.scrapeError).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
