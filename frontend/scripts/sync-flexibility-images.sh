#!/usr/bin/env bash
# Sync flexibility-and-optionality page images (Flex_Option_HeroA_1420x1144.png, banner-3.png) to headless WP.
#
# Prereqs:
#   - .env.local has NEXT_PUBLIC_GRAPHQL_ENDPOINT (or NEXT_PUBLIC_WORDPRESS_URL)
#   - lftp NOT required; script uses Node SFTP when password is set
#
# Usage:
#   export HEADLESS_SFTP_USER="headlessameril-eugenio"
#   export HEADLESS_SFTP_PASSWORD='your-password'
#   export HEADLESS_WP_APP_PASSWORD="your-app-password"
#   ./frontend/scripts/sync-flexibility-images.sh

set -e

export SYNC_WP_IMAGES=1
export SYNC_WP_IMPORT_MEDIA_LIBRARY=1
export SYNC_WP_PAGE_URL="https://amerilife.com/flexibility-and-optionality/"

export HEADLESS_SFTP_HOST="${HEADLESS_SFTP_HOST:-headlessameril.sftp.wpengine.com}"
export HEADLESS_SFTP_PORT="${HEADLESS_SFTP_PORT:-2222}"
export HEADLESS_SFTP_USER="${HEADLESS_SFTP_USER:?Set HEADLESS_SFTP_USER}"
export HEADLESS_SFTP_PASSWORD="${HEADLESS_SFTP_PASSWORD:?Set HEADLESS_SFTP_PASSWORD}"
export HEADLESS_WP_APP_USER="${HEADLESS_WP_APP_USER:-mediauploader}"
export HEADLESS_WP_APP_PASSWORD="${HEADLESS_WP_APP_PASSWORD:?Set HEADLESS_WP_APP_PASSWORD}"

unset HEADLESS_SFTP_WP_ROOT

cd "$(dirname "$0")/.."
pnpm sync:wp-images
