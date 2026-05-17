#!/usr/bin/env python3
"""
Google Maps Discovery Scraper for Nomad Directory
Discovers NEW places by searching Google Maps for nomad-specific queries
and appending high-quality results to nomad-data.json.

Usage:
  python3 scripts/gmaps-discover.py --city "Chiang Mai, Thailand" --category "coworking"
"""

import json
import asyncio
import argparse
import logging
import os
import time
import re
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Optional, List

from playwright.async_api import async_playwright, Page

DATA_PATH = Path(__file__).parent.parent / "src" / "lib" / "nomad-data.json"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%H:%M:%S'
)
log = logging.getLogger(__name__)

# Map search categories to our internal schema categories
CATEGORY_MAPPING = {
    "coliving": ["coliving space with coworking and food", "digital nomad coliving with restaurant"],
    "hostel": ["hostel with coworking and cafe", "digital nomad hostel with restaurant"],
}


async def scroll_to_bottom(page: Page, scrollable_selector: str, max_scrolls: int = 20) -> int:
    """Scrolls a specific container to the bottom to load all lazy-loaded results."""
    try:
        await page.wait_for_selector(scrollable_selector, timeout=10000)
    except Exception:
        log.warning(f"Could not find scrollable container: {scrollable_selector}")
        return 0

    previous_count = 0
    same_count_retries = 0

    for i in range(max_scrolls):
        # Count current loaded places
        current_count = await page.locator('a[href*="google.com/maps/place"]').count()
        log.info(f"Scroll {i+1}/{max_scrolls} - Loaded {current_count} places so far...")
        
        if current_count == previous_count:
            same_count_retries += 1
            if same_count_retries >= 3:
                # Check if "You've reached the end of the list." is visible
                end_text = page.locator('span:has-text("You\'ve reached the end of the list")')
                if await end_text.count() > 0:
                    log.info("Reached the end of the list.")
                    break
                log.info("No new items loaded after 3 retries, stopping scroll.")
                break
        else:
            same_count_retries = 0
            
        previous_count = current_count
        
        # Scroll the container down
        # Google Maps results list has role="feed"
        await page.evaluate(f'''
            const feed = document.querySelector('{scrollable_selector}');
            if (feed) feed.scrollTo(0, feed.scrollHeight);
        ''')
        
        await page.wait_for_timeout(2000)
        
    return current_count


async def extract_places_from_list(page: Page, city_name: str, internal_category: str) -> List[dict]:
    """Extract data from all loaded items in the search results list."""
    places = []
    
    # We will grab all the link cards
    links = page.locator('a[href*="google.com/maps/place"]')
    count = await links.count()
    
    log.info(f"Extracting data from {count} place cards...")
    
    for i in range(count):
        try:
            link = links.nth(i)
            url = await link.get_attribute('href')
            
            # The card is usually the parent of the parent of the link
            card = page.locator(f'(//a[contains(@href, "google.com/maps/place")])[{i+1}]/ancestor::div[contains(@class, "Nv2PK")]')
            
            if await card.count() == 0:
                continue
                
            card = card.first
            text_content = await card.inner_text()
            lines = [l.strip() for l in text_content.split('\n') if l.strip()]
            
            if not lines:
                continue
                
            name = lines[0]
            
            # Extract Rating and Review Count
            rating = None
            review_count = None
            for line in lines:
                m = re.match(r'^(\d\.\d)\s*\(([\d,]+)\)', line)
                if m:
                    rating = float(m.group(1))
                    review_count = int(m.group(2).replace(',', ''))
                    break
                    
            # Basic quality filter
            if not rating or rating < 4.0 or not review_count or review_count < 10:
                log.debug(f"Skipping {name} - low rating/reviews ({rating} / {review_count})")
                continue
                
            # Fallback coords from URL if present
            lat, lon = 0.0, 0.0
            coords_match = re.search(r'!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)', url)
            if coords_match:
                lat = float(coords_match.group(1))
                lon = float(coords_match.group(2))
            
            place_data = {
                "osm_id": f"gmap-{int(time.time()*1000)}-{i}",
                "name": name,
                "category": internal_category,
                "lat": lat,
                "lon": lon,
                "city": city_name.split(',')[0].strip(),
                "country": city_name.split(',')[-1].strip() if ',' in city_name else "",
                "address": "", # Hard to extract perfectly from list view
                "phone": "",
                "website": "",
                "opening_hours": "",
                "wifi": "yes" if internal_category in ["coworking", "cafe"] else "unknown",
                "quality": min(100, int((rating / 5.0) * 50 + min(50, review_count / 10))),
                "cost_tier": 2,
                "timezone": "UTC",
                "visa": "unknown",
                "osm_url": "",
                "google_rating": rating,
                "google_review_count": review_count,
                "google_maps_url": url.split('?')[0] if url else ""
            }
            places.append(place_data)
            
        except Exception as e:
            log.warning(f"Error extracting item {i}: {e}")
            
    return places


async def discover(city: str, category: str):
    """Main discovery workflow for a single city and category."""
    internal_cat = category.lower()
    if internal_cat not in CATEGORY_MAPPING:
        log.error(f"Category must be one of: {list(CATEGORY_MAPPING.keys())}")
        return
        
    search_term = CATEGORY_MAPPING[internal_cat][0]
    query = f"{search_term} in {city}"
    search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
    
    log.info(f"Starting discovery for: '{query}'")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--disable-dev-shm-usage', '--no-sandbox']
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            locale="en-US"
        )
        page = await context.new_page()
        
        try:
            await page.goto(search_url, timeout=20000, wait_until="domcontentloaded")
            await page.wait_for_timeout(3000)
            
            # Accept cookies if prompted
            accept = page.locator('button:has-text("Accept all")')
            if await accept.count() > 0:
                await accept.click()
                await page.wait_for_timeout(1000)
            
            # The scrollable results container in Google Maps is role="feed"
            log.info("Scrolling results to load all places...")
            await scroll_to_bottom(page, 'div[role="feed"]', max_scrolls=30)
            
            new_places = await extract_places_from_list(page, city, internal_cat)
            log.info(f"Extracted {len(new_places)} high-quality places from results.")
            
            if new_places:
                # Merge into existing data
                with open(DATA_PATH, 'r') as f:
                    data = json.load(f)
                    
                # Prevent duplicates by checking name + city combination
                existing_keys = {f"{p['name'].lower()}-{p['city'].lower()}" for p in data}
                
                added_count = 0
                for place in new_places:
                    key = f"{place['name'].lower()}-{place['city'].lower()}"
                    if key not in existing_keys:
                        data.append(place)
                        existing_keys.add(key)
                        added_count += 1
                        
                if added_count > 0:
                    with open(DATA_PATH, 'w') as f:
                        json.dump(data, f, separators=(',', ':'))
                    log.info(f"Successfully added {added_count} NEW places to nomad-data.json!")
                else:
                    log.info("All extracted places were already in the database.")
                    
        except Exception as e:
            log.error(f"Discovery failed: {e}")
        finally:
            await browser.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Discover new places via Google Maps')
    parser.add_argument('--city', type=str, required=True, help='City to search in (e.g. "Chiang Mai, Thailand")')
    parser.add_argument('--category', type=str, required=True, choices=list(CATEGORY_MAPPING.keys()), help='Category to search')
    
    args = parser.parse_args()
    asyncio.run(discover(args.city, args.category))
