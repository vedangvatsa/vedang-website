// Fetch coliving/hostel data from OSM Overpass API
// Uses Node.js native fetch which handles SSL properly on macOS

const fs = require('fs');
const path = require('path');

const OVERPASS_URL = 'https://overpass.kumi.systems/api/interpreter';

const CITIES = [
  ["Canggu", "Indonesia", -8.6478, 115.1385, 10],
  ["Hoi An", "Vietnam", 15.8801, 108.3380, 10],
  ["Seoul", "South Korea", 37.5665, 126.9780, 15],
  ["Riga", "Latvia", 56.9496, 24.1052, 12],
  ["Lagos", "Nigeria", 6.5244, 3.3792, 15],
  ["Oaxaca", "Mexico", 17.0732, -96.7266, 10],
  ["Koh Phangan", "Thailand", 9.7519, 100.0136, 10],
  ["Siargao", "Philippines", 9.8572, 126.0459, 15],
  ["Taghazout", "Morocco", 30.5440, -9.7085, 10],
  ["Essaouira", "Morocco", 31.5085, -9.7595, 10],
  ["Penang", "Malaysia", 5.4164, 100.3327, 12],
  ["Ho Chi Minh City", "Vietnam", 10.8231, 106.6297, 12],
  ["Kuala Lumpur", "Malaysia", 3.1390, 101.6869, 12],
  ["Athens", "Greece", 37.9838, 23.7275, 12],
  ["Porto", "Portugal", 41.1579, -8.6291, 12],
  ["Tenerife", "Spain", 28.2916, -16.6291, 15],
  ["Phnom Penh", "Cambodia", 11.5564, 104.9282, 12],
  ["Siem Reap", "Cambodia", 13.3671, 103.8448, 10],
  ["Cusco", "Peru", -13.5320, -71.9675, 10],
  ["Cartagena", "Colombia", 10.3910, -75.5364, 10],
  ["Santa Marta", "Colombia", 11.2404, -74.1990, 10],
  ["Nosara", "Costa Rica", 9.9767, -85.6530, 10],
  ["Antigua", "Guatemala", 14.5586, -90.7295, 10],
  ["Dahab", "Egypt", 28.5007, 34.5133, 10],
  ["Palermo", "Italy", 38.1157, 13.3615, 10],
  ["Dubrovnik", "Croatia", 42.6507, 18.0944, 10],
  ["Thessaloniki", "Greece", 40.6401, 22.9444, 10],
  ["Valparaiso", "Chile", -33.0472, -71.6127, 10],
  ["San Juan del Sur", "Nicaragua", 11.2530, -85.8710, 10],
  ["El Zonte", "El Salvador", 13.4963, -89.3882, 10],
  ["Guadalajara", "Mexico", 20.6597, -103.3496, 12],
  ["Zanzibar", "Tanzania", -6.1659, 39.1989, 15],
  ["Tarifa", "Spain", 36.0140, -5.6068, 10],
  ["Mancora", "Peru", -4.1037, -81.0452, 10],
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function queryOSM(lat, lon, radiusKm) {
  const r = radiusKm * 1000;
  const query = `[out:json][timeout:25];(node["tourism"~"hostel|guest_house|apartment"](around:${r},${lat},${lon});way["tourism"~"hostel|guest_house|apartment"](around:${r},${lat},${lon});node["name"~"coliving|co-living"i](around:${r},${lat},${lon}););out center body;`;
  const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`;

  try {
    const resp = await fetch(url, {
      signal: AbortSignal.timeout(30000),
      headers: { 'User-Agent': 'NomadDirectory/1.0' }
    });
    if (!resp.ok) {
      console.error(`  HTTP ${resp.status}`);
      return [];
    }
    const data = await resp.json();
    return data.elements || [];
  } catch (e) {
    console.error(`  Error: ${e.message}`);
    return [];
  }
}

function categorize(tags, name) {
  const nl = name.toLowerCase();
  if (nl.includes('coliving') || nl.includes('co-living')) return 'coliving';
  if (tags.tourism === 'hostel' || nl.includes('hostel')) return 'hostel';
  if (tags.tourism === 'guest_house') return 'guesthouse';
  if (tags.tourism === 'apartment') return 'apartment';
  return 'hostel';
}

async function main() {
  const dataPath = path.join(__dirname, '..', 'src', 'lib', 'nomad-data.json');
  const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const existingIds = new Set(existing.map(d => d.osm_id));
  console.log(`Existing: ${existing.length} entries`);

  const newEntries = [];

  for (let i = 0; i < CITIES.length; i++) {
    const [city, country, lat, lon, radius] = CITIES[i];
    const elements = await queryOSM(lat, lon, radius);

    let cityNew = 0;
    for (const elem of elements) {
      const tags = elem.tags || {};
      const name = tags.name;
      if (!name) continue;
      const elat = elem.lat || (elem.center && elem.center.lat);
      const elon = elem.lon || (elem.center && elem.center.lon);
      if (!elat || !elon) continue;
      const eid = elem.id;
      if (existingIds.has(eid)) continue;

      newEntries.push({
        osm_id: eid,
        name,
        category: categorize(tags, name),
        lat: Math.round(elat * 1e6) / 1e6,
        lon: Math.round(elon * 1e6) / 1e6,
        city, country,
        address: tags['addr:street'] || tags['addr:full'] || '',
        phone: tags.phone || tags['contact:phone'] || '',
        website: tags.website || tags['contact:website'] || '',
        opening_hours: tags.opening_hours || '',
        wifi: tags.internet_access || '',
        wheelchair: tags.wheelchair || '',
        operator: tags.operator || '',
        brand: tags.brand || '',
        osm_url: `https://www.openstreetmap.org/node/${eid}`,
        quality: 5,
      });
      existingIds.add(eid);
      cityNew++;
    }

    console.log(`[${i+1}/${CITIES.length}] ${city}: ${elements.length} found, ${cityNew} new`);
    if (i < CITIES.length - 1) await sleep(4000);
  }

  console.log(`\n=== TOTAL NEW: ${newEntries.length} ===`);

  const combined = [...existing, ...newEntries];
  fs.writeFileSync(dataPath, JSON.stringify(combined));
  console.log(`Saved combined (${combined.length} entries)`);

  // Summary by city
  const counts = {};
  for (const e of newEntries) counts[e.city] = (counts[e.city] || 0) + 1;
  Object.entries(counts).sort((a,b) => b[1]-a[1]).forEach(([c,n]) => console.log(`  + ${c}: ${n}`));
}

main().catch(console.error);
