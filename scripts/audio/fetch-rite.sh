#!/bin/bash
# Fetches the music candidates for the smoke rite (notes/rito/musica.md) from incompetech.com (Kevin MacLeod,
# CC BY 4.0), one at a time, a few seconds apart, polite User-Agent, the first 8 MB only (about 3.5 minutes at
# 320 kbit/s: the long ambient pieces are not needed whole). Raw files go to $WORK/raw, never to the repo.
#   scripts/audio/fetch-rite.sh [air]
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
WORK=${WORK:-/tmp/rite-dl}
UA="salem-tarocchi/1.0 (private hobby project)"
BASE=https://incompetech.com/music/royalty-free/mp3-royaltyfree
mkdir -p "$WORK/raw"
grep -v '^#' "$ROOT/scripts/audio/candidates.tsv" | while IFS=$'\t' read -r air title file why; do
  [ -n "${1:-}" ] && [ "$air" != "$1" ] && continue
  out="$WORK/raw/$air--$title.mp3"
  [ -s "$out" ] && continue
  url="$BASE/$(python3 -I -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$file")"
  code=$(curl -sSL -m 240 -A "$UA" -r 0-8000000 -o "$out" -w "%{http_code}" "$url" || true)
  if [ "$code" != 200 ] && [ "$code" != 206 ]; then echo "  $title -> HTTP $code: stopping (no retries against a refusal)" >&2; rm -f "$out"; exit 1; fi
  echo "$air  $title  $(stat -c%s "$out") bytes"
  sleep 5
done
