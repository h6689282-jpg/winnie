#!/usr/bin/env bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "[all] Starting backend and frontend..."

./backend/start_backend.sh &
BACKEND_PID=$!

./frontend/start_frontend.sh &
FRONTEND_PID=$!

trap 'echo; echo "[all] Stopping backend and frontend..."; kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true; exit 0' INT TERM

wait

