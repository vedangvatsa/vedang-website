import json
import os
import shutil

topic = {
    "slug": "doppler_effect",
    "title": "The Doppler Effect and Wavefronts",
    "yt_title": "The Doppler Effect and Wavefronts | Math Explained",
    "date": "2026-12-08",
    "time": "17:00",
    "text": "Visualizing the Doppler effect through moving wavefront geometry. When a wave source travels at steady velocity, emitted spherical wavefronts bunch together ahead to shorten wavelength and increase frequency, while stretching apart behind."
}

# 1. Sync assets
ratios = ["9x16", "1x1", "4x5", "16x9"]
src_base = "/Users/vedang/Projects/data-viz-videos/explainer_videos/rendered_videos"
dest_video_base = "/Users/vedang/ZCodeProject/vedang-website/scripts/viz-assets/videos/explainer_videos"
dest_preview_base = "/Users/vedang/ZCodeProject/vedang-website/scripts/viz-assets/previews/explainer_videos"

slug = topic["slug"]
for r in ratios:
    src_mp4 = f"{src_base}/{r}/{slug}_{r}.mp4"
    dest_mp4 = f"{dest_video_base}/{r}/{slug}_{r}.mp4"
    os.makedirs(os.path.dirname(dest_mp4), exist_ok=True)
    if os.path.exists(src_mp4):
        shutil.copy2(src_mp4, dest_mp4)
        print(f"Copied {src_mp4} -> {dest_mp4}")
    preview_file = f"{slug}_{r}.png"
    src_preview = f"/Users/vedang/ZCodeProject/vedang-website/scripts/viz-assets/{preview_file}"
    dest_preview = f"{dest_preview_base}/{preview_file}"
    os.makedirs(os.path.dirname(dest_preview), exist_ok=True)
    if os.path.exists(src_preview):
        shutil.copy2(src_preview, dest_preview)
        print(f"Copied {src_preview} -> {dest_preview}")

# 2. Append to queues
platforms = [
    {"name": "youtube", "prefix": "explainer-yt-", "ratio": "9x16", "is_yt": True},
    {"name": "instagram", "prefix": "explainer-ig-", "ratio": "9x16", "is_yt": False},
    {"name": "tiktok", "prefix": "explainer-tiktok-", "ratio": "9x16", "is_yt": False},
    {"name": "linkedin", "prefix": "explainer-linkedin-", "ratio": "4x5", "is_yt": False},
    {"name": "x", "prefix": "explainer-x-", "ratio": "1x1", "is_yt": False},
    {"name": "threads", "prefix": "explainer-threads-", "ratio": "1x1", "is_yt": False},
    {"name": "facebook", "prefix": "explainer-fb-", "ratio": "4x5", "is_yt": False},
    {"name": "bluesky", "prefix": "explainer-bsky-", "ratio": "1x1", "is_yt": False}
]

for p in platforms:
    p_name = p["name"]
    path = f"/Users/vedang/ZCodeProject/vedang-website/scripts/viz-{p_name}-posts.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    post_id = f"{p['prefix']}{slug}"
    if any(item.get("id") == post_id for item in data):
        print(f"Skipping {p_name}, {post_id} already exists")
        continue

    ratio = p["ratio"]
    video = f"scripts/viz-assets/videos/explainer_videos/{ratio}/{slug}_{ratio}.mp4"
    thumb = f"scripts/viz-assets/previews/explainer_videos/{slug}_{ratio}.png"
    
    if p["is_yt"]:
        entry = {
            "id": post_id,
            "batchId": "explainer-v1",
            "slug": slug,
            "video": video,
            "thumbnail": thumb,
            "title": topic["yt_title"],
            "scheduleDate": topic["date"],
            "scheduleTime": topic["time"],
            "posted": False,
            "postedAt": None,
            "description": topic["text"],
            "tags": []
        }
    else:
        entry = {
            "id": post_id,
            "batchId": "explainer-v1",
            "slug": slug,
            "video": video,
            "thumbnail": thumb,
            "title": topic["title"],
            "scheduleDate": topic["date"],
            "scheduleTime": topic["time"],
            "posted": False,
            "postedAt": None,
            "text": topic["text"]
        }
    data.append(entry)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Added to {p_name}: {len(data)} entries")
