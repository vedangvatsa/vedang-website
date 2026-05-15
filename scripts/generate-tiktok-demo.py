#!/usr/bin/env python3
"""Generate TikTok Content Posting API demo video for app review."""

import subprocess, os
from PIL import Image, ImageDraw, ImageFont

OUT = "/Users/vedang/vedang-website/scripts/tiktok-demo"
os.makedirs(OUT, exist_ok=True)

W, H = 1920, 1080
BG = (15, 15, 15)
WHITE = (255, 255, 255)
RED = (254, 44, 85)       # TikTok red
GRAY = (170, 170, 170)
DARK_GRAY = (60, 60, 60)

# Try to load a nice font, fallback to default
def get_font(size):
    for p in [
        "/System/Library/Fonts/SFPro-Bold.otf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]:
        try:
            return ImageFont.truetype(p, size)
        except:
            continue
    return ImageFont.load_default()

def get_font_regular(size):
    for p in [
        "/System/Library/Fonts/SFPro-Regular.otf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]:
        try:
            return ImageFont.truetype(p, size)
        except:
            continue
    return ImageFont.load_default()

font_title = get_font(56)
font_body = get_font_regular(34)
font_sub = get_font_regular(24)
font_small = get_font_regular(20)
font_code = get_font_regular(22)
font_step = get_font(28)

def draw_centered(draw, text, y, font, color):
    bbox = draw.textbbox((0,0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, y), text, font=font, fill=color)

def draw_left(draw, text, x, y, font, color):
    draw.text((x, y), text, font=font, fill=color)

def make_slide(idx, draw_fn, duration=4):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    
    # Subtle border accent at top
    draw.rectangle([(0, 0), (W, 4)], fill=RED)
    
    draw_fn(draw, img)
    
    # Save frame
    frame_path = os.path.join(OUT, f"slide_{idx:02d}.png")
    img.save(frame_path)
    
    # Convert to video segment
    vid_path = os.path.join(OUT, f"slide_{idx:02d}.mp4")
    subprocess.run([
        "ffmpeg", "-y", "-loop", "1", "-i", frame_path,
        "-c:v", "libx264", "-t", str(duration),
        "-pix_fmt", "yuv420p", "-r", "30",
        "-vf", "scale=1920:1080",
        vid_path
    ], capture_output=True)
    return vid_path

# ─── Slide 1: Title ──────────────────────────────────────────────
def slide_title(draw, img):
    draw_centered(draw, "Vedang-Socials", 300, font_title, RED)
    draw_centered(draw, "TikTok Content Posting API", 400, font_body, WHITE)
    draw_centered(draw, "Integration Demo", 450, font_body, WHITE)
    draw_centered(draw, "━" * 40, 520, font_sub, DARK_GRAY)
    draw_centered(draw, "Automated Social Media Content Syndication Platform", 580, font_sub, GRAY)
    draw_centered(draw, "vedangvatsa.com", 640, font_small, GRAY)

# ─── Slide 2: Architecture ────────────────────────────────────────
def slide_arch(draw, img):
    draw_centered(draw, "System Architecture", 120, font_title, RED)
    
    # Flow boxes
    boxes = [
        ("Content CMS", 160, 350),
        ("Schedule Queue", 510, 350),
        ("OAuth2 Auth", 860, 350),
        ("Content Posting API", 1210, 350),
        ("TikTok", 1560, 350),
    ]
    for label, x, y in boxes:
        draw.rounded_rectangle([(x, y), (x+250, y+80)], radius=12, outline=RED, width=2)
        bbox = draw.textbbox((0,0), label, font=font_step)
        tw = bbox[2] - bbox[0]
        draw.text((x + (250 - tw)//2, y + 25), label, font=font_step, fill=WHITE)
    
    # Arrows between boxes
    for i in range(len(boxes)-1):
        x1 = boxes[i][1] + 250
        x2 = boxes[i+1][1]
        y = 390
        draw.line([(x1+5, y), (x2-5, y)], fill=GRAY, width=2)
        draw.polygon([(x2-10, y-6), (x2-10, y+6), (x2-2, y)], fill=GRAY)
    
    draw_centered(draw, "Pre-rendered MP4 videos are queued and published automatically", 520, font_sub, GRAY)
    draw_centered(draw, "OAuth2 authorization ensures secure, user-approved access", 560, font_sub, GRAY)

# ─── Slide 3: OAuth Step 1 ────────────────────────────────────────
def slide_oauth1(draw, img):
    draw_centered(draw, "Step 1: OAuth2 Authorization", 120, font_title, RED)
    
    # Simulated browser window
    draw.rounded_rectangle([(300, 230), (1620, 850)], radius=16, outline=DARK_GRAY, width=2)
    draw.rectangle([(300, 230), (1620, 275)], fill=(30,30,30))
    # URL bar
    draw.rounded_rectangle([(450, 240), (1500, 265)], radius=6, fill=(50,50,50))
    draw_left(draw, "tiktok.com/v2/auth/authorize/?client_key=awdqcm...&scope=video.publish", 465, 243, font_small, GRAY)
    
    # Content area
    draw_centered(draw, "TikTok Authorization Page", 330, font_body, WHITE)
    draw_centered(draw, "Vedang-Socials is requesting access to your TikTok account", 400, font_sub, GRAY)
    
    # Permissions list
    perms = ["✓  Access your basic profile info", "✓  Upload videos to your account", "✓  Publish content on your behalf"]
    for i, p in enumerate(perms):
        draw_left(draw, p, 650, 470 + i*45, font_sub, WHITE)
    
    # Authorize button
    draw.rounded_rectangle([(810, 650), (1110, 710)], radius=8, fill=RED)
    draw_centered(draw, "Authorize App", 660, font_step, WHITE)
    
    draw_centered(draw, "User clicks Authorize → Redirected back with authorization code", 890, font_small, GRAY)

# ─── Slide 4: OAuth Step 2 ────────────────────────────────────────
def slide_oauth2(draw, img):
    draw_centered(draw, "Step 2: Token Exchange", 120, font_title, RED)
    
    # Code block
    draw.rounded_rectangle([(250, 230), (1670, 620)], radius=12, fill=(25,25,25), outline=DARK_GRAY)
    
    code_lines = [
        ("POST ", GRAY), ("https://open.tiktokapis.com/v2/oauth/token/", WHITE),
        ("", None),
        ("Content-Type: ", GRAY), ("application/x-www-form-urlencoded", WHITE),
        ("", None),
        ("client_key=", GRAY), ("awdqcmvubfrmg6ok", (130, 200, 130)),
        ("client_secret=", GRAY), ("XvlyKrj2fr....", (130, 200, 130)),
        ("code=", GRAY), ("<authorization_code>", (200, 200, 130)),
        ("grant_type=", GRAY), ("authorization_code", (130, 200, 130)),
    ]
    
    y = 260
    for text, color in code_lines:
        if color is None:
            y += 30
            continue
        draw_left(draw, text, 300, y, font_code, color)
        if text.endswith("="):
            bbox = draw.textbbox((0,0), text, font=font_code)
            # next item will be on same line (handled in pairs above)
        y += 30
    
    # Response
    draw.rounded_rectangle([(250, 660), (1670, 850)], radius=12, fill=(25,25,25), outline=(40, 100, 40))
    draw_left(draw, "Response:", 300, 680, font_sub, (100, 200, 100))
    draw_left(draw, '{ "access_token": "act.xxxxx...", "open_id": "user_open_id",', 300, 720, font_code, (130, 200, 130))
    draw_left(draw, '  "expires_in": 86400, "refresh_token": "rft.xxxxx..." }', 300, 755, font_code, (130, 200, 130))
    
    draw_centered(draw, "Access token stored securely for subsequent API calls", 900, font_small, GRAY)

# ─── Slide 5: Content Queue ───────────────────────────────────────
def slide_queue(draw, img):
    draw_centered(draw, "Step 3: Content Queue", 120, font_title, RED)
    
    # JSON block
    draw.rounded_rectangle([(250, 220), (1670, 800)], radius=12, fill=(25,25,25), outline=DARK_GRAY)
    draw_left(draw, "tiktok-posts.json", 300, 240, font_sub, GRAY)
    
    json_lines = [
        '[',
        '  {',
        '    "id": "tiktok-post-001",',
        '    "videoPath": "content/videos/ai-agents-explained.mp4",',
        '    "caption": "AI agents are changing how we work #tech #ai",',
        '    "scheduleDate": "2026-05-15",',
        '    "scheduleTime": "09:00",',
        '    "posted": false',
        '  },',
        '  {',
        '    "id": "tiktok-post-002",',
        '    "videoPath": "content/videos/web3-careers.mp4",',
        '    "caption": "Web3 is hiring. Here is where to look #web3 #jobs",',
        '    "scheduleDate": "2026-05-15",',
        '    "scheduleTime": "17:00",',
        '    "posted": false',
        '  }',
        ']',
    ]
    for i, line in enumerate(json_lines):
        color = (130, 200, 130) if '"' in line else GRAY
        draw_left(draw, line, 300, 280 + i*28, font_code, color)
    
    draw_centered(draw, "Videos are queued with captions, hashtags, and scheduled times", 850, font_small, GRAY)

# ─── Slide 6: Upload API ──────────────────────────────────────────
def slide_upload(draw, img):
    draw_centered(draw, "Step 4: Video Upload via Content Posting API", 120, font_title, RED)
    
    # Step boxes
    steps = [
        ("1. Initialize Upload", "POST /v2/post/publish/video/init/", "Returns upload_url for video chunks"),
        ("2. Upload Video File", "PUT {upload_url}", "Binary upload of MP4 file with Content-Type header"),
        ("3. Publish", "POST /v2/post/publish/", "Publish with caption, privacy settings, hashtags"),
    ]
    
    for i, (title, endpoint, desc) in enumerate(steps):
        y = 250 + i * 200
        draw.rounded_rectangle([(300, y), (1620, y+160)], radius=12, outline=DARK_GRAY, width=1)
        draw_left(draw, title, 340, y+20, font_step, RED)
        draw_left(draw, endpoint, 340, y+60, font_code, (130, 200, 130))
        draw_left(draw, desc, 340, y+100, font_sub, GRAY)
    
    draw_centered(draw, "All API calls authenticated with Bearer access_token", 880, font_small, GRAY)

# ─── Slide 7: Published ───────────────────────────────────────────
def slide_published(draw, img):
    draw_centered(draw, "Step 5: Published on TikTok", 120, font_title, RED)
    
    # Mock TikTok post card
    draw.rounded_rectangle([(660, 230), (1260, 800)], radius=20, fill=(25,25,25), outline=DARK_GRAY, width=2)
    
    # Video placeholder
    draw.rounded_rectangle([(680, 260), (1240, 600)], radius=12, fill=(40,40,40))
    draw_centered(draw, "▶", 390, get_font(72), GRAY)
    draw_centered(draw, "ai-agents-explained.mp4", 470, font_small, GRAY)
    
    # Caption
    draw_left(draw, "@vedangvatsa", 700, 620, font_step, WHITE)
    draw_left(draw, "AI agents are changing how we", 700, 660, font_sub, WHITE)
    draw_left(draw, "work #tech #ai", 700, 690, font_sub, (100, 180, 255))
    
    # Engagement icons
    draw_left(draw, "❤  ↗  💬  ⊕", 700, 740, font_body, GRAY)
    
    draw_centered(draw, "Post status tracked in queue: posted=true, postedAt=timestamp", 860, font_small, GRAY)

# ─── Slide 8: Schedule ────────────────────────────────────────────
def slide_schedule(draw, img):
    draw_centered(draw, "Automated Scheduling", 120, font_title, RED)
    
    # Timeline
    times = [
        ("09:00 IST", "Post 1: Tech Insight Video", True),
        ("13:00 IST", "Post 2: Career Advice Video", False),
        ("21:00 IST", "Post 3: Industry Analysis Video", False),
    ]
    
    for i, (time, desc, active) in enumerate(times):
        y = 300 + i * 150
        color = RED if active else DARK_GRAY
        dot_color = RED if active else GRAY
        
        # Timeline line
        if i < len(times)-1:
            draw.line([(400, y+30), (400, y+150)], fill=DARK_GRAY, width=2)
        
        # Dot
        draw.ellipse([(388, y+18), (412, y+42)], fill=dot_color)
        
        # Content
        draw_left(draw, time, 450, y+10, font_step, WHITE if active else GRAY)
        draw_left(draw, desc, 450, y+50, font_sub, GRAY)
    
    draw_centered(draw, "Cron-based scheduler with 8-hour cooldown between posts", 780, font_sub, GRAY)
    draw_centered(draw, "GitHub Actions CI/CD ensures reliable execution", 820, font_small, GRAY)

# ─── Slide 9: End ─────────────────────────────────────────────────
def slide_end(draw, img):
    draw_centered(draw, "Vedang-Socials", 350, font_title, RED)
    draw_centered(draw, "Ready for Production", 430, font_body, WHITE)
    draw_centered(draw, "━" * 30, 490, font_sub, DARK_GRAY)
    draw_centered(draw, "vedangvatsa.com  |  vedang@vedangvatsa.com", 540, font_sub, GRAY)
    draw_centered(draw, "Thank you for reviewing", 600, font_small, GRAY)

# ─── Generate all slides ─────────────────────────────────────────
print("🎬 Generating slides...")
slides = [
    (1, slide_title, 4),
    (2, slide_arch, 5),
    (3, slide_oauth1, 5),
    (4, slide_oauth2, 5),
    (5, slide_queue, 5),
    (6, slide_upload, 5),
    (7, slide_published, 4),
    (8, slide_schedule, 4),
    (9, slide_end, 3),
]

vid_paths = []
for idx, fn, dur in slides:
    path = make_slide(idx, fn, dur)
    print(f"  ✅ Slide {idx}: {path}")
    vid_paths.append(path)

# Concatenate
print("🔗 Concatenating...")
concat_file = os.path.join(OUT, "concat.txt")
with open(concat_file, "w") as f:
    for p in vid_paths:
        f.write(f"file '{p}'\n")

final = os.path.join(OUT, "tiktok-demo-video.mp4")
subprocess.run([
    "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_file,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "-movflags", "+faststart", final
], capture_output=True)

size = os.path.getsize(final) / (1024*1024) if os.path.exists(final) else 0
print(f"\n✅ Demo video: {final} ({size:.1f} MB)")
