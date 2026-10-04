#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
node=""
for candidate in node nodejs node.exe; do
  if node_path="$(command -v "$candidate" 2>/dev/null)"; then
    node="$node_path"
    break
  fi
done
if [ -z "$node" ]; then
  echo "autoresearch.sh: node executable not found on PATH" >&2
  exit 1
fi

"$node" bench/site-quality.mjs