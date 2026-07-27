#!/usr/bin/env bash
# Regenerate public/avatar.jpg from the original in photos/.
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
