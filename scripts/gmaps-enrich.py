#!/usr/bin/env python3
"""
Google Maps Enrichment Script for Nomad Directory
Scrapes ratings and review counts from Google Maps for all POIs in nomad-data.json.
Uses parallel headless Playwright workers for maximum throughput.

Usage:
  python3 scripts/gmaps-enrich.py [--workers 20] [--city "Chiang Mai"] [--limit 100]
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

from playwright.async_api import async_playwright, Page, Browser, BrowserContext

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
    osm_id: int = 0
    google_rating: Optional[float] = None
    google_review_count: Optional[int] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    google_url: Optional[str] = None
    reviews: List[str] = field(default_factory=list)
    matched: bool = False


async def scrape_place(page: Page, name: str, city: str, category: str) -> GMapsResult:
    """Scrape rating and reviews for a single place from Google Maps."""
    result = GMapsResult()

    # Clean city name for search (remove parenthetical)
    clean_city = re.sub(r'\s*\(.*?\)', '', city)
    query = f"{name} {clean_city}"
    search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"

    try:
        await page.goto(search_url, timeout=12000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2500)

        # If we got a results list, click the first result
        first_link = page.locator('a[href*="google.com/maps/place"]').first
        if await first_link.count() > 0:
            try:
                await first_link.click()
                await page.wait_for_timeout(2000)
            except Exception:
                pass

        # Extract body text for parsing
        body = await page.inner_text('body')
        lines = [l.strip() for l in body.split('\n') if l.strip()]

        # --- Extract rating ---
        # Method 1: Find a standalone "X.Y" pattern in the first 60 lines
        first_word = name.split()[0].lower() if name else ""
        found_name = False
        for i, line in enumerate(lines[:80]):
            if first_word and first_word in line.lower() and len(line) < 120:
                found_name = True
                continue
            if found_name and re.match(r'^\d\.\d$', line):
                result.google_rating = float(line)
                break

        # Method 2: aria-label fallback
        if not result.google_rating:
            stars_els = page.locator('[aria-label*="stars"]')
            for j in range(min(await stars_els.count(), 3)):
                label = await stars_els.nth(j).get_attribute('aria-label') or ''
                m = re.match(r'([\d.]+)\s*stars?', label.strip())
                if m:
                    result.google_rating = float(m.group(1))
                    break

        # --- Extract review count ---
        # Look for parenthesized numbers like (1,234) in body near the top
        parens = re.findall(r'\(([\d,]+)\)', body[:4000])
        for p_match in parens:
            try:
                num = int(p_match.replace(',', ''))
                if 1 < num < 500000:
                    result.google_review_count = num
                    break
            except Exception:
                pass

        # Also check aria-labels for review counts
        if not result.google_review_count:
            review_els = page.locator('[aria-label*="reviews"]')
            for j in range(min(await review_els.count(), 3)):
                label = await review_els.nth(j).get_attribute('aria-label') or ''
                m = re.search(r'([\d,]+)\s*reviews?', label)
                if m:
                    result.google_review_count = int(m.group(1).replace(',', ''))
                    break

        if result.google_rating:
            result.matched = True
            
            # Save the resolved Google Maps URL
            result.google_url = page.url
            
            # Try to extract website
            try:
                web_el = page.locator('[data-item-id="authority"]')
                if await web_el.count() > 0:
                    text = await web_el.first.inner_text()
                    if text and '.' in text:
                        result.website = text.strip()
            except Exception:
                pass
                
            # Try to extract phone
            try:
                phone_el = page.locator('[data-item-id*="phone:tel:"]')
                if await phone_el.count() > 0:
                    text = await phone_el.first.inner_text()
                    if text and any(c.isdigit() for c in text):
                        result.phone = text.strip()
            except Exception:
                pass

        # --- Extract review snippets ---
        if result.matched:
            try:
                # Try clicking the reviews tab
                reviews_btn = page.locator('button[aria-label*="review"], button:has-text("Reviews")').first
                if await reviews_btn.count() > 0:
                    await reviews_btn.click()
                    await page.wait_for_timeout(1500)

                    # Try multiple selectors for review text
                    for sel in ['span.wiI7pd', '.MyEned span', '[data-review-id] span']:
                        review_els = page.locator(sel)
                        count = min(await review_els.count(), 5)
                        if count > 0:
                            for i in range(count):
                                try:
                                    text = await review_els.nth(i).inner_text()
                                    if text and len(text) > 20:
                                        result.reviews.append(text[:300])
                                except Exception:
                                    pass
                            if result.reviews:
                                break
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
    """Worker coroutine that processes places from the shared queue."""
    context = await browser.new_context(
        viewport={"width": 1280, "height": 720},
        locale="en-US",
        user_agent=(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/131.0.0.0 Safari/537.36"
        ),
    )
    page = await context.new_page()

    # Accept consent on first load
    try:
        await page.goto("https://www.google.com/maps", timeout=15000)
        await page.wait_for_timeout(1000)
        accept = page.locator('button:has-text("Accept all")')
        if await accept.count() > 0:
            await accept.click()
            await page.wait_for_timeout(500)
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
                'website': result.website,
                'phone': result.phone,
                'google_url': result.google_url,
                'reviews': result.reviews,
            }

        processed += 1
        progress['done'] += 1
        done = progress['done']
        matched = len(results)

        if done % 20 == 0 or result.matched:
            status = f"★ {result.google_rating}" if result.matched else "✗"
            log.info(
                f"[W{worker_id:02d}] {done}/{total} ({done*100//total}%) | "
                f"Matched: {matched} ({matched*100//max(done,1)}%) | "
                f"{status} {name[:35]}"
            )

        # Checkpoint every 100 results
        if done % 100 == 0:
            save_checkpoint(results, progress['done'])

        queue.task_done()

    await context.close()
    log.info(f"[W{worker_id:02d}] Finished. Processed {processed} places.")


def save_checkpoint(results: dict, done: int):
    """Save progress checkpoint to disk."""
    checkpoint = {
        'done': done,
        'results': {str(k): v for k, v in results.items()},
        'timestamp': time.time(),
    }
    with open(CHECKPOINT_PATH, 'w') as f:
        json.dump(checkpoint, f)
    log.info(f"Checkpoint saved: {len(results)} matches / {done} processed")


def load_checkpoint() -> tuple[dict, set]:
    """Load previous checkpoint if exists."""
    if CHECKPOINT_PATH.exists():
        with open(CHECKPOINT_PATH) as f:
            data = json.load(f)
        results = {str(k): v for k, v in data.get('results', {}).items()}
        log.info(f"Resumed checkpoint: {len(results)} matches from previous run")
        return results, set(results.keys())
    return {}, set()


def generate_review_summary(reviews: List[str]) -> str:
    """Generate a concise summary from review snippets using extractive approach."""
    if not reviews:
        return ""

    all_text = " ".join(reviews)
    sentences = re.split(r'[.!?]+', all_text)
    sentences = [s.strip() for s in sentences if 15 < len(s.strip()) < 150]

    if not sentences:
        return ""

    sentiment_keywords = [
        'great', 'excellent', 'amazing', 'perfect', 'beautiful',
        'clean', 'friendly', 'comfortable', 'cozy', 'nice',
        'wifi', 'location', 'staff', 'quiet', 'workspace',
        'noisy', 'dirty', 'expensive', 'slow', 'crowded',
        'recommend', 'love', 'best', 'worst', 'avoid',
        'helpful', 'spacious', 'central', 'modern', 'view',
    ]

    scored = []
    for s in sentences:
        score = sum(1 for kw in sentiment_keywords if kw in s.lower())
        scored.append((score, s))

    scored.sort(key=lambda x: -x[0])
    best = scored[0][1].strip()
    if not best.endswith('.'):
        best += '.'

    return best


async def main():
    parser = argparse.ArgumentParser(description='Enrich nomad data with Google Maps ratings')
    parser.add_argument('--workers', type=int, default=20, help='Parallel browser workers (default: 20)')
    parser.add_argument('--city', type=str, help='Only process a specific city')
    parser.add_argument('--reset', action='store_true', help='Reset checkpoint, start fresh')
    parser.add_argument('--limit', type=int, help='Max number of places to process')
    args = parser.parse_args()

    with open(DATA_PATH) as f:
        data = json.load(f)

    log.info(f"Loaded {len(data)} places from nomad-data.json")

    if args.city:
        pool = [d for d in data if d['city'] == args.city]
        log.info(f"Filtered to {len(pool)} places in {args.city}")
    else:
        pool = data

    if args.reset and CHECKPOINT_PATH.exists():
        CHECKPOINT_PATH.unlink()
        log.info("Checkpoint reset")

    results, done_ids = load_checkpoint()
    remaining = [d for d in pool if d['osm_id'] not in done_ids]

    if args.limit:
        remaining = remaining[:args.limit]

    log.info(f"Remaining: {len(remaining)} places | Workers: {args.workers}")

    if remaining:
        queue: asyncio.Queue = asyncio.Queue()
        for item in remaining:
            await queue.put(item)

        progress = {'done': len(done_ids)}
        total = len(done_ids) + len(remaining)

        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    '--disable-dev-shm-usage',
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-extensions',
                    '--disable-background-networking',
                ],
            )

            num_workers = min(args.workers, len(remaining))
            log.info(f"Launching {num_workers} parallel browser tabs...")

            tasks = [
                asyncio.create_task(
                    worker(i, browser, queue, results, progress, total)
                )
                for i in range(num_workers)
            ]

            await asyncio.gather(*tasks)
            await browser.close()

    save_checkpoint(results, len(done_ids) + len(remaining))

    # Merge back into data
    enriched = 0
    for poi in data:
        r = results.get(poi['osm_id'])
        if r:
            poi['google_rating'] = r.get('google_rating')
            poi['google_review_count'] = r.get('google_review_count')
            
            # Enrich missing fields
            if r.get('website') and not poi.get('website'):
                poi['website'] = r.get('website')
            if r.get('phone') and not poi.get('phone'):
                poi['phone'] = r.get('phone')
            if r.get('google_url'):
                poi['google_maps_url'] = r.get('google_url')
                
            reviews = r.get('reviews', [])
            if reviews:
                poi['review_summary'] = generate_review_summary(reviews)
            enriched += 1

    with open(DATA_PATH, 'w') as f:
        json.dump(data, f, separators=(',', ':'))

    log.info(f"\n{'='*60}")
    log.info(f"ENRICHMENT COMPLETE")
    log.info(f"{'='*60}")
    log.info(f"Total: {len(data)} | Enriched: {enriched} | Rate: {enriched*100//len(data)}%")
    log.info(f"Saved to {DATA_PATH}")


if __name__ == '__main__':
    asyncio.run(main())
