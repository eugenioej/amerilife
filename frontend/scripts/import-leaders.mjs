/**
 * Bulk-import AmeriLife executive leaders from live amerilife.com into headless WordPress.
 *
 * - Bios and metadata are versioned in this file (scraped from amerilife.com).
 * - Photos: fetches each live page, reads og:image (with fallbacks), downloads and uploads to WP media.
 *
 * If leaders were created without photos, run:
 *   pnpm import:leaders --fix-photos
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_GRAPHQL_ENDPOINT or NEXT_PUBLIC_WORDPRESS_URL
 *   HEADLESS_WP_APP_USER
 *   HEADLESS_WP_APP_PASSWORD
 *
 * Usage:
 *   pnpm import:leaders
 *   pnpm import:leaders --dry-run
 *   pnpm import:leaders --skip-photos
 *   pnpm import:leaders --fix-photos   # only set featured images on existing leader posts
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------

function env(name, fallback = undefined) {
  const v = process.env[name];
  return v == null || v === "" ? fallback : v;
}

function stripOuterQuotes(v) {
  const s = v.trim();
  if (
    (s.startsWith('"') && s.endsWith('"') && s.length >= 2) ||
    (s.startsWith("'") && s.endsWith("'") && s.length >= 2)
  ) {
    return s.slice(1, -1);
  }
  return s;
}

async function loadDotEnvFiles() {
  const candidates = [
    path.join(PROJECT_ROOT, ".env.local"),
    path.join(PROJECT_ROOT, ".env"),
  ];
  for (const p of candidates) {
    let raw = "";
    try {
      raw = await (await import("node:fs/promises")).readFile(p, "utf8");
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

function getConfig() {
  const sourceBase = env("WP_SOURCE_URL", "https://amerilife.com").replace(/\/$/, "");
  const gql = env("NEXT_PUBLIC_GRAPHQL_ENDPOINT");
  const wpUrl = env("NEXT_PUBLIC_WORDPRESS_URL");
  const headlessBase = wpUrl
    ? wpUrl.replace(/\/$/, "")
    : gql
      ? gql.replace(/\/graphql\/?$/, "").replace(/\/$/, "")
      : null;

  const wpUser = env("HEADLESS_WP_APP_USER");
  const wpPassword = env("HEADLESS_WP_APP_PASSWORD");
  const delayMs = Number(env("IMPORT_LEADERS_DELAY_MS", "400"));

  return { sourceBase, headlessBase, wpUser, wpPassword, delayMs };
}

function basicAuthHeader(user, password) {
  const pass = String(password).replace(/\s+/g, "");
  return `Basic ${Buffer.from(`${user}:${pass}`, "utf8").toString("base64")}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        const wait = Math.pow(2, i + 1) * 1000;
        console.warn(`  Rate limited, waiting ${wait}ms...`);
        await sleep(wait);
        continue;
      }
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(1000 * (i + 1));
    }
  }
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

function extractOgImage(html) {
  if (!html) return null;
  let m = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (m) return m[1].trim();
  m = html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
  return m ? m[1].trim() : null;
}

/** Site-wide OG image / logo — not a person headshot. */
function isGenericSiteImage(url) {
  if (!url) return true;
  const u = url.toLowerCase();
  return (
    u.includes("/2017/01/logo") ||
    u.includes("logo.png") ||
    u.includes("amerilife_logo") ||
    (u.includes("/uploads/") && u.endsWith("logo.png"))
  );
}

/**
 * Best URL for the leader headshot: og:image, or first large uploads img in page (not logo).
 */
function extractLeaderPhotoUrl(html) {
  const og = extractOgImage(html);
  if (og && !isGenericSiteImage(og)) {
    return og.replace(/^http:\/\//i, "https://");
  }

  const uploads = [];
  const imgRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let im;
  while ((im = imgRe.exec(html)) !== null) {
    const src = im[1].trim();
    if (!src.includes("wp-content/uploads")) continue;
    if (isGenericSiteImage(src)) continue;
    uploads.push(src.replace(/^http:\/\//i, "https://"));
  }
  return uploads[0] ?? null;
}

// ---------------------------------------------------------------------------
// Leader data (scraped from https://amerilife.com/our-leaders/…)
// ---------------------------------------------------------------------------

/** @type {{ order: number; name: string; slug: string; jobTitle: string; linkedin: string; bioHtml: string }[]} */
const LEADERS = [
  {
    order: 1,
    name: "Scott R. Perry",
    slug: "scott-r-perry",
    jobTitle: "Chairman & Chief Executive Officer",
    linkedin: "https://www.linkedin.com/in/scott-perry-5989a120",
    bioHtml: `<p>As AmeriLife's Chairman &amp; Chief Executive Officer and with more than 30 years' industry experience, Scott Perry leads a multi-channel distribution business with a national network of over 300,000 insurance agents and financial advisors.</p>
<p>Prior to joining AmeriLife in 2016, Scott was Chief Business Officer of CNO Financial Group and President of Bankers Life. Before that, he held leadership roles with Golden Rule, Anthem Blue Cross Blue Shield and Premera Blue Cross.</p>
<p>Scott is a board member with Vericity Inc., a publicly traded insurance holding company, and Insurance Technologies, a leading fintech solutions company in the THL portfolio.</p>`,
  },
  {
    order: 2,
    name: "Kiersten Burstiner",
    slug: "kiersten-burstiner",
    jobTitle: "Chief Human Resources Officer",
    linkedin: "",
    bioHtml: `<p>As AmeriLife's Chief Human Resources Officer, Kiersten Burstiner furthers AmeriLife's people programs by redefining and scaling talent and service delivery strategies to support and enable our rapid and significant growth.</p>
<p>Kiersten is responsible for developing and executing all areas of human capital and human resource management, including talent acquisition, talent management, change management, organizational and performance management, total rewards, succession planning, training and talent development, DE&amp;I (Diversity, Equity &amp; Inclusion), employee relations and HR technology.</p>
<p>Kiersten brings more than 20 years' experience aligning individuals and business strategies to AmeriLife. Prior to joining the company in 2021, Kiersten held multiple human resources leadership roles, including leading talent for Deloitte Consulting's U.S. Industry &amp; Enabling Area practices.</p>
<p>Kiersten is a member the Atlanta CHRO governing body and Chief, a private membership network connecting and supporting women executive leaders.</p>`,
  },
  {
    order: 3,
    name: "Jim Quinn",
    slug: "jim-quinn",
    jobTitle: "Chief Financial Officer",
    linkedin: "",
    bioHtml: `<p>Jim Quinn serves as AmeriLife's Chief Financial Officer, overseeing the company's financial performance. Jim has more than 25 years' experience as an investor, executive and advisor in the financial services industry.</p>
<p>Prior to joining AmeriLife in 2017, Jim served as Senior Vice President of Corporate Development for Marsh &amp; McLennan Agency, the middle-market platform of Marsh. He began his career with Goldman Sachs and spent over a decade with Olympus Partners, a middle-market private equity firm.</p>
<p>Jim graduated from Georgetown University with a degree in Economics and earned his MBA at Stanford University.</p>`,
  },
  {
    order: 4,
    name: "Tim Calvert",
    slug: "tim-calvert",
    jobTitle: "Chief Operating Officer",
    linkedin: "https://www.linkedin.com/in/tim-calvert-288765",
    bioHtml: `<p>Tim Calvert, AmeriLife's Chief Operating Officer, oversees critical dimensions of the company's overall value proposition, including Agent Service Operations, Information Technology and A.I., Enterprise Data and Analytics, and Product Development. He is also responsible for driving enterprise business strategy, post-acquisition integration, and transformation initiatives that position AmeriLife for sustained growth and innovation.</p>
<p>Prior to joining AmeriLife in 2020, Tim served as Managing Director and Partner at Boston Consulting Group (BCG), where he led the global life insurance sector. He began his career at Deloitte Consulting where he served as Principal (Partner), leading the U.S. life, annuity, and group insurance sector and also served as Chief Talent Officer for Deloitte Consulting's U.S. Industry practices. Throughout his tenure at BCG and Deloitte, Tim advised leading insurance organizations on business growth, distribution transformation, advanced data and analytics deployment, and digital strategies at the intersection of operations and technology.</p>
<p>Tim earned a bachelor's degree in Business Administration from the University of Kansas and an MBA from the Ross School of Business at the University of Michigan.</p>`,
  },
  {
    order: 5,
    name: "Gideon Moore",
    slug: "gideon-moore",
    jobTitle: "Chief Legal Officer",
    linkedin: "https://www.linkedin.com/in/gideonmoore/",
    bioHtml: `<p>As AmeriLife's Chief Legal Officer, Gideon Moore serves as the company's lead legal counsel, managing AmeriLife's Legal and Compliance department and advising its Board of Directors and Executive Leadership Team on all legal, regulatory, corporate governance, investment, transactional, and risk issues.</p>
<p>Gideon served in progressively senior legal roles at AmeriLife for more than seven years between 2014 and 2021, including as Associate General Counsel and Secretary overseeing all legal matters related to the company's mergers and acquisitions efforts. During this tenure, he was named a finalist for the Tampa Bay Business Journal's 2016 Top Corporate Counsel award.</p>
<p>Gideon began his career with the historic white-shoe law firm, Cadwalader, Wickersham &amp; Taft LLP, where he spent four years in its Corporate and Global Finance Departments. He received his J.D. from Duke University School of Law and B.A. from the University of North Carolina at Chapel Hill.</p>`,
  },
  {
    order: 6,
    name: "Andrew Soss",
    slug: "andrew-soss",
    jobTitle: "Chief of Staff",
    linkedin: "https://www.linkedin.com/in/andrewjsoss/",
    bioHtml: `<p>Andrew Soss serves as AmeriLife's Chief of Staff, where he partners closely with the Executive Leadership Team to drive strategic alignment, oversee high-impact initiatives, and manage Board-level engagement.</p>
<p>Prior to AmeriLife, Andrew was Managing Director, Client Solutions at LogicSource, Inc., leading initiatives to optimize operational performance and deliver measurable business outcomes. Previously, he held senior roles at The Hackett Group, specializing in strategy and transformation, and began his career as a Senior Financial Analyst at Allstate.</p>
<p>Andrew earned a Bachelor of Business Administration in Finance and Real Estate from Emory University.</p>`,
  },
  {
    order: 7,
    name: "Mike Vietri",
    slug: "mike-vietri",
    jobTitle: "EVP, Distribution, and Senior Advisor to the Office of the CEO",
    linkedin: "https://www.linkedin.com/in/mike-vietri-39176b4a",
    bioHtml: `<p>Mike Vietri serves as an executive leader and senior strategic advisor for AmeriLife — tapping into his prestigious 30-year career to help agency owners grow their business and increase productivity, while developing insurance and retirement products and distribution strategies to address the needs of America's pre-retirees and retirees.</p>
<p>Since joining AmeriLife in 2016, Mike has enhanced and grown the company's national Health and Wealth distribution networks to include a diverse population of over 300,000 insurance agents and advisors, and more than 160 career agency offices and affiliate marketing organizations.</p>
<p>Prior to joining AmeriLife, Mike held executive positions with the Producers Group and MetLife, where he successfully led change for one of the nation's largest sales and general distribution groups.</p>`,
  },
  {
    order: 8,
    name: "Michael Tobitsch",
    slug: "michael-tobitsch",
    jobTitle: "Executive Vice President & Head of Corporate Development",
    linkedin: "https://www.linkedin.com/in/michael-tobitsch-a26a317/",
    bioHtml: `<p>As AmeriLife's Executive Vice President and Head of Corporate Development, Michael Tobitsch spearheads AmeriLife's growth strategy and leads its mergers and acquisitions and partnership integration efforts.</p>
<p>Previously, Michael served as a Managing Director at Marsh McLennan, where he managed a team of investment professionals who together deployed over $1 billion annually into global acquisitions across the insurance, investment management and advisory industries. Michael began his career as an investment banker at Wells Fargo Securities.</p>
<p>Michael holds a B.S. from Boston University's Questrom School of Business with a concentration in finance and accounting.</p>`,
  },
  {
    order: 9,
    name: "Todd Buchanan",
    slug: "todd-buchanan",
    jobTitle: "President, Wealth",
    linkedin: "https://www.linkedin.com/in/todd-buchanan/",
    bioHtml: `<p>Todd Buchanan serves as President of AmeriLife Wealth Group, where he leads the company's expanding Wealth Distribution organization. In this role, Todd is responsible for driving strategy, growth, and performance across AmeriLife's national network of wealth distribution affiliates and advisors, advancing the company's mission to deliver comprehensive, client-centric financial solutions.</p>
<p>Todd brings nearly 30 years of experience in insurance distribution, retirement, and wealth management leadership. He joined AmeriLife from Transamerica, where he served on the Transamerica Management Board and as President of World Financial Group (WFG). Under his leadership, WFG became one of the largest financial services distribution networks in North America, focused on expanding financial access, advisor growth, and innovative distribution models.</p>
<p>Prior to Transamerica, Todd held senior leadership roles at AIG Life and Retirement (now Corebridge Financial), where he spent more than two decades building and leading high-performing distribution organizations across multiple regions and functions. Earlier in his career, he served as Chief Executive Officer of Coherent Global, an insurance technology company, where he led large-scale digital transformation initiatives and supported rapid business growth.</p>
<p>Todd began his professional career as a U.S. Army officer, achieving the rank of Captain, an experience that continues to shape his leadership philosophy and commitment to service. He is a graduate of the University of Southern Mississippi and was inducted into the university's Alumni Hall of Fame in 2015. Todd also serves on several industry and community boards and is passionate about advancing financial literacy and long-term financial security for individuals and families.</p>`,
  },
  {
    order: 10,
    name: "Scotty Elliott",
    slug: "scotty-elliott",
    jobTitle: "Chief Distribution Officer, Health",
    linkedin: "https://www.linkedin.com/in/scotty-elliott-a3492336/",
    bioHtml: `<p>As AmeriLife's Chief Distribution Officer for Health, Scotty Elliott oversees a distribution organization of more than 50 independent health and life marketing organizations that has more than doubled in size since 2020.</p>
<p>In this role, Scotty leads AmeriLife's Medicare and Simplified Issue verticals, as well as its Direct-to-Consumer distribution arm. He joined AmeriLife in 2019 and was named president of the company's Life and Health Brokerage Distribution in 2020. Prior to joining AmeriLife, he successfully led One Life, a life and final expense insurance provider, where he spearheaded a holistic reconstruction effort that included a corporate rebrand, governance overhaul, and market diversification strategy.</p>
<p>Scotty holds Bachelor's and Master's degrees from Mississippi College.</p>`,
  },
  {
    order: 11,
    name: "Ovi Vitas",
    slug: "ovi-vitas",
    jobTitle: "Chief Marketing Officer",
    linkedin: "https://www.linkedin.com/in/ovi-vitas-553439/",
    bioHtml: `<p>As AmeriLife's Chief Marketing Officer, Ovidio "Ovi" Vitas leads the company's marketing strategies and programs, bringing broader awareness to AmeriLife's holistic solutions to life, health and retirement planning. His oversight includes enterprise brand strategy, creative, communications, e-commerce, acquisition/performance, as well as marketing data, insights and analytics. Additionally, Ovi oversees AmeriLife's newly formed Direct to Consumer business, with a focus on operational and marketing excellence.</p>
<p>Prior to joining AmeriLife in 2020, Ovi served as Executive Vice President and Chief Brand and Digital Officer for Marriott Vacations Worldwide, where he oversaw all brand, digital and performance optimization efforts. He has also led award-winning advertising initiatives and overall channel optimization for global brands, including Electronic Arts, NBC/Universal, Warner Brothers and Reebok.</p>
<p>Ovi graduated with a Bachelor of Science degree from Vanderbilt University and earned his MBA at Cornell University.</p>`,
  },
];

// ---------------------------------------------------------------------------
// WordPress REST
// ---------------------------------------------------------------------------

async function wpRestGet(headlessBase, endpoint, authHeader) {
  const url = `${headlessBase}/wp-json${endpoint}`;
  const res = await fetchWithRetry(url, {
    headers: { authorization: authHeader, accept: "application/json" },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${endpoint} -> ${res.status}: ${txt.slice(0, 200)}`);
  }
  return res.json();
}

async function wpRestPost(headlessBase, endpoint, body, authHeader) {
  const url = `${headlessBase}/wp-json${endpoint}`;
  const res = await fetchWithRetry(url, {
    method: "POST",
    headers: {
      authorization: authHeader,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`POST ${endpoint} -> ${res.status}: ${txt.slice(0, 500)}`);
  }
  return res.json();
}

async function wpRestPatch(headlessBase, endpoint, body, authHeader) {
  const url = `${headlessBase}/wp-json${endpoint}`;
  const res = await fetchWithRetry(url, {
    method: "PATCH",
    headers: {
      authorization: authHeader,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`PATCH ${endpoint} -> ${res.status}: ${txt.slice(0, 500)}`);
  }
  return res.json();
}

/**
 * @param {string} headlessBase
 * @param {string} authHeader
 * @param {string} imageUrl
 * @param {string} altText
 */
async function uploadMediaAsset(headlessBase, authHeader, imageUrl, altText) {
  const imgRes = await fetchWithRetry(imageUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      accept: "image/*,*/*;q=0.8",
      referer: "https://amerilife.com/",
    },
  });
  if (!imgRes.ok) {
    throw new Error(`Image download failed ${imgRes.status}: ${imageUrl}`);
  }

  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const parsedUrl = new URL(imageUrl);
  const filename = path.basename(parsedUrl.pathname) || "leader-photo.jpg";
  const contentType = imgRes.headers.get("content-type") || "image/jpeg";

  const uploadUrl = `${headlessBase}/wp-json/wp/v2/media`;
  const uploadRes = await fetchWithRetry(uploadUrl, {
    method: "POST",
    headers: {
      authorization: authHeader,
      "content-disposition": `attachment; filename="${filename}"`,
      "content-type": contentType,
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    const txt = await uploadRes.text().catch(() => "");
    throw new Error(`Media upload failed ${uploadRes.status}: ${txt.slice(0, 300)}`);
  }

  const media = await uploadRes.json();

  if (altText && media.id) {
    try {
      await wpRestPost(
        headlessBase,
        `/wp/v2/media/${media.id}`,
        { alt_text: altText },
        authHeader
      );
    } catch {
      // non-fatal
    }
  }

  return { id: media.id, sourceUrl: media.source_url || "" };
}

async function fetchLivePageHtml(sourceBase, slug) {
  const url = `${sourceBase}/our-leaders/${slug}/`;
  const res = await fetchWithRetry(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      accept: "text/html",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

async function leaderExists(headlessBase, authHeader, slug) {
  const rows = await wpRestGet(
    headlessBase,
    `/wp/v2/leader?slug=${encodeURIComponent(slug)}&per_page=1&status=publish,draft,pending`,
    authHeader
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

/**
 * Download headshot from live amerilife.com and upload to headless media library.
 * @returns {Promise<{ id: number; sourceUrl: string } | null>}
 */
async function fetchAndUploadLeaderPhoto(headlessBase, authHeader, sourceBase, slug, altText) {
  const html = await fetchLivePageHtml(sourceBase, slug);
  const photoUrl = extractLeaderPhotoUrl(html);
  if (!photoUrl) {
    throw new Error(`No leader photo URL found in HTML for ${slug}`);
  }
  return uploadMediaAsset(headlessBase, authHeader, photoUrl, altText);
}

async function runFixPhotos({ sourceBase, headlessBase, authHeader, delayMs, dryRun }) {
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  console.log("Mode: --fix-photos (set featured image from live amerilife.com for existing leaders)\n");

  for (let i = 0; i < LEADERS.length; i++) {
    const L = LEADERS[i];
    const label = `[${i + 1}/${LEADERS.length}]`;

    if (dryRun) {
      console.log(`${label} Would set photo: ${L.slug}`);
      continue;
    }

    try {
      const existing = await leaderExists(headlessBase, authHeader, L.slug);
      if (!existing) {
        console.warn(`${label} No leader post for slug "${L.slug}" — run full import first.`);
        skipped += 1;
        continue;
      }

      const media = await fetchAndUploadLeaderPhoto(
        headlessBase,
        authHeader,
        sourceBase,
        L.slug,
        `${L.name} — AmeriLife`
      );
      await wpRestPatch(
        headlessBase,
        `/wp/v2/leader/${existing.id}`,
        { featured_media: media.id },
        authHeader
      );
      console.log(`${label} Featured image set: ${L.slug} -> media ${media.id}`);
      updated += 1;
    } catch (err) {
      console.error(`${label} FAILED ${L.slug}: ${err.message}`);
      failed += 1;
    }

    if (i < LEADERS.length - 1) await sleep(delayMs);
  }

  if (!dryRun) {
    console.log(`\nfix-photos done. updated=${updated} skipped=${skipped} failed=${failed}`);
  }
  return { updated, skipped, failed };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const skipPhotos = args.includes("--skip-photos");
  const fixPhotos = args.includes("--fix-photos");

  await loadDotEnvFiles();
  const { sourceBase, headlessBase, wpUser, wpPassword, delayMs } = getConfig();

  if (!dryRun) {
    if (!headlessBase) {
      console.error("Missing NEXT_PUBLIC_WORDPRESS_URL or NEXT_PUBLIC_GRAPHQL_ENDPOINT.");
      process.exit(1);
    }
    if (!wpUser || !wpPassword) {
      console.error("Set HEADLESS_WP_APP_USER and HEADLESS_WP_APP_PASSWORD in .env.local");
      process.exit(1);
    }
  }

  const authHeader = wpUser && wpPassword ? basicAuthHeader(wpUser, wpPassword) : "";

  if (!dryRun && headlessBase) {
    try {
      await wpRestGet(headlessBase, "/wp/v2/users/me", authHeader);
      console.log("Auth OK (headless WordPress).\n");
    } catch (e) {
      console.error("WordPress auth failed:", e.message);
      process.exit(1);
    }
  }

  if (fixPhotos && !dryRun) {
    const r = await runFixPhotos({ sourceBase, headlessBase, authHeader, delayMs, dryRun: false });
    process.exit(r.failed > 0 ? 1 : 0);
    return;
  }
  if (fixPhotos && dryRun) {
    await runFixPhotos({ sourceBase, headlessBase, authHeader, delayMs, dryRun: true });
    console.log("\nDry run (--fix-photos): would update featured images for existing leaders.");
    return;
  }

  console.log(`Source (live): ${sourceBase}`);
  console.log(`Target: ${headlessBase || "(dry-run)"}`);
  console.log(`Leaders: ${LEADERS.length} | dry-run=${dryRun} skip-photos=${skipPhotos}\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < LEADERS.length; i++) {
    const L = LEADERS[i];
    const label = `[${i + 1}/${LEADERS.length}]`;

    if (dryRun) {
      console.log(`${label} Would import: ${L.slug} — ${L.name}`);
      continue;
    }

    try {
      const existing = await leaderExists(headlessBase, authHeader, L.slug);
      if (existing) {
        console.log(`${label} Skip (exists): ${L.slug} (id ${existing.id})`);
        skipped += 1;
        continue;
      }

      let featuredMediaId = 0;
      if (!skipPhotos) {
        try {
          const media = await fetchAndUploadLeaderPhoto(
            headlessBase,
            authHeader,
            sourceBase,
            L.slug,
            `${L.name} — AmeriLife`
          );
          featuredMediaId = media.id;
          console.log(`${label} Photo -> media ${featuredMediaId}`);
        } catch (photoErr) {
          console.warn(`${label} Photo step failed (${L.slug}): ${photoErr.message}`);
        }
      }

      const body = {
        title: L.name,
        slug: L.slug,
        status: "publish",
        content: L.bioHtml,
        menu_order: L.order,
        meta: {
          job_title: L.jobTitle,
          linkedin_url: L.linkedin || "",
        },
      };
      if (featuredMediaId) {
        body.featured_media = featuredMediaId;
      }

      const post = await wpRestPost(headlessBase, "/wp/v2/leader", body, authHeader);
      let fm = post.featured_media ?? 0;
      if (featuredMediaId && Number(fm) !== Number(featuredMediaId)) {
        try {
          const patched = await wpRestPatch(
            headlessBase,
            `/wp/v2/leader/${post.id}`,
            { featured_media: featuredMediaId },
            authHeader
          );
          fm = patched.featured_media ?? featuredMediaId;
          console.log(`${label} Patched featured_media=${fm}`);
        } catch (patchErr) {
          console.warn(`${label} Could not PATCH featured_media: ${patchErr.message}`);
        }
      }
      console.log(`${label} Created leader id=${post.id} slug=${post.slug} featured_media=${fm || featuredMediaId || "none"}`);
      created += 1;
    } catch (err) {
      console.error(`${label} FAILED ${L.slug}: ${err.message}`);
      failed += 1;
    }

    if (i < LEADERS.length - 1) await sleep(delayMs);
  }

  if (dryRun) {
    console.log(`\nDry run complete. ${LEADERS.length} leaders would be processed.`);
    return;
  }

  console.log(`\nDone. created=${created} skipped=${skipped} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
