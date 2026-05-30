#!/usr/bin/env python3
"""Fetch coliving/hostel data from OSM Overpass API for new cities."""
import json, time, subprocess, sys, urllib.parse

OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter"

CITIES = [
    ("Canggu", "Indonesia", -8.6478, 115.1385, 10),
    ("Hoi An", "Vietnam", 15.8801, 108.3380, 10),
    ("Seoul", "South Korea", 37.5665, 126.9780, 15),
    ("Riga", "Latvia", 56.9496, 24.1052, 12),
    ("Lagos", "Nigeria", 6.5244, 3.3792, 15),
    ("Oaxaca", "Mexico", 17.0732, -96.7266, 10),
    ("Koh Phangan", "Thailand", 9.7519, 100.0136, 10),
    ("Siargao", "Philippines", 9.8572, 126.0459, 15),
    ("Taghazout", "Morocco", 30.5440, -9.7085, 10),
    ("Essaouira", "Morocco", 31.5085, -9.7595, 10),
    ("Penang", "Malaysia", 5.4164, 100.3327, 12),
    ("Ho Chi Minh City", "Vietnam", 10.8231, 106.6297, 12),
    ("Kuala Lumpur", "Malaysia", 3.1390, 101.6869, 12),
    ("Athens", "Greece", 37.9838, 23.7275, 12),
    ("Porto", "Portugal", 41.1579, -8.6291, 12),
    ("Tenerife", "Spain", 28.2916, -16.6291, 15),
    ("Phnom Penh", "Cambodia", 11.5564, 104.9282, 12),
    ("Siem Reap", "Cambodia", 13.3671, 103.8448, 10),
    ("Cusco", "Peru", -13.5320, -71.9675, 10),
    ("Cartagena", "Colombia", 10.3910, -75.5364, 10),
    ("Santa Marta", "Colombia", 11.2404, -74.1990, 10),
    ("Nosara", "Costa Rica", 9.9767, -85.6530, 10),
    ("Antigua", "Guatemala", 14.5586, -90.7295, 10),
    ("Dahab", "Egypt", 28.5007, 34.5133, 10),
    ("Palermo", "Italy", 38.1157, 13.3615, 10),
    ("Dubrovnik", "Croatia", 42.6507, 18.0944, 10),
    ("Thessaloniki", "Greece", 40.6401, 22.9444, 10),
    ("Valparaiso", "Chile", -33.0472, -71.6127, 10),
    ("San Juan del Sur", "Nicaragua", 11.2530, -85.8710, 10),
    ("El Zonte", "El Salvador", 13.4963, -89.3882, 10),
    ("Guadalajara", "Mexico", 20.6597, -103.3496, 12),
    ("Zanzibar", "Tanzania", -6.1659, 39.1989, 15),
    ("Tarifa", "Spain", 36.0140, -5.6068, 10),
    ("Mancora", "Peru", -4.1037, -81.0452, 10),
]

def query_osm(lat, lon, radius_km):
    r = radius_km * 1000
    query = f'[out:json][timeout:25];(node["tourism"~"hostel|guest_house|apartment"](around:{r},{lat},{lon});way["tourism"~"hostel|guest_house|apartment"](around:{r},{lat},{lon});node["name"~"coliving|co-living"i](around:{r},{lat},{lon}););out center body;'
    
    # Use GET with URL-encoded query parameter
    url = f"{OVERPASS_URL}?data={urllib.parse.quote(query)}"
    
    result = subprocess.run(
        ["curl", "-s", "-k", "--max-time", "30", url],
        capture_output=True, text=True
    )

    if result.returncode != 0 or not result.stdout.strip():
        return []

    try:
        data = json.loads(result.stdout)
        return data.get("elements", [])
    except json.JSONDecodeError as e:
        print(f"  Parse error: {e}", file=sys.stderr)
        return []

def main():
    with open("src/lib/nomad-data.json") as f:
        existing = json.load(f)

    existing_ids = set(d.get("osm_id") for d in existing)
    print(f"Existing: {len(existing)} entries", flush=True)

    new_entries = []

    for i, (city, country, lat, lon, radius) in enumerate(CITIES):
        elements = query_osm(lat, lon, radius)

        city_new = 0
        for elem in elements:
            tags = elem.get("tags", {})
            name = tags.get("name", "")
            if not name:
                continue
            elat = elem.get("lat") or elem.get("center", {}).get("lat")
            elon = elem.get("lon") or elem.get("center", {}).get("lon")
            if not elat or not elon:
                continue
            eid = elem.get("id", 0)
            if eid in existing_ids:
                continue

            tourism = tags.get("tourism", "")
            nl = name.lower()
            if "coliving" in nl or "co-living" in nl:
                cat = "coliving"
            elif tourism == "hostel" or "hostel" in nl:
                cat = "hostel"
            elif tourism == "guest_house":
                cat = "guesthouse"
            elif tourism == "apartment":
                cat = "apartment"
            else:
                cat = "hostel"

            entry = {
                "osm_id": eid, "name": name, "category": cat,
                "lat": round(elat, 6), "lon": round(elon, 6),
                "city": city, "country": country,
                "address": tags.get("addr:street", tags.get("addr:full", "")),
                "phone": tags.get("phone", tags.get("contact:phone", "")),
                "website": tags.get("website", tags.get("contact:website", "")),
                "opening_hours": tags.get("opening_hours", ""),
                "wifi": tags.get("internet_access", ""),
                "wheelchair": tags.get("wheelchair", ""),
                "operator": tags.get("operator", ""),
                "brand": tags.get("brand", ""),
                "osm_url": f"https://www.openstreetmap.org/node/{eid}",
                "quality": 5,
            }
            new_entries.append(entry)
            existing_ids.add(eid)
            city_new += 1

        print(f"[{i+1}/{len(CITIES)}] {city}: {len(elements)} found, {city_new} new", flush=True)
        time.sleep(4)

    print(f"\n=== TOTAL NEW: {len(new_entries)} ===", flush=True)

    combined = existing + new_entries
    with open("src/lib/nomad-data.json", "w") as f:
        json.dump(combined, f, ensure_ascii=False)
    print(f"Saved combined ({len(combined)} entries)")

    from collections import Counter
    for c, n in Counter(e["city"] for e in new_entries).most_common():
        print(f"  + {c}: {n}")

if __name__ == "__main__":
    main()
