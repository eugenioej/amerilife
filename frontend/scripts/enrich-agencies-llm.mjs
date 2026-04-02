/**
 * LLM pass over docs/scraped-agencies.json using Google Gemini Flash (REST).
 * Fetches each office page HTML, extracts main-content plain text, and asks the model
 * for structured office + agent fields when the DOM scraper left generic "Office Contact" rows
 * or missing phone.
 *
 * Env (frontend/.env.local):
 *   GEMINI_API_KEY   — required unless --dry-run
 *   GEMINI_MODEL     — optional, default gemini-2.0-flash (override e.g. gemini-1.5-flash)
 *
 * Typical order:
 *   pnpm -C frontend scrape:agencies
 *   pnpm -C frontend enrich:agencies
 *   pnpm -C frontend enrich:agencies-llm -- --only=charleston
 *   pnpm -C frontend enrich:agencies   # refresh map URLs / needsReview after LLM edits
 *
 * One-shot (scrape + heuristic enrich + LLM for every office, agents included):
 *   pnpm -C frontend pipeline:agencies
 *
 * Flags:
 *   --dry-run              Fetches HTML and builds prompt; no Gemini call, no file write
 *   --only=slug1,slug2     Process only these agency slugs (pageSlug / sub slug)
 *   --all                  All importable agencies (not just Office Contact / missing phone)
 *   --no-post-enrich       Do not run enrich:agencies after a successful write
 *
 * Cost: ~1 request per processed office; Flash is low cost; use --only for trials.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { parse } from "node-html-parser";
import { buildAgentSlug } from "./lib/agent-slug.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const FRONTEND_ROOT = path.resolve(__dirname, "..");
const JSON_PATH = path.join(REPO_ROOT, "docs/scraped-agencies.json");

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const DEFAULT_MODEL = "gemini-2.0-flash";
const MAX_TEXT_CHARS = 12000;
const DELAY_MS = 450;

function stripOuterQuotes(v) {
  const s = String(v).trim();
  if (
    (s.startsWith('"') && s.endsWith('"') && s.length >= 2) ||
    (s.startsWith("'") && s.endsWith("'") && s.length >= 2)
  ) {
    return s.slice(1, -1);
  }
  return s;
}

async function loadDotEnvFiles() {
  const candidates = [path.join(FRONTEND_ROOT, ".env.local"), path.join(FRONTEND_ROOT, ".env")];
  for (const p of candidates) {
    let raw = "";
    try {
      raw = await fs.readFile(p, "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = stripOuterQuotes(trimmed.slice(eq + 1));
      if (!key) continue;
      if (process.env[key] == null) process.env[key] = val;
    }
  }
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseArgs(argv) {
  let dryRun = false;
  let only = null;
  let all = false;
  let noPostEnrich = false;
  for (const a of argv) {
    if (a === "--dry-run") dryRun = true;
    if (a === "--all") all = true;
    if (a === "--no-post-enrich") noPostEnrich = true;
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
  return { dryRun, only, all, noPostEnrich };
}

/**
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
 * Plain text from main content — same spirit as scrape-agent-pages getContentScope.
 * @param {string} html
 */
function extractPlainTextForLlm(html) {
  const root = parse(html);
  const scope = getContentScope(root);
  scope.querySelectorAll("script, style, noscript").forEach((el) => el.remove());
  const chunks = [];
  for (const inner of scope.querySelectorAll(".et_pb_text_inner")) {
    const t = inner.text.replace(/\s+/g, " ").trim();
    if (t.length > 2) chunks.push(t);
  }
  let text = chunks.length ? chunks.join("\n\n") : scope.text.replace(/\s+/g, " ").trim();
  text = text.replace(/\s+/g, " ").trim();
  if (text.length > MAX_TEXT_CHARS) text = text.slice(0, MAX_TEXT_CHARS) + "\n…";
  return text;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function formatPhone(raw) {
  if (raw == null || raw === "") return null;
  const d = String(raw).replace(/\D/g, "");
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d.startsWith("1")) {
    const x = d.slice(1);
    return `(${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
  }
  return String(raw).trim().slice(0, 32);
}

function digitsEqual(a, b) {
  const da = String(a || "").replace(/\D/g, "");
  const db = String(b || "").replace(/\D/g, "");
  if (da.length < 10 || db.length < 10) return false;
  return da.slice(-10) === db.slice(-10);
}

function normalizeEmail(s) {
  if (!s) return null;
  return String(s).replace(/mailto:/gi, "").trim().toLowerCase() || null;
}

function amlhFromEmail(email) {
  if (!email) return null;
  const m = String(email).match(/^(amlh[a-z0-9]*)/i);
  return m ? m[1].toUpperCase() : null;
}

/**
 * @param {string} text
 */
function parseJsonFromModel(text) {
  const t = String(text || "").trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  const payload = fence ? fence[1].trim() : t;
  return JSON.parse(payload);
}

function isBoilerplateAbout(s) {
  const t = String(s || "");
  return (
    t.length < 60 ||
    /Since the early 1970s, AmeriLife agents have collaborated/i.test(t)
  );
}

/**
 * @param {object} addr
 */
function validAddress(addr) {
  if (!addr || typeof addr !== "object") return false;
  const state = String(addr.state || "")
    .trim()
    .toUpperCase()
    .slice(0, 2);
  const zip = String(addr.zip || "").replace(/\D/g, "");
  return state.length === 2 && zip.length === 5;
}

/**
 * @param {object} parsed
 * @param {object} agency
 * @param {{ fullBatch?: boolean }} [options]
 */
function mergeLlmIntoAgency(parsed, agency, options = {}) {
  const fullBatch = options.fullBatch === true;
  const out = { ...agency };
  const prevAddr = agency.address || {};

  if (parsed.phone) {
    const fp = formatPhone(parsed.phone);
    if (fp && (!out.phone || digitsEqual(fp, out.phone))) {
      out.phone = fp;
    } else if (fp && !out.phone) {
      out.phone = fp;
    }
  }

  if (parsed.hours && String(parsed.hours).trim().length > 5) {
    out.hours = String(parsed.hours).replace(/\s+/g, " ").trim().slice(0, 120);
  }

  if (parsed.address && typeof parsed.address === "object") {
    const a = parsed.address;
    const next = {
      line1: (a.line1 && String(a.line1).trim()) || prevAddr.line1 || "",
      line2: a.line2 != null && String(a.line2).trim() ? String(a.line2).trim() : prevAddr.line2 ?? null,
      city: (a.city && String(a.city).trim()) || prevAddr.city || "",
      state: (a.state && String(a.state).trim().toUpperCase().slice(0, 2)) || prevAddr.state || "",
      zip: (a.zip && String(a.zip).replace(/\D/g, "").slice(0, 5)) || prevAddr.zip || "",
    };
    if (validAddress(next) || (next.line1 && next.city)) {
      out.address = next;
    }
  }

  if (parsed.officeName && String(parsed.officeName).trim().length > 3) {
    out.officeName = String(parsed.officeName).trim().slice(0, 200);
  }

  if (parsed.aboutOffice && String(parsed.aboutOffice).trim().length > 40) {
    const ab = String(parsed.aboutOffice).trim();
    if (!isBoilerplateAbout(ab) || isBoilerplateAbout(out.aboutOffice)) {
      out.aboutOffice = ab.slice(0, 1200);
    }
  }

  const prevAgents = Array.isArray(agency.agents) ? agency.agents : [];
  const hasOnlyOfficeContact = prevAgents.every((x) => x?.name === "Office Contact");
  const llmAgents = Array.isArray(parsed.agents) ? parsed.agents : [];

  if (llmAgents.length > 0 && llmAgents.some((x) => x?.name && x.name !== "Office Contact")) {
    const singleFallbackEmail =
      prevAgents.length === 1 ? normalizeEmail(prevAgents[0]?.email) : null;
    const singleFallbackAmlh = prevAgents.length === 1 ? prevAgents[0]?.amlhCode : null;
    const resolvedNames = llmAgents.map((a) => ({
      name: String(a.name || "").trim() || "Office Contact",
    }));
    out.agents = llmAgents.map((a, i) => {
      let email = normalizeEmail(a.email);
      if (!email && hasOnlyOfficeContact && singleFallbackEmail) {
        email = singleFallbackEmail;
      } else if (!email && fullBatch) {
        email =
          normalizeEmail(prevAgents[i]?.email) ||
          normalizeEmail(prevAgents[0]?.email) ||
          null;
      }
      const amlhCode =
        amlhFromEmail(email) ||
        (prevAgents[i]?.amlhCode ?? singleFallbackAmlh);
      const name = resolvedNames[i].name;
      const role = String(a.role || "Licensed Insurance Agent").trim().slice(0, 120);
      let imageUrl = null;
      if (typeof a.imageUrl === "string" && /^https?:\/\//i.test(a.imageUrl.trim())) {
        imageUrl = a.imageUrl.trim();
      } else if (prevAgents[i]?.imageUrl) {
        imageUrl = prevAgents[i].imageUrl;
      }
      return {
        name,
        role,
        email,
        amlhCode,
        slug: buildAgentSlug(slugify, agency.slug, resolvedNames, i),
        ...(imageUrl ? { imageUrl } : {}),
      };
    });
  } else if (hasOnlyOfficeContact && llmAgents.length === 0) {
    out.enrichment = {
      ...out.enrichment,
      llmNeedsReview: [...(out.enrichment?.llmNeedsReview || []), "no_agents_in_llm_output"],
    };
  }

  return out;
}

/**
 * @param {object} data
 * @param {object} agency
 */
function syncRecordFromAgency(data, agency) {
  const slug = agency.slug;
  for (const rec of data.records || []) {
    if (rec.error) continue;
    if (rec.kind === "single" && (rec.slug === slug || rec.pageSlug === slug)) {
      rec.phone = agency.phone;
      rec.hours = agency.hours;
      rec.address = agency.address;
      rec.agents = agency.agents;
      rec.aboutOffice = agency.aboutOffice;
      rec.officeName = agency.officeName;
      rec.pageTitle = agency.pageTitle;
      rec.enrichment = agency.enrichment;
      return;
    }
    if (rec.kind === "aggregator" && Array.isArray(rec.subAgencies)) {
      const sub = rec.subAgencies.find((s) => s.slug === slug);
      if (sub) {
        sub.phone = agency.phone;
        sub.hours = agency.hours;
        sub.address = agency.address;
        sub.agents = agency.agents;
        sub.aboutOffice = agency.aboutOffice;
        sub.officeName = agency.officeName;
        sub.enrichment = agency.enrichment;
        return;
      }
    }
  }
}

function shouldConsiderAgency(a, { only, all }) {
  if (a.scrapeError || a.kind === "aggregator_meta") return false;
  if (only && !only.has(String(a.slug || "").toLowerCase())) return false;
  if (all) return true;
  const hasOfficeContact = (a.agents || []).some((x) => x?.name === "Office Contact");
  const missingPhone = a.phone == null || String(a.phone).trim() === "";
  return hasOfficeContact || missingPhone;
}

/**
 * @param {boolean} [fullBatch]
 */
function buildPrompt(pageSlug, sourceUrl, plainText, fullBatch) {
  const listEveryone =
    fullBatch &&
    `
- agents: include every named person tied to this office (managing director, agency manager, licensed agents, etc.) with roles as stated in the text. Omit only if no names appear.`;
  return `You extract factual data from an AmeriLife insurance office webpage (plain text below).

Rules:
- Return ONLY valid JSON (no markdown). Keys: officeName, phone, hours, address, agents, aboutOffice.
- address must be { "line1", "line2", "city", "state", "zip" } with US state as 2-letter code and zip 5 digits. Use null for unknown fields.
- agents is an array of { "name", "role", "email" }. Use real names and titles from the text only.
- email: only if it appears in the text (e.g. AMLH...@amerilife.com). Otherwise null. Never guess emails.
- phone: US format if present in text; otherwise null. Do not invent phone numbers.
- aboutOffice: a short description of this office from the text, or null if only generic marketing copy appears.
- If the text does not mention a person, agents may be empty.${listEveryone || ""}

pageSlug: ${pageSlug}
sourceUrl: ${sourceUrl}

--- PAGE TEXT ---
${plainText}
`;
}

async function callGemini(apiKey, model, prompt, dryRun) {
  if (dryRun) {
    return { parsed: null, rawText: null, error: null };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.15,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  };

  let attempt = 0;
  while (attempt < 4) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 429) {
      const wait = Math.pow(2, attempt) * 800;
      console.warn(`  Rate limited, waiting ${wait}ms...`);
      await sleep(wait);
      attempt++;
      continue;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.error?.message || res.statusText || String(res.status);
      throw new Error(`Gemini ${res.status}: ${msg}`);
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const fr = data.candidates?.[0]?.finishReason;
      throw new Error(`No model text (finishReason=${fr || "unknown"})`);
    }
    return { parsed: parseJsonFromModel(text), rawText: text, error: null };
  }
  throw new Error("Too many 429 retries");
}

async function main() {
  await loadDotEnvFiles();
  const { dryRun, only, all, noPostEnrich } = parseArgs(process.argv.slice(2));
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  if (!dryRun && !apiKey) {
    console.error("Missing GEMINI_API_KEY (set in frontend/.env.local) or use --dry-run");
    process.exit(1);
  }

  const raw = await fs.readFile(JSON_PATH, "utf8");
  const data = JSON.parse(raw);
  const agencies = data.agencies || [];

  const targets = agencies.filter((a) => shouldConsiderAgency(a, { only, all }));
  console.log(
    `LLM enrich: ${targets.length} agencies (model=${model}, dryRun=${dryRun}, only=${only ? [...only].join(",") : "—"}, all=${all})`
  );

  let ok = 0;
  let fail = 0;

  for (const agency of targets) {
    const slug = agency.slug;
    const url = agency.sourceUrl;
    if (!url) {
      console.warn(`Skip ${slug}: no sourceUrl`);
      fail++;
      continue;
    }

    process.stdout.write(`  ${slug} ... `);
    let plainText = "";
    try {
      const html = await fetchHtml(url);
      plainText = extractPlainTextForLlm(html);
    } catch (e) {
      console.log(`fetch FAIL: ${e.message}`);
      agency.enrichment = {
        ...agency.enrichment,
        llmError: `fetch: ${e.message}`,
        llmAt: new Date().toISOString(),
        llmModel: model,
      };
      syncRecordFromAgency(data, agency);
      fail++;
      await sleep(DELAY_MS);
      continue;
    }

    const prompt = buildPrompt(slug, url, plainText, all);

    if (dryRun) {
      console.log(`dry-run: plainText ~${plainText.length} chars, prompt ~${prompt.length} chars (no API / no write)`);
      await sleep(50);
      continue;
    }

    try {
      const { parsed } = await callGemini(apiKey, model, prompt, false);
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid JSON object from model");

      const merged = mergeLlmIntoAgency(parsed, agency, { fullBatch: all });
      merged.enrichment = {
        ...merged.enrichment,
        llmAt: new Date().toISOString(),
        llmModel: model,
        llmError: null,
      };

      const idx = agencies.findIndex((x) => x.slug === slug);
      if (idx >= 0) agencies[idx] = merged;
      syncRecordFromAgency(data, merged);
      console.log("ok");
      ok++;
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
      agency.enrichment = {
        ...agency.enrichment,
        llmError: e.message,
        llmAt: new Date().toISOString(),
        llmModel: model,
      };
      syncRecordFromAgency(data, agency);
      fail++;
    }

    await sleep(DELAY_MS);
  }

  data.agencies = agencies;
  data.llmEnrichedAt = new Date().toISOString();

  if (!dryRun) {
    await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2), "utf8");
    console.log(`\nWrote ${JSON_PATH} (ok=${ok}, fail=${fail})`);

    if (!noPostEnrich && ok > 0) {
      console.log("Running pnpm enrich:agencies to refresh addresses / map URLs / needsReview ...");
      execSync("pnpm enrich:agencies", { cwd: FRONTEND_ROOT, stdio: "inherit" });
    }
  } else {
    console.log("\nDry-run complete (no writes).");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
