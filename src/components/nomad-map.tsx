'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Bed, Home, Hotel, Users } from 'lucide-react';

// Leaflet must be loaded client-side only
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr: false });

interface POI {
  osm_id: number;
  name: string;
  category: string;
  lat: number;
  lon: number;
  city: string;
  country: string;
  address: string;
  phone: string;
  website: string;
  opening_hours: string;
  wifi: string;
  quality: number;
  cost_tier: number;
  timezone: string;
  visa: string;
  osm_url: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: typeof MapPin }> = {
  coworking: { label: 'Coworking', color: '#3b82f6', icon: Building2 },
  coliving: { label: 'Coliving', color: '#8b5cf6', icon: Users },
  hostel: { label: 'Hostels', color: '#f59e0b', icon: Bed },
  apartment: { label: 'Apartments', color: '#10b981', icon: Home },
  guesthouse: { label: 'Guesthouses', color: '#ec4899', icon: Hotel },
};

const CATEGORY_COLORS: Record<string, string> = {
  coworking: '#3b82f6',
  coliving: '#8b5cf6',
  hostel: '#f59e0b',
  apartment: '#10b981',
  guesthouse: '#ec4899',
};

export function NomadMap({ data }: { data: POI[] }) {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(Object.keys(CATEGORY_CONFIG)));
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    // Import leaflet CSS
    import('leaflet/dist/leaflet.css');
  }, []);

  const cities = useMemo(() => {
    const citySet = new Map<string, { country: string; count: number; lat: number; lon: number }>();
    for (const poi of data) {
      const existing = citySet.get(poi.city);
      if (existing) {
        existing.count++;
      } else {
        citySet.set(poi.city, { country: poi.country, count: 1, lat: poi.lat, lon: poi.lon });
      }
    }
    return Array.from(citySet.entries())
      .map(([name, info]) => ({ name, ...info }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedCity !== 'all') {
      filtered = filtered.filter(p => p.city === selectedCity);
    }
    filtered = filtered.filter(p => selectedCategories.has(p.category));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
    }
    return filtered;
  }, [data, selectedCity, selectedCategories, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const source = selectedCity === 'all' ? data : data.filter(p => p.city === selectedCity);
    for (const poi of source) {
      counts[poi.category] = (counts[poi.category] || 0) + 1;
    }
    return counts;
  }, [data, selectedCity]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const mapCenter = useMemo(() => {
    if (selectedCity !== 'all') {
      const city = cities.find(c => c.name === selectedCity);
      if (city) return [city.lat, city.lon] as [number, number];
    }
    return [20, 20] as [number, number];
  }, [selectedCity, cities]);

  const mapZoom = selectedCity === 'all' ? 2 : 13;

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <Badge variant="outline" className="text-sm px-3 py-1">
          {filteredData.length.toLocaleString()} places
        </Badge>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {cities.length} cities
        </Badge>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {new Set(data.map(d => d.country)).size} countries
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* City selector */}
        <div className="flex-1">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Cities ({data.length.toLocaleString()} places)</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>
                {city.name}, {city.country} ({city.count})
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const active = selectedCategories.has(key);
          const count = categoryCounts[key] || 0;
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                active
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
              }`}
            >
              <Icon className="w-3 h-3" />
              {config.label}
              <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="w-full h-[600px] rounded-xl overflow-hidden border shadow-sm">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="w-full h-full"
          key={`${selectedCity}-${mapZoom}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {filteredData.map((poi) => (
            <CircleMarker
              key={poi.osm_id}
              center={[poi.lat, poi.lon]}
              radius={6}
              pathOptions={{
                color: CATEGORY_COLORS[poi.category] || '#666',
                fillColor: CATEGORY_COLORS[poi.category] || '#666',
                fillOpacity: 0.8,
                weight: 1,
              }}
            >
              <Popup>
                <div className="text-sm min-w-[200px]">
                  <p className="font-semibold text-base">{poi.name}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {CATEGORY_CONFIG[poi.category]?.label} · {poi.city}, {poi.country}
                  </p>
                  {poi.address && <p className="mt-2 text-xs">{poi.address}</p>}
                  {poi.opening_hours && <p className="text-xs mt-1">Hours: {poi.opening_hours}</p>}
                  {poi.phone && <p className="text-xs mt-1">Phone: {poi.phone}</p>}
                  <div className="mt-2 flex gap-2">
                    {poi.website && (
                      <a href={poi.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                        Website
                      </a>
                    )}
                    <a href={poi.osm_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                      OpenStreetMap
                    </a>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Listings table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">City</th>
                <th className="text-left px-4 py-3 font-medium">Quality</th>
                <th className="text-left px-4 py-3 font-medium">Links</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 500).map((poi, i) => (
                <tr key={poi.osm_id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 text-muted-foreground text-xs font-mono">{i + 1}</td>
                  <td className="px-4 py-2.5 font-medium">{poi.name}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: CATEGORY_COLORS[poi.category] || '#666' }}
                    >
                      {CATEGORY_CONFIG[poi.category]?.label || poi.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{poi.city}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(Math.round(poi.quality / 2), 5) }).map((_, i) => (
                        <span key={i} className="w-2 h-2 rounded-full bg-emerald-500" />
                      ))}
                      {Array.from({ length: 5 - Math.min(Math.round(poi.quality / 2), 5) }).map((_, i) => (
                        <span key={i} className="w-2 h-2 rounded-full bg-muted" />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-2">
                      {poi.website && (
                        <a href={poi.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                          Web
                        </a>
                      )}
                      <a href={poi.osm_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                        Map
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length > 500 && (
          <p className="text-center text-xs text-muted-foreground py-3 border-t">
            Showing 500 of {filteredData.length.toLocaleString()} results. Use filters to narrow down.
          </p>
        )}
      </div>
    </div>
  );
}
