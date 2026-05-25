#!/usr/bin/env bash
#
# Deploy script for the 75hard app on EC2.
# Stops the running process before building so requests during the build
# window don't get ENOENT errors for chunks being replaced. Brief downtime
# (~30-45s) is acceptable for this app's scale.
#
# Usage (from the project root on EC2):
#   bash scripts/deploy.sh
#
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/home/ec2-user/75hard}"
APP_NAME="${APP_NAME:-75hard}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://localhost:3000}"

log() {
  printf "[deploy] %s\n" "$*"
}

cd "$PROJECT_DIR"

log "pulling latest from origin..."
git pull --ff-only

log "installing dependencies..."
npm ci --no-audit --no-fund

log "stopping app (closes the chunk-rename race window)..."
pm2 delete "$APP_NAME" 2>/dev/null || true

log "building production bundle..."
npm run build

log "starting app from ecosystem config..."
pm2 start ecosystem.config.cjs
pm2 save

log "waiting for app to accept traffic..."
attempts=0
max_attempts=15
until status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "$HEALTHCHECK_URL" 2>/dev/null) \
  && [[ "$status" =~ ^(200|301|302|307|308)$ ]]; do
  attempts=$((attempts + 1))
  if [ $attempts -ge $max_attempts ]; then
    log "✗ app failed to respond after ${max_attempts} attempts (last status: ${status:-none})"
    log "  check: pm2 logs $APP_NAME --lines 50"
    exit 1
  fi
  sleep 2
done

log "✓ app responding (HTTP $status)"
log "done"
