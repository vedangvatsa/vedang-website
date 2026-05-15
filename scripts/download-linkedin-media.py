import subprocess
import os
import requests
from bs4 import BeautifulSoup

urls = {
    "1": "https://www.linkedin.com/feed/update/urn:li:activity:7374306676243537920/",
    "2": "https://www.linkedin.com/feed/update/urn:li:activity:7393605305076670464/",
    "3": "https://www.linkedin.com/feed/update/urn:li:activity:7394479906002395137/",
    "4": "https://www.linkedin.com/feed/update/urn:li:activity:7434857507778457601/",
    "5": "https://www.linkedin.com/feed/update/urn:li:activity:7393287535172628481/",
    "6": "https://www.linkedin.com/feed/update/urn:li:activity:7338267091508129793/",
    "7": "https://www.linkedin.com/feed/update/urn:li:activity:7366658301700263940/",
    "8": "https://www.linkedin.com/feed/update/urn:li:activity:7365933565710098432/",
    "9": "https://www.linkedin.com/feed/update/urn:li:activity:7401008878903033860/",
    "10": "https://www.linkedin.com/feed/update/urn:li:activity:7388884770392457216/"
}

out_dir = "/Users/vedang/vedang-website/scripts/thread-assets/linkedin-rewrites"
os.makedirs(out_dir, exist_ok=True)

for i, url in urls.items():
    print(f"Downloading media for post {i}...")
    try:
        # Try yt-dlp first for video
        res = subprocess.run(["yt-dlp", "-o", f"{out_dir}/post_{i}.%(ext)s", url], capture_output=True)
        if res.returncode == 0:
            print(f"Post {i} downloaded as video.")
            continue
        
        # If yt-dlp fails, it's an image. Scrape OG image.
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        html = requests.get(url, headers=headers).text
        soup = BeautifulSoup(html, 'html.parser')
        og_img = soup.find("meta", property="og:image")
        if og_img and og_img.get("content"):
            img_url = og_img.get("content")
            print(f"Post {i} is an image. Fetching from {img_url}...")
            img_data = requests.get(img_url).content
            with open(f"{out_dir}/post_{i}.png", 'wb') as f:
                f.write(img_data)
        else:
            print(f"Post {i}: Could not find video or image.")
            
    except Exception as e:
        print(f"Error on post {i}: {e}")

