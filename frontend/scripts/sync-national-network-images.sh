#!/usr/bin/env bash
# Sync national-network page images (National_Network_1420x1144.png) to headless WP.
#
# Usage:
#   export HEADLESS_SFTP_USER="..." HEADLESS_SFTP_PASSWORD="..." HEADLESS_WP_APP_PASSWORD="..."
#   ./frontend/scripts/sync-national-network-images.sh

set -e

export SYNC_WP_IMAGES=1
export SYNC_WP_IMPORT_MEDIA_LIBRARY=1
export SYNC_WP_PAGE_URL="https://amerilife.com/national-network/"
export HEADLESS_SFTP_HOST="${HEADLESS_SFTP_HOST:-headlessameril.sftp.wpengine.com}"
export HEADLESS_SFTP_PORT="${HEADLESS_SFTP_PORT:-2222}"
export HEADLESS_SFTP_USER="${HEADLESS_SFTP_USER:?Set HEADLESS_SFTP_USER}"
export HEADLESS_SFTP_PASSWORD="${HEADLESS_SFTP_PASSWORD:?Set HEADLESS_SFTP_PASSWORD}"
export HEADLESS_WP_APP_USER="${HEADLESS_WP_APP_USER:-mediauploader}"
export HEADLESS_WP_APP_PASSWORD="${HEADLESS_WP_APP_PASSWORD:?Set HEADLESS_WP_APP_PASSWORD}"
unset HEADLESS_SFTP_WP_ROOT

cd "$(dirname "$0")/.."
pnpm sync:wp-images
