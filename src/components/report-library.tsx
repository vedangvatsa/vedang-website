'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, MoveUpRight, Database, Loader2, Zap, BookOpen, GraduationCap, Flame, ArrowUpDown, X } from 'lucide-react';

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

const CHUNK = 50;
const DEBOUNCE_MS = 400;



const parseClientDate = (dateStr: string): number => {
  if (!dateStr) return 0;
  const match = dateStr.match(/\d{4}/);
  if (match) {
    const year = parseInt(match[0], 10);
    const monthStr = dateStr.slice(0, 3).toLowerCase();
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const month = months[monthStr] !== undefined ? months[monthStr] : 0;
    return new Date(year, month, 1).getTime();
  }
  return 0;
};

export function ReportLibrary({ dataUrl, categories, corpus = 'ai' }: ReportLibraryProps) {
  const [defaultReports, setDefaultReports] = useState<ReportEntry[]>([]);
  const [defaultLoading, setDefaultLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  
  const [searchMode, setSearchMode] = useState<'curated' | 'academic'>('curated');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<'citations' | 'date'>('citations');
  
  // Search pagination states
  const [results, setResults] = useState<ReportEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Local pagination limit for default reports list
  const [visibleLimit, setVisibleLimit] = useState(CHUNK);
  
  const sentinelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load default lightweight reports on mount
  useEffect(() => {
    setDefaultLoading(true);
    const defaultUrl = dataUrl.replace('-data.json', '-default.json');
    fetch(defaultUrl)
      .then(res => res.json())
      .then((data: ReportEntry[]) => {
        setDefaultReports(data);
        setDefaultLoading(false);
      })
      .catch(() => {
        setDefaultLoading(false);
      });
  }, [dataUrl]);

  // Sort default list client-side based on sort state
  const sortedDefaultReports = useMemo(() => {
    const reports = [...defaultReports];
    if (sort === 'date') {
      return reports.sort((a, b) => parseClientDate(b.date) - parseClientDate(a.date));
    }
    // Default to citations, fallback to date
    return reports.sort((a, b) => {
      const citDiff = (b.citations || 0) - (a.citations || 0);
      if (citDiff !== 0) return citDiff;
      return parseClientDate(b.date) - parseClientDate(a.date);
    });
  }, [defaultReports, sort]);

  // Debounced search trigger (local or OpenAlex)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // If no search query/filter on Curated tab, we don't query the API; just use the default reports
    if (!query && !category && searchMode === 'curated') {
      setResults([]);
      setTotalCount(0);
      setPage(1);
      setHasMore(false);
      setApiLoading(false);
      return;
    }

    // For Academic tab, require at least 3 characters to search
    if (searchMode === 'academic' && (!query || query.length < 3)) {
      setResults([]);
      setTotalCount(0);
      setPage(1);
      setHasMore(false);
      setApiLoading(false);
      return;
    }

    setApiLoading(true);
    setPage(1); // Reset page to 1 for new queries

    debounceRef.current = setTimeout(async () => {
      try {
        let fetchUrl = '';
        if (searchMode === 'curated') {
          fetchUrl = `/api/reports/local-search?corpus=${corpus}&q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&sort=${sort}&page=1&limit=50`;
        } else {
          // OpenAlex search (always sorted by citations on the route side)
          fetchUrl = `/api/reports/search?corpus=${corpus}&q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&page=1&per_page=50`;
        }

        const res = await fetch(fetchUrl);
        const data = await res.json();
        
        const fetchedResults = data.results || [];
        setResults(fetchedResults);
        
        const total = data.total || 0;
        setTotalCount(total);
        
        setHasMore(fetchedResults.length < total);
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setApiLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, category, searchMode, corpus, sort]);

  // Fetching next page when user scrolls to bottom
  const fetchNextPage = useCallback(async () => {
    if (apiLoading || !hasMore) return;
    
    const nextPage = page + 1;
    setApiLoading(true);
    
    try {
      let fetchUrl = '';
      if (searchMode === 'curated') {
        fetchUrl = `/api/reports/local-search?corpus=${corpus}&q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&sort=${sort}&page=${nextPage}&limit=50`;
      } else {
        fetchUrl = `/api/reports/search?corpus=${corpus}&q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&page=${nextPage}&per_page=50`;
      }
      
      const res = await fetch(fetchUrl);
      const data = await res.json();
      
      const newResults = data.results || [];
      setResults(prev => [...prev, ...newResults]);
      setPage(nextPage);
      
      const total = data.total || totalCount;
      setTotalCount(total);
      setHasMore(results.length + newResults.length < total);
    } catch (err) {
      console.error('Fetch next page error:', err);
    } finally {
      setApiLoading(false);
    }
  }, [page, apiLoading, hasMore, query, category, searchMode, corpus, sort, results.length, totalCount]);

  // Infinite scroll intersection callback
  const loadMore = useCallback(() => {
    if (!query && !category && searchMode === 'curated') {
      // Local slicing for default view
      setVisibleLimit(prev => Math.min(prev + CHUNK, defaultReports.length));
    } else {
      // Server-side page fetching for search/filter mode
      fetchNextPage();
    }
  }, [query, category, searchMode, defaultReports.length, fetchNextPage]);

  // Setup observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '400px' }
    );
    
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Compute what list to display
  const visibleItems = useMemo(() => {
    if (!query && !category && searchMode === 'curated') {
      return sortedDefaultReports.slice(0, visibleLimit);
    }
    return results;
  }, [query, category, searchMode, sortedDefaultReports, visibleLimit, results]);

  // Compute total counts
  const totalCountDisplay = useMemo(() => {
    if (!query && !category && searchMode === 'curated') {
      return defaultReports.length;
    }
    return totalCount;
  }, [query, category, searchMode, defaultReports.length, totalCount]);

  // Reset local list pagination on search reset
  useEffect(() => {
    setVisibleLimit(CHUNK);
  }, [query, category, searchMode]);

  // Reset all filters helper
  const resetFilters = () => {
    setQuery('');
    setCategory('');
    setSort('citations');
  };

  if (defaultLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm font-medium">Initializing library and metadata...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Search Mode Tabs */}
      <div className="flex border-b border-border/50 mb-6 gap-1 md:gap-2">
        <button
          onClick={() => {
            setSearchMode('curated');
            resetFilters();
          }}
          className={`flex items-center gap-2 pb-3 px-3 md:px-5 text-sm font-semibold border-b-2 transition-all -mb-px ${
            searchMode === 'curated'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curated Library</span>
          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-mono">
            {corpus === 'ai' ? '133,000+' : '100,000+'}
          </span>
        </button>
        <button
          onClick={() => {
            setSearchMode('academic');
            resetFilters();
          }}
          className={`flex items-center gap-2 pb-3 px-3 md:px-5 text-sm font-semibold border-b-2 transition-all -mb-px ${
            searchMode === 'academic'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Search</span>
          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-mono">
            250M+
          </span>
        </button>
      </div>

      {/* Stats Summary Banner */}
      <div className="bg-muted/30 border border-border/50 rounded-2xl p-4.5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-foreground mb-1">
            {corpus === 'ai' ? 'Curated AI Research Corpus' : 'Curated Web3 & Blockchain Corpus'}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
            This collection contains peer-reviewed papers, institutional research reports, and technical outlines. Sorted by academic impact and citation count to surface the most foundational documents first.
          </p>
        </div>
        <div className="flex gap-4.5 shrink-0 text-left">
          <div className="border-l-2 border-primary/20 pl-3">
            <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Scope</span>
            <span className="text-xs font-bold text-foreground">1980 – 2026</span>
          </div>
          <div className="border-l-2 border-primary/20 pl-3">
            <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Sources</span>
            <span className="text-xs font-bold text-foreground">OpenAlex, Crossref</span>
          </div>
          <div className="border-l-2 border-primary/20 pl-3">
            <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Metrics</span>
            <span className="text-xs font-bold text-foreground">Citations Tracked</span>
          </div>
        </div>
      </div>

      {/* Category Grid Explorer */}
      <div className="mb-6">
        <span className="block text-xs font-bold text-muted-foreground mb-3 px-1">
          Explore by Category
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {categories.map((c) => {
            const isActive = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(isActive ? '' : c)}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/5 border-primary text-primary shadow-sm'
                    : 'border-border/60 bg-card hover:bg-muted/40 text-foreground'
                }`}
              >
                <span className="truncate">{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Sort controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === 'curated'
                ? `Search within ${category || 'curated library'}...`
                : "Search 250M+ papers via OpenAlex..."
            }
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full text-muted-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        {searchMode === 'curated' && (
          <div className="relative shrink-0 flex items-center gap-2">
            <div className="relative w-full">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'citations' | 'date')}
                className="w-full sm:w-auto pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-medium"
              >
                <option value="citations">Sort by Citations</option>
                <option value="date">Sort by Date (Newest)</option>
              </select>
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        {(query || category || sort !== 'citations') && (
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-border hover:bg-muted/40 text-sm font-semibold transition-all shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Loading & Results Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1.5">
        <span className="text-xs text-muted-foreground font-medium">
          {(!query && !category && searchMode === 'curated') ? (
            `Showing top ${visibleItems.length} of ${totalCountDisplay.toLocaleString()} curated reports`
          ) : (
            visibleItems.length > 0 && (
              `Showing ${visibleItems.length} of ${totalCountDisplay.toLocaleString()} matching results`
            )
          )}
        </span>

        {apiLoading && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            <span>
              {searchMode === 'curated' ? 'Searching curated database...' : 'Querying OpenAlex global index...'}
            </span>
          </div>
        )}
      </div>

      {/* Instructions for Academic Search */}
      {searchMode === 'academic' && (!query || query.length < 3) && (
        <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card">
          <Search className="mx-auto h-9 w-9 text-muted-foreground/30 mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">Global Academic Search</h3>
          <p className="text-muted-foreground text-xs max-w-sm mx-auto leading-relaxed px-4">
            Search over 250 million academic papers in real-time via OpenAlex. Enter a search query of 3 or more characters above to begin.
          </p>
        </div>
      )}

      {/* Report List Grid */}
      {visibleItems.length === 0 && !apiLoading && (searchMode !== 'academic' || (query && query.length >= 3)) && (
        <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card">
          <Database className="mx-auto h-9 w-9 text-muted-foreground/30 mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">No reports found</h3>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto px-4">
            We couldn't find any entries matching "{query}". Try checking your spelling or clearing filters.
          </p>
        </div>
      )}

      {visibleItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visibleItems.map((item, i) => (
            <Link
              key={`${item.url}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col p-4.5 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-muted/15 transition-all duration-200 group bg-card shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-150 line-clamp-2">
                  {item.title}
                </h3>
                <MoveUpRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-150" />
              </div>
              
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3.5 leading-relaxed">
                  {item.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[11px] text-muted-foreground mt-auto">
                {item.date && (
                  <span className="font-semibold bg-secondary/70 text-secondary-foreground px-2 py-0.5 rounded">
                    {item.date}
                  </span>
                )}
                {item.source && (
                  <span className="font-medium text-foreground/80">
                    {item.source}
                  </span>
                )}
                {item.type && (
                  <span className="opacity-70">
                    • {item.type}
                  </span>
                )}
                {item.citations !== undefined && item.citations > 0 && (
                  <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold ${
                    item.citations >= 1000
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-primary/5 text-primary'
                  }`}>
                    {item.citations >= 1000 ? <Flame className="w-3 h-3 fill-current shrink-0" /> : null}
                    {item.citations.toLocaleString()} citations
                  </span>
                )}
                {item.category && (
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10 font-semibold text-[10px]">
                    {item.category}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {((!query && !category && searchMode === 'curated' && visibleLimit < defaultReports.length) || hasMore) && (
        <div ref={sentinelRef} className="flex justify-center py-10 mt-4">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/60" />
        </div>
      )}
    </div>
  );
}
