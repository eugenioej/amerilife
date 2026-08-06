# Deployment Guide – WP Engine Atlas

## Atlas environment variables (required for production)

The **build does not upload images**. You upload images to headless WordPress yourself (e.g. via wp-admin Media Library or SFTP). Configure these in **WP Engine Atlas** → **Settings** → **Environment Variables** (use **Secrets** for credentials).

| Variable | Value | Notes |
|---------|-------|-------|
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://headlessameril.wpenginepowered.com/graphql` | Headless WordPress GraphQL |
| `NEXT_PUBLIC_USE_LIVE_IMAGES` | `0` | Use headless images (not live amerilife.com) |
| `PIPER_API_BASE_URL` | `https://api-incentives-prod.piper.tools` | Career Leaderboard (server-only) |
| `PIPER_API_KEY` | *(secret from AmeriLife IT)* | Required for live Career standings |

### Sales Leaderboard SFTP pull (brokerage outbound files)

Full administration guide (Sales SFTP vs Career Piper API, WP uploads, CI, ownership): [ideaxchange-leaderboard-administration.md](./ideaxchange-leaderboard-administration.md).

Brokerage product CSVs are dropped on `sftp.amerilife.com:/outbound` (usually weekly). Run the pull daily so new drops are picked up automatically:

```bash
# Local (credentials in frontend/.env.local)
pnpm -C frontend sync:leaderboard-sftp:list   # inventory remote files
pnpm -C frontend sync:leaderboard-sftp        # download new/changed CSVs
pnpm -C frontend import:leaderboard           # push latest/tables.json → WP CPT
```

Artifacts land in `frontend/.cache/leaderboard-sftp/` (gitignored): `archive/YYYY-MM-DD/`, `latest/tables.json`, `manifest.json`, `sync-log.jsonl`.

| Variable | Value | Notes |
|---------|-------|-------|
| `LEADERBOARD_SFTP_HOST` | `sftp.amerilife.com` | Outbound SFTP |
| `LEADERBOARD_SFTP_PORT` | `22` | |
| `LEADERBOARD_SFTP_USER` / `LEADERBOARD_SFTP_PASSWORD` | *(from AmeriLife TAB / Marketing)* | Repo secrets for GitHub Action |
| `LEADERBOARD_SFTP_REMOTE_DIR` | `/outbound` | |
| `WORDPRESS_URL` | `https://headlessameril.wpenginepowered.com` | Headless WP origin |
| `WORDPRESS_USER` / `WORDPRESS_APP_PASSWORD` | *(Editor/Admin Application Password)* | Import needs `edit_posts` — not `mediauploader` |

Scheduled job: `.github/workflows/sync-leaderboard-sftp.yml` (daily 15:30 UTC + manual `workflow_dispatch`). Pulls CSVs → writes `latest/tables.json` → `POST /wp-json/amerilife/v1/import-ideaxchange-leaderboard` (updates rows + `report_date` on each `ideaxchange_lb_table` post). Deploy the leaderboard MU plugin first (`node scripts/deploy-mu-plugins.mjs`) so the import route exists.

Optional (only if you use the image sync script manually):

| Variable | Value | Notes |
|---------|-------|-------|
| `SYNC_WP_IMAGES` | `1` | Only for `pnpm sync:wp-images`; not used during build |
| `HEADLESS_SFTP_*` / `HEADLESS_WP_APP_*` | *(see .env.example)* | For script `pnpm sync:wp-images` |

### Steps

1. In Atlas, set `NEXT_PUBLIC_GRAPHQL_ENDPOINT` and `NEXT_PUBLIC_USE_LIVE_IMAGES=0`.
2. Ensure images are present on headless WP (you upload them manually or run `pnpm -C frontend sync:wp-images` locally when needed).
3. Trigger a deploy: push to `main` or use Atlas **Redeploy**.
4. After deploy, verify images at your frontend URL (e.g. `https://ha5z0...js.wpenginepowered.com/about-us/who-we-are`).
5. Media Library: `https://headlessameril.wpenginepowered.com/wp-admin/upload.php`.

### Verify import endpoint and auth (local, optional)

```bash
pnpm -C frontend run verify:media-import
```

Only needed if you use `pnpm sync:wp-images` and Media Library registration. Requires `HEADLESS_WP_APP_USER` and `HEADLESS_WP_APP_PASSWORD` in `frontend/.env.local`.

### Verify headless images (local)

```bash
pnpm -C frontend run verify:headless-images
```

Expected: `4 ok, 0 failed` (or similar) for sample paths.
