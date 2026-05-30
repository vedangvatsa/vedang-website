#!/usr/bin/env python3
"""
News Video Factory v3 — Playwright + HTML/CSS rendering
Browser-quality typography, strict design system, real stock photos.
"""

import asyncio
import base64
import json
import math
import os
import re
import subprocess
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

# ── PATHS ───────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent
ASSETS = ROOT / "assets"
OUTPUT = ROOT / "output"
FRAMES = OUTPUT / "frames"
OUTPUT.mkdir(exist_ok=True)
FRAMES.mkdir(exist_ok=True)

WIDTH, HEIGHT = 1080, 1920
FPS = 30

# ── SCRIPT (Rewrite A — zero AI slop, real intellectual value) ──────────────
SCENES = [
    {
        "text": "Trump was about to sign an executive order that would've given the NSA ninety days to stress-test any new AI model before it goes public. Ninety days of classified government evaluation. For a voluntary program.",
        "image": "white_house.jpg",
        "headline": "90-DAY AI REVIEW — KILLED",
        "source": "Photo: Pexels",
    },
    {
        "text": "He killed it at the last minute. Said it felt like a blocker.",
        "image": "capitol_night.jpg",
        "headline": "",
        "source": "Photo: Pexels",
    },
    {
        "text": "But think about what that order actually contained. It would've let federal cybersecurity testers run Anthropic's Mythos model against real financial systems and hospital networks. Because Mythos can find and exploit software vulnerabilities on its own. That's not a theory. Anthropic published the benchmarks.",
        "image": "server_room.jpg",
        "headline": "MYTHOS: AUTONOMOUS EXPLOITS",
        "source": "Photo: Pexels",
    },
    {
        "text": "The EU already has binding rules for this. Their AI Act classifies models by risk tier, and high-risk systems need a full conformity assessment before launch. China files every algorithm with the government.",
        "image": "china_city.jpg",
        "headline": "EU & CHINA MOVED FIRST",
        "source": "Photo: Pexels",
    },
    {
        "text": "We just chose to do nothing.",
        "image": "circuit_board.jpg",
        "headline": "",
        "source": "",
    },
    {
        "text": "So now we're the only major power running advanced AI with no federal framework at all. Not a weak one. Not a delayed one. None.",
        "image": "circuit_board.jpg",
        "headline": "NO FEDERAL FRAMEWORK",
        "source": "Photo: Pexels",
    },
    {
        "text": "The models keep shipping. The rules don't exist yet.",
        "image": "document_desk.jpg",
        "headline": "",
        "source": "Photo: Pexels",
    },
]

FULL_SCRIPT = " ".join(s["text"] for s in SCENES)


# ── DESIGN SYSTEM (all values defined here, used nowhere else) ──────────────
DESIGN = {
    "bg": "#080A10",
    "card_bg": "rgba(14, 16, 24, 0.92)",
    "card_border": "rgba(40, 46, 65, 0.5)",
    "accent": "#0096FF",
    "accent_dark": "#0070CC",
    "text_primary": "#F0F2FA",
    "text_secondary": "#B0B8D0",
    "text_dim": "#4A5270",
    "alert_red": "#FF3340",
    "safe_top": 160,      # px from top — safe zone
    "safe_bottom": 160,   # px from bottom — safe zone
    "safe_side": 48,      # px from sides
    "card_margin": 40,
    "card_padding": 32,
    "card_radius": 12,
    "grid_unit": 8,       # all spacing = multiples of 8
}


def build_html_template():
    """Build the master HTML template with CSS design system."""
    return """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1080px;
    height: 1920px;
    background: %(bg)s;
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ── SCENE IMAGE ─────────────────────────────── */
  .scene-image {
    position: absolute;
    top: 0; left: 0;
    width: 1080px;
    height: 1120px;
    overflow: hidden;
  }
  .scene-image img {
    width: 100%%;
    height: 100%%;
    object-fit: cover;
    filter: saturate(0.7) brightness(0.82);
  }
  .scene-image::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 400px;
    background: linear-gradient(to top, %(bg)s 0%%, %(bg)s 15%%, transparent 100%%);
  }
  .scene-image::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 120px;
    background: linear-gradient(to bottom, rgba(8,10,16,0.6), transparent);
    z-index: 1;
  }

  /* ── TOP BAR ─────────────────────────────────── */
  .top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: %(accent)s;
    z-index: 10;
  }

  .brand {
    position: absolute;
    top: 20px; left: %(safe_side)spx;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .brand-name {
    font-size: 24px;
    font-weight: 800;
    color: %(accent)s;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .brand-dot {
    width: 8px; height: 8px;
    border-radius: 50%%;
    background: %(alert_red)s;
    box-shadow: 0 0 8px %(alert_red)s;
  }
  .brand-live {
    font-size: 14px;
    font-weight: 700;
    color: %(alert_red)s;
    letter-spacing: 1px;
  }

  .date-tag {
    position: absolute;
    top: 22px; right: %(safe_side)spx;
    font-size: 18px;
    font-weight: 500;
    color: %(text_dim)s;
    letter-spacing: 0.5px;
    z-index: 10;
  }

  /* ── HEADLINE ────────────────────────────────── */
  .headline-bar {
    position: absolute;
    top: 980px;
    left: 0;
    z-index: 5;
    display: flex;
    align-items: stretch;
  }
  .headline-accent {
    width: 5px;
    background: %(text_primary)s;
  }
  .headline-text {
    background: %(accent)s;
    padding: 14px 24px 14px 20px;
    font-size: 36px;
    font-weight: 800;
    color: %(text_primary)s;
    letter-spacing: 0.5px;
    white-space: nowrap;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.4);
  }

  /* ── CAPTION CARD ────────────────────────────── */
  .caption-card {
    position: absolute;
    left: %(card_margin)spx;
    right: %(card_margin)spx;
    top: 1140px;
    bottom: %(safe_bottom)spx;
    background: %(card_bg)s;
    border: 1px solid %(card_border)s;
    border-radius: %(card_radius)spx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: %(card_padding)spx;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .caption-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: %(card_radius)spx;
    right: %(card_radius)spx;
    height: 2px;
    background: %(accent)s;
    opacity: 0.6;
  }

  /* ── CAPTION TEXT ────────────────────────────── */
  .caption-text {
    text-align: center;
    line-height: 1.55;
    max-width: 920px;
  }
  .word {
    display: inline;
    font-size: 42px;
    font-weight: 700;
    transition: color 0.15s ease;
  }
  .word.active {
    color: %(text_primary)s;
    background: %(accent)s;
    padding: 2px 7px;
    border-radius: 5px;
    margin: 0 -3px;
  }
  .word.spoken {
    color: %(text_secondary)s;
  }
  .word.upcoming {
    color: %(text_dim)s;
  }

  /* ── SOURCE ATTRIBUTION ──────────────────────── */
  .source {
    position: absolute;
    bottom: 1130px;
    right: %(safe_side)spx;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.3);
    z-index: 5;
  }

  /* ── PROGRESS BAR ────────────────────────────── */
  .progress-bar {
    position: absolute;
    bottom: 0; left: 0;
    height: 5px;
    background: linear-gradient(90deg, %(accent)s, #00C8FF);
    z-index: 10;
    border-radius: 0 3px 0 0;
  }
  .progress-bg {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 5px;
    background: rgba(255,255,255,0.05);
    z-index: 9;
  }

  /* ── SCENE COUNTER ───────────────────────────── */
  .scene-counter {
    position: absolute;
    bottom: 24px;
    right: %(safe_side)spx;
    font-size: 16px;
    font-weight: 600;
    color: %(text_dim)s;
    z-index: 10;
  }
</style>
</head>
<body>
  <div class="top-bar"></div>

  <div class="brand">
    <span class="brand-name">The Signal</span>
    <span class="brand-dot" id="liveDot"></span>
    <span class="brand-live">LIVE</span>
  </div>

  <div class="date-tag">MAY 22, 2026</div>

  <div class="scene-image">
    <img id="sceneImg" src="" alt="">
  </div>

  <div class="source" id="sourceText"></div>

  <div class="headline-bar" id="headlineBar" style="display:none;">
    <div class="headline-accent"></div>
    <div class="headline-text" id="headlineText"></div>
  </div>

  <div class="caption-card">
    <div class="caption-text" id="captionText"></div>
  </div>

  <div class="scene-counter" id="sceneCounter"></div>
  <div class="progress-bg"></div>
  <div class="progress-bar" id="progressBar"></div>
</body>
</html>""" % DESIGN


def compute_word_timings(audio_duration_s, scenes):
    """Estimate word timings proportionally from audio."""
    all_words = []
    for s in scenes:
        all_words.extend(s["text"].split())

    pad_start, pad_end = 0.3, 0.4
    usable = audio_duration_s - pad_start - pad_end

    weights = []
    for w in all_words:
        clean = re.sub(r'[^a-zA-Z]', '', w)
        syllables = max(1, len(re.findall(r'[aeiouyAEIOUY]+', clean)))
        weights.append(syllables)
    total_w = sum(weights)

    timings = []
    t = pad_start
    for word, weight in zip(all_words, weights):
        dur = (weight / total_w) * usable
        timings.append({"word": word, "start": t, "end": t + dur})
        t += dur
    return timings


def build_scene_timings(scenes, word_timings):
    """Map word timings to scene boundaries."""
    result = []
    offset = 0
    for scene in scenes:
        n = len(scene["text"].split())
        s = word_timings[offset]["start"] if offset < len(word_timings) else 0
        e = word_timings[offset + n - 1]["end"] if offset + n - 1 < len(word_timings) else s + 5
        result.append({"start": s, "end": e, "word_offset": offset, "n_words": n, **scene})
        offset += n
    return result


def render_frames(scene_timings, word_timings, audio_duration):
    """Render every frame using Playwright."""
    total_frames = int(audio_duration * FPS)
    html = build_html_template()

    # Write HTML template
    html_path = OUTPUT / "template.html"
    html_path.write_text(html)

    # Encode images as base64 data URIs for embedding
    image_data = {}
    for scene in scene_timings:
        img_name = scene["image"]
        if img_name not in image_data:
            img_path = ASSETS / img_name
            if img_path.exists():
                b64 = base64.b64encode(img_path.read_bytes()).decode()
                image_data[img_name] = f"data:image/jpeg;base64,{b64}"

    print(f"🎨 Rendering {total_frames} frames via Playwright...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
        page.goto(f"file://{html_path.absolute()}")

        # Wait for fonts to load
        page.wait_for_timeout(2000)

        prev_scene_idx = -1

        for frame_num in range(total_frames):
            current_s = frame_num / FPS
            progress = frame_num / total_frames

            # Find current scene
            scene_idx = 0
            for i, st in enumerate(scene_timings):
                if current_s >= st["start"]:
                    scene_idx = i

            st = scene_timings[scene_idx]

            # Find active word
            active_local = -1
            for i in range(st["n_words"]):
                gi = st["word_offset"] + i
                if gi < len(word_timings) and current_s >= word_timings[gi]["start"]:
                    active_local = i

            # Build word HTML
            words = st["text"].split()
            word_spans = []
            for i, w in enumerate(words):
                if i == active_local:
                    cls = "active"
                elif i < active_local:
                    cls = "spoken"
                else:
                    cls = "upcoming"
                word_spans.append(f'<span class="word {cls}">{w} </span>')

            caption_html = "".join(word_spans)

            # Ken Burns: compute transform
            frame_in_scene = frame_num - int(st["start"] * FPS)
            scene_frames = max(1, int((st["end"] - st["start"]) * FPS))
            t = frame_in_scene / scene_frames
            scale = 1.0 + 0.08 * t
            tx = 5 * math.sin(t * math.pi)
            ty = 3 * math.cos(t * math.pi * 0.7)

            img_src = image_data.get(st["image"], "")

            # Scene counter
            counter_text = f"{scene_idx + 1} / {len(scene_timings)}"

            # Update DOM in one evaluate call
            page.evaluate(f"""() => {{
                document.getElementById('sceneImg').src = '{img_src}';
                document.getElementById('sceneImg').style.transform = 'scale({scale}) translate({tx}px, {ty}px)';
                document.getElementById('captionText').innerHTML = `{caption_html}`;
                document.getElementById('progressBar').style.width = '{progress * 100}%';
                document.getElementById('sceneCounter').textContent = '{counter_text}';
                document.getElementById('sourceText').textContent = '{st.get("source", "")}';

                const hl = document.getElementById('headlineBar');
                const hlText = document.getElementById('headlineText');
                const headline = '{st.get("headline", "")}';
                if (headline) {{
                    hl.style.display = 'flex';
                    hlText.textContent = headline;
                }} else {{
                    hl.style.display = 'none';
                }}
            }}""")

            # Screenshot
            frame_path = FRAMES / f"frame_{frame_num:05d}.png"
            page.screenshot(path=str(frame_path))

            if frame_num % (FPS * 3) == 0:
                print(f"   Frame {frame_num}/{total_frames} ({progress*100:.0f}%) — Scene {scene_idx+1}/{len(scene_timings)}")

        browser.close()
    print(f"   ✅ All {total_frames} frames rendered")


def main():
    print("🎬 News Video Factory v3 — Playwright + CSS Design System")
    print("=" * 60)

    # 1. Generate audio
    print("\n🎙️  Generating voiceover...")
    audio_path = OUTPUT / "voiceover.mp3"

    async def gen_audio():
        import edge_tts
        comm = edge_tts.Communicate(FULL_SCRIPT, "en-US-GuyNeural", rate="+5%", pitch="-2Hz")
        await comm.save(str(audio_path))

    asyncio.run(gen_audio())

    # Get duration
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", str(audio_path)],
        capture_output=True, text=True
    )
    duration = float(result.stdout.strip())
    print(f"   ✅ {duration:.1f}s audio generated")

    # 2. Compute timings
    print("\n📝 Computing word timings...")
    word_timings = compute_word_timings(duration, SCENES)
    scene_timings = build_scene_timings(SCENES, word_timings)
    print(f"   ✅ {len(word_timings)} words across {len(scene_timings)} scenes")

    # 3. Render frames
    print()
    render_frames(scene_timings, word_timings, duration)

    # 4. Assemble with ffmpeg
    print("\n🔧 Assembling final video...")
    output_video = OUTPUT / "news_v3_final.mp4"
    subprocess.run([
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", str(FRAMES / "frame_%05d.png"),
        "-i", str(audio_path),
        "-c:v", "libx264", "-preset", "slow", "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", "-movflags", "+faststart",
        str(output_video)
    ], check=True, capture_output=True)

    size_mb = output_video.stat().st_size / 1024 / 1024
    print(f"\n✅ VIDEO COMPLETE: {output_video}")
    print(f"   📏 {size_mb:.1f} MB | ⏱️ {duration:.1f}s | 📐 {WIDTH}×{HEIGHT}")

    # Cleanup
    print("🧹 Cleaning frames...")
    shutil.rmtree(FRAMES)
    FRAMES.mkdir()

    # Open
    print("🎥 Opening in QuickTime...")
    subprocess.run(["open", "-a", "QuickTime Player", str(output_video)])


if __name__ == "__main__":
    main()
