#!/bin/bash
# Fetches and converts the sound files: the darker pieces (public/music/) and the ambience loops
# (public/ambience/). Repeatable; needs curl, ffmpeg, ffprobe, python3 with numpy.
#   scripts/fetch-sound.sh            everything
#   scripts/fetch-sound.sh music      only the music     (also: ambience)
# (A night-wood loop from "Nature sounds ambience in a Dordogne pond", CC BY 3.0, was tried: the server answered 429 every time.)
# Sources and licences are in docs/CREDITS.md. Downloads are one at a time, a few seconds apart, with a
# polite User-Agent; on HTTP 429 it waits and tries again. Raw downloads go to $WORK, never to the repo.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
WORK=${WORK:-/tmp/salem-sound}
UA="salem-tarocchi/1.0 (private hobby project)"
mkdir -p "$WORK/raw" "$ROOT/public/music" "$ROOT/public/ambience"

fetch() { # url out
  [ -s "$2" ] && [ "$(stat -c%s "$2")" -gt 10000 ] && return 0
  for i in 1 2 3 4 5; do
    code=$(curl -sSL -m 240 -A "$UA" -o "$2" -w "%{http_code}" "$1" || true)
    [ "$code" = 200 ] && { sleep 6; return 0; }
    echo "  $1 -> HTTP $code, waiting" >&2; sleep $((i * 40))
  done
  rm -f "$2"; echo "  GIVING UP on $1" >&2; return 1
}
loud() { ffmpeg -nostdin -hide_banner -i "$1" -af loudnorm=print_format=json -f null - 2>&1 | python3 -I -c "import sys,json;t=sys.stdin.read();print(json.loads(t[t.index('{'):t.rindex('}')+1])['$2'])"; }

# ---- music: Kevin MacLeod, incompetech.com, CC BY 4.0 ------------------------------------------
# piece: out-name | incompetech file | cut at second (a quiet point, found with astats; the 3 s fade ends there)
MUSIC_BASE=https://incompetech.com/music/royalty-free/mp3-royaltyfree
music() { # out file end
  local out=$1 file=$2 end=$3 raw="$WORK/raw/$1.mp3"
  fetch "$MUSIC_BASE/$(python3 -I -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$file")" "$raw"
  # two-pass loudnorm to -24 LUFS (the piano pieces measure -24.2), 1.5 s fade in, 3 s fade out, stereo 44.1 kHz 80 kbit/s
  local m; m=$(ffmpeg -nostdin -hide_banner -t "$end" -i "$raw" -af loudnorm=I=-24:TP=-2:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  g() { echo "$m" | python3 -I -c "import sys,json;print(json.load(sys.stdin)['$1'])"; }
  ffmpeg -nostdin -hide_banner -loglevel error -y -t "$end" -i "$raw" -af "loudnorm=I=-24:TP=-2:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,afade=t=in:d=1.5,afade=t=out:st=$(python3 -I -c "print($end-3)"):d=3" \
    -ar 44100 -ac 2 -b:a 80k -map_metadata -1 -vn "$ROOT/public/music/$out.mp3"
  echo "music $out: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ROOT/public/music/$out.mp3") s"
}
do_music() {
  music hopes     "SCP-x6x.mp3"                         177.5   # Hopes (SCP-x6x): piano and cello, 66 bpm
  music wounded   "Wounded.mp3"                         170.0   # piano and strings, 50 bpm
  music darktimes "Dark Times.mp3"                      182.0   # strings, 48 bpm
  music funeral   "Music for Funeral Home - Part 11.mp3" 162.2  # pipe organ, 48 bpm
  music colorless "Colorless Aura.mp3"                  158.0   # solo piano, 50 bpm (whole piece)
}

# ---- ambience: Wikimedia Commons, public domain / CC BY ---------------------------------------
# loop IN OUT MAXSECONDS CROSSFADE FILTER: mono, seamless (the last X seconds fade out while the first X fade in
# on top of them, the loop is everything else, so its end runs straight into its start), -34 LUFS (the music is
# -24), 64 kbit/s, peaks limited at -9 dBFS.
loop() {
  local in=$1 out=$2 maxd=$3 X=$4 flt=${5:-anull} tmp; tmp=$(mktemp -d)
  ffmpeg -nostdin -hide_banner -loglevel error -y -t "$maxd" -i "$in" -ac 1 -ar 44100 -af "$flt" -f f32le "$tmp/src.raw"
  python3 -I - "$tmp/src.raw" "$tmp/loop.raw" "$X" <<'PY'
import sys, numpy as np
a = np.fromfile(sys.argv[1], dtype='<f4'); X = int(float(sys.argv[3]) * 44100)
t = np.linspace(0, np.pi / 2, X, endpoint=False)
head = a[:X] * np.sin(t) + a[-X:] * np.cos(t)
np.concatenate([head, a[X:-X]]).astype('<f4').tofile(sys.argv[2])
PY
  meas() { ffmpeg -nostdin -hide_banner -f f32le -ar 44100 -ac 1 -i "$1" -af loudnorm=print_format=json -f null - 2>&1 | python3 -I -c "import sys,json;t=sys.stdin.read();print(json.loads(t[t.index('{'):t.rindex('}')+1])['input_i'])"; }
  enc() { ffmpeg -nostdin -hide_banner -loglevel error -y -f f32le -ar 44100 -ac 1 -i "$tmp/loop.raw" -af "volume=${1}dB,alimiter=limit=0.35:level=disabled:attack=2:release=40" -b:a 64k -map_metadata -1 "$out"; }
  local G D; G=$(python3 -I -c "print(-34-($(meas "$tmp/loop.raw")))")
  enc "$G"
  D=$(python3 -I -c "print(-34-($(loud "$out" input_i)))") # the limiter and the encoder move the level a little: once more
  enc "$(python3 -I -c "print($G+$D)")"
  rm -rf "$tmp"; echo "ambience $(basename "$out"): $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out") s"
}
CM=https://commons.wikimedia.org/wiki/Special:FilePath
do_ambience() {
  fetch "$CM/Dry_grass_burning_in_open_fireplace.ogg" "$WORK/raw/fire.ogg"          # public domain (ezwa)
  fetch "$CM/Rain_(1).ogg" "$WORK/raw/rain.ogg"                                       # public domain (ezwa)
  fetch "$CM/Flowing-water-100019.ogg" "$WORK/raw/stream.ogg"                         # public domain
  fetch "$CM/Gentle_breeze_and_birds_singing.ogg" "$WORK/raw/breeze.ogg"              # public domain (ezwa)
  loop "$WORK/raw/fire.ogg"   "$ROOT/public/ambience/fire.mp3"   60 1.0 "highpass=f=60"
  loop "$WORK/raw/rain.ogg"   "$ROOT/public/ambience/rain.mp3"   60 1.5 "highpass=f=60"
  loop "$WORK/raw/stream.ogg" "$ROOT/public/ambience/stream.mp3" 60 1.0 "highpass=f=80"
  # the breeze recording has birds in it: a low-pass leaves the wind in the trees and drops them
  loop "$WORK/raw/breeze.ogg" "$ROOT/public/ambience/wind.mp3"   60 2.0 "highpass=f=50,lowpass=f=1100"
}

case "${1:-all}" in
  music) do_music ;;
  ambience) do_ambience ;;
  all) do_music; do_ambience ;;
  *) echo "usage: $0 [music|ambience|all]"; exit 2 ;;
esac
