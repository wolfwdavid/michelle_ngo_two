#!/usr/bin/env bash
# repo/scripts/encode-preview.sh
#
# Phase 8 hover-preview-clip encoding harness.
# Reads <slug> + a {in,out} timestamp pair, downloads the source video from
# the slug's vimeoId/youtubeId frontmatter, encodes a muted 640x360 H.264
# preview to repo/static/previews/<slug>.mp4, asserts payload <= 250 KB.
#
# Usage:
#   ./scripts/encode-preview.sh <slug> <in_seconds> <out_seconds>
# Example:
#   ./scripts/encode-preview.sh pbs-american-portrait 42 47
#
# Local prerequisites (NOT npm deps):
#   - yt-dlp on PATH (https://github.com/yt-dlp/yt-dlp)
#   - ffmpeg on PATH (https://ffmpeg.org)
#   - node on PATH (already a project dep)
#
# Cross-platform: tested on git-bash (Windows), Linux, macOS.

set -euo pipefail

# Make Scoop-installed tools reachable on Windows + git-bash where Scoop's
# User-PATH update may not have propagated to the running shell. Defensive
# no-op on Linux/macOS where the shims dir does not exist.
if [ -d "$HOME/scoop/shims" ]; then
  export PATH="$HOME/scoop/shims:$PATH"
fi

# --- Arg parsing ---
if [ $# -ne 3 ]; then
  echo "Usage: $0 <slug> <in_seconds> <out_seconds>" >&2
  echo "Example: $0 pbs-american-portrait 42 47" >&2
  exit 2
fi

SLUG="$1"
IN="$2"
OUT="$3"

# --- Locate repo root (script lives at repo/scripts/, run from anywhere) ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PROJECT_MD="$REPO_ROOT/src/content/projects/$SLUG/index.md"
if [ ! -f "$PROJECT_MD" ]; then
  echo "ERROR: project file not found: $PROJECT_MD" >&2
  echo "Hint: <slug> must match a folder under repo/src/content/projects/" >&2
  exit 1
fi

# --- Frontmatter parsing (node one-liner; Phase 2 D-03 XOR) ---
PROVIDER_AND_ID="$(node -e '
const fs = require("fs");
const txt = fs.readFileSync(process.argv[1], "utf8");
const m = txt.match(/^---\n([\s\S]*?)\n---/);
if (!m) { process.stderr.write("no frontmatter\n"); process.exit(1); }
const fm = m[1];
const vimeo = fm.match(/^vimeoId:\s*["]?([^"\n]+)["]?\s*$/m);
const youtube = fm.match(/^youtubeId:\s*["]?([^"\n]+)["]?\s*$/m);
if (vimeo && youtube) { process.stderr.write("both vimeoId and youtubeId set (Phase 2 D-03 XOR violation)\n"); process.exit(1); }
if (!vimeo && !youtube) { process.stderr.write("neither vimeoId nor youtubeId set\n"); process.exit(1); }
if (vimeo) process.stdout.write("vimeo " + vimeo[1].trim());
else process.stdout.write("youtube " + youtube[1].trim());
' "$PROJECT_MD")"

PROVIDER="${PROVIDER_AND_ID%% *}"
VIDEO_ID="${PROVIDER_AND_ID#* }"

case "$PROVIDER" in
  vimeo)   SOURCE_URL="https://vimeo.com/$VIDEO_ID" ;;
  youtube) SOURCE_URL="https://youtube.com/watch?v=$VIDEO_ID" ;;
  *)       echo "ERROR: unknown provider '$PROVIDER'" >&2; exit 1 ;;
esac

# --- Temp file + cleanup trap (set BEFORE yt-dlp) ---
TMP_SOURCE="$(mktemp -t "${SLUG}-source.XXXXXX.mp4" 2>/dev/null || mktemp)"
trap 'rm -f "$TMP_SOURCE"' EXIT

# --- Output path ---
PREVIEWS_DIR="$REPO_ROOT/static/previews"
mkdir -p "$PREVIEWS_DIR"
OUTPUT="$PREVIEWS_DIR/$SLUG.mp4"

# --- yt-dlp download (D-07 literal) ---
echo "==> Downloading source: $SOURCE_URL"
yt-dlp -f "best[height<=720]" --no-playlist -o "$TMP_SOURCE" "$SOURCE_URL"

# --- ffmpeg encode (D-06 literal) ---
echo "==> Encoding: ${IN}s -> ${OUT}s, 640x360, CRF 26, muted, faststart"
ffmpeg -ss "$IN" -to "$OUT" -i "$TMP_SOURCE" \
  -c:v libx264 -crf 26 -vf scale=640:-2 -an \
  -movflags +faststart -y \
  "$OUTPUT"

# --- Payload assertion (CLIP-03: <= 250 KB = 256000 bytes) ---
if [ ! -f "$OUTPUT" ]; then
  echo "ERROR: ffmpeg did not produce $OUTPUT" >&2
  exit 1
fi

SIZE=$(stat -c%s "$OUTPUT" 2>/dev/null || stat -f%z "$OUTPUT")
echo "==> Output size: $SIZE bytes ($(awk "BEGIN{printf \"%.1f\", $SIZE/1024}") KB)"

if [ "$SIZE" -gt 256000 ]; then
  echo "FAIL: $SIZE bytes exceeds CLIP-03 ceiling of 256000 bytes (250 KB)." >&2
  echo "Hint: re-encode at CRF 28 or 30, or shorten the duration (D-06 fallback ladder)." >&2
  exit 1
fi

echo "==> OK: $OUTPUT ($SIZE bytes, $((OUT - IN))s)"
