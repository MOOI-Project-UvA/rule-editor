#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <env-file> [port]"
  exit 1
fi

ENV_FILE="$1"
PORT="${2:-8888}"
MAX_WAIT_SECONDS="45"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE"
  exit 1
fi

for cmd in node npm netlify curl; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd"
    exit 1
  fi
done

set -a
source "$ENV_FILE"
set +a

optional_vars=(
  X_API_KEY
  ALLOWED_DOMAINS
  FLINT_TRANSLATION_URL
  TRIPLY_KEY_R
  TRIPLY_KEY_W
  TRIPLY_ENDPOINT
  VITE_X_API_KEY
  VITE_AUTH_ENABLED
  VITE_AUTH_API_BASE_URL
  VITE_EFLINT_API_BASE_URL
  VITE_EFLINT_EXECUTE_URL
)

for var_name in "${optional_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    echo "Warning: optional env var is empty: $var_name"
  fi
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_FILE="$REPO_ROOT/.netlify-dev-verify.log"

pushd "$REPO_ROOT/gui" >/dev/null
npm ci
npm run build
popd >/dev/null

cd "$REPO_ROOT"
netlify dev --port "$PORT" >"$LOG_FILE" 2>&1 &
NETLIFY_PID=$!

cleanup() {
  if ps -p "$NETLIFY_PID" >/dev/null 2>&1; then
    kill "$NETLIFY_PID" >/dev/null 2>&1 || true
    wait "$NETLIFY_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

START_TIME="$(date +%s)"
until curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; do
  NOW="$(date +%s)"
  ELAPSED=$((NOW - START_TIME))
  if [[ "$ELAPSED" -ge "$MAX_WAIT_SECONDS" ]]; then
    echo "netlify dev did not become ready within ${MAX_WAIT_SECONDS}s"
    echo "---- netlify dev logs ----"
    tail -n 200 "$LOG_FILE" || true
    exit 1
  fi
  sleep 1
done

ROOT_STATUS="$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/")"
FUNC_STATUS="$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/api/serverless/getSources")"

if [[ "$ROOT_STATUS" != "200" ]]; then
  echo "Unexpected root status: $ROOT_STATUS"
  exit 1
fi

case "$FUNC_STATUS" in
  200|401|403|404|500)
    ;;
  *)
    echo "Unexpected function route status: $FUNC_STATUS"
    exit 1
    ;;
esac

echo "Verification passed."
echo "Root endpoint status: $ROOT_STATUS"
echo "Function route status: $FUNC_STATUS"
echo "netlify dev log: $LOG_FILE"