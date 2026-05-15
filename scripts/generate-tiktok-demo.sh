#!/bin/bash
# generate-tiktok-demo.sh — Creates a demo video for TikTok app review
# Shows the complete OAuth + Content Posting API flow

OUTPUT_DIR="/Users/vedang/vedang-website/scripts/tiktok-demo"
mkdir -p "$OUTPUT_DIR"

FONT="/System/Library/Fonts/Helvetica.ttc"
W=1920
H=1080
BG_COLOR="#0F0F0F"
TEXT_COLOR="#FFFFFF"
ACCENT="#FE2C55"  # TikTok red
SUBTLE="#AAAAAA"

# Generate individual slide images with ffmpeg
generate_slide() {
  local idx=$1
  local title="$2"
  local body="$3"
  local subtitle="$4"
  local duration=$5
  local outfile="$OUTPUT_DIR/slide_${idx}.mp4"

  ffmpeg -y -f lavfi -i "color=c=${BG_COLOR}:s=${W}x${H}:d=${duration}" \
    -vf "\
      drawtext=fontfile=${FONT}:text='${title}':fontcolor=${ACCENT}:fontsize=52:x=(w-text_w)/2:y=h/4,\
      drawtext=fontfile=${FONT}:text='${body}':fontcolor=${TEXT_COLOR}:fontsize=32:x=(w-text_w)/2:y=h/2-20:line_spacing=20,\
      drawtext=fontfile=${FONT}:text='${subtitle}':fontcolor=${SUBTLE}:fontsize=24:x=(w-text_w)/2:y=3*h/4\
    " \
    -c:v libx264 -pix_fmt yuv420p -r 30 "$outfile" 2>/dev/null

  echo "$outfile"
}

echo "🎬 Generating TikTok demo video slides..."

# Slide 1: Title (4s)
generate_slide 01 \
  "Vedang-Socials" \
  "TikTok Content Posting API Integration Demo" \
  "vedangvatsa.com | Automated Content Syndication Platform" \
  4

# Slide 2: Architecture Overview (5s)
generate_slide 02 \
  "Platform Architecture" \
  "CMS Queue -> Scheduler -> Content Posting API -> TikTok" \
  "Automated publishing pipeline with OAuth2 authentication" \
  5

# Slide 3: OAuth Flow - Step 1 (4s)
generate_slide 03 \
  "Step 1: OAuth2 Authorization" \
  "User clicks Authorize -> Redirected to TikTok login" \
  "Scopes: user.info.basic, video.publish, video.upload" \
  4

# Slide 4: OAuth Flow - Step 2 (4s)
generate_slide 04 \
  "Step 2: Token Exchange" \
  "Authorization code exchanged for access_token" \
  "POST https://open.tiktokapis.com/v2/oauth/token/" \
  4

# Slide 5: Content Queue (5s)
generate_slide 05 \
  "Step 3: Content Queue Management" \
  "Pre-rendered MP4 videos queued with captions and hashtags" \
  "tiktok-posts.json: scheduleDate, scheduleTime, videoPath, caption" \
  5

# Slide 6: Video Upload (5s)
generate_slide 06 \
  "Step 4: Video Upload via API" \
  "POST /v2/post/publish/video/init/ -> Upload video chunks" \
  "Content Posting API handles transcoding and publishing" \
  5

# Slide 7: Published (4s)
generate_slide 07 \
  "Step 5: Published on TikTok" \
  "Video appears on user profile with caption and hashtags" \
  "Engagement tracking logged for analytics" \
  4

# Slide 8: Drip Schedule (4s)
generate_slide 08 \
  "Scheduling: 3x Daily Publishing" \
  "Cron-based scheduler posts at optimal engagement windows" \
  "8-hour cooldown between posts | Max 3 posts per day" \
  4

# Slide 9: End (3s)
generate_slide 09 \
  "Vedang-Socials" \
  "Ready for Production" \
  "Contact: vedang@vedangvatsa.com | https://veda.ng" \
  3

echo "🔗 Concatenating slides..."

# Create concat file
CONCAT_FILE="$OUTPUT_DIR/concat.txt"
> "$CONCAT_FILE"
for i in 01 02 03 04 05 06 07 08 09; do
  echo "file 'slide_${i}.mp4'" >> "$CONCAT_FILE"
done

# Concatenate all slides
FINAL="$OUTPUT_DIR/tiktok-demo-video.mp4"
ffmpeg -y -f concat -safe 0 -i "$CONCAT_FILE" \
  -c:v libx264 -pix_fmt yuv420p -r 30 \
  -movflags +faststart \
  "$FINAL" 2>/dev/null

echo "✅ Demo video created: $FINAL"
ls -lh "$FINAL"
