import os
import json
import urllib.request
import re
import html
import time
import subprocess

json_path = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd/scratch/top_100_source.json'
brain_dir = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd'
assets_dir = '/Users/vedang/.gemini/antigravity/scratch/vedang-website/scripts/linkedin-assets/clean'

os.makedirs(assets_dir, exist_ok=True)

def download_image(url, dest_path):
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'}
    )
    with urllib.request.urlopen(req) as response:
        with open(dest_path, 'wb') as f:
            f.write(response.read())

def fetch_with_backoff(url, retries=3):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response:
                return response.read().decode('utf-8')
        except urllib.error.HTTPError as e:
            if e.code == 429:
                sleep_time = 45 * (attempt + 1)
                print(f"  Hit 429 (Too Many Requests). Attempt {attempt + 1}/{retries}. Sleeping {sleep_time}s...")
                time.sleep(sleep_time)
            else:
                raise e
        except Exception as e:
            if attempt == retries - 1:
                raise e
            time.sleep(5)
    raise Exception("Max retries exceeded for 429 block")

def scrape_and_download_all():
    with open(json_path, 'r') as f:
        posts = json.load(f)
    
    print(f"Loaded {len(posts)} posts from JSON.")
    
    for idx, post in enumerate(posts):
        image_name = f"li-viral-image-{idx + 1}.jpg"
        brain_path = os.path.join(brain_dir, image_name)
        assets_path = os.path.join(assets_dir, image_name)
        
        # Check if already downloaded
        if os.path.exists(brain_path) and os.path.getsize(brain_path) > 1000:
            if not os.path.exists(assets_path):
                import shutil
                shutil.copyfile(brain_path, assets_path)
            continue
            
        print(f"[{idx + 1}/100] Scraping: {post['post_url']}")
        try:
            html_content = fetch_with_backoff(post['post_url'])
            
            # Regex to find og:image content
            match = re.search(r'<meta[^>]*property="og:image"[^>]*content="([^"]+)"', html_content)
            if not match:
                match = re.search(r'content="([^"]+)"[^>]*property="og:image"', html_content)
                
            if match:
                img_url = html.unescape(match.group(1))
                print(f"  Found image URL: {img_url[:100]}...")
                download_image(img_url, brain_path)
                import shutil
                shutil.copyfile(brain_path, assets_path)
                print(f"  Downloaded & Saved: {image_name}")
                
                # Regenerate drafts markdown so it's live updated
                subprocess.run(["node", "/Users/vedang/.gemini/antigravity/scratch/vedang-website/scripts/generate-drafts-md.mjs"])
            else:
                print("  og:image meta tag not found on page.")
                
            time.sleep(3.0)  # Politeness delay between successful posts
            
        except Exception as e:
            print(f"  Failed to scrape {post['post_url']}: {e}")
            time.sleep(5.0)

    print("Scraping finished. Final regeneration of drafts markdown...")
    subprocess.run(["node", "/Users/vedang/.gemini/antigravity/scratch/vedang-website/scripts/generate-drafts-md.mjs"])

if __name__ == "__main__":
    scrape_and_download_all()
