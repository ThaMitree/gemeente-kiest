#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  echo "Missing .env file. Copy .env.example to .env and set CF_TUNNEL_TOKEN."
  exit 1
fi

echo "[deploy] pulling latest changes"
git pull --ff-only

echo "[deploy] building and starting containers"
docker compose --env-file .env up -d --build

echo "[deploy] done"
docker compose ps
