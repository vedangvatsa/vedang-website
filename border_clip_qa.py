#!/usr/bin/env python3
"""
border_clip_qa.py — Automated Pixel-Boundary Clipping Audit for Video Assets.
This script streams video frames at 1 fps via FFmpeg, extracts the background color
of each frame from its corners, and checks if any non-background pixels enter the
5px absolute outer margins (which indicates a layout overflow or clipped text/bars).
"""

import os
import sys
import glob
import subprocess
import numpy as np
from PIL import Image

VIDEO_DIRS = [
    "/Users/vedang/Desktop/chart-videos",
    "/Users/vedang/Desktop/chart-videos/visualizations"
]

def get_video_metadata(vpath):
    """Get the width, height, and duration of a video using ffprobe."""
    try:
        cmd = [
            "ffprobe", "-v", "error", "-select_streams", "v:0",
            "-show_entries", "stream=width,height,duration",
            "-of", "csv=s=x:p=0", vpath
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        parts = res.stdout.strip().split("x")
        if len(parts) >= 2:
            width = int(parts[0])
            # The last element might contain duration if the output is widthxheightxduration
            height_dur = parts[1].split(",")
            height = int(height_dur[0])
            duration = float(height_dur[1]) if len(height_dur) > 1 else 30.0
            return width, height, duration
    except Exception as e:
        print(f"Error reading metadata for {os.path.basename(vpath)}: {e}")
    return None

def check_video_boundaries(vpath, border_px=5, fps=1):
    """
    Stream video frames at a low fps, and check if any pixel in the border
    boundary (border_px from edges) is a different color from the background.
    """
    name = os.path.basename(vpath)
    meta = get_video_metadata(vpath)
    if not meta:
        return {"status": "error", "message": "Could not read video metadata"}
    
    width, height, duration = meta
    frame_size = width * height * 3  # RGB24 (3 bytes per pixel)
    
    # Run ffmpeg to stream raw frames as RGB24
    cmd = [
        "ffmpeg", "-v", "quiet", "-i", vpath,
        "-vf", f"fps={fps}", "-f", "image2pipe",
        "-vcodec", "rawvideo", "-pix_fmt", "rgb24", "-"
    ]
    
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    
    frame_count = 0
    clip_flags = []
    
    while True:
        raw_frame = proc.stdout.read(frame_size)
        if not raw_frame or len(raw_frame) < frame_size:
            break
        
        frame_count += 1
        timestamp = (frame_count - 1) / fps
        
        # Convert to numpy array
        frame = np.frombuffer(raw_frame, dtype=np.uint8).reshape((height, width, 3))
        
        # 1. Determine background color dynamically from the 4 corners
        corners = [
            frame[0, 0],
            frame[0, width - 1],
            frame[height - 1, 0],
            frame[height - 1, width - 1]
        ]
        # Median corner color is highly robust against compression artifacts
        bg_color = np.median(corners, axis=0).astype(np.uint8)
        
        # 2. Extract border slices
        top_border = frame[0:border_px, :, :]
        bottom_border = frame[height - border_px:height, :, :]
        left_border = frame[:, 0:border_px, :]
        right_border = frame[:, width - border_px:width, :]
        
        # 3. Calculate distance from background color
        # We allow a small tolerance (e.g. 15 out of 255) for video compression artifacts
        tolerance = 15
        
        top_diff = np.abs(top_border.astype(int) - bg_color.astype(int))
        bottom_diff = np.abs(bottom_border.astype(int) - bg_color.astype(int))
        left_diff = np.abs(left_border.astype(int) - bg_color.astype(int))
        right_diff = np.abs(right_border.astype(int) - bg_color.astype(int))
        
        # Find if any pixel exceeds tolerance in any color channel
        top_clipped = np.any(np.max(top_diff, axis=2) > tolerance)
        bottom_clipped = np.any(np.max(bottom_diff, axis=2) > tolerance)
        left_clipped = np.any(np.max(left_diff, axis=2) > tolerance)
        right_clipped = np.any(np.max(right_diff, axis=2) > tolerance)
        
        if top_clipped or bottom_clipped or left_clipped or right_clipped:
            sides = []
            if top_clipped: sides.append("top")
            if bottom_clipped: sides.append("bottom")
            if left_clipped: sides.append("left")
            if right_clipped: sides.append("right")
            clip_flags.append({
                "frame": frame_count,
                "timestamp": timestamp,
                "sides": sides
            })
            
    proc.stdout.close()
    proc.wait()
    
    if clip_flags:
        return {
            "status": "fail",
            "frames_checked": frame_count,
            "clips": clip_flags,
            "resolution": f"{width}x{height}",
            "duration": f"{duration:.1f}s"
        }
    return {
        "status": "pass",
        "frames_checked": frame_count,
        "resolution": f"{width}x{height}",
        "duration": f"{duration:.1f}s"
    }

def main():
    print("=" * 60)
    print("🎬 VISUAL BOUNDARY & BORDER CLIPPING AUDIT")
    print("=" * 60)
    
    # Collect all video paths
    video_paths = []
    for d in VIDEO_DIRS:
        if os.path.exists(d):
            video_paths.extend(glob.glob(os.path.join(d, "*.mp4")))
    
    video_paths = sorted(list(set(video_paths)))
    
    if not video_paths:
        print("No videos found to audit.")
        return
        
    print(f"Found {len(video_paths)} videos to check. Starting analysis...")
    
    results = {}
    failures = 0
    passes = 0
    
    for i, vpath in enumerate(video_paths):
        name = os.path.basename(vpath)
        print(f"[{i+1}/{len(video_paths)}] Checking {name}...", end="", flush=True)
        
        res = check_video_boundaries(vpath)
        if res["status"] == "pass":
            print(f" ✅ PASS ({res['frames_checked']} frames, {res['resolution']})")
            passes += 1
        elif res["status"] == "fail":
            print(f" ❌ CLIPPED ({len(res['clips'])} warnings)")
            failures += 1
            results[name] = res
        else:
            print(f" ⚠️ ERROR ({res['message']})")
            
    print("\n" + "=" * 60)
    print("AUDIT RESULTS SUMMARY")
    print("=" * 60)
    print(f"Total Videos Checked: {len(video_paths)}")
    print(f"Passed Visual Boundaries: {passes}")
    print(f"Failed (Visual Clipping): {failures}")
    print("=" * 60)
    
    if failures > 0:
        print("\nDetailed Clipping Failures:")
        for name, info in results.items():
            print(f"\n🎥 {name} ({info['resolution']}, {info['duration']}):")
            for c in info["clips"][:5]:  # show first 5 instances
                print(f"  - Frame {c['frame']} at {c['timestamp']:.1f}s: Clipping detected on side(s): {', '.join(c['sides'])}")
            if len(info["clips"]) > 5:
                print(f"  - ... and {len(info['clips']) - 5} more frames.")
    else:
        print("\n🎉 CONGRATULATIONS! All videos have perfect border layouts. No clipping or cut-offs detected!")

if __name__ == "__main__":
    main()
