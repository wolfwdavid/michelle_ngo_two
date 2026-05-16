#!/usr/bin/env bash
# check-content-boundary.sh — CONT-04 / CONT-05 enforcement
# Fails (exit 1) if any route file globs src/content/ directly.
# Routes MUST import from $lib/content; only $lib/content.ts may glob src/content/.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

# Search routes for any import.meta.glob targeting src/content/
# -r recursive, -E extended regex, -n line numbers
if grep -rEn 'import\.meta\.glob.*src/content' src/routes/ 2>/dev/null; then
  echo ""
  echo "ERROR: CONT-04 / CONT-05 boundary violation."
  echo "Routes must import content from \$lib/content, not glob src/content/ directly."
  echo "See .planning/phases/02-content-model-schema/02-CONTEXT.md decision D-13."
  exit 1
fi

echo "OK: no content-boundary violations under src/routes/"
exit 0
