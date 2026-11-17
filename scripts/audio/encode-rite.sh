#!/bin/bash
# Encodes the kept music candidates of the smoke rite (notes/rito/musica.md) from $WORK/raw (fetch-rite.sh):
#  - public/rite/cand/<code>.mp3   20-second clips for the blind listening page (harness/ascolto.*): the first
#    20 s after the leading silence, -24 LUFS, 0.3 s in, 1.5 s out. The code names nothing (a1, b2...).
#  - public/rite/music/<air>.mp3   the provisional winner of each air for the game: the whole piece (at most
#    180 s) after the leading silence, so that entering "from the beginning" starts on sound; -24 LUFS like the
#    rest of the music (tracks.js MASTER), 1 s in, 3 s out, stereo 44.1 kHz 80 kbit/s like public/music/.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
WORK=${WORK:-/tmp/rite-dl}
enc() { # in out maxsecs fadein fadeout
  local in=$1 out=$2 T=$3 fi=$4 fo=$5 lead m
  lead=$(ffmpeg -nostdin -hide_banner -t 20 -i "$in" -af silencedetect=n=-45dB:d=0.3 -f null - 2>&1 | grep -o "silence_end: [0-9.]*" | head -1 | awk '{print $2}' || true)
  lead=${lead:-0}; python3 -I -c "import sys; sys.exit(0 if float('$lead') < 6 else 1)" || lead=0
  local dur; dur=$(ffmpeg -nostdin -hide_banner -ss "$lead" -t "$T" -i "$in" -f null - 2>&1 | grep -o "time=[0-9:.]*" | tail -1 | cut -d= -f2 | awk -F: '{print $1*3600+$2*60+$3}')
  m=$(ffmpeg -nostdin -hide_banner -ss "$lead" -t "$T" -i "$in" -af loudnorm=I=-24:TP=-2:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  g() { echo "$m" | python3 -I -c "import sys,json;print(json.load(sys.stdin)['$1'])"; }
  ffmpeg -nostdin -hide_banner -loglevel error -y -ss "$lead" -t "$T" -i "$in" -af "loudnorm=I=-24:TP=-2:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,afade=t=in:d=$fi,afade=t=out:st=$(python3 -I -c "print(max(0,$dur-$fo))"):d=$fo" \
    -ar 44100 -ac 2 -b:a 80k -map_metadata -1 -vn "$out"
  echo "$(basename "$out"): lead ${lead}s, $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out") s, $(stat -c%s "$out") bytes"
}
# code | air--title: the codes are random letters (the page shuffles them too), so a file name says nothing
CANDS="vfs|rosa--Reawakening gln|rosa--Simple Duet pbr|rosa--Water Lily
lbv|alloro--Errigal sgm|alloro--Somewhere Sunny (ver 2) tdd|alloro--Cello Suite #1 in G - Prelude
jpm|cipresso--Heart of Nowhere djr|cipresso--Night Vigil
ffj|salvia--Fairytale Waltz tdj|salvia--Wizardtorium
smr|mirra--Mourning Song jvs|mirra--Plaint pgb|mirra--Virtutes Instrumenti"
if [ "${1:-}" != music ]; then
  while IFS='|' read -r code name; do enc "$WORK/raw/$name.mp3" "$ROOT/public/rite/cand/$code.mp3" 20 0.3 1.5; done <<< "$(echo "$CANDS" | sed 's/ k/\nk/g')"
fi
if [ "${1:-}" != cand ]; then
  # the provisional winners (by measurement: notes/rito/musica.md)
  enc "$WORK/raw/rosa--Reawakening.mp3" "$ROOT/public/rite/music/rosa.mp3" 180 1 3
  enc "$WORK/raw/alloro--Errigal.mp3" "$ROOT/public/rite/music/alloro.mp3" 180 1 3
  enc "$WORK/raw/cipresso--Heart of Nowhere.mp3" "$ROOT/public/rite/music/cipresso.mp3" 180 1 3
  enc "$WORK/raw/salvia--Fairytale Waltz.mp3" "$ROOT/public/rite/music/salvia.mp3" 180 1 3
  enc "$WORK/raw/mirra--Mourning Song.mp3" "$ROOT/public/rite/music/mirra.mp3" 180 1 3
fi
