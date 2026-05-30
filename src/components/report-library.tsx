'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, MoveUpRight, Database, Loader2 } from 'lucide-react';

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
}

const CHUNK = 200;

export function ReportLibrary({ dataUrl, categories, manualReports = [] }: ReportLibraryProps) {
  const [allReports, setAllReports] = useState<ReportEntry[]>(manualReports);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [visible, setVisible] = useState(CHUNK);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch the large JSON client-side
  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then((generated: ReportEntry[]) => {
        setAllReports(prev => [...prev, ...generated]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataUrl]);

  // Filter client-side
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allReports.filter((r) => {
      const matchesSearch = !q ||
        r.title.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q));
      const matchesCategory = !category || r.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [allReports, query, category]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisible(CHUNK);
  }, [query, category]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + CHUNK, filtered.length));
  }, [filtered.length]);

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

  const visibleItems = filtered.slice(0, visible);

  return (
    <div className="py-12">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${allReports.length.toLocaleString()}+ reports by title, source, or topic...`}
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

      {/* Report List */}
      {visibleItems.length === 0 && !loading ? (
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
      {visible < filtered.length && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
