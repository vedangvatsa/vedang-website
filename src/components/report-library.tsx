'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, MoveUpRight, Database, Loader2, Zap } from 'lucide-react';

interface ReportEntry {
  title: string;
  source: string;
  url: string;
  date: string;
  category: string;
  type: string;
  description?: string;
  citations?: number;
}

interface ReportLibraryProps {
  dataUrl: string;
  categories: string[];
  manualReports?: ReportEntry[];
  corpus?: 'ai' | 'web3';
}

const CHUNK = 200;
const DEBOUNCE_MS = 400;

export function ReportLibrary({ dataUrl, categories, manualReports = [], corpus = 'ai' }: ReportLibraryProps) {
  const [localReports, setLocalReports] = useState<ReportEntry[]>(manualReports);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [visible, setVisible] = useState(CHUNK);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Live search state
  const [liveResults, setLiveResults] = useState<ReportEntry[] | null>(null);
  const [liveTotal, setLiveTotal] = useState(0);
  const [liveLoading, setLiveLoading] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Fetch the large JSON client-side (for default browse)
  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then((generated: ReportEntry[]) => {
        setLocalReports(prev => [...prev, ...generated]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataUrl]);

  // Debounced live search via OpenAlex
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.length < 3) {
      setIsLiveMode(false);
      setLiveResults(null);
      setLiveTotal(0);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLiveMode(true);
      setLiveLoading(true);
      try {
        const res = await fetch(`/api/reports/search?q=${encodeURIComponent(query)}&corpus=${corpus}&per_page=100`);
        const data = await res.json();
        setLiveResults(data.results || []);
        setLiveTotal(data.total || 0);
      } catch {
        // Fall back to local search on error
        setIsLiveMode(false);
        setLiveResults(null);
      } finally {
        setLiveLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, corpus]);

  // Local filter (used when not in live mode)
  const filteredLocal = useMemo(() => {
    const q = query.toLowerCase();
    return localReports.filter((r) => {
      const matchesSearch = !q ||
        r.title.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q));
      const matchesCategory = !category || r.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [localReports, query, category]);

  // Choose which results to display
  const displayResults = useMemo(() => {
    if (isLiveMode && liveResults) {
      // Apply category filter to live results too
      if (category) {
        return liveResults.filter(r => r.category === category);
      }
      return liveResults;
    }
    return filteredLocal;
  }, [isLiveMode, liveResults, filteredLocal, category]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisible(CHUNK);
  }, [query, category]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + CHUNK, displayResults.length));
  }, [displayResults.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleItems = displayResults.slice(0, visible);

  const totalCount = isLiveMode ? liveTotal : localReports.length;

  return (
    <div className="py-8">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${localReports.length.toLocaleString()}+ reports. Type 3+ characters to search 250M+ papers via OpenAlex...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg border border-border bg-background text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Live search indicator */}
      {isLiveMode && (
        <div className="flex items-center gap-2 mb-4 px-2 py-1.5 rounded-md bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
          {liveLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Searching 250M+ papers via OpenAlex...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>
                <strong className="text-foreground">{liveTotal.toLocaleString()}</strong> results from OpenAlex
                {displayResults.length < liveTotal && ` (showing top ${displayResults.length})`}
              </span>
            </>
          )}
        </div>
      )}

      {/* Report List */}
      {visibleItems.length === 0 && !loading && !liveLoading ? (
        <div className="py-20 text-center">
          <Database className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No reports found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
          {visibleItems.map((item, i) => (
            <Link
              key={`${item.url}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2.5 px-2 rounded-md hover:bg-muted/50 transition-colors group border-b border-border/40"
            >
              <span className="text-sm truncate pr-4 group-hover:text-primary transition-colors">
                {item.title}
              </span>
              <MoveUpRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {visible < displayResults.length && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
