#!/usr/bin/env bash
# Regenerate public/img/ from the originals in photos/.
#
# Run by hand, not in CI: the output is committed, photos/ is gitignored, and
# CI has no ImageMagick. Re-run only when a source photo changes.
#
#   ./scripts/build-images.sh
#
# ponytail: `output: 'export'` forces images.unoptimized, so next/image cannot
# resize anything. Pre-generating the handful of sizes we actually use is less
# machinery than adding a loader.

set -euo pipefail
cd "$(dirname "$0")/.."

SRC=photos
OUT=public/img
mkdir -p "$OUT"

# Emit AVIF + WebP + a JPEG fallback at each width.
emit() {
  local input=$1 name=$2 shift_args=$3
  shift 3
  for w in "$@"; do
    magick "$input" $shift_args -resize "${w}x" -quality 62 "$OUT/${name}-${w}.avif"
    magick "$input" $shift_args -resize "${w}x" -quality 80 "$OUT/${name}-${w}.webp"
  done
}

# --- Hero: 4:5 portrait crop centred on the subject -------------------------
# Source is 3840x2160 with the subject right of centre; 1728x2160 is 4:5 at
# full height, offset so his face lands on the optical centre.
HERO_SRC="$SRC/profile pic.jpeg"
emit "$HERO_SRC" hero "-crop 1728x2160+1229+0 +repage -modulate 100,100,101" 1200 900 600

# --- Avatar: 1:1 on the face ------------------------------------------------
emit "$HERO_SRC" avatar "-crop 1700x1700+1243+0 +repage" 512 256

# --- About strip: desaturated + warmed so they sit on the dark canvas -------
# Grayscale, then tinted toward the bark surface colour so the photos read as
# part of the canvas rather than pasted onto it (DESIGN.md §5).
# Resize must fill the *target* 4:5 box, not a square — otherwise extent crops
# off an arbitrary band of a portrait source.
strip() {
  local input=$1 name=$2 gravity=$3
  for w in 800 480; do
    local h=$((w * 5 / 4))
    for fmt in avif webp; do
      local q=62
      [ "$fmt" = webp ] && q=80
      magick "$input" -auto-orient \
        -resize "${w}x${h}^" -gravity "$gravity" -extent "${w}x${h}" \
        -colorspace Gray -colorspace sRGB \
        -fill '#3a2418' -tint 30 -modulate 106,100,100 \
        -quality $q "$OUT/${name}-${w}.${fmt}"
    done
  done
}

strip "$SRC/IMG_0404 3.JPG" life-surf center
strip "$SRC/IMG_4094 2.jpg" life-trek north
strip "$SRC/IMG_1523 3.jpg" life-rest center

echo "wrote:"
ls -la "$OUT"
