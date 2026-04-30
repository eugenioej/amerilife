# Development Guide

Everything needed to run the project locally and contribute.

## Prerequisites

- **Node.js** >= 20
- **pnpm** — use exclusively; do not use npm or yarn

## Local Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd amerilife
pnpm install
```

### 2. Environment variables

```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:

| Variable | Required | Default | Description |
|---------|----------|---------|-------------|
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | Yes | `https://headlessameril.wpenginepowered.com/graphql` | Headless WordPress GraphQL API URL |
| `NEXT_PUBLIC_USE_LIVE_IMAGES` | No | `0` | `1` = load images from amerilife.com; `0` = use headless WP URLs |
| `NEXT_PUBLIC_SITE_URL` | No | — | Frontend canonical base URL (e.g. `https://amerilife.com`). Rewrites Yoast canonical URLs. |

SFTP credentials (only needed for image sync — see Image Sync Workflow below):

| Variable | Description |
|---------|-------------|
| `SYNC_WP_IMAGES` | Set to `1` to enable SFTP upload in sync script |
| `HEADLESS_SFTP_HOST` | SFTP host (e.g. `headlessameril.sftp.wpengine.com`) |
| `HEADLESS_SFTP_PORT` | SFTP port (typically `2222`) |
| `HEADLESS_SFTP_USER` | SFTP username |
| `HEADLESS_SFTP_PASSWORD` | SFTP password |
| `HEADLESS_WP_APP_USER` | WordPress Application Password username (for media import endpoint) |
| `HEADLESS_WP_APP_PASSWORD` | WordPress Application Password (for media import endpoint) |

### 3. Run development server

```bash
pnpm dev
```

Server runs at **http://localhost:3000** (Turbopack enabled).

---

## Script Reference

All scripts run from the project root unless noted with `-C frontend`.

### Development & Build

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Next.js dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Run production server (after `build`) |
| `pnpm lint` | Run ESLint |

### Image Sync

| Command | Purpose |
|---------|---------|
| `pnpm -C frontend sync:wp-images` | Download images from amerilife.com and upload to headless WP via SFTP |
| `pnpm -C frontend sync:wp-images:download` | Download images only (no upload; no SFTP credentials needed) |

### Verification

| Command | Purpose |
|---------|---------|
| `pnpm -C frontend verify:headless-images` | Check sample image URLs are accessible on headless WP |
| `pnpm -C frontend verify:media-import` | Verify the `/import-media` mu-plugin endpoint and Application Password auth |
| `pnpm -C frontend check:pages-404` | Crawl all static routes and report any that return non-200 status |

### Blog / Post Migration

| Command | Purpose |
|---------|---------|
| `pnpm -C frontend migrate:extract` | Extract blog posts from the legacy Divi site |
| `pnpm -C frontend migrate:upload` | Upload extracted posts to headless WordPress |
| `pnpm -C frontend migrate:posts` | Full extract + upload in one step |

### Insights

| Command | Purpose |
|---------|---------|
| `pnpm seed:insights:wp` | Seed Insights articles into WordPress (one-time import) |

### Leaders

| Command | Purpose |
|---------|---------|
| `pnpm -C frontend import:leaders` | Import leader profiles into WordPress from source data |

### Agency Pipeline (see [AGENCIES.md](AGENCIES.md) for full details)

| Command | Purpose |
|---------|---------|
| `pnpm scrape:agencies` | Scrape agency/agent pages from amerilife.com |
| `pnpm enrich:agencies` | Rule-based enrichment of scraped agency data |
| `pnpm enrich:agencies-llm` | LLM-based enrichment (only unprocessed records) |
| `pnpm enrich:agencies-llm -- --all` | LLM-based enrichment (all records, overwrite) |
| `pnpm apply:agency-defaults` | Apply default values to any remaining empty fields |
| `pnpm pipeline:agencies` | Shortcut: scrape + enrich + LLM-enrich in one command |
| `pnpm import:all-agencies` | Import enriched agencies into WordPress |
| `pnpm import:all-agencies:overwrite` | Import and overwrite existing WordPress records |
| `pnpm import:all-agencies:fresh` | Wipe WordPress agencies first, then import fresh |
| `pnpm export:scraped-csv` | Export enriched agency data to CSV for review |
| `pnpm -C frontend run sync:agency-gf-ids` | Link Gravity Form IDs to Agency CPT posts in WordPress |
| `pnpm -C frontend run wipe:agencies-wp` | **Destructive** — delete all Agency CPT posts from WordPress |
| `pnpm -C frontend run normalize:agent-json` | Normalize agent JSON format |
| `pnpm -C frontend run patch:agency-images` | Patch missing featured images on Agency CPT posts |
| `pnpm -C frontend run map:gf-forms` | Map Gravity Form IDs to agency records (generates CSV) |
| `pnpm -C frontend run import:affiliates` | Import affiliate company data from amerilife.com |

---

## Image Sync Workflow

Images are **not** uploaded during the Next.js build. They must exist on headless WordPress before deployment. There are four options:

**Option A — Manual upload:**  
Upload directly via WP Admin → Media Library:  
`https://headlessameril.wpenginepowered.com/wp-admin/upload.php`

**Option B — SFTP sync (recommended for bulk sync):**

1. Set SFTP credentials in `frontend/.env.local` (see env vars table above).
2. Run:
   ```bash
   pnpm -C frontend sync:wp-images
   ```
   The script reads image paths from `frontend/lib/wp-image-sources.ts`, downloads from `amerilife.com`, and uploads via SFTP.

**Option C — Download only:**
```bash
pnpm -C frontend sync:wp-images:download
```
Downloads images to local disk without SFTP credentials. Useful for verifying source images exist.

**Option D — Media import endpoint (after SFTP upload):**  
Call `POST /wp-json/amerilife/v1/import-media` on the headless WP instance to register SFTP-uploaded files in the Media Library. Requires an Application Password. See [WORDPRESS.md](WORDPRESS.md#must-use-plugins) for endpoint details.

---

## Common Tasks

### Adding a new static page

1. Create `frontend/app/(site)/your-route/page.tsx`.
2. Implement the page with hardcoded or CMS-fetched content.
3. Add a `metadata` export with title and description.
4. Add the route to `frontend/lib/sitemap-config.ts` (`STATIC_SITEMAP_PATHS`) so it appears in `sitemap.xml`.
5. If the page should be searchable, add it to `frontend/lib/search-index.ts`.
6. If images are needed, add their URLs to `frontend/lib/wp-image-sources.ts` and run the image sync.

### Adding a new agency or agent

**Preferred — via WordPress:**
Add the Agency CPT post (and OfficeAgent posts) directly in WP Admin. Pages are live on next request with no rebuild needed. See [AGENCIES.md](AGENCIES.md#adding-a-new-office-or-agent).

**Legacy fallback — via `locations-data.ts`:**

1. Add an entry to `frontend/lib/locations-data.ts` with: `slug`, `officeName`, `phone`, `address`, `hours`, `aboutOffice`, `agents`, `features`, and optionally `officeImageUrl` and `gravityFormId`.
2. The slug becomes the URL (`polk-county` → `/polk-county/`).
3. Agents are `/{location-slug}/{agent-slug}/` (e.g. `/polk-county/ryan-atkins/`).
4. Agent fields: `slug`, `name`, `role`, `city`, `state`, and optionally `photoUrl`, `bio`, `email`, `phone`, `areasOfFocus`.

Do not use this path for new offices — add them to WordPress instead.

### Adding a Gravity Form to a page

See [FORMS.md](FORMS.md#adding-a-form-to-a-new-page).

### Updating navigation

Navigation menus are managed in WordPress (WP Admin → Appearance → Menus). Menus must be assigned to a theme location ("Primary" or "Header") to be visible via WPGraphQL. If WordPress returns no menu, the frontend falls back to hardcoded constants in `lib/wp-menus.ts`.

### Maintaining the search index

`frontend/lib/search-index.ts` provides the static search index for marketing pages (not blog posts). Blog posts are searched via WPGraphQL.

Each entry requires: `path`, `title`, `description`, `keywords` (string array). Add a new object to `SEARCH_INDEX` when creating a new static page. Blog posts do not need to be added — they are queried dynamically via `SEARCH_POSTS`.

---

## Key Library Files

| File | Purpose |
|------|---------|
| `lib/wp-client.ts` | Central GraphQL fetcher |
| `lib/queries.ts` | All GraphQL query and mutation documents |
| `lib/agencies.ts` | Agency/Agent CPT fetch functions and data adapters |
| `lib/insights-data.ts` | Insights CPT fetch functions |
| `lib/gf-client.ts` | Gravity Forms fetch and submit helpers, form ID constants |
| `lib/seo.ts` | SEO metadata helpers, `yoastSeoToMetadata()` |
| `lib/wp-media.ts` | Image URL rewriting functions |
| `lib/wp-menus.ts` | Navigation menu fetch with static fallback |
| `lib/wp-redirects.ts` | Build-time redirect fetch from WordPress Redirection plugin |
| `lib/locations-data.ts` | Static agency/agent fallback data |
| `lib/search-index.ts` | Static search index for marketing pages |
| `lib/wp-image-sources.ts` | Registry of all hardcoded page images (used by sync script) |
| `lib/sitemap-config.ts` | Static sitemap paths and disallowed paths |

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full WP Engine Atlas deployment instructions.

Quick reference:
1. Set `NEXT_PUBLIC_GRAPHQL_ENDPOINT` and `NEXT_PUBLIC_USE_LIVE_IMAGES=0` in Atlas environment variables.
2. Ensure images are present on headless WordPress.
3. Push to `main` or trigger Redeploy in Atlas.
