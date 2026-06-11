#!/usr/bin/env node
/**
 * prepare-new-articles.mjs
 *
 * Lee los .docx de "New Articles", extrae el contenido con mammoth (sin modificarlo),
 * llama a Gemini SOLO para metadatos (excerpt, slug, tags, spotlight),
 * asigna una featured image local por topic, y genera new-articles-seed.json.
 *
 * Usage:
 *   node scripts/prepare-new-articles.mjs
 *   node scripts/prepare-new-articles.mjs --dry-run   # imprime JSON sin escribir archivo
 *
 * Env:
 *   GEMINI_API_KEY   — requerido
 *   ARTICLES_DIR     — ruta a la carpeta "New Articles" (default: ver abajo)
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// ─── Rutas ───────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Cargar .env.local
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
loadEnv(join(ROOT, "..", ".env"));
loadEnv(join(ROOT, "..", ".env.local"));
loadEnv(join(ROOT, ".env"));
loadEnv(join(ROOT, ".env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const SEO_ONLY = process.argv.includes("--seo-only");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  console.error("❌  Falta GEMINI_API_KEY en .env.local");
  process.exit(1);
}

// Ruta a la carpeta "New Articles" — ajusta si tu folder está en otro lugar
const ARTICLES_DIR =
  process.env.ARTICLES_DIR ||
  join(ROOT, "..", "New Articles");

if (!existsSync(ARTICLES_DIR)) {
  console.error(`❌  No encontré la carpeta de artículos en:\n    ${ARTICLES_DIR}`);
  console.error(`    Usa:  ARTICLES_DIR=/ruta/a/tu/folder node scripts/prepare-new-articles.mjs`);
  process.exit(1);
}

const IMAGES_DIR = join(ARTICLES_DIR, "featured-images");
const OUTPUT_FILE = join(ROOT, "scripts", "new-articles-seed.json");

// ─── Mammoth ─────────────────────────────────────────────────────────────────

let mammoth;
try {
  // Intentar desde el proyecto primero
  mammoth = require("mammoth");
} catch {
  try {
    mammoth = require("/sessions/wonderful-bold-gates/node_modules_cache/node_modules/mammoth");
  } catch {
    console.error("❌  mammoth no está instalado. Corre: pnpm add -D mammoth");
    process.exit(1);
  }
}

// ─── Categorías y topics ─────────────────────────────────────────────────────

const CATEGORIES = [
  {
    folder: "AmeriLife.com Insights - Leadership Articles",
    topic: "leadership",
    // Imágenes apropiadas para leadership: financial-planning-office + financial-advisor-meeting
    imagePool: [
      "35_financial-planning-office_Cht_Gsml_n3xhFnlp.jpg",
      "36_financial-planning-office_Sasun_Bughdaryan_mQ4dmENW.jpg",
      "37_financial-planning-office_Cht_Gsml_FVwy7PBi.jpg",
      "38_financial-planning-office_Cht_Gsml_JacfRVlN.jpg",
      "07_financial-advisor-meeting_Vitaly_Gariev_f4TM45jA.jpg",
      "08_financial-advisor-meeting_Vitaly_Gariev_OZnnv0FC.jpg",
      "09_financial-advisor-meeting_Vitaly_Gariev_YR4zsA7Q.jpg",
      "10_financial-advisor-meeting_Vitaly_Gariev_0e5EGrNj.jpg",
      "11_financial-advisor-meeting_Vitaly_Gariev_biciz2eS.jpg",
    ],
  },
  {
    folder: "AmeriLife.com Insights - News Articles",
    topic: "news",
    // Imágenes para news: wealth-management-professional + senior-couple-outdoor
    imagePool: [
      "22_wealth-management-professional_Invest_Europe_8vbYa3T3.jpg",
      "23_wealth-management-professional_Gilly_wcWN29Nu.jpg",
      "24_wealth-management-professional_Brett_Jordan_cch7QsPI.jpg",
      "25_wealth-management-professional_Brett_Jordan_rcvNsXF9.jpg",
      "26_wealth-management-professional_Hakim_Menikh_Zt7lvQEP.jpg",
      "31_senior-couple-outdoor_Land_O'Lakes,_Inc._-NwK3jWe.jpg",
      "32_senior-couple-outdoor_Linus_Belanger_ZMa7QhDC.jpg",
      "33_senior-couple-outdoor_Andreea_Munteanu_0eybus8I.jpg",
      "34_senior-couple-outdoor_Freddie_Addery_m0m1j2mz.jpg",
    ],
  },
  {
    folder: "AmeriLife.com_Insights_-_Annuity_Articles",
    topic: "wealth",
    // Imágenes para annuities: retirement-planning-couple + retirement-savings
    imagePool: [
      "01_retirement-planning-couple_Vitaly_Gariev_zJbdqZkl.jpg",
      "02_retirement-planning-couple_Vitaly_Gariev__nl1owGB.jpg",
      "03_retirement-planning-couple_Vitaly_Gariev_hnRs_icK.jpg",
      "04_retirement-planning-couple_Vitaly_Gariev_DQdilc0v.jpg",
      "05_retirement-planning-couple_Vitaly_Gariev_J4KsphFs.jpg",
      "06_retirement-planning-couple_Vitaly_Gariev_RrfQcstU.jpg",
      "27_retirement-savings_Towfiqu_barbhuiya_yIIFNiEK.jpg",
      "28_retirement-savings_Towfiqu_barbhuiya_joqWSI9u.jpg",
      "29_retirement-savings_Towfiqu_barbhuiya_0ITvgXAU.jpg",
    ],
  },
];

// ─── Fechas en marzo 2026 (escalonadas) ──────────────────────────────────────

function generateMarchDates(count) {
  // Distribuir los artículos en los días laborables de marzo 2026
  // Marzo 2026 tiene 31 días
  const dates = [];
  const days = [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 23, 24, 25, 26, 27, 30, 31];
  for (let i = 0; i < count; i++) {
    const day = days[i % days.length];
    dates.push(`2026-03-${String(day).padStart(2, "0")} 10:00:00`);
  }
  return dates;
}

// ─── Gemini: solo metadatos ───────────────────────────────────────────────────

async function callGemini(title, textPreview) {
  const prompt = `You are a content metadata assistant for AmeriLife, a financial services company.

Given the following article title and content preview, generate metadata.
IMPORTANT: Do NOT rewrite or modify the article content itself.

Article Title: ${title}

Content Preview (first ~800 chars):
${textPreview}

Return ONLY a valid JSON object with these fields:
{
  "excerpt": "<p>One concise sentence (max 25 words) describing what the article covers. HTML paragraph tag.</p>",
  "slug": "url-friendly-slug-max-6-words-lowercase-hyphens",
  "tags": ["tag1", "tag2"],
  "spotlight": false
}

Rules:
- excerpt: 1 sentence, professional tone, in an HTML <p> tag
- slug: 4-6 words max, lowercase, hyphens only, no dates or numbers
- tags: 2-3 relevant tags from: ["featured", "leadership", "annuities", "retirement", "wealth", "news", "life-insurance", "medicare", "agents", "partners"]
- spotlight: true only if this is a flagship/cover story article, false for most

Return only the JSON object, no markdown, no explanation.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 300 },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Limpiar posible markdown code block
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.warn("⚠️  Gemini returned non-JSON, using fallback:", raw.slice(0, 100));
    return {
      excerpt: `<p>${title}</p>`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50),
      tags: ["featured"],
      spotlight: false,
    };
  }
}

// ─── Extraer título del HTML crudo ────────────────────────────────────────────

function extractTitle(rawHtml, filename) {
  const plain = (s) =>
    s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").trim();

  // Collect all paragraph texts (used for H1 search)
  const paras = [];
  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pm;
  while ((pm = pRe.exec(rawHtml)) !== null) {
    paras.push(plain(pm[1]));
  }

  // 1. H1: metadata marker — last occurrence in doc (most authoritative)
  for (let i = paras.length - 1; i >= 0; i--) {
    const t = paras[i];
    if (/^H1:\s+\S/.test(t)) return t.replace(/^H1:\s+/i, "").trim();
    // Standalone "H1:" label followed by the title in the next paragraph
    if (/^H1:?\s*$/.test(t) && i + 1 < paras.length && paras[i + 1].length > 5)
      return paras[i + 1];
  }

  // 2. Headline: marker
  for (const t of paras) {
    if (/^Headline:\s+\S/.test(t)) return t.replace(/^Headline:\s+/i, "").trim();
  }

  // 3. True H1-H3 heading tags (mammoth sometimes generates these)
  const hMatch = rawHtml.match(/<h[123][^>]*>(.*?)<\/h[123]>/i);
  if (hMatch) return plain(hMatch[1]);

  // 4. First all-bold paragraph with enough length (≥15 chars)
  const boldRe = /<p[^>]*><strong>([^<]{15,})<\/strong><\/p>/i;
  const boldM = rawHtml.match(boldRe);
  if (boldM) return boldM[1].trim();

  // 5. Filename fallback
  return basename(filename, ".docx")
    .replace(/^(WITH SEO\s*-?\s*[\d\w-]*_?)/i, "")
    .replace(/^iX\s+[\w/-]+\s+\d{4}\s*[-–]?\s*/i, "")
    .replace(/\s*FINAL[-\d]*$/i, "")
    .replace(/\s*[-–]\s*(?:SEO|Final|Copy)\s*[-\d]*/gi, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

// ─── Extraer metadatos SEO del bloque final del .docx ─────────────────────────

function plainText(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function extractSeoFromDocxHtml(rawHtml) {
  const paras = [];
  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pm;
  while ((pm = pRe.exec(rawHtml)) !== null) {
    paras.push(plainText(pm[1]));
  }

  const seo = {
    seoTitle: "",
    metaDescription: "",
    focusKeyphrase: "",
    pageSlug: "",
  };

  const setField = (field, value) => {
    const v = String(value || "").trim();
    if (v && !seo[field]) seo[field] = v;
  };

  const isLabelLine = (text) =>
    /^(Focus Keyphrase|SEO Title|Meta Description|Page Slug|Category(?:\(ies\))?|Tags|Featured Image|Alt(?:\s*&|\s+and)?\s*Title|H1)\b/i.test(
      text
    );

  for (const t of paras) {
    let m;
    if ((m = t.match(/^Focus Keyphrase(?:[^:]*):\s*(.+)$/i))) setField("focusKeyphrase", m[1]);
    else if ((m = t.match(/^SEO Title(?:[^:]*):\s*(.+)$/i))) setField("seoTitle", m[1]);
    else if ((m = t.match(/^Meta Description(?:[^:]*):\s*(.+)$/i))) setField("metaDescription", m[1]);
    else if ((m = t.match(/^Page Slug(?:[^:]*):\s*(.+)$/i))) setField("pageSlug", m[1]);
  }

  const labelMap = [
    { re: /^Focus Keyphrase/i, field: "focusKeyphrase" },
    { re: /^SEO Title/i, field: "seoTitle" },
    { re: /^Meta Description/i, field: "metaDescription" },
    { re: /^Page Slug/i, field: "pageSlug" },
  ];

  for (let i = 0; i < paras.length - 1; i++) {
    const t = paras[i];
    for (const { re, field } of labelMap) {
      if (re.test(t) && !seo[field]) {
        const next = paras[i + 1];
        if (next && !isLabelLine(next)) setField(field, next);
      }
    }
  }

  return seo;
}

// ─── Limpiar HTML del .docx ────────────────────────────────────────────────────

function cleanDocxHtml(rawHtml) {
  let html = rawHtml;

  // ── 1. Quitar footnotes (<ol> que mammoth extrae de las notas al pie del docx)
  html = html.replace(/<ol>[\s\S]*?<\/ol>/gi, "");

  // ── 2. Cortar bloque de metadata SEO al final ──────────────────────────────
  // Busca el primer marcador de bloque de metadatos y corta todo desde ahí
  const trailMarkers = [
    /<p[^>]*>(?:<[^>]+>)*\s*Featured Image recommendation/i,
    /<p[^>]*>(?:<[^>]+>)*\s*Alt\s*(?:&amp;|&)\s*Title\s*Tag/i,
    /<p[^>]*>(?:<[^>]+>)*\s*Here are the SEO/i,
    /<p[^>]*>(?:<[^>]+>)*\s*Focus Keyphrase/i,
    /<p[^>]*>(?:<[^>]+>)*\s*Category\(ies\)/i,
    /<p[^>]*>(?:<[^>]+>)*\s*SEO Title\b/i,
    /<p[^>]*>(?:<[^>]+>)*\s*SEO Details:/i,
    /<p[^>]*>(?:<[^>]+>)*\s*SEO Optimization\b/i,
    /<p[^>]*>(?:<[^>]+>)*\s*Tags:/i,          // "Tags: annuity leads, ..." section
    // SIDEBAR: N Key Takeaways: — editorial label at end
    /<p[^>]*>(?:<[^>]+>)*\s*SIDEBAR:\s*\d/i,
    // Standalone <p><strong>SEO</strong></p>
    /<p[^>]*><strong>SEO<\/strong><\/p>/i,
  ];
  for (const pat of trailMarkers) {
    const idx = html.search(pat);
    if (idx > 50) html = html.slice(0, idx);
  }

  // Quitar "Title | AmeriLife" trailing (Alt Tag content lines)
  html = html.replace(/(<p[^>]*>(?:<[^>]+>)*[^<]+\|\s*AmeriLife[^<]*(?:<\/[^>]+>)*<\/p>\s*)+$/gi, "");
  // Quitar trailing H1: label y/o título
  html = html.replace(/(<p[^>]*>(?:<[^>]+>)*H1:[^<]*(?:<\/[^>]+>)*<\/p>\s*)+$/gi, "");

  // ── 3. Quitar marcadores editoriales: [Pull quote], [Image], [Caption], etc.
  html = html.replace(/<p[^>]*>(?:<[^>]+>)*\s*\[[^\]]{1,50}\]\s*(?:<\/[^>]+>)*<\/p>/gi, "");

  // ── 4. Quitar líneas separadoras: guiones bajos (___), markdown (###), --Sidebar—
  html = html.replace(/<p[^>]*>(?:<[^>]+>)*_{3,}(?:<\/[^>]+>)*<\/p>/g, "");
  html = html.replace(/<p[^>]*>(?:<[^>]+>)*#{2,}\s*(?:<\/[^>]+>)*<\/p>/g, "");
  // --Sidebar— y variantes (--Sidebar--, —Sidebar—, SIDEBAR:, etc.)
  html = html.replace(/<p[^>]*>(?:<[^>]+>)*\s*[-–—]+\s*Sidebar\s*[-–—]*\s*(?:<\/[^>]+>)*<\/p>/gi, "");
  html = html.replace(/<p[^>]*>(?:<[^>]+>)*\s*SIDEBAR:\s*(?:<\/[^>]+>)*<\/p>/gi, "");
  // "3 Key Takeaways:" / "Key Takeaways:" standalone label (sin contenido real)
  html = html.replace(/<p[^>]*>(?:<[^>]+>)*\s*\d*\s*Key\s+Takeaways?\s*:?\s*(?:<br\s*\/>)?\s*(?:<\/[^>]+>)*<\/p>/gi, "");

  // ── 5. Reemplazar tabs (de tablas de dos columnas en el docx)
  html = html.replace(/\t/g, " ");

  // ── 6. Quitar párrafos de encabezado de template al inicio ─────────────────
  const plain = (s) =>
    s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").trim();

  const isLeadingHeader = (text) => {
    if (!text) return true;
    if (/^ideaXchange/i.test(text)) return true;
    if (/^Issue\s*[:\d]/i.test(text)) return true;
    if (/^iX\s+\w/.test(text) && text.length < 35) return true; // "iX October", "iX Nov/Dec 2025"
    if (/^Leadership\s+Column/i.test(text)) return true;
    if (/^By:\s+/i.test(text)) return true;
    if (/^Advancing\s+Annuities\s*$/i.test(text)) return true;
    if (/^Agent\s*(?:&amp;|&)\s*Advisor\s*$/i.test(text)) return true;
    if (/^Category:\s+/i.test(text)) return true;
    if (/^Compliance\s+(?:Code|Approval\s+Code):\s*/i.test(text)) return true;
    if (/^H1:\s*/i.test(text)) return true;   // H1: o "H1: Título"
    if (/^Headline:\s+/i.test(text)) return true;
    if (/^Column:\s+/i.test(text)) return true;
    if (/^Reflections\s+(Insert|Column)/i.test(text)) return true;
    if (/^Spotlight on Success\s+\d/i.test(text)) return true; // "Spotlight on Success 2 (Brokerage)"
    // Annuity docx metadata labels
    if (/^Meta\s+[Dd]escription:\s+/i.test(text)) return true;
    if (/^Word\s+[Cc]ount:\s+/i.test(text)) return true;
    if (/^Byline:\s*/i.test(text)) return true;            // "Byline:" o "Byline: A&A Editorial Team"
    if (/^SME:\s+/i.test(text)) return true;               // "SME: TK"
    if (/^Featured\s+[Ii]mage:\s*$/i.test(text)) return true; // "Featured image:" placeholder
    if (/^Key\s+(?:Takeaways|Points):\s*$/i.test(text)) return true; // standalone labels only
    // "Spotlight on Success: Category" — solo si después del colon hay ≤3 palabras
    const sosM = text.match(/^Spotlight on Success:\s*(.+)$/i);
    if (sosM && sosM[1].trim().split(/\s+/).length <= 3) return true;
    return false;
  };

  // Procesar párrafo por párrafo desde el inicio
  const parts = [];
  let rest = html.trim();
  let headerPhase = true;

  while (rest.length > 0) {
    if (!rest.startsWith("<p")) {
      // Elemento no-párrafo (ol, ul, table…): termina la fase de headers
      headerPhase = false;
      parts.push(rest);
      rest = "";
      break;
    }
    const pEnd = rest.indexOf("</p>");
    if (pEnd === -1) { parts.push(rest); rest = ""; break; }

    const para = rest.slice(0, pEnd + 4);
    rest = rest.slice(pEnd + 4).trimStart();

    if (headerPhase) {
      if (isLeadingHeader(plain(para))) continue; // descartar
      headerPhase = false;
    }
    parts.push(para);
  }
  // Quitar "By: Autor" si aparece inmediatamente después del primer párrafo de contenido
  // (el title ya quedó como parts[0], el byline editorial como parts[1])
  if (parts.length >= 2 && /^By:\s+\S/i.test(plain(parts[1]))) {
    parts.splice(1, 1);
  }

  html = parts.join("");

  // ── 7. Limpiar restos ──────────────────────────────────────────────────────
  // Quitar <br /> inicial en el primer párrafo
  html = html.replace(/^<p>(<br\s*\/>)+/, "<p>");
  // Quitar párrafos vacíos
  html = html.replace(/<p[^>]*>(\s|<br\s*\/>)*<\/p>/g, "");

  return html.trim();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (SEO_ONLY) {
    if (!existsSync(OUTPUT_FILE)) {
      console.error(`❌  No encontré ${OUTPUT_FILE}. Corre prepare-new-articles.mjs primero.`);
      process.exit(1);
    }

    const articles = JSON.parse(readFileSync(OUTPUT_FILE, "utf8"));
    console.log(`🔍  Modo --seo-only: extrayendo SEO de ${articles.length} artículos\n`);

    for (const article of articles) {
      const sourceFile = article._source_file;
      if (!sourceFile) continue;

      const cat = CATEGORIES.find((c) => {
        const catDir = join(ARTICLES_DIR, c.folder);
        return existsSync(join(catDir, sourceFile));
      });
      if (!cat) {
        console.warn(`⚠️  No encontré docx para: ${sourceFile}`);
        continue;
      }

      const filePath = join(ARTICLES_DIR, cat.folder, sourceFile);
      try {
        const result = await mammoth.convertToHtml({ path: filePath });
        article.seo = extractSeoFromDocxHtml(result.value);
        console.log(
          `   ✅  ${sourceFile}\n      title: ${article.seo.seoTitle || "(vacío)"}\n      desc:  ${(article.seo.metaDescription || "(vacío)").slice(0, 70)}…\n      kw:    ${article.seo.focusKeyphrase || "(vacío)"}`
        );
      } catch (err) {
        console.error(`   ❌  ${sourceFile}: ${err.message}`);
      }
    }

    if (DRY_RUN) {
      console.log("\n🔎  DRY RUN — primeros 2 SEO:");
      console.log(JSON.stringify(articles.slice(0, 2).map((a) => ({ title: a.title, seo: a.seo })), null, 2));
      return;
    }

    writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2), "utf8");
    console.log(`\n✅  SEO guardado en ${OUTPUT_FILE}`);
    console.log(`\n👉  Siguiente paso:`);
    console.log(`    node scripts/upload-new-articles.mjs --update-seo`);
    return;
  }

  console.log("🔍  Leyendo artículos desde:", ARTICLES_DIR);
  console.log("🖼️   Imágenes desde:", IMAGES_DIR);
  console.log("");

  const allArticles = [];

  for (const cat of CATEGORIES) {
    const catDir = join(ARTICLES_DIR, cat.folder);
    if (!existsSync(catDir)) {
      console.warn(`⚠️  No encontré carpeta: ${cat.folder}`);
      continue;
    }

    const files = readdirSync(catDir).filter((f) => f.endsWith(".docx"));
    console.log(`📁  ${cat.folder} → ${files.length} archivos`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = join(catDir, file);
      console.log(`   📄  ${file}`);

      // 1. Extraer HTML con mammoth (contenido intacto)
      let html = "";
      try {
        const result = await mammoth.convertToHtml({ path: filePath });
        html = result.value;
        if (result.messages.length > 0) {
          const warnings = result.messages.filter((m) => m.type === "warning");
          if (warnings.length > 0) console.log(`      ⚠️  ${warnings.length} warning(s) de mammoth`);
        }
      } catch (err) {
        console.error(`      ❌  Error leyendo ${file}:`, err.message);
        continue;
      }

      // 2. Extraer título del HTML crudo (antes de limpiar, para encontrar H1: markers)
      const title = extractTitle(html, file);
      const seo = extractSeoFromDocxHtml(html);

      // 3. Limpiar HTML: quitar headers de template, bloque SEO, marcadores editoriales
      const cleanHtml = cleanDocxHtml(html);

      // 4. Preview de texto plano para Gemini (del HTML limpio)
      const textPreview = cleanHtml
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 800);

      // 6. Llamar a Gemini solo para metadatos
      let meta;
      try {
        meta = await callGemini(title, textPreview);
        console.log(`      ✅  Gemini → slug: ${meta.slug}`);
      } catch (err) {
        console.error(`      ❌  Gemini falló:`, err.message);
        meta = {
          excerpt: `<p>${title}</p>`,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50),
          tags: ["featured"],
          spotlight: false,
        };
      }

      // 7. Asignar imagen (rotando por el pool del topic)
      const imageFile = cat.imagePool[i % cat.imagePool.length];
      const imagePath = join(IMAGES_DIR, imageFile);

      allArticles.push({
        _source_file: file,
        _image_local_path: imagePath,
        slug: seo.pageSlug || meta.slug,
        title,
        topic: cat.topic,
        tags: meta.tags,
        spotlight: meta.spotlight,
        excerpt: meta.excerpt,
        content: cleanHtml, // ← HTML limpio: sin headers de template ni bloque SEO
        seo,
        featured_image_url: "", // se llenará por upload-new-articles.mjs tras subir a WP Media
      });
    }

    console.log("");
  }

  // 6. Asignar fechas escalonadas en marzo 2026
  const dates = generateMarchDates(allArticles.length);
  allArticles.forEach((a, i) => {
    a.date = dates[i];
  });

  console.log(`\n📊  Total artículos procesados: ${allArticles.length}`);
  console.log(
    "   " +
      CATEGORIES.map((c) => {
        const count = allArticles.filter((a) => a.topic === c.topic).length;
        return `${c.topic}: ${count}`;
      }).join("  |  ")
  );

  if (DRY_RUN) {
    console.log("\n🔎  DRY RUN — JSON preview (primeros 2):");
    console.log(
      JSON.stringify(
        allArticles.slice(0, 2).map((a) => ({ ...a, content: a.content.slice(0, 100) + "…" })),
        null,
        2
      )
    );
    return;
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(allArticles, null, 2), "utf8");
  console.log(`\n✅  Guardado: ${OUTPUT_FILE}`);
  console.log(`\n👉  Siguiente paso:`);
  console.log(`    node scripts/upload-new-articles.mjs`);
}

main().catch((err) => {
  console.error("❌  Error:", err);
  process.exit(1);
});
