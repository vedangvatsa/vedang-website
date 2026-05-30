#!/usr/bin/env python3
"""
Autonomous News Video Factory v2 — High-Quality Video Producer
Generates a premium 9:16 short-form news commentary video.
Uses estimated word timings for caption sync (no Whisper needed).
"""

import asyncio
import json
import math
import os
import subprocess
import textwrap
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# ── CONFIG ──────────────────────────────────────────────────────────────────
WIDTH, HEIGHT = 1080, 1920
FPS = 30
OUTPUT_DIR = Path(__file__).parent / "output"
ARTIFACT_DIR = Path("/Users/vedang/.gemini/antigravity/brain/ab88b5bc-6fae-486c-b1ef-e14a25e0ec28")

# ── COLORS (Premium dark editorial palette) ─────────────────────────────────
BG_DARK = (8, 10, 16)
CARD_BG = (14, 16, 24)
CARD_BORDER = (30, 35, 48)
ACCENT = (0, 150, 255)       # Electric blue
ACCENT_GLOW = (0, 120, 220)
TEXT_WHITE = (245, 248, 255)
TEXT_DIM = (100, 108, 130)
TEXT_SPOKEN = (185, 192, 210)
HEADLINE_BG = (0, 140, 245)

# ── SCRIPT ──────────────────────────────────────────────────────────────────
SCENES = [
    {
        "text": "Trump just killed his own AI order. Like, literally refused to sign it.",
        "image": "trump_ai_order_1779394376432.png",
        "headline": "AI ORDER KILLED",
    },
    {
        "text": "The executive order was supposed to put guardrails on the most powerful AI models. Partly because Anthropic's new Mythos model freaked out half the national security team.",
        "image": "ai_chip_visual_1779394390768.png",
        "headline": "ANTHROPIC'S MYTHOS",
    },
    {
        "text": "But Trump looked at the draft and said he didn't like certain aspects. So he walked away.",
        "image": "trump_ai_order_1779394376432.png",
        "headline": '"DIDN\'T LIKE IT"',
    },
    {
        "text": "And here's what nobody's talking about. The real fight isn't about safety. It's about China.",
        "image": "china_us_flags_1779394416864.png",
        "headline": "THE REAL FIGHT",
    },
    {
        "text": "One side of the White House wants to slow AI down so it doesn't go off the rails. The other side says if we slow down even a little, Beijing wins.",
        "image": "china_us_flags_1779394416864.png",
        "headline": "SAFETY vs SPEED",
    },
    {
        "text": "So now there's no rule. No guardrails. No framework. Just the most powerful technology humans have ever built, running with zero oversight.",
        "image": "ai_chip_visual_1779394390768.png",
        "headline": "ZERO OVERSIGHT",
    },
    {
        "text": "And the kicker? While Washington argues about paperwork, Anthropic, OpenAI, and Google are shipping new models every single week.",
        "image": "ai_chip_visual_1779394390768.png",
        "headline": "THEY'RE NOT WAITING",
    },
    {
        "text": "The government can't even agree on a document. The companies aren't waiting.",
        "image": "news_bg_dark_1779394362600.png",
        "headline": "",
    },
]

FULL_SCRIPT = " ".join(s["text"] for s in SCENES)


def get_font(size, bold=False):
    """Get the best available system font."""
    if bold:
        candidates = [
            "/System/Library/Fonts/SFProDisplay-Bold.otf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
    else:
        candidates = [
            "/System/Library/Fonts/SFProDisplay-Regular.otf",
            "/System/Library/Fonts/SFProDisplay-Medium.otf",
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def ease_out_cubic(t):
    return 1 - (1 - min(max(t, 0), 1)) ** 3

def ease_out_quart(t):
    return 1 - (1 - min(max(t, 0), 1)) ** 4

def ease_in_out_cubic(t):
    t = min(max(t, 0), 1)
    if t < 0.5:
        return 4 * t * t * t
    else:
        return 1 - (-2 * t + 2) ** 3 / 2


def compute_word_timings(audio_duration_s):
    """Estimate word timings based on scene text and proportional timing."""
    all_words = []
    for scene in SCENES:
        words = scene["text"].split()
        all_words.extend(words)
    
    total_words = len(all_words)
    # Add small padding at start and end
    start_pad = 0.3
    end_pad = 0.5
    usable_duration = audio_duration_s - start_pad - end_pad
    
    # Weight words by syllable count (rough estimate: longer words take longer)
    word_weights = []
    for w in all_words:
        clean = re.sub(r'[^a-zA-Z]', '', w)
        # Rough syllable estimate
        syllables = max(1, len(re.findall(r'[aeiouyAEIOUY]+', clean)))
        word_weights.append(syllables)
    
    total_weight = sum(word_weights)
    
    timings = []
    current_time = start_pad
    for i, (word, weight) in enumerate(zip(all_words, word_weights)):
        duration = (weight / total_weight) * usable_duration
        timings.append({
            "word": word,
            "start_s": current_time,
            "end_s": current_time + duration,
            "index": i,
        })
        current_time += duration
    
    return timings


def create_premium_frame(scene_img, headline_text, caption_words,
                          active_word_idx, frame_in_scene, total_scene_frames,
                          scene_index, progress, is_scene_transition, transition_progress):
    """Create a single premium video frame."""
    
    frame = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(frame)
    
    # ── Scene image with Ken Burns + vignette ───────────────────────────────
    if scene_img:
        img = scene_img.copy()
        
        # Ken Burns: slow zoom + slight drift
        t = frame_in_scene / max(total_scene_frames, 1)
        zoom = 1.0 + 0.12 * t
        drift_x = int(15 * math.sin(t * math.pi))
        drift_y = int(8 * math.cos(t * math.pi * 0.7))
        
        new_w = int(img.width / zoom)
        new_h = int(img.height / zoom)
        cx = img.width // 2 + drift_x
        cy = img.height // 2 + drift_y
        
        x1 = max(0, cx - new_w // 2)
        y1 = max(0, cy - new_h // 2)
        x2 = min(img.width, x1 + new_w)
        y2 = min(img.height, y1 + new_h)
        
        cropped = img.crop((x1, y1, x2, y2))
        
        # Display in top 58% of frame
        display_h = int(HEIGHT * 0.58)
        resized = cropped.resize((WIDTH, display_h), Image.LANCZOS)
        
        # Color grade: slightly desaturated, cool tone
        enhancer = ImageEnhance.Color(resized)
        resized = enhancer.enhance(0.7)
        enhancer = ImageEnhance.Brightness(resized)
        resized = enhancer.enhance(0.85)
        
        # Scene transition fade
        if is_scene_transition and transition_progress < 1.0:
            opacity = int(255 * ease_out_cubic(transition_progress))
            mask = Image.new("L", resized.size, opacity)
            black = Image.new("RGB", resized.size, BG_DARK)
            resized = Image.composite(resized, black, mask)
        
        # Bottom gradient fade to dark
        resized_rgba = resized.convert("RGBA")
        overlay = Image.new("RGBA", (WIDTH, display_h), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        
        # Bottom 35% gradient
        grad_start = int(display_h * 0.65)
        for y in range(grad_start, display_h):
            alpha = int(255 * ((y - grad_start) / (display_h - grad_start)) ** 1.5)
            od.rectangle([(0, y), (WIDTH, y + 1)], fill=(BG_DARK[0], BG_DARK[1], BG_DARK[2], alpha))
        
        # Top 8% subtle gradient
        for y in range(0, int(display_h * 0.08)):
            alpha = int(120 * (1 - y / (display_h * 0.08)))
            od.rectangle([(0, y), (WIDTH, y + 1)], fill=(BG_DARK[0], BG_DARK[1], BG_DARK[2], alpha))
        
        # Side vignettes
        vignette_w = 100
        for x in range(vignette_w):
            alpha = int(80 * (1 - x / vignette_w))
            od.rectangle([(x, 0), (x + 1, display_h)], fill=(BG_DARK[0], BG_DARK[1], BG_DARK[2], alpha))
            od.rectangle([(WIDTH - x - 1, 0), (WIDTH - x, display_h)], fill=(BG_DARK[0], BG_DARK[1], BG_DARK[2], alpha))
        
        composited = Image.alpha_composite(resized_rgba, overlay)
        frame.paste(composited.convert("RGB"), (0, 50))
    
    # ── Top bar ─────────────────────────────────────────────────────────────
    # Accent line
    draw.rectangle([(0, 0), (WIDTH, 3)], fill=ACCENT)
    
    # Channel branding
    brand_font = get_font(26, bold=True)
    date_font = get_font(22)
    
    # Animated entrance for branding
    brand_alpha = min(1.0, frame_in_scene / 15) if scene_index == 0 else 1.0
    draw.text((36, 16), "THE SIGNAL", font=brand_font, fill=ACCENT)
    
    # Live indicator dot (pulsing)
    pulse = 0.5 + 0.5 * math.sin(frame_in_scene * 0.15)
    dot_r = int(5 + 2 * pulse)
    dot_x, dot_y = 200, 27
    draw.ellipse([(dot_x - dot_r, dot_y - dot_r), (dot_x + dot_r, dot_y + dot_r)], 
                 fill=(255, 60, 60))
    draw.text((dot_x + 14, 16), "LIVE", font=get_font(20, bold=True), fill=(255, 60, 60))
    
    draw.text((WIDTH - 210, 18), "MAY 22, 2026", font=date_font, fill=TEXT_DIM)
    
    # ── Headline overlay ────────────────────────────────────────────────────
    if headline_text:
        hl_font = get_font(48, bold=True)
        hl_y = int(HEIGHT * 0.52)
        
        # Measure
        bbox = draw.textbbox((0, 0), headline_text, font=hl_font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        
        # Slide-in animation
        slide_t = min(1.0, frame_in_scene / 10)
        eased = ease_out_quart(slide_t)
        slide_x = int(-text_w - 40 + (40 + text_w + 40) * eased)
        
        pad_x, pad_y = 20, 12
        
        # Shadow behind bar
        shadow_offset = 4
        draw.rectangle(
            [(slide_x - pad_x + shadow_offset, hl_y - pad_y + shadow_offset),
             (slide_x + text_w + pad_x + shadow_offset, hl_y + text_h + pad_y + shadow_offset)],
            fill=(0, 0, 0)
        )
        
        # Blue bar
        draw.rectangle(
            [(slide_x - pad_x, hl_y - pad_y),
             (slide_x + text_w + pad_x, hl_y + text_h + pad_y)],
            fill=HEADLINE_BG
        )
        
        # White accent stripe on left
        draw.rectangle(
            [(slide_x - pad_x, hl_y - pad_y),
             (slide_x - pad_x + 4, hl_y + text_h + pad_y)],
            fill=TEXT_WHITE
        )
        
        draw.text((slide_x, hl_y), headline_text, font=hl_font, fill=TEXT_WHITE)
    
    # ── Caption card ────────────────────────────────────────────────────────
    card_margin = 28
    card_top = int(HEIGHT * 0.62)
    card_bottom = HEIGHT - 70
    card_radius = 16
    
    # Card background with subtle gradient
    card = Image.new("RGBA", (WIDTH - 2 * card_margin, card_bottom - card_top), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    
    # Fill card
    card_w = card.width
    card_h = card.height
    cd.rounded_rectangle([(0, 0), (card_w, card_h)], radius=card_radius,
                         fill=(CARD_BG[0], CARD_BG[1], CARD_BG[2], 230),
                         outline=(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2], 120),
                         width=1)
    
    # Top accent line on card
    cd.rectangle([(card_radius, 0), (card_w - card_radius, 2)], fill=(*ACCENT, 180))
    
    frame_rgba = frame.convert("RGBA")
    frame_rgba.paste(card, (card_margin, card_top), card)
    frame = frame_rgba.convert("RGB")
    draw = ImageDraw.Draw(frame)
    
    # ── Render caption words ────────────────────────────────────────────────
    if caption_words:
        cap_font = get_font(44, bold=True)
        cap_font_dim = get_font(44)
        
        # Word wrap
        max_chars = 20
        lines = []
        current_line = []
        current_len = 0
        
        for word in caption_words:
            wl = len(word) + 1
            if current_len + wl > max_chars and current_line:
                lines.append(current_line[:])
                current_line = [word]
                current_len = wl
            else:
                current_line.append(word)
                current_len += wl
        if current_line:
            lines.append(current_line)
        
        # Limit visible lines (show 4 max, scroll as needed)
        max_visible_lines = 4
        
        # Calculate positions
        line_height = 64
        total_h = min(len(lines), max_visible_lines) * line_height
        text_area_top = card_top + 30
        text_area_bottom = card_bottom - 30
        text_center_y = text_area_top + (text_area_bottom - text_area_top - total_h) // 2
        
        word_global_idx = 0
        for line_idx, line_words in enumerate(lines):
            if line_idx >= max_visible_lines:
                # Update global index but don't render
                word_global_idx += len(line_words)
                continue
            
            # Center each line
            line_text = " ".join(line_words)
            bbox = draw.textbbox((0, 0), line_text, font=cap_font)
            line_w = bbox[2] - bbox[0]
            line_x = (WIDTH - line_w) // 2
            
            y = text_center_y + line_idx * line_height
            
            # Draw each word
            x_cursor = line_x
            for word in line_words:
                word_bbox = draw.textbbox((0, 0), word, font=cap_font)
                word_w = word_bbox[2] - word_bbox[0]
                space_w = draw.textbbox((0, 0), " ", font=cap_font)[2]
                
                is_active = word_global_idx == active_word_idx
                is_spoken = word_global_idx < active_word_idx
                
                if is_active:
                    # Active: bright white + blue underline + subtle bg glow
                    # Glow background
                    glow_pad = 6
                    draw.rounded_rectangle(
                        [(x_cursor - glow_pad, y - 4),
                         (x_cursor + word_w + glow_pad, y + 52)],
                        radius=6,
                        fill=(ACCENT[0], ACCENT[1], ACCENT[2])
                    )
                    draw.text((x_cursor, y), word, font=cap_font, fill=TEXT_WHITE)
                elif is_spoken:
                    draw.text((x_cursor, y), word, font=cap_font, fill=TEXT_SPOKEN)
                else:
                    draw.text((x_cursor, y), word, font=cap_font_dim, fill=TEXT_DIM)
                
                x_cursor += word_w + space_w
                word_global_idx += 1
    
    # ── Bottom progress bar ─────────────────────────────────────────────────
    bar_h = 4
    bar_y = HEIGHT - bar_h
    draw.rectangle([(0, bar_y), (WIDTH, HEIGHT)], fill=(20, 22, 32))
    pw = int(WIDTH * progress)
    
    # Gradient progress bar
    for x in range(pw):
        ratio = x / WIDTH
        r = int(0 + 60 * ratio)
        g = int(120 + 30 * ratio)
        b = int(255 - 20 * ratio)
        draw.rectangle([(x, bar_y), (x + 1, HEIGHT)], fill=(r, g, b))
    
    # Glowing dot at progress head
    if pw > 0:
        dot_glow = int(4 + 2 * math.sin(frame_in_scene * 0.2))
        draw.ellipse([(pw - dot_glow, bar_y - dot_glow + 2), 
                      (pw + dot_glow, HEIGHT + dot_glow - 2)], fill=ACCENT)
    
    return frame


def build_video():
    """Main video production pipeline."""
    print("🎬 Starting premium video production...")
    
    # Step 1: Generate audio
    print("🎙️  Generating voiceover with Edge TTS...")
    audio_path = OUTPUT_DIR / "voiceover.mp3"
    
    async def gen_audio():
        import edge_tts
        voice = "en-US-GuyNeural"
        communicate = edge_tts.Communicate(FULL_SCRIPT, voice, rate="+8%", pitch="-1Hz")
        await communicate.save(str(audio_path))
    
    asyncio.run(gen_audio())
    print(f"   ✅ Audio saved: {audio_path}")
    
    # Step 2: Get audio duration
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(audio_path)],
        capture_output=True, text=True
    )
    audio_duration = float(result.stdout.strip())
    total_frames = int(audio_duration * FPS)
    print(f"   Duration: {audio_duration:.1f}s ({total_frames} frames)")
    
    # Step 3: Compute word timings
    print("📝 Computing word timings...")
    word_timings = compute_word_timings(audio_duration)
    print(f"   {len(word_timings)} words mapped")
    
    # Step 4: Build scene timing from word timings
    print("🎭 Mapping scenes...")
    scene_timings = []
    word_offset = 0
    for scene in SCENES:
        scene_words = scene["text"].split()
        n_words = len(scene_words)
        
        if word_offset < len(word_timings) and word_offset + n_words - 1 < len(word_timings):
            start_s = word_timings[word_offset]["start_s"]
            end_s = word_timings[word_offset + n_words - 1]["end_s"]
        else:
            start_s = 0
            end_s = audio_duration
        
        scene_timings.append({
            "start_s": start_s,
            "end_s": end_s,
            "words": scene_words,
            "word_offset": word_offset,
            "n_words": n_words,
            "image": scene["image"],
            "headline": scene["headline"],
        })
        word_offset += n_words
    
    # Step 5: Load scene images
    print("🖼️  Loading scene images...")
    scene_images = {}
    for scene in SCENES:
        img_name = scene["image"]
        if img_name not in scene_images:
            img_path = ARTIFACT_DIR / img_name
            if img_path.exists():
                scene_images[img_name] = Image.open(img_path).convert("RGB")
                print(f"   ✅ {img_name}")
    
    # Step 6: Render frames
    print("🎨 Rendering frames...")
    frames_dir = OUTPUT_DIR / "frames"
    frames_dir.mkdir(exist_ok=True)
    
    prev_scene_idx = -1
    transition_start_frame = 0
    TRANSITION_FRAMES = 8  # ~0.27s scene transition
    
    for frame_num in range(total_frames):
        current_s = frame_num / FPS
        progress = frame_num / total_frames
        
        # Find current scene
        current_scene_idx = 0
        for i, st in enumerate(scene_timings):
            if current_s >= st["start_s"]:
                current_scene_idx = i
        
        # Detect scene change for transition
        is_transition = False
        transition_progress = 1.0
        if current_scene_idx != prev_scene_idx:
            transition_start_frame = frame_num
            prev_scene_idx = current_scene_idx
        
        frames_since_transition = frame_num - transition_start_frame
        if frames_since_transition < TRANSITION_FRAMES:
            is_transition = True
            transition_progress = frames_since_transition / TRANSITION_FRAMES
        
        st = scene_timings[current_scene_idx]
        scene_img = scene_images.get(st["image"])
        
        # Frame within scene
        scene_start_frame = int(st["start_s"] * FPS)
        frame_in_scene = frame_num - scene_start_frame
        scene_total_frames = int((st["end_s"] - st["start_s"]) * FPS)
        
        # Find active word within this scene
        active_word_local = -1
        for i in range(st["n_words"]):
            global_idx = st["word_offset"] + i
            if global_idx < len(word_timings):
                if current_s >= word_timings[global_idx]["start_s"]:
                    active_word_local = i
        
        # Create frame
        frame = create_premium_frame(
            scene_img=scene_img,
            headline_text=st["headline"],
            caption_words=st["words"],
            active_word_idx=active_word_local,
            frame_in_scene=frame_in_scene,
            total_scene_frames=scene_total_frames,
            scene_index=current_scene_idx,
            progress=progress,
            is_scene_transition=is_transition,
            transition_progress=transition_progress,
        )
        
        frame_path = frames_dir / f"frame_{frame_num:05d}.png"
        frame.save(frame_path, "PNG", optimize=False)
        
        if frame_num % (FPS * 2) == 0:  # Log every 2 seconds
            print(f"   Frame {frame_num}/{total_frames} ({progress*100:.0f}%) — Scene {current_scene_idx+1}/{len(SCENES)}")
    
    print(f"   ✅ All {total_frames} frames rendered")
    
    # Step 7: Assemble with ffmpeg
    print("🔧 Assembling final video with ffmpeg...")
    output_video = OUTPUT_DIR / "news_short_final.mp4"
    
    subprocess.run([
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", str(frames_dir / "frame_%05d.png"),
        "-i", str(audio_path),
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        "-movflags", "+faststart",
        str(output_video)
    ], check=True, capture_output=True)
    
    file_size = output_video.stat().st_size / 1024 / 1024
    print(f"\n✅ VIDEO COMPLETE: {output_video}")
    print(f"   📏 Size: {file_size:.1f} MB")
    print(f"   ⏱️  Duration: {audio_duration:.1f}s")
    print(f"   📐 Resolution: {WIDTH}x{HEIGHT}")
    
    # Cleanup frames
    print("🧹 Cleaning up frames...")
    import shutil
    shutil.rmtree(frames_dir)
    
    return output_video


if __name__ == "__main__":
    build_video()
