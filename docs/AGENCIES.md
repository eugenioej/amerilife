# Agencies & Agents

Agency location pages and agent profile pages are driven by a WordPress Custom Post Type. This document covers the data model, page resolution, and the one-time data pipeline used to populate WordPress from scraped source data.

## Overview

AmeriLife has a network of career agency offices, each with staff agents. These are represented as:

- **Agency** — A WordPress CPT representing an office location. Has custom fields for phone, address, hours, hero image, features, and an optional Gravity Form ID.
- **OfficeAgent** — A WordPress CPT representing an individual agent, linked to a parent Agency.

The frontend renders these via:
- `/{agency-slug}/` → `LocationPageTemplate`
- `/{agency-slug}/{agent-slug}/` → `AgentDetailTemplate`

Both are resolved by the catch-all route `(site)/[...slug]/page.tsx`. See [ROUTING.md](ROUTING.md#catch-all-slug) for the full resolution order.

---

## Data Model

### Agency CPT (`agencyFields`)

| Field | GraphQL key | Description |
|-------|-------------|-------------|
| `slug` | `slug` | URL slug (e.g. `polk-county`) |
| `title` | `title` | Office display name |
| `phone` | `agencyFields.phone` | Main phone number |
| `address line 1` | `agencyFields.addressLine1` | Street address |
| `address line 2` | `agencyFields.addressLine2` | Suite / Unit (optional) |
| `city` | `agencyFields.addressCity` | City |
| `state` | `agencyFields.addressState` | State abbreviation |
| `zip` | `agencyFields.addressZip` | ZIP code |
| `hours` | `agencyFields.hours` | Office hours string |
| `about office` | `agencyFields.aboutOffice` | Office description paragraph |
| `hero image URL` | `agencyFields.heroImageUrl` | Override hero image |
| `features JSON` | `agencyFields.featuresJson` | JSON array of `FeatureBlock` objects |
| `map search URL` | `agencyFields.mapSearchUrl` | Google Maps search URL |
| `Gravity Form ID` | `agencyFields.gravityFormId` | Per-agency "Connect" form (falls back to `31`) |
| `featured image` | `featuredImage.node.sourceUrl` | Fallback hero if `heroImageUrl` is empty |

### Agent CPT (`officeAgent`)

| Field | GraphQL key | Description |
|-------|-------------|-------------|
| `slug` | `slug` | URL slug (e.g. `ryan-atkins`) |
| `name` | `name` | Full display name |
| `role` | `role` | Job title (optional; omitted if identical to "Licensed Insurance Agent") |
| `city` | `city` | Agent's city |
| `state` | `state` | Agent's state |
| `photo URL` | `photoUrl` | Headshot image URL |
| `bio` | `content` | Post content used as bio (HTML stripped to plain text) |
| `email` | `email` | Contact email |
| `phone` | `phone` | Direct phone |
| `areas of focus` | `areasOfFocus` | Comma-separated string → `string[]` |
| `menu order` | `menuOrder` | Sort order within the agency's agent list |

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/agencies.ts` | GraphQL fetch functions, `AgencyDetailGql` → `LocationData` adapter |
| `lib/locations-data.ts` | Static fallback data (legacy; prefer WordPress CPT for new offices) |
| `lib/queries.ts` | `GET_AGENCIES`, `GET_AGENCY_BY_SLUG`, `GET_AGENT_PAGE_DATA`, `GET_AGENCIES_FOR_SITEMAP`, `GET_AGENCIES_FOR_FIND_AGENT` |

### `lib/agencies.ts` — Public API

| Function | Purpose |
|----------|---------|
| `fetchAgencyBySlug(slug)` | Fetch a single agency + its agents from WPGraphQL |
| `fetchAgentWithLocation(agencySlug, agentSlug)` | Fetch one agent and its parent agency |
| `fetchLocationsForFindAgentPage()` | Fetch all agencies (lightweight, no agents) for `/find-an-agent` |
| `fetchAllAgencySlugs()` | Fetch all agency slugs (for sitemap) |
| `agencyGraphqlToLocationData(agency)` | Map `AgencyDetailGql` → `LocationData` (used by templates) |
| `agencyLocationMetadata(location)` | Build Next.js `Metadata` for an agency page |
| `agentDetailMetadata(agent, location)` | Build Next.js `Metadata` for an agent detail page |
| `parseFeaturesJson(raw)` | Parse `featuresJson` string → `FeatureBlock[]` |

### `features_json` Format

The `featuresJson` field on an Agency CPT is a JSON string. Each element maps to a `FeatureBlock`:

```json
[
  { "heading": "Medicare Solutions", "body": "We help seniors navigate coverage options.", "icon": "medicare" },
  { "heading": "Health Insurance", "body": "Individual and group plans.", "icon": "health" }
]
```

Valid icon values: `medicare`, `health`, `life`, `annuity`.

---

## Static Fallback (`locations-data.ts`)

`frontend/lib/locations-data.ts` contains a hardcoded list of offices and agents. This was the original data source before the Agency CPT was implemented. The catch-all route tries WordPress first and falls back to this file if nothing is found.

**Do not add new offices to `locations-data.ts`.** Add them to WordPress via the Agency CPT. The static file is kept only until all legacy offices are fully migrated.

---

## Agency Data Pipeline

The following pipeline was used to bulk-import agency and agent data from the legacy AmeriLife website into WordPress. These scripts are run manually, not during deployment.

### Pipeline Overview

```
scrape:agencies
    ↓
enrich:agencies
    ↓
enrich:agencies-llm
    ↓
import:all-agencies  (into WordPress)
    ↓
sync:agency-gf-ids  (link Gravity Form IDs)
```

### Step-by-Step

#### 1. Scrape

```bash
pnpm scrape:agencies
```

Script: `frontend/scripts/scrape-agent-pages.mjs`

Crawls `amerilife.com` agency/agent pages and produces raw JSON in `docs/scraped-agencies.json` and `docs/scraped-agencies-agents.csv`.

#### 2. Enrich (rule-based)

```bash
pnpm enrich:agencies
```

Script: `frontend/scripts/enrich-scraped-agencies.mjs`

Normalizes fields, fills in missing address parts, and deduplicates records. Outputs enriched JSON.

#### 3. Enrich (LLM)

```bash
pnpm enrich:agencies-llm
# or, to re-process all records:
pnpm enrich:agencies-llm -- --all
```

Script: `frontend/scripts/enrich-agencies-llm.mjs`

Uses an LLM to improve office descriptions, extract hours, and clean up names. Results are merged back into the agency JSON.

#### 4. Apply Defaults

```bash
pnpm apply:agency-defaults
```

Script: `frontend/scripts/apply-agency-defaults.mjs`

Sets fallback values for any remaining empty fields before import.

#### 5. Import into WordPress

```bash
pnpm import:all-agencies
# Force overwrite existing records:
pnpm import:all-agencies:overwrite
# Wipe WordPress first, then import fresh:
pnpm import:all-agencies:fresh
```

Script: `frontend/scripts/import-all-agencies.mjs`

Creates or updates Agency and OfficeAgent CPT posts in WordPress via the REST API. Sets all custom fields, uploads featured images, and links agents to their parent agency.

#### 6. Sync Gravity Form IDs

```bash
pnpm -C frontend run sync:agency-gf-ids
```

Script: `frontend/scripts/sync-agency-gravity-form-ids.mjs`

Cross-references the `gf-form-mapping.csv` in `docs/` to set `gravityFormId` on each Agency CPT post in WordPress.

#### 7. Export CSV (optional)

```bash
pnpm export:scraped-csv
```

Script: `frontend/scripts/export-scraped-agencies-csv.mjs`

Exports the enriched agency data to CSV for review (`docs/scraped-agencies-offices.csv`, `docs/scraped-agencies-agents.csv`).

---

## Adding a New Office or Agent

### Via WordPress (recommended)

1. In WP Admin, create a new **Agency** post. Set the slug, title, and all custom fields.
2. Create **OfficeAgent** posts linked to the agency post. Set slug, name, role, city, state, and other fields.
3. The new page is live on the next request — no rebuild required (`dynamicParams = true`).
4. Add the agency's Gravity Form ID to `gravityFormId` if it has a custom connect form; otherwise the default form (`31`) is used.

### Via `locations-data.ts` (legacy fallback only)

Only use this path if WordPress CPT is not an option. See the "Adding a new location or agent" section in [DEVELOPMENT.md](DEVELOPMENT.md).

---

## Image Handling

Agency hero images are resolved in order:
1. `agencyFields.heroImageUrl` — explicit URL stored in WordPress
2. `featuredImage.node.sourceUrl` — WordPress featured image
3. `DEFAULT_AGENCY_OFFICE_HERO_URL` — a generic AmeriLife office fallback image

Agent photos use `photoUrl` from the OfficeAgent CPT. If empty, no photo is shown.

Hero images must be uploaded to headless WordPress before the page is deployed. See [DEVELOPMENT.md](DEVELOPMENT.md#image-sync-workflow) for the sync process.
