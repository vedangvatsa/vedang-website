import json
import subprocess
import os
import asyncio

json_path = '/Users/vedang/vedang-website/scripts/linkedin-posts.json'
with open(json_path, 'r') as f:
    data = json.load(f)

# Find the 10 rewritten posts
posts = data[-10:]
out_dir = '/Users/vedang/vedang-website/scripts/thread-assets/linkedin-rewrites/audio'
os.makedirs(out_dir, exist_ok=True)

# Generate audio for the first one as a test
post = posts[0]
text = post['text'].replace('\n', ' ')

# Edge-tts command: en-US-ChristopherNeural is a good male voice
# We'll run edge-tts via subprocess
out_file = os.path.join(out_dir, 'post_1.mp3')
print(f"Generating TTS for post 1...")
subprocess.run([
    'python3', '-m', 'edge_tts', 
    '--voice', 'en-US-ChristopherNeural', 
    '--text', text,
    '--write-media', out_file
])
print(f"Generated {out_file}")

