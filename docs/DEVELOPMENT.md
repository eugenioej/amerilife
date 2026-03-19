# Development Guide

Everything needed to run the project locally and deploy.

## Prerequisites

- **Node.js** >= 20
- **pnpm** (package manager) — use exclusively, not npm or yarn

## Local Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd amerilife
pnpm install
```

### 2. Environment variables

Copy the example file and edit:

```bash
cp frontend/.env.example frontend/.env.local
```

| Variable | Required | Default | Description |
|---------|----------|---------|-------------|
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | Yes | `https://headlessameril.wpenginepowered.com/graphql` | Headless WordPress GraphQL API |
| `NEXT_PUBLIC_USE_LIVE_IMAGES` | No | `0` | `1` = load images from amerilife.com; `0` = use headless WP URLs |
| `NEXT_PUBLIC_SITE_URL` | No | — | Frontend site URL for canonical/OG (rewrites Yoast URLs) |

### 3. Run development server

```bash
pnpm dev
```

Server runs at **http://localhost:3000** (Turbopack enabled).

## Scripts

All scripts run from the project root unless noted.

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Next.js dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Run production server (after `build`) |
| `pnpm lint` | Run ESLint |
| `pnpm -C frontend sync:wp-images` | Sync images from amerilife.com to headless WP via SFTP |
| `pnpm -C frontend sync:wp-images:download` | Download images only (no SFTP credentials needed) |
| `pnpm -C frontend verify:headless-images` | Verify sample image URLs on headless WP |
| `pnpm -C frontend verify:media-import` | Verify Media Library import endpoint and auth |
| `pnpm -C frontend migrate:extract` | Extract blog posts from old Divi site |
| `pnpm -C frontend migrate:upload` | Upload extracted posts to headless WP |
| `pnpm -C frontend migrate:posts` | Full migrate (extract + upload) |

## Image Sync Workflow

Images are **not** uploaded during build. They must exist on headless WordPress before deploy.

### Option A: Manual upload

Upload images via WP Admin: `https://headlessameril.wpenginepowered.com/wp-admin/upload.php`

### Option B: SFTP sync script

1. Add to `frontend/.env.local`:
   ```
   SYNC_WP_IMAGES=1
   HEADLESS_SFTP_HOST=headlessameril.sftp.wpengine.com
   HEADLESS_SFTP_PORT=2222
   HEADLESS_SFTP_USER=<your-sftp-user>
   HEADLESS_SFTP_PASSWORD=<your-sftp-password>
   ```
2. Run: `pnpm -C frontend sync:wp-images`

The script downloads images from `amerilife.com` (or configured source) and uploads them to headless WP. Image paths are defined in `frontend/lib/wp-image-sources.ts` and per-page sync scripts in `frontend/scripts/`.

### Option C: Download only (no credentials)

```bash
pnpm -C frontend sync:wp-images:download
```

Downloads images locally without uploading. Useful for verifying sources.

## Deployment (WP Engine Atlas)

1. **Environment variables** — In Atlas → Settings → Environment Variables, set:
   - `NEXT_PUBLIC_GRAPHQL_ENDPOINT` = `https://headlessameril.wpenginepowered.com/graphql`
   - `NEXT_PUBLIC_USE_LIVE_IMAGES` = `0`

2. **Images** — Ensure images are on headless WP (manual or sync script run separately).

3. **Deploy** — Push to `main` or trigger **Redeploy** in Atlas.

4. **Verify** — Check a page with images, e.g. `/about-us/who-we-are`.

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step Atlas configuration.

## Common Tasks

### Adding a new location or agent

All location and agent data lives in `frontend/lib/locations-data.ts`. The catch-all route uses this file to resolve URLs like `/polk-county/` and `/polk-county/ryan-atkins/`.

**To add a new office location:**

1. Add an entry to the `LOCATIONS` object in `locations-data.ts` with: `slug`, `officeName`, `phone`, `address`, `hours`, `aboutOffice`, `agents`, `features`, and optionally `officeImageUrl`.
2. The slug becomes the URL path (e.g. `polk-county` → `/polk-county/`).
3. Add agent objects to `agents` with: `slug`, `name`, `role`, `city`, `state`, and optionally `photoUrl`, `bio`, `email`, `phone`, `areasOfFocus`.
4. Agent URLs are `/{location-slug}/{agent-slug}/` (e.g. `/polk-county/ryan-atkins/`).

**To add an agent to an existing location:** Append to the `agents` array in that location's entry.

### Key lib files

| File | Purpose |
|------|---------|
| `lib/locations-data.ts` | Location and agent data (no CMS — edit this file) |
| `lib/search-index.ts` | Static search index for non-blog pages |
| `lib/wp-image-sources.ts` | Central image URLs for hardcoded pages (used by sync script) |
| `lib/wp-menus.ts` | Nav menus (WP GraphQL + static fallback) |

### Maintaining the search index

Site search uses a static in-memory index in `frontend/lib/search-index.ts`. **New pages are not searchable until you add them.**

Each entry has: `path`, `title`, `description`, `keywords` (string array). Add a new object to `SEARCH_INDEX` when you create a new static page. Blog posts are searched via GraphQL (`SEARCH_POSTS`) and do not need to be added here.
