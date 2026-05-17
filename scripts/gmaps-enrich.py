#!/usr/bin/env python3
"""
Google Maps Enrichment Script for Nomad Directory
Scrapes ratings, review counts, and review snippets from Google Maps
for all POIs in nomad-data.json using parallel Playwright workers.

Usage:
  python3 scripts/gmaps-enrich.py [--workers 20] [--city "Chiang Mai"]
"""

import json
import asyncio
import argparse
import logging
import os
import time
import re
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional, List

# Try to import playwright
try:
    from playwright.async_api import async_playwright, Page, Browser
except ImportError:
    print("Installing playwright...")
    os.system("pip3 install playwright")
    os.system("python3 -m playwright install chromium")
    from playwright.async_api import async_playwright, Page, Browser

DATA_PATH = Path(__file__).parent.parent / "src" / "lib" / "nomad-data.json"
CHECKPOINT_PATH = Path(__file__).parent / ".gmaps-checkpoint.json"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%H:%M:%S'
)
log = logging.getLogger(__name__)


@dataclass
class GMapsResult:
    osm_id: int
    google_rating: Optional[float] = None
    google_review_count: Optional[int] = None
    reviews: List[str] = field(default_factory=list)
    matched: bool = False


async def scrape_place(page: Page, name: str, city: str, category: str) -> GMapsResult:
    """Scrape a single place from Google Maps."""
    result = GMapsResult(osm_id=0)
    
    # Build search query - be specific
    query = f"{name} {city} {category}"
    search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
    
    try:
        await page.goto(search_url, timeout=15000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)
        
        # Check if we landed directly on a place page or a results list
        # Try to find the place details panel
        try:
            # Wait for either the place name or the results list
            await page.wait_for_selector(
                '//div[@class="TIHn2 "]//h1[@class="DUwDvf lfPIob"], //div[@role="feed"]',
                timeout=8000
            )
        except Exception:
            return result
        
        # If we got a list, click the first result
        first_result = page.locator('//a[contains(@href, "https://www.google.com/maps/place")]').first
        if await first_result.count() > 0:
            try:
                await first_result.click()
                await page.wait_for_timeout(2000)
            except Exception:
                pass

        # Extract rating
        try:
            rating_el = page.locator('//div[@class="TIHn2 "]//div[@class="fontBodyMedium dmRWX"]//div//span[@aria-hidden]')
            if await rating_el.count() > 0:
                rating_text = await rating_el.inner_text()
                rating_text = rating_text.replace(' ', '').replace(',', '.')
                result.google_rating = float(rating_text)
        except Exception:
            pass
        
        # Extract review count
        try:
            count_el = page.locator('//div[@class="TIHn2 "]//div[@class="fontBodyMedium dmRWX"]//div//span//span//span[@aria-label]')
            if await count_el.count() > 0:
                count_text = await count_el.inner_text()
                count_text = count_text.replace('\xa0', '').replace('(', '').replace(')', '').replace(',', '').replace('.', '')
                result.google_review_count = int(count_text)
        except Exception:
            pass

        # Try to get review snippets (scroll to reviews section)
        if result.google_rating:
            result.matched = True
            try:
                # Click on reviews tab/button
                reviews_btn = page.locator('//button[contains(@aria-label, "review")]').first
                if await reviews_btn.count() > 0:
                    await reviews_btn.click()
                    await page.wait_for_timeout(1500)
                    
                    # Extract visible review texts
                    review_elements = page.locator('//div[@class="MyEned"]//span[@class="wiI7pd"]')
                    count = min(await review_elements.count(), 5)
                    for i in range(count):
                        try:
                            text = await review_elements.nth(i).inner_text()
                            if text and len(text) > 20:
                                result.reviews.append(text[:300])
                        except Exception:
                            pass
            except Exception:
                pass

    except Exception as e:
        log.debug(f"Error scraping {name}: {e}")
    
    return result


async def worker(
    worker_id: int,
    browser: Browser,
    queue: asyncio.Queue,
    results: dict,
    progress: dict,
    total: int,
):
    """Worker that processes places from the queue."""
    context = await browser.new_context(
        viewport={"width": 1280, "height": 720},
        locale="en-US",
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    )
    page = await context.new_page()
    
    # Accept cookies on first load
    try:
        await page.goto("https://www.google.com/maps", timeout=15000)
        await page.wait_for_timeout(1000)
        # Try to accept cookies consent
        try:
            accept_btn = page.locator('//button[contains(., "Accept all")]')
            if await accept_btn.count() > 0:
                await accept_btn.click()
                await page.wait_for_timeout(500)
        except Exception:
            pass
    except Exception:
        pass

    processed = 0
    while True:
        try:
            item = queue.get_nowait()
        except asyncio.QueueEmpty:
            break
        
        osm_id = item['osm_id']
        name = item['name']
        city = item['city']
        category = item['category']
        
        result = await scrape_place(page, name, city, category)
        result.osm_id = osm_id
        
        if result.matched:
            results[osm_id] = {
                'google_rating': result.google_rating,
                'google_review_count': result.google_review_count,
                'reviews': result.reviews,
            }
        
        processed += 1
        progress['done'] += 1
        done = progress['done']
        matched = len(results)
        
        if done % 10 == 0 or result.matched:
            status = f"★ {result.google_rating}" if result.matched else "✗"
            log.info(
                f"[W{worker_id:02d}] {done}/{total} ({done*100//total}%) | "
                f"Matched: {matched} | {status} {name[:40]}"
            )
        
        # Checkpoint every 50 results
        if done % 50 == 0:
            save_checkpoint(results, progress['done'])
        
        queue.task_done()
    
    await context.close()
    log.info(f"[W{worker_id:02d}] Done. Processed {processed} places.")


def save_checkpoint(results: dict, done: int):
    """Save progress checkpoint."""
    checkpoint = {
        'done': done,
        'results': results,
        'timestamp': time.time(),
    }
    with open(CHECKPOINT_PATH, 'w') as f:
        json.dump(checkpoint, f)


def load_checkpoint() -> tuple[dict, set]:
    """Load previous checkpoint if exists."""
    if CHECKPOINT_PATH.exists():
        with open(CHECKPOINT_PATH) as f:
            data = json.load(f)
        results = data.get('results', {})
        # Convert string keys back to int
        results = {int(k): v for k, v in results.items()}
        done_ids = set(results.keys())
        log.info(f"Loaded checkpoint: {len(results)} results from previous run")
        return results, done_ids
    return {}, set()


def generate_ai_summary(reviews: List[str]) -> str:
    """Generate a concise summary from review snippets.
    Uses a simple extractive approach (no API needed).
    """
    if not reviews:
        return ""
    
    # Combine and extract key sentiment phrases
    all_text = " ".join(reviews)
    
    # Simple extractive: pick the most informative short sentence
    sentences = re.split(r'[.!?]+', all_text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 15 and len(s.strip()) < 150]
    
    if not sentences:
        return ""
    
    # Prefer sentences with sentiment keywords
    sentiment_keywords = ['great', 'excellent', 'amazing', 'perfect', 'beautiful', 
                         'clean', 'friendly', 'comfortable', 'cozy', 'nice',
                         'wifi', 'location', 'staff', 'quiet', 'workspace',
                         'noisy', 'dirty', 'expensive', 'slow', 'crowded',
                         'recommend', 'love', 'best', 'worst', 'avoid']
    
    scored = []
    for s in sentences:
        score = sum(1 for kw in sentiment_keywords if kw in s.lower())
        scored.append((score, s))
    
    scored.sort(key=lambda x: -x[0])
    
    # Return the most informative sentence
    best = scored[0][1] if scored else sentences[0]
    
    # Clean up
    best = best.strip()
    if not best.endswith('.'):
        best += '.'
    
    return best


async def main():
    parser = argparse.ArgumentParser(description='Enrich nomad data with Google Maps reviews')
    parser.add_argument('--workers', type=int, default=20, help='Number of parallel workers (default: 20)')
    parser.add_argument('--city', type=str, help='Only process a specific city')
    parser.add_argument('--reset', action='store_true', help='Reset checkpoint and start fresh')
    parser.add_argument('--limit', type=int, help='Limit number of places to process')
    args = parser.parse_args()

    # Load data
    with open(DATA_PATH) as f:
        data = json.load(f)
    
    log.info(f"Loaded {len(data)} places from nomad-data.json")

    # Filter by city if specified
    if args.city:
        data_to_process = [d for d in data if d['city'] == args.city]
        log.info(f"Filtered to {len(data_to_process)} places in {args.city}")
    else:
        data_to_process = data

    # Load checkpoint
    if args.reset and CHECKPOINT_PATH.exists():
        CHECKPOINT_PATH.unlink()
        log.info("Checkpoint reset")
    
    results, done_ids = load_checkpoint()
    
    # Filter out already-processed items
    remaining = [d for d in data_to_process if d['osm_id'] not in done_ids]
    
    if args.limit:
        remaining = remaining[:args.limit]
    
    log.info(f"Processing {len(remaining)} remaining places with {args.workers} workers")
    
    if not remaining:
        log.info("All places already processed!")
    else:
        # Create queue
        queue = asyncio.Queue()
        for item in remaining:
            await queue.put(item)
        
        progress = {'done': len(done_ids)}
        total = len(done_ids) + len(remaining)
        
        # Launch browser and workers
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    '--disable-dev-shm-usage',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-gpu',
                    '--disable-extensions',
                    '--disable-background-networking',
                ],
            )
            
            # Create workers
            num_workers = min(args.workers, len(remaining))
            log.info(f"Launching {num_workers} parallel browser workers...")
            
            workers = [
                asyncio.create_task(
                    worker(i, browser, queue, results, progress, total)
                )
                for i in range(num_workers)
            ]
            
            await asyncio.gather(*workers)
            await browser.close()
    
    # Save final checkpoint
    save_checkpoint(results, len(results))
    
    # Merge results back into data
    enriched_count = 0
    for poi in data:
        osm_id = poi['osm_id']
        if osm_id in results:
            r = results[osm_id]
            poi['google_rating'] = r.get('google_rating')
            poi['google_review_count'] = r.get('google_review_count')
            
            # Generate AI summary from reviews
            reviews = r.get('reviews', [])
            if reviews:
                poi['review_summary'] = generate_ai_summary(reviews)
            
            enriched_count += 1
    
    # Save enriched data
    with open(DATA_PATH, 'w') as f:
        json.dump(data, f, separators=(',', ':'))
    
    log.info(f"\n{'='*60}")
    log.info(f"ENRICHMENT COMPLETE")
    log.info(f"{'='*60}")
    log.info(f"Total places: {len(data)}")
    log.info(f"Enriched with Google data: {enriched_count}")
    log.info(f"Match rate: {enriched_count*100//len(data)}%")
    log.info(f"Saved to {DATA_PATH}")


if __name__ == '__main__':
    asyncio.run(main())
