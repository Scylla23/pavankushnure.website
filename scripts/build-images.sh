#!/usr/bin/env bash
# Regenerate the avatars and the header banner slides.
#
# Run by hand, not in CI: the output is committed, photos/ is gitignored, and
# CI has no ImageMagick. Re-run only when a source photo or slide changes.
#
#   ./scripts/build-images.sh
#
# ponytail: project thumbnails are Playwright screenshots of the live sites, not
# photo derivatives, so they are not built here — see README.

set -euo pipefail
cd "$(dirname "$0")/.."

# Two avatars, one per theme — see Header.tsx. The studio portrait carries the
# dark background, the outdoor one the light. Both are square; the header masks
# them to a circle, so keep the head clear of the edges.
#
# Source is 3840x2160 with the subject right of centre; this crop is 1:1 on the face.
magick "photos/profile pic.jpeg" -crop 1700x1700+1243+0 +repage \
  -resize 512x512 -quality 85 public/avatar.jpg
echo "wrote: public/avatar.jpg"

magick "photos/IMG_3223 2.jpg" -auto-orient -crop 1800x1800+150+750 +repage \
  -resize 512x512 -quality 85 public/avatar-light.jpg
echo "wrote: public/avatar-light.jpg"

# Banner slides, in the order src/data/banner.ts rotates them. Slide 1 is his own
# peacock photo (public/banner.jpg, also the OG image) and is left alone. The
# rest are Unsplash, free to use without permission or attribution — fetched
# here rather than dropped in by hand so the crop is reproducible.
mkdir -p public/img
slides=(
  "banner-ridge:photo-1470071459604-3b5ec3a7fe05"
  "banner-stars:photo-1419242902214-272b3f66ee7a"
  "banner-orbit:photo-1451187580459-43490279c0fa"
)
for spec in "${slides[@]}"; do
  name="${spec%%:*}"; id="${spec#*:}"
  curl -fsS -o "public/img/$name.jpg" \
    "https://images.unsplash.com/$id?w=1600&h=600&fit=crop&crop=entropy&q=82&fm=jpg"
  echo "wrote: public/img/$name.jpg"
done
