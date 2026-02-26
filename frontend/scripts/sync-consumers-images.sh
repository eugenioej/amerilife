#!/usr/bin/env bash
# Sync consumers page images (Consumers_Hero_1420x1144.png, banner-10.png) to headless WP.
#
# Prereqs:
#   - .env.local has NEXT_PUBLIC_GRAPHQL_ENDPOINT (or NEXT_PUBLIC_WORDPRESS_URL)
#   - lftp NOT required; script uses Node SFTP when password is set
#
# Usage:
#   export HEADLESS_SFTP_USER="headlessameril-eugenio"
#   export HEADLESS_SFTP_PASSWORD='your-password'
#   export HEADLESS_WP_APP_PASSWORD="your-app-password"
#   ./frontend/scripts/sync-consumers-images.sh
#
# Or inline (from project root):
#   HEADLESS_SFTP_USER=... HEADLESS_SFTP_PASSWORD=... HEADLESS_WP_APP_PASSWORD=... ./frontend/scripts/sync-consumers-images.sh

set -e

# Required for sync
export SYNC_WP_IMAGES=1
export SYNC_WP_IMPORT_MEDIA_LIBRARY=1
export SYNC_WP_PAGE_URL="https://amerilife.com/our-solutions/consumers/"

# SFTP (WP Engine)
export HEADLESS_SFTP_HOST="${HEADLESS_SFTP_HOST:-headlessameril.sftp.wpengine.com}"
export HEADLESS_SFTP_PORT="${HEADLESS_SFTP_PORT:-2222}"
export HEADLESS_SFTP_USER="${HEADLESS_SFTP_USER:?Set HEADLESS_SFTP_USER}"
export HEADLESS_SFTP_PASSWORD="${HEADLESS_SFTP_PASSWORD:?Set HEADLESS_SFTP_PASSWORD}"

# Media Library registration (optional but recommended)
export HEADLESS_WP_APP_USER="${HEADLESS_WP_APP_USER:-mediauploader}"
export HEADLESS_WP_APP_PASSWORD="${HEADLESS_WP_APP_PASSWORD:?Set HEADLESS_WP_APP_PASSWORD}"

# Unset if set - WP Engine SFTP is usually chrooted
unset HEADLESS_SFTP_WP_ROOT

# Headless base (from .env.local or NEXT_PUBLIC_GRAPHQL_ENDPOINT)
# Script loads .env.local automatically
cd "$(dirname "$0")/.."
pnpm sync:wp-images
