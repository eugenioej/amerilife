# Deployment Guide – WP Engine Atlas

## Atlas environment variables (required for production)

The **build does not upload images**. You upload images to headless WordPress yourself (e.g. via wp-admin Media Library or SFTP). Configure these in **WP Engine Atlas** → **Settings** → **Environment Variables** (use **Secrets** for credentials).

| Variable | Value | Notes |
|---------|-------|-------|
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://headlessameril.wpenginepowered.com/graphql` | Headless WordPress GraphQL |
| `NEXT_PUBLIC_USE_LIVE_IMAGES` | `0` | Use headless images (not live amerilife.com) |

Optional (only if you use the sync script manually):

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
