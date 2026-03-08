#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"

echo "[backend] Creating virtualenv (.venv) if not exists..."
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

echo "[backend] Activating virtualenv..."
 # shellcheck disable=SC1091
source .venv/bin/activate

echo "[backend] Installing dependencies..."
pip install -r requirements.txt

echo "[backend] Running migrations..."
python manage.py migrate

# Only treat port as in use if something is actually LISTENing (ignore client connections like Chrome)
if LISTEN_PID=$(lsof -i :8000 -P -n 2>/dev/null | grep LISTEN | awk '{print $2}' | head -1) && [ -n "$LISTEN_PID" ]; then
  echo "[backend] ERROR: Port 8000 is already in use (PID $LISTEN_PID). Stop it first: kill $LISTEN_PID" >&2
  exit 1
fi

echo "[backend] Starting Django development server at http://localhost:8000 ..."
python manage.py runserver 0.0.0.0:8000

