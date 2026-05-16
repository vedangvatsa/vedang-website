#!/usr/bin/env python3
"""
Digital Nomad Directory - OSM Data Pipeline
Fetches coworking spaces, coliving, hostels, and wifi-cafes globally
from OpenStreetMap via the Overpass API (free, no API key needed).

Usage:
    python fetch_osm_data.py                    # Fetch all cities
    python fetch_osm_data.py --city "Bangkok"   # Fetch a single city
    python fetch_osm_data.py --region asia      # Fetch a region
"""

import json
import csv
import time
import ssl
import argparse
import sys
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from datetime import datetime

# macOS Python often has SSL cert issues with urllib
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Top digital nomad cities with bounding boxes [south, west, north, east]
CITIES = {
    # Southeast Asia
    "Bangkok": {"bbox": [13.5, 100.3, 13.95, 100.8], "country": "Thailand", "region": "asia"},
    "Chiang Mai": {"bbox": [18.7, 98.9, 18.85, 99.05], "country": "Thailand", "region": "asia"},
    "Phuket": {"bbox": [7.8, 98.25, 7.95, 98.42], "country": "Thailand", "region": "asia"},
    "Bali (Canggu/Ubud)": {"bbox": [-8.7, 115.1, -8.3, 115.5], "country": "Indonesia", "region": "asia"},
    "Ho Chi Minh City": {"bbox": [10.7, 106.55, 10.9, 106.85], "country": "Vietnam", "region": "asia"},
    "Hanoi": {"bbox": [20.98, 105.78, 21.08, 105.88], "country": "Vietnam", "region": "asia"},
    "Kuala Lumpur": {"bbox": [3.05, 101.6, 3.25, 101.8], "country": "Malaysia", "region": "asia"},
    "Penang": {"bbox": [5.35, 100.25, 5.48, 100.38], "country": "Malaysia", "region": "asia"},
    "Singapore": {"bbox": [1.2, 103.6, 1.47, 104.0], "country": "Singapore", "region": "asia"},
    "Phnom Penh": {"bbox": [11.5, 104.85, 11.6, 104.97], "country": "Cambodia", "region": "asia"},
    "Siem Reap": {"bbox": [13.33, 103.82, 13.38, 103.89], "country": "Cambodia", "region": "asia"},
    "Da Nang": {"bbox": [15.95, 108.15, 16.12, 108.3], "country": "Vietnam", "region": "asia"},
    "Manila": {"bbox": [14.5, 120.9, 14.65, 121.05], "country": "Philippines", "region": "asia"},
    "Cebu": {"bbox": [10.28, 123.85, 10.36, 123.93], "country": "Philippines", "region": "asia"},

    # South Asia
    "Goa": {"bbox": [15.38, 73.75, 15.55, 73.95], "country": "India", "region": "asia"},
    "Bangalore": {"bbox": [12.9, 77.5, 13.05, 77.7], "country": "India", "region": "asia"},
    "Delhi": {"bbox": [28.5, 77.1, 28.7, 77.35], "country": "India", "region": "asia"},
    "Kathmandu": {"bbox": [27.67, 85.28, 27.75, 85.38], "country": "Nepal", "region": "asia"},
    "Colombo": {"bbox": [6.85, 79.83, 6.97, 79.9], "country": "Sri Lanka", "region": "asia"},

    # Europe - Western
    "Lisbon": {"bbox": [38.69, -9.23, 38.8, -9.09], "country": "Portugal", "region": "europe"},
    "Porto": {"bbox": [41.12, -8.67, 41.19, -8.57], "country": "Portugal", "region": "europe"},
    "Barcelona": {"bbox": [41.33, 2.07, 41.47, 2.23], "country": "Spain", "region": "europe"},
    "Valencia": {"bbox": [39.43, -0.42, 39.52, -0.32], "country": "Spain", "region": "europe"},
    "Malaga": {"bbox": [36.69, -4.47, 36.75, -4.37], "country": "Spain", "region": "europe"},
    "Berlin": {"bbox": [52.4, 13.25, 52.6, 13.55], "country": "Germany", "region": "europe"},
    "Amsterdam": {"bbox": [52.33, 4.83, 52.42, 4.95], "country": "Netherlands", "region": "europe"},
    "London": {"bbox": [51.45, -0.2, 51.55, 0.0], "country": "UK", "region": "europe"},
    "Paris": {"bbox": [48.82, 2.28, 48.9, 2.42], "country": "France", "region": "europe"},
    "Madeira (Funchal)": {"bbox": [32.6, -17.0, 32.7, -16.85], "country": "Portugal", "region": "europe"},
    "Gran Canaria (Las Palmas)": {"bbox": [27.99, -15.46, 28.17, -15.38], "country": "Spain", "region": "europe"},
    "Tenerife": {"bbox": [28.4, -16.4, 28.52, -16.2], "country": "Spain", "region": "europe"},

    # Europe - Central/Eastern
    "Budapest": {"bbox": [47.43, 18.95, 47.56, 19.15], "country": "Hungary", "region": "europe"},
    "Prague": {"bbox": [50.03, 14.32, 50.13, 14.5], "country": "Czech Republic", "region": "europe"},
    "Warsaw": {"bbox": [52.15, 20.9, 52.3, 21.1], "country": "Poland", "region": "europe"},
    "Krakow": {"bbox": [50.03, 19.87, 50.1, 20.0], "country": "Poland", "region": "europe"},
    "Bucharest": {"bbox": [44.38, 26.03, 44.48, 26.18], "country": "Romania", "region": "europe"},
    "Sofia": {"bbox": [42.65, 23.27, 42.73, 23.4], "country": "Bulgaria", "region": "europe"},
    "Belgrade": {"bbox": [44.75, 20.4, 44.85, 20.52], "country": "Serbia", "region": "europe"},
    "Tallinn": {"bbox": [59.4, 24.65, 59.47, 24.83], "country": "Estonia", "region": "europe"},
    "Vilnius": {"bbox": [54.66, 25.22, 54.73, 25.32], "country": "Lithuania", "region": "europe"},
    "Tbilisi": {"bbox": [41.67, 44.72, 41.77, 44.85], "country": "Georgia", "region": "europe"},
    "Split": {"bbox": [43.49, 16.4, 43.55, 16.5], "country": "Croatia", "region": "europe"},
    "Athens": {"bbox": [37.93, 23.68, 38.02, 23.78], "country": "Greece", "region": "europe"},

    # Turkey
    "Istanbul": {"bbox": [40.97, 28.85, 41.1, 29.1], "country": "Turkey", "region": "europe"},
    "Antalya": {"bbox": [36.85, 30.63, 36.92, 30.75], "country": "Turkey", "region": "europe"},

    # Latin America
    "Mexico City": {"bbox": [19.3, -99.25, 19.5, -99.05], "country": "Mexico", "region": "latam"},
    "Playa del Carmen": {"bbox": [20.6, -87.12, 20.65, -87.05], "country": "Mexico", "region": "latam"},
    "Tulum": {"bbox": [20.19, -87.47, 20.24, -87.42], "country": "Mexico", "region": "latam"},
    "Oaxaca": {"bbox": [17.04, -96.76, 17.1, -96.68], "country": "Mexico", "region": "latam"},
    "Guadalajara": {"bbox": [20.6, -103.42, 20.74, -103.28], "country": "Mexico", "region": "latam"},
    "Medellin": {"bbox": [6.18, -75.63, 6.32, -75.52], "country": "Colombia", "region": "latam"},
    "Bogota": {"bbox": [4.55, -74.15, 4.75, -74.0], "country": "Colombia", "region": "latam"},
    "Cartagena": {"bbox": [10.38, -75.55, 10.44, -75.48], "country": "Colombia", "region": "latam"},
    "Buenos Aires": {"bbox": [-34.7, -58.52, -34.55, -58.33], "country": "Argentina", "region": "latam"},
    "Lima": {"bbox": [-12.2, -77.1, -12.0, -76.9], "country": "Peru", "region": "latam"},
    "Santiago": {"bbox": [-33.5, -70.72, -33.38, -70.58], "country": "Chile", "region": "latam"},
    "Montevideo": {"bbox": [-34.93, -56.25, -34.83, -56.08], "country": "Uruguay", "region": "latam"},
    "Sao Paulo": {"bbox": [-23.65, -46.75, -23.45, -46.55], "country": "Brazil", "region": "latam"},
    "Rio de Janeiro": {"bbox": [-22.98, -43.3, -22.88, -43.15], "country": "Brazil", "region": "latam"},
    "Florianopolis": {"bbox": [-27.65, -48.55, -27.55, -48.42], "country": "Brazil", "region": "latam"},

    # Middle East / Africa
    "Dubai": {"bbox": [25.05, 55.1, 25.35, 55.4], "country": "UAE", "region": "mena"},
    "Cape Town": {"bbox": [-34.1, 18.35, -33.85, 18.65], "country": "South Africa", "region": "mena"},
    "Nairobi": {"bbox": [-1.35, 36.7, -1.2, 36.9], "country": "Kenya", "region": "mena"},
    "Marrakech": {"bbox": [31.6, -8.05, 31.66, -7.95], "country": "Morocco", "region": "mena"},
    "Zanzibar": {"bbox": [-6.18, 39.17, -6.1, 39.25], "country": "Tanzania", "region": "mena"},
    "Accra": {"bbox": [5.53, -0.25, 5.63, -0.13], "country": "Ghana", "region": "mena"},
    "Lagos": {"bbox": [6.4, 3.3, 6.55, 3.5], "country": "Nigeria", "region": "mena"},

    # East Asia
    "Seoul": {"bbox": [37.45, 126.85, 37.6, 127.1], "country": "South Korea", "region": "asia"},
    "Tokyo": {"bbox": [35.6, 139.6, 35.8, 139.85], "country": "Japan", "region": "asia"},
    "Taipei": {"bbox": [24.95, 121.45, 25.1, 121.6], "country": "Taiwan", "region": "asia"},
}


def build_overpass_query(bbox: list) -> str:
    """Build Overpass QL query for DN-relevant POIs within a bounding box."""
    s, w, n, e = bbox
    return f"""
[out:json][timeout:120];
(
  // Coworking spaces
  node["amenity"="coworking_space"]({s},{w},{n},{e});
  way["amenity"="coworking_space"]({s},{w},{n},{e});

  // Hostels
  node["tourism"="hostel"]({s},{w},{n},{e});
  way["tourism"="hostel"]({s},{w},{n},{e});

  // Serviced apartments / apart-hotels (longer stays)
  node["tourism"="apartment"]({s},{w},{n},{e});
  way["tourism"="apartment"]({s},{w},{n},{e});

  // Guest houses (budget accommodation)
  node["tourism"="guest_house"]({s},{w},{n},{e});
  way["tourism"="guest_house"]({s},{w},{n},{e});

  // Coliving (building or residential tagged as coliving)
  node["building"="residential"]["operator"~"coliv",i]({s},{w},{n},{e});
  way["building"="residential"]["operator"~"coliv",i]({s},{w},{n},{e});
  node["amenity"="coworking_space"]["residential"="yes"]({s},{w},{n},{e});
  way["amenity"="coworking_space"]["residential"="yes"]({s},{w},{n},{e});
);
out center;
"""


def classify_poi(tags: dict) -> str:
    """Classify a POI into a category based on its OSM tags."""
    # Coliving detection (coworking + residential, or operator contains coliv)
    op = (tags.get("operator") or "").lower()
    if "coliv" in op or tags.get("residential") == "yes":
        return "coliving"
    if tags.get("amenity") == "coworking_space":
        return "coworking"
    if tags.get("tourism") == "hostel":
        return "hostel"
    if tags.get("tourism") == "apartment":
        return "apartment"
    if tags.get("tourism") == "guest_house":
        return "guesthouse"
    return "other"


# City-level nomad metadata (cost tier: 1=cheap, 2=moderate, 3=expensive)
CITY_META = {
    "Bangkok": {"cost": 1, "timezone": "UTC+7", "visa": "visa-free 60d"},
    "Chiang Mai": {"cost": 1, "timezone": "UTC+7", "visa": "visa-free 60d"},
    "Phuket": {"cost": 1, "timezone": "UTC+7", "visa": "visa-free 60d"},
    "Bali (Canggu/Ubud)": {"cost": 1, "timezone": "UTC+8", "visa": "visa-on-arrival 30d"},
    "Ho Chi Minh City": {"cost": 1, "timezone": "UTC+7", "visa": "e-visa 90d"},
    "Hanoi": {"cost": 1, "timezone": "UTC+7", "visa": "e-visa 90d"},
    "Kuala Lumpur": {"cost": 1, "timezone": "UTC+8", "visa": "visa-free 90d"},
    "Penang": {"cost": 1, "timezone": "UTC+8", "visa": "visa-free 90d"},
    "Singapore": {"cost": 3, "timezone": "UTC+8", "visa": "visa-free 90d"},
    "Phnom Penh": {"cost": 1, "timezone": "UTC+7", "visa": "visa-on-arrival 30d"},
    "Siem Reap": {"cost": 1, "timezone": "UTC+7", "visa": "visa-on-arrival 30d"},
    "Da Nang": {"cost": 1, "timezone": "UTC+7", "visa": "e-visa 90d"},
    "Manila": {"cost": 1, "timezone": "UTC+8", "visa": "visa-free 30d"},
    "Cebu": {"cost": 1, "timezone": "UTC+8", "visa": "visa-free 30d"},
    "Goa": {"cost": 1, "timezone": "UTC+5:30", "visa": "e-visa 30d"},
    "Bangalore": {"cost": 1, "timezone": "UTC+5:30", "visa": "e-visa 30d"},
    "Delhi": {"cost": 1, "timezone": "UTC+5:30", "visa": "e-visa 30d"},
    "Kathmandu": {"cost": 1, "timezone": "UTC+5:45", "visa": "visa-on-arrival 90d"},
    "Colombo": {"cost": 1, "timezone": "UTC+5:30", "visa": "e-visa 30d"},
    "Lisbon": {"cost": 2, "timezone": "UTC+0", "visa": "Schengen 90d"},
    "Porto": {"cost": 2, "timezone": "UTC+0", "visa": "Schengen 90d"},
    "Barcelona": {"cost": 2, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "Valencia": {"cost": 2, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "Malaga": {"cost": 2, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "Berlin": {"cost": 2, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "Amsterdam": {"cost": 3, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "London": {"cost": 3, "timezone": "UTC+0", "visa": "visitor 180d"},
    "Paris": {"cost": 3, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "Madeira (Funchal)": {"cost": 2, "timezone": "UTC+0", "visa": "Schengen 90d"},
    "Gran Canaria (Las Palmas)": {"cost": 2, "timezone": "UTC+0", "visa": "Schengen 90d"},
    "Tenerife": {"cost": 2, "timezone": "UTC+0", "visa": "Schengen 90d"},
    "Budapest": {"cost": 1, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "Prague": {"cost": 2, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "Warsaw": {"cost": 1, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "Krakow": {"cost": 1, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "Bucharest": {"cost": 1, "timezone": "UTC+2", "visa": "Schengen 90d"},
    "Sofia": {"cost": 1, "timezone": "UTC+2", "visa": "Schengen 90d"},
    "Belgrade": {"cost": 1, "timezone": "UTC+1", "visa": "visa-free 90d"},
    "Tallinn": {"cost": 2, "timezone": "UTC+2", "visa": "Schengen 90d"},
    "Vilnius": {"cost": 1, "timezone": "UTC+2", "visa": "Schengen 90d"},
    "Tbilisi": {"cost": 1, "timezone": "UTC+4", "visa": "visa-free 365d"},
    "Split": {"cost": 2, "timezone": "UTC+1", "visa": "Schengen 90d"},
    "Athens": {"cost": 2, "timezone": "UTC+2", "visa": "Schengen 90d"},
    "Istanbul": {"cost": 1, "timezone": "UTC+3", "visa": "e-visa 90d"},
    "Antalya": {"cost": 1, "timezone": "UTC+3", "visa": "e-visa 90d"},
    "Mexico City": {"cost": 1, "timezone": "UTC-6", "visa": "visa-free 180d"},
    "Playa del Carmen": {"cost": 2, "timezone": "UTC-5", "visa": "visa-free 180d"},
    "Tulum": {"cost": 2, "timezone": "UTC-5", "visa": "visa-free 180d"},
    "Oaxaca": {"cost": 1, "timezone": "UTC-6", "visa": "visa-free 180d"},
    "Guadalajara": {"cost": 1, "timezone": "UTC-6", "visa": "visa-free 180d"},
    "Medellin": {"cost": 1, "timezone": "UTC-5", "visa": "visa-free 90d"},
    "Bogota": {"cost": 1, "timezone": "UTC-5", "visa": "visa-free 90d"},
    "Cartagena": {"cost": 1, "timezone": "UTC-5", "visa": "visa-free 90d"},
    "Buenos Aires": {"cost": 1, "timezone": "UTC-3", "visa": "visa-free 90d"},
    "Lima": {"cost": 1, "timezone": "UTC-5", "visa": "visa-free 183d"},
    "Santiago": {"cost": 2, "timezone": "UTC-4", "visa": "visa-free 90d"},
    "Montevideo": {"cost": 2, "timezone": "UTC-3", "visa": "visa-free 90d"},
    "Sao Paulo": {"cost": 2, "timezone": "UTC-3", "visa": "e-visa 90d"},
    "Rio de Janeiro": {"cost": 2, "timezone": "UTC-3", "visa": "e-visa 90d"},
    "Florianopolis": {"cost": 1, "timezone": "UTC-3", "visa": "e-visa 90d"},
    "Dubai": {"cost": 3, "timezone": "UTC+4", "visa": "visa-on-arrival 30d"},
    "Cape Town": {"cost": 1, "timezone": "UTC+2", "visa": "visa-free 90d"},
    "Nairobi": {"cost": 1, "timezone": "UTC+3", "visa": "e-visa"},
    "Marrakech": {"cost": 1, "timezone": "UTC+1", "visa": "visa-free 90d"},
    "Zanzibar": {"cost": 1, "timezone": "UTC+3", "visa": "visa-on-arrival"},
    "Accra": {"cost": 1, "timezone": "UTC+0", "visa": "visa-on-arrival"},
    "Lagos": {"cost": 1, "timezone": "UTC+1", "visa": "visa required"},
    "Seoul": {"cost": 2, "timezone": "UTC+9", "visa": "visa-free 90d"},
    "Tokyo": {"cost": 3, "timezone": "UTC+9", "visa": "visa-free 90d"},
    "Taipei": {"cost": 2, "timezone": "UTC+8", "visa": "visa-free 90d"},
}


def compute_quality_score(tags: dict) -> int:
    """Compute a quality score (0-10) based on OSM data completeness.
    Higher score = more established, well-documented venue."""
    score = 0
    if tags.get("website"):
        score += 3  # Website is strongest signal of legitimacy
    if tags.get("phone") or tags.get("contact:phone"):
        score += 2
    if tags.get("opening_hours"):
        score += 2
    if tags.get("operator") or tags.get("brand"):
        score += 1  # Part of a chain/brand
    if tags.get("internet_access") in ("wlan", "yes"):
        score += 1  # Wifi availability noted
    if tags.get("addr:street"):
        score += 1  # Has a street address
    return min(score, 10)


def extract_poi(element: dict, city: str, country: str) -> dict:
    """Extract a clean POI record from an Overpass element."""
    tags = element.get("tags", {})

    # Get coordinates (nodes have lat/lon directly, ways have center)
    lat = element.get("lat") or element.get("center", {}).get("lat")
    lon = element.get("lon") or element.get("center", {}).get("lon")

    quality = compute_quality_score(tags)
    meta = CITY_META.get(city, {})

    return {
        "osm_id": element.get("id"),
        "name": tags.get("name", "Unnamed"),
        "category": classify_poi(tags),
        "lat": lat,
        "lon": lon,
        "city": city,
        "country": country,
        "address": tags.get("addr:street", ""),
        "phone": tags.get("phone", "") or tags.get("contact:phone", ""),
        "website": tags.get("website", "") or tags.get("contact:website", ""),
        "opening_hours": tags.get("opening_hours", ""),
        "wifi": tags.get("internet_access", ""),
        "wheelchair": tags.get("wheelchair", ""),
        "operator": tags.get("operator", ""),
        "brand": tags.get("brand", ""),
        "quality": quality,
        "cost_tier": meta.get("cost", 0),
        "timezone": meta.get("timezone", ""),
        "visa": meta.get("visa", ""),
        "osm_url": f"https://www.openstreetmap.org/{element['type']}/{element['id']}",
    }


def fetch_city(city_name: str, city_info: dict) -> list:
    """Fetch all DN-relevant POIs for a single city."""
    query = build_overpass_query(city_info["bbox"])
    from urllib.parse import urlencode
    body = urlencode({"data": query}).encode("utf-8")

    req = Request(OVERPASS_URL, data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    req.add_header("User-Agent", "NomadDirectory/1.0")

    try:
        with urlopen(req, timeout=180, context=SSL_CTX) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except HTTPError as e:
        if e.code == 429:
            print(f"  Rate limited. Waiting 60s...")
            time.sleep(60)
            return fetch_city(city_name, city_info)
        print(f"  HTTP error {e.code} for {city_name}: {e.reason}")
        return []
    except URLError as e:
        print(f"  Network error for {city_name}: {e.reason}")
        return []

    elements = result.get("elements", [])
    pois = []
    seen_ids = set()
    for el in elements:
        poi = extract_poi(el, city_name, city_info["country"])
        # Quality filters
        if not poi["lat"] or not poi["lon"]:
            continue
        if poi["name"] == "Unnamed":
            continue  # Skip unnamed POIs — low quality
        if poi["osm_id"] in seen_ids:
            continue  # Deduplicate
        tags = el.get("tags", {})
        if tags.get("disused") == "yes" or tags.get("abandoned") == "yes":
            continue  # Skip closed/abandoned places
        if tags.get("access") == "private":
            continue  # Skip private-access only venues
        if poi["quality"] < 2:
            continue  # Skip places with almost no metadata (likely abandoned/informal)
        seen_ids.add(poi["osm_id"])
        pois.append(poi)

    return pois


def save_results(all_pois: list, output_dir: Path):
    """Save results as both JSON and CSV."""
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d")

    # JSON
    json_path = output_dir / f"nomad_directory_{timestamp}.json"
    with open(json_path, "w") as f:
        json.dump(all_pois, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(all_pois)} POIs to {json_path}")

    # CSV
    csv_path = output_dir / f"nomad_directory_{timestamp}.csv"
    if all_pois:
        fields = all_pois[0].keys()
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            writer.writerows(all_pois)
        print(f"Saved {len(all_pois)} POIs to {csv_path}")

    # Summary by city and category
    summary = {}
    for poi in all_pois:
        city = poi["city"]
        cat = poi["category"]
        if city not in summary:
            summary[city] = {}
        summary[city][cat] = summary[city].get(cat, 0) + 1

    summary_path = output_dir / f"summary_{timestamp}.json"
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)
    print(f"Saved summary to {summary_path}")

    # Print summary table
    cats_list = ["coworking", "coliving", "hostel", "apartment", "guesthouse"]
    header = f"{'City':<30}" + "".join(f" {c:>10}" for c in cats_list) + f" {'Total':>8}"
    print(f"\n{header}")
    print("-" * len(header))
    for city, cats in sorted(summary.items()):
        total = sum(cats.values())
        row = f"{city:<30}" + "".join(f" {cats.get(c,0):>10}" for c in cats_list) + f" {total:>8}"
        print(row)

    grand = len(all_pois)
    totals = f"{'TOTAL':<30}" + "".join(f" {sum(1 for p in all_pois if p['category']==c):>10}" for c in cats_list) + f" {grand:>8}"
    print(f"\n{totals}")


def main():
    parser = argparse.ArgumentParser(description="Fetch digital nomad POIs from OpenStreetMap")
    parser.add_argument("--city", help="Fetch a single city by name")
    parser.add_argument("--region", choices=["asia", "europe", "latam", "mena"], help="Fetch all cities in a region")
    parser.add_argument("--output", default="data", help="Output directory")
    args = parser.parse_args()

    output_dir = Path(__file__).parent / args.output

    # Determine which cities to fetch
    if args.city:
        matches = {k: v for k, v in CITIES.items() if args.city.lower() in k.lower()}
        if not matches:
            print(f"City '{args.city}' not found. Available: {', '.join(CITIES.keys())}")
            sys.exit(1)
        targets = matches
    elif args.region:
        targets = {k: v for k, v in CITIES.items() if v["region"] == args.region}
    else:
        targets = CITIES

    print(f"Fetching {len(targets)} cities from OpenStreetMap...")
    print(f"Categories: coworking, hostels, wifi cafes, libraries, gyms, laundry\n")

    all_pois = []
    for i, (city_name, city_info) in enumerate(targets.items(), 1):
        print(f"[{i}/{len(targets)}] {city_name}, {city_info['country']}...", end=" ", flush=True)

        pois = fetch_city(city_name, city_info)
        all_pois.extend(pois)

        print(f"{len(pois)} POIs found")

        # Be polite to Overpass API
        if i < len(targets):
            time.sleep(2)

    save_results(all_pois, output_dir)


if __name__ == "__main__":
    main()
