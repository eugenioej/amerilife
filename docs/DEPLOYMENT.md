# Deployment Guide – WP Engine Atlas

## Atlas environment variables (required for images)

Configure these in **WP Engine Atlas** → **Settings** → **Environment Variables** (use **Secrets** for credentials).

| Variable | Value | Notes |
|---------|-------|-------|
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | `https://headlessameril.wpenginepowered.com/graphql` | Headless WordPress GraphQL |
| `NEXT_PUBLIC_USE_LIVE_IMAGES` | `0` | Use headless images (not live amerilife.com) |
| `SYNC_WP_IMAGES` | `1` | Enable image sync during build |
| `HEADLESS_SFTP_HOST` | `headlessameril.sftp.wpengine.com` | SFTP host for uploads |
| `HEADLESS_SFTP_PORT` | `2222` | SFTP port |
| `HEADLESS_SFTP_USER` | *(your SFTP user)* | Set as secret |
| `HEADLESS_SFTP_PASSWORD` | *(your SFTP password)* | Set as secret |
| `SYNC_WP_IMPORT_MEDIA_LIBRARY` | `1` | Register files in wp-admin Media Library |
| `HEADLESS_WP_APP_USER` | `mediauploader` | WP user with upload_files capability |
| `HEADLESS_WP_APP_PASSWORD` | *(WordPress Application Password)* | Generate at Users → Profile → Application Passwords |

### Steps

1. In Atlas, add each variable above. Mark sensitive ones as **Secret**.
2. Generate a WordPress Application Password: headless WP admin → Users → Your user → Application Passwords → Add new.
3. Trigger a new deploy: push to `main` (if Atlas is wired to your repo) or use Atlas dashboard **Redeploy**.
4. After deploy, verify images at `https://ha5z0...js.wpenginepowered.com/about-us/who-we-are`.
5. Check Media Library at `https://headlessameril.wpenginepowered.com/wp-admin/upload.php`.

### Verify headless images (local)

```bash
pnpm -C frontend run verify:headless-images
```

Expected: `4 ok, 0 failed` (or similar) for sample paths.
