#!/usr/bin/env bash
set -euo pipefail

NETLIFY_CLI_VERSION="23.10"

if ! command -v apt-get >/dev/null 2>&1; then
  echo "This script currently supports Debian/Ubuntu systems (apt-get required)."
  exit 1
fi

sudo apt-get update
sudo apt-get install -y curl git ca-certificates

install_node_20() {
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
}

if ! command -v node >/dev/null 2>&1; then
  install_node_20
else
  NODE_MAJOR="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
  if [[ "$NODE_MAJOR" -lt 20 ]]; then
    install_node_20
  fi
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found after Node.js installation"
  exit 1
fi

if ! command -v netlify >/dev/null 2>&1; then
  sudo npm i -g "netlify-cli@${NETLIFY_CLI_VERSION}"
else
  INSTALLED_VERSION="$(netlify --version | tr -d '[:space:]')"
  if [[ "$INSTALLED_VERSION" != "$NETLIFY_CLI_VERSION" ]]; then
    sudo npm i -g "netlify-cli@${NETLIFY_CLI_VERSION}"
  fi
fi

echo "Bootstrap complete."
echo "node: $(node -v)"
echo "npm: $(npm -v)"
echo "netlify: $(netlify --version)"