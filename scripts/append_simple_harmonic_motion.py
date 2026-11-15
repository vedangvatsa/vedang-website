import json

topic = {
    "slug": "simple_harmonic_motion",
    "title": "Simple Harmonic Motion and Circular Motion",
    "yt_title": "Simple Harmonic Motion and Circular Motion | Math Explained",
    "date": "2026-12-08",
    "time": "01:00",
    "text": "Visualizing simple harmonic motion as the one-dimensional projection of uniform circular motion. The oscillating position of a mass on a spring matches the horizontal cosine projection of an object rotating at constant angular frequency."
}

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
    
    post_id = f"{p['prefix']}{topic['slug']}"
    if any(item.get("id") == post_id for item in data):
        print(f"Skipping {p_name}, {post_id} already exists")
        continue

    ratio = p["ratio"]
    slug = topic["slug"]
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
