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
    "Bali (Canggu/Ubud)": {"bbox": [-8.7, 115.1, -8.3, 115.5], "country": "Indonesia", "region": "asia"},
    "Ho Chi Minh City": {"bbox": [10.7, 106.55, 10.9, 106.85], "country": "Vietnam", "region": "asia"},
    "Kuala Lumpur": {"bbox": [3.05, 101.6, 3.25, 101.8], "country": "Malaysia", "region": "asia"},
    "Singapore": {"bbox": [1.2, 103.6, 1.47, 104.0], "country": "Singapore", "region": "asia"},
    "Phnom Penh": {"bbox": [11.5, 104.85, 11.6, 104.97], "country": "Cambodia", "region": "asia"},
    "Da Nang": {"bbox": [15.95, 108.15, 16.12, 108.3], "country": "Vietnam", "region": "asia"},

    # Europe
    "Lisbon": {"bbox": [38.69, -9.23, 38.8, -9.09], "country": "Portugal", "region": "europe"},
    "Barcelona": {"bbox": [41.33, 2.07, 41.47, 2.23], "country": "Spain", "region": "europe"},
    "Berlin": {"bbox": [52.4, 13.25, 52.6, 13.55], "country": "Germany", "region": "europe"},
    "Budapest": {"bbox": [47.43, 18.95, 47.56, 19.15], "country": "Hungary", "region": "europe"},
    "Prague": {"bbox": [50.03, 14.32, 50.13, 14.5], "country": "Czech Republic", "region": "europe"},
    "Tbilisi": {"bbox": [41.67, 44.72, 41.77, 44.85], "country": "Georgia", "region": "europe"},
    "Split": {"bbox": [43.49, 16.4, 43.55, 16.5], "country": "Croatia", "region": "europe"},
    "Tallinn": {"bbox": [59.4, 24.65, 59.47, 24.83], "country": "Estonia", "region": "europe"},
    "Athens": {"bbox": [37.93, 23.68, 38.02, 23.78], "country": "Greece", "region": "europe"},
    "Madeira (Funchal)": {"bbox": [32.6, -17.0, 32.7, -16.85], "country": "Portugal", "region": "europe"},
    "Gran Canaria (Las Palmas)": {"bbox": [27.99, -15.46, 28.17, -15.38], "country": "Spain", "region": "europe"},

    # Latin America
    "Mexico City": {"bbox": [19.3, -99.25, 19.5, -99.05], "country": "Mexico", "region": "latam"},
    "Playa del Carmen": {"bbox": [20.6, -87.12, 20.65, -87.05], "country": "Mexico", "region": "latam"},
    "Medellin": {"bbox": [6.18, -75.63, 6.32, -75.52], "country": "Colombia", "region": "latam"},
    "Bogota": {"bbox": [4.55, -74.15, 4.75, -74.0], "country": "Colombia", "region": "latam"},
    "Buenos Aires": {"bbox": [-34.7, -58.52, -34.55, -58.33], "country": "Argentina", "region": "latam"},
    "Lima": {"bbox": [-12.2, -77.1, -12.0, -76.9], "country": "Peru", "region": "latam"},
    "Sao Paulo": {"bbox": [-23.65, -46.75, -23.45, -46.55], "country": "Brazil", "region": "latam"},

    # Middle East / Africa
    "Dubai": {"bbox": [25.05, 55.1, 25.35, 55.4], "country": "UAE", "region": "mena"},
    "Cape Town": {"bbox": [-34.1, 18.35, -33.85, 18.65], "country": "South Africa", "region": "mena"},
    "Nairobi": {"bbox": [-1.35, 36.7, -1.2, 36.9], "country": "Kenya", "region": "mena"},

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

  // Cafes with internet/wifi
  node["amenity"="cafe"]["internet_access"="wlan"]({s},{w},{n},{e});
  node["amenity"="cafe"]["internet_access"="yes"]({s},{w},{n},{e});

  // Libraries (free wifi, quiet workspace)
  node["amenity"="library"]({s},{w},{n},{e});
  way["amenity"="library"]({s},{w},{n},{e});

  // Gyms and fitness centers
  node["leisure"="fitness_centre"]({s},{w},{n},{e});
  way["leisure"="fitness_centre"]({s},{w},{n},{e});

  // Laundry
  node["shop"="laundry"]({s},{w},{n},{e});
  node["shop"="dry_cleaning"]({s},{w},{n},{e});
);
out center;
"""


def classify_poi(tags: dict) -> str:
    """Classify a POI into a category based on its OSM tags."""
    if tags.get("amenity") == "coworking_space":
        return "coworking"
    if tags.get("tourism") == "hostel":
        return "hostel"
    if tags.get("amenity") == "cafe":
        return "wifi_cafe"
    if tags.get("amenity") == "library":
        return "library"
    if tags.get("leisure") == "fitness_centre":
        return "gym"
    if tags.get("shop") in ("laundry", "dry_cleaning"):
        return "laundry"
    return "other"


def extract_poi(element: dict, city: str, country: str) -> dict:
    """Extract a clean POI record from an Overpass element."""
    tags = element.get("tags", {})

    # Get coordinates (nodes have lat/lon directly, ways have center)
    lat = element.get("lat") or element.get("center", {}).get("lat")
    lon = element.get("lon") or element.get("center", {}).get("lon")

    return {
        "osm_id": element.get("id"),
        "name": tags.get("name", "Unnamed"),
        "category": classify_poi(tags),
        "lat": lat,
        "lon": lon,
        "city": city,
        "country": country,
        "address": tags.get("addr:street", ""),
        "phone": tags.get("phone", ""),
        "website": tags.get("website", ""),
        "opening_hours": tags.get("opening_hours", ""),
        "wifi": tags.get("internet_access", ""),
        "wheelchair": tags.get("wheelchair", ""),
        "operator": tags.get("operator", ""),
        "brand": tags.get("brand", ""),
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
    for el in elements:
        poi = extract_poi(el, city_name, city_info["country"])
        if poi["lat"] and poi["lon"]:
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
    print(f"\n{'City':<30} {'Cowork':>8} {'Hostel':>8} {'Cafe':>8} {'Library':>8} {'Gym':>8} {'Laundry':>8} {'Total':>8}")
    print("-" * 98)
    for city, cats in sorted(summary.items()):
        total = sum(cats.values())
        print(f"{city:<30} {cats.get('coworking',0):>8} {cats.get('hostel',0):>8} {cats.get('wifi_cafe',0):>8} {cats.get('library',0):>8} {cats.get('gym',0):>8} {cats.get('laundry',0):>8} {total:>8}")

    grand = len(all_pois)
    print(f"\n{'TOTAL':<30} {sum(1 for p in all_pois if p['category']=='coworking'):>8} {sum(1 for p in all_pois if p['category']=='hostel'):>8} {sum(1 for p in all_pois if p['category']=='wifi_cafe'):>8} {sum(1 for p in all_pois if p['category']=='library'):>8} {sum(1 for p in all_pois if p['category']=='gym'):>8} {sum(1 for p in all_pois if p['category']=='laundry'):>8} {grand:>8}")


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
