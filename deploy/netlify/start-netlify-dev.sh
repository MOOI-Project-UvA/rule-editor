#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <env-file> [port]"
  exit 1
fi

ENV_FILE="$1"
PORT="${2:-8888}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but not found. Install Node.js 20+ first."
  exit 1
fi

if ! command -v netlify >/dev/null 2>&1; then
  echo "netlify CLI is not installed. Install with: npm i -g netlify-cli"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

set -a
source "$ENV_FILE"
set +a

pushd "$REPO_ROOT/gui" >/dev/null
npm ci
popd >/dev/null

cd "$REPO_ROOT"
exec netlify dev --port "$PORT"