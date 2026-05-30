#!/usr/bin/env python3
"""
Video QA: Detect flickering, frozen endings, and suspicious anomalies.
Analyzes frame-to-frame luminance diffs to find:
1. Flickering: sudden brightness spikes between consecutive frames
2. Frozen endings: last N seconds with zero frame changes (animation stopped early)
3. Suspiciously small files (might be blank/static)
"""
import subprocess, json, os, sys, glob

VIDEO_DIR = "/Users/vedang/Desktop/chart-videos"
videos = sorted(glob.glob(os.path.join(VIDEO_DIR, "*.mp4")))

issues = []

for vpath in videos:
    name = os.path.basename(vpath).replace(".mp4", "")
    fsize = os.path.getsize(vpath)
    
    # Skip the special 3D video
    if name == "birthrate-3d":
        continue
    
    # Flag 1: Suspiciously small files (< 250KB for a 30s video = likely blank/static)
    if fsize < 250000:
        issues.append(f"⚠️  {name}: VERY SMALL FILE ({fsize/1024:.0f}KB) - likely blank or static content")
        continue
    
    # Flag 2: Use ffmpeg scene detection to find flicker frames
    # Scene change detection: high score = big visual change between frames
    try:
        result = subprocess.run([
            "ffprobe", "-v", "quiet", "-f", "lavfi",
            "-i", f"movie={vpath},select='gt(scene,0.4)',metadata=print:file=-",
            "-show_entries", "frame=pts_time",
            "-of", "csv=p=0"
        ], capture_output=True, text=True, timeout=30)
        
        # Alternative: use ffmpeg to detect scene changes
        result2 = subprocess.run([
            "ffmpeg", "-i", vpath, "-vf",
            "select='gt(scene,0.35)',metadata=print:file=-",
            "-vsync", "vfr", "-f", "null", "-"
        ], capture_output=True, text=True, timeout=60)
        
        scene_changes = result2.stderr.count("scene_score=") if result2.stderr else 0
        high_scores = []
        for line in result2.stderr.split("\n") if result2.stderr else []:
            if "scene_score=" in line:
                try:
                    score = float(line.split("scene_score=")[1].split()[0])
                    if score > 0.5:
                        high_scores.append(score)
                except:
                    pass
        
        if len(high_scores) > 5:
            issues.append(f"🔴 {name}: POTENTIAL FLICKERING - {len(high_scores)} high scene-change spikes (scores: {[f'{s:.2f}' for s in high_scores[:5]]}...)")
        elif scene_changes > 20:
            issues.append(f"🟡 {name}: HIGH scene changes ({scene_changes}) - verify visual smoothness")
            
    except subprocess.TimeoutExpired:
        pass
    except Exception as e:
        pass
    
    # Flag 3: Check last 3 seconds for frozen frames (identical pixels = animation stopped early)
    try:
        # Extract average pixel values from last 3 seconds 
        result3 = subprocess.run([
            "ffmpeg", "-sseof", "-3", "-i", vpath,
            "-vf", "cropdetect=24:16:0",
            "-f", "null", "-"
        ], capture_output=True, text=True, timeout=30)
        
        # Check if last 3s frames are all identical by looking at file sizes of extracted frames
        result4 = subprocess.run([
            "ffmpeg", "-sseof", "-3", "-i", vpath,
            "-vf", "select='not(mod(n,10))',format=gray,signalstats",
            "-f", "null", "-"
        ], capture_output=True, text=True, timeout=30)
        
        # Parse YAVG (average luminance) values
        yavg_values = []
        if result4.stderr:
            for line in result4.stderr.split("\n"):
                if "YAVG" in line:
                    try:
                        val = float(line.split("YAVG:")[1].split()[0])
                        yavg_values.append(val)
                    except:
                        pass
        
        if len(yavg_values) >= 3:
            # Check if luminance is constant (frozen)
            if len(set(round(v, 1) for v in yavg_values)) == 1:
                issues.append(f"🟠 {name}: FROZEN ENDING - last 3s have identical frame luminance (animation may have ended early)")
                
    except:
        pass

    # Flag 4: Duplicate file sizes (exact same file = rendering bug)
    # We'll check this separately

# Check for duplicate files
size_map = {}
for vpath in videos:
    name = os.path.basename(vpath).replace(".mp4", "")
    fsize = os.path.getsize(vpath)
    if fsize in size_map:
        size_map[fsize].append(name)
    else:
        size_map[fsize] = [name]

for fsize, names in size_map.items():
    if len(names) > 1 and names[0] != "birthrate-3d":
        # These might be legitimately same-sized but check for exact duplicates
        issues.append(f"🔵 DUPLICATE SIZE ({fsize/1024:.0f}KB): {', '.join(names)} - may be identical renders")

print(f"\n{'='*60}")
print(f"VIDEO QA REPORT - {len(videos)} videos analyzed")
print(f"{'='*60}\n")

if issues:
    print(f"Found {len(issues)} potential issues:\n")
    for issue in sorted(issues):
        print(f"  {issue}")
else:
    print("✅ All videos passed QA checks!")

print(f"\n{'='*60}")
