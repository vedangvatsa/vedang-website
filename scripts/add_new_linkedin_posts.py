import json
import os
import re
from datetime import datetime, timedelta

# Read the artifact text
with open('/Users/vedang/.gemini/antigravity/brain/9e801190-e577-499f-9dba-6525f80853b3/linkedin_rewrites.md', 'r') as f:
    text = f.read()

# Extract the 10 posts
posts = []
parts = text.split("### Post ")[1:]
for part in parts:
    lines = part.strip().split('\n')
    title_line = lines[0]
    
    # Text is everything else, ignoring formatting hints like **[Format: Post with Video Only]**
    content_lines = []
    for line in lines[1:]:
        if not line.startswith('**[Format:'):
            content_lines.append(line)
    
    posts.append('\n'.join(content_lines).strip())

# Read the existing JSON
json_path = '/Users/vedang/vedang-website/scripts/linkedin-posts.json'
with open(json_path, 'r') as f:
    data = json.load(f)

# Find the latest scheduled date
latest_date = datetime.strptime("2026-05-08", "%Y-%m-%d")

# Extensions mapping based on the download script output
# Posts 1, 2, 5, 6, 7, 8, 9, 10 are videos (.mp4)
# Posts 3, 4 are images (.png)
media_types = {
    1: 'mp4',
    2: 'mp4',
    3: 'png',
    4: 'png',
    5: 'mp4',
    6: 'mp4',
    7: 'mp4',
    8: 'mp4',
    9: 'mp4',
    10: 'mp4'
}

for i, post_text in enumerate(posts):
    post_index = i + 1
    media_path = f"scripts/thread-assets/linkedin-rewrites/post_{post_index}.{media_types[post_index]}"
    
    # Schedule one per day
    sched_date = (latest_date + timedelta(days=i+1)).strftime("%Y-%m-%d")
    
    new_post = {
        "id": f"rewritten-post-{post_index}",
        "scheduleDate": sched_date,
        "scheduleTime": "09:00",
        "posted": False,
        "image": media_path,
        "text": post_text
    }
    data.append(new_post)

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Added 10 new posts to linkedin-posts.json")
