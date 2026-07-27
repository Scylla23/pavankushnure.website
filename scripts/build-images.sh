#!/usr/bin/env bash
# Regenerate public/avatar.jpg and the ambience banners from the originals in photos/.
#
# Run by hand, not in CI: the output is committed, photos/ is gitignored, and
# CI has no ImageMagick. Re-run only when the source photo changes.
#
#   ./scripts/build-images.sh
#
# ponytail: project thumbnails are Playwright screenshots of the live sites, not
# photo derivatives, so they are not built here — see README.

set -euo pipefail
cd "$(dirname "$0")/.."

# Source is 3840x2160 with the subject right of centre; this crop is 1:1 on the face.
magick "photos/profile pic.jpeg" -crop 1700x1700+1243+0 +repage \
  -resize 512x512 -quality 85 public/avatar.jpg

echo "wrote: public/avatar.jpg"

# Ambience banners: one per soundscape in src/data/ambience.ts. All four sources
# are portrait, so each is a horizontal 8:3 band — the percentage is where that
# band sits vertically, picked by eye so nobody is cropped at the neck.
mkdir -p public/img
scenes=(
  "IMG_3223 2.jpg:forest:20"
  "IMG_1841 3.JPG:ocean:50"
  "IMG_3927 2.jpg:mountains:35"
  "IMG_4094 2.jpg:rain:20"
)
for spec in "${scenes[@]}"; do
  src="${spec%%:*}"; rest="${spec#*:}"; name="${rest%%:*}"; pct="${rest##*:}"
  read -r w h < <(magick identify -format '%w %h\n' -auto-orient "photos/$src")
  magick "photos/$src" -auto-orient \
    -crop "${w}x$((w * 3 / 8))+0+$((h * pct / 100))" +repage \
    -resize 1600x600 -quality 82 "public/img/scene-$name.jpg"
  echo "wrote: public/img/scene-$name.jpg"
done
