#!/usr/bin/env bash
# Regenerate the ambience loops in public/music/ from noise sources.
#
# Run by hand, not in CI: the output is committed and CI has no ffmpeg. Same
# deal as build-images.sh.
#
#   ./scripts/build-audio.sh
#
# These are synthesised, not field recordings — no licence, no attribution, no
# takedown risk on a public repo. To use real recordings instead, just drop them
# over public/music/<scene>.mp3; nothing else refers to this script.
#
# Every LFO runs at 0.1Hz so it completes exactly 3 cycles in 30s and the loop
# point lands mid-cycle without a jump. MP3 still adds a few ms of encoder
# padding on repeat, which is inaudible under broadband noise.

set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/music

DUR=30
RATE=44100
BITRATE=96k

# --- ocean: brown swell under pink foam hiss -------------------------------
ffmpeg -y -loglevel error \
  -f lavfi -i "anoisesrc=d=$DUR:c=brown:a=0.9:r=$RATE" \
  -f lavfi -i "anoisesrc=d=$DUR:c=pink:a=0.9:r=$RATE" \
  -filter_complex "[0]lowpass=f=500,tremolo=f=0.1:d=0.8[a];\
[1]highpass=f=1800,lowpass=f=7000,tremolo=f=0.1:d=0.9,volume=0.5[b];\
[a][b]amix=inputs=2:weights=1 0.6,loudnorm=I=-20:TP=-2,aformat=channel_layouts=stereo" \
  -b:a $BITRATE public/music/ocean.mp3

# --- rain: band-limited white noise, lightly varying ------------------------
ffmpeg -y -loglevel error \
  -f lavfi -i "anoisesrc=d=$DUR:c=white:a=0.9:r=$RATE" \
  -af "highpass=f=600,lowpass=f=9000,tremolo=f=0.2:d=0.25,\
loudnorm=I=-20:TP=-2,aformat=channel_layouts=stereo" \
  -b:a $BITRATE public/music/rain.mp3

# --- mountains: wind. The bandpassed pink layer is what keeps it from
# --- collapsing into featureless low rumble.
ffmpeg -y -loglevel error \
  -f lavfi -i "anoisesrc=d=$DUR:c=brown:a=0.9:r=$RATE" \
  -f lavfi -i "anoisesrc=d=$DUR:c=pink:a=0.9:r=$RATE" \
  -filter_complex "[0]lowpass=f=900,tremolo=f=0.1:d=0.7[a];\
[1]bandpass=f=1200:width_type=o:w=2,tremolo=f=0.1:d=0.85,volume=0.35[b];\
[a][b]amix=inputs=2:normalize=0,highpass=f=45,\
loudnorm=I=-21:TP=-2,aformat=channel_layouts=stereo" \
  -b:a $BITRATE public/music/mountains.mp3

# --- forest: leaf bed plus birdsong ----------------------------------------
# A chirp is a sine with quadratic phase (so the pitch sweeps) under a fast
# exponential decay. Positive t^2 term rises, negative falls.
c1="0.9*sin(2*PI*(2400*t+9000*t*t))*exp(-14*t)"
c2="0.9*sin(2*PI*(3100*t-4000*t*t))*exp(-18*t)"
c3="0.9*sin(2*PI*(1900*t+16000*t*t))*exp(-11*t)"
# Offsets in ms, deliberately uneven — evenly spaced birds sound like a metronome.
# The last one lands well before the end so the loop does not clip a chirp.
times=(1200 3450 3620 5900 8300 11150 13400 13580 16900 19700 22400 24950 27300)

args=(-f lavfi -i "anoisesrc=d=$DUR:c=pink:a=0.9:r=$RATE")
fc="[0]lowpass=f=2600,tremolo=f=0.1:d=0.45[bed];"
mix="[bed]"
i=1
for t in "${times[@]}"; do
  case $((i % 3)) in 0) e="$c1" ;; 1) e="$c2" ;; *) e="$c3" ;; esac
  args+=(-f lavfi -i "aevalsrc='$e':d=0.35:s=$RATE")
  fc+="[$i]adelay=${t},apad=whole_dur=$DUR,volume=0.30[c$i];"
  mix+="[c$i]"
  i=$((i + 1))
done
fc+="${mix}amix=inputs=$i:normalize=0,alimiter=limit=0.9,\
loudnorm=I=-20:TP=-2,aformat=channel_layouts=stereo"

ffmpeg -y -loglevel error "${args[@]}" -filter_complex "$fc" -t $DUR \
  -b:a $BITRATE public/music/forest.mp3

for f in public/music/*.mp3; do echo "wrote: $f"; done
