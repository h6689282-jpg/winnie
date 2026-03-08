#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"

# Make script find npm (nvm/fnm usually doesn't load in non-interactive shells)
if command -v npm &>/dev/null; then
  : # npm is already in PATH
elif [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  # shellcheck source=/dev/null
  . "$HOME/.nvm/nvm.sh"
elif [ -s "$HOME/.fnm/fnm" ] || [ -x "$HOME/.local/share/fnm/fnm" ]; then
  eval "$(fnm env)" 2>/dev/null || true
fi
if ! command -v npm &>/dev/null; then
  echo "[frontend] ERROR: npm not found. Install Node.js (https://nodejs.org) or ensure nvm/fnm is set up." >&2
  exit 1
fi

echo "[frontend] Installing npm dependencies..."
npm install

echo "[frontend] Starting Vite dev server at http://localhost:5173 ..."
npm run dev

