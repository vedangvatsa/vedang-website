'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, MoveUpRight, Database, Loader2, ArrowUpDown, X } from 'lucide-react';

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
  const [docType, setDocType] = useState('');
  const [yearRange, setYearRange] = useState('');
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

  // Sort and filter default list client-side
  const processedDefaultReports = useMemo(() => {
    let reports = [...defaultReports];
    
    // Filter by type
    if (docType) {
      const typeLower = docType.toLowerCase();
      if (typeLower === 'paper') {
        reports = reports.filter(item => ['paper', 'preprint', 'thesis', 'book'].includes(item.type?.toLowerCase() || ''));
      } else if (typeLower === 'report') {
        reports = reports.filter(item => ['report', 'analysis', 'survey', 'white paper'].includes(item.type?.toLowerCase() || ''));
      } else if (typeLower === 'framework') {
        reports = reports.filter(item => ['framework', 'guidance', 'standard'].includes(item.type?.toLowerCase() || ''));
      }
    }
    
    // Filter by year range
    if (yearRange) {
      reports = reports.filter(item => {
        const itemYearMatch = item.date.match(/\d{4}/);
        if (!itemYearMatch) return yearRange === 'earlier';
        const itemYear = parseInt(itemYearMatch[0], 10);
        if (yearRange === '2025-2026') return itemYear >= 2025;
        if (yearRange === '2023-2024') return itemYear >= 2023 && itemYear <= 2024;
        if (yearRange === '2020-2022') return itemYear >= 2020 && itemYear <= 2022;
        if (yearRange === 'earlier') return itemYear < 2020;
        return true;
      });
    }

    // Sort
    if (sort === 'date') {
      return reports.sort((a, b) => parseClientDate(b.date) - parseClientDate(a.date));
    }
    return reports.sort((a, b) => {
      const citDiff = (b.citations || 0) - (a.citations || 0);
      if (citDiff !== 0) return citDiff;
      return parseClientDate(b.date) - parseClientDate(a.date);
    });
  }, [defaultReports, sort, docType, yearRange]);

  // Debounced search trigger (local or OpenAlex)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // If no search/filter active on Curated tab, use the default reports
    if (!query && !category && !docType && !yearRange && searchMode === 'curated') {
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

    const executeSearch = async () => {
      try {
        let url = '';
        if (searchMode === 'curated') {
          url = `/api/reports/local-search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&type=${encodeURIComponent(docType)}&yearRange=${encodeURIComponent(yearRange)}&sort=${sort}&page=1&limit=${CHUNK}`;
        } else {
          url = `/api/reports/search?q=${encodeURIComponent(query)}&page=1&limit=${CHUNK}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        
        const newResults = data.results || [];
        setResults(newResults);
        setTotalCount(data.total || 0);
        setHasMore(newResults.length < (data.total || 0));
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
        setTotalCount(0);
        setHasMore(false);
      } finally {
        setApiLoading(false);
      }
    };

    debounceRef.current = setTimeout(executeSearch, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, category, docType, yearRange, sort, searchMode, dataUrl]);

  // Server-side next page loading
  const fetchNextPage = useCallback(async () => {
    if (apiLoading || !hasMore) return;
    
    setApiLoading(true);
    const nextPage = page + 1;
    
    try {
      let url = '';
      if (searchMode === 'curated') {
        url = `/api/reports/local-search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}&type=${encodeURIComponent(docType)}&yearRange=${encodeURIComponent(yearRange)}&sort=${sort}&page=${nextPage}&limit=${CHUNK}`;
      } else {
        url = `/api/reports/search?q=${encodeURIComponent(query)}&page=${nextPage}&limit=${CHUNK}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load next page');
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
  }, [page, apiLoading, hasMore, query, category, searchMode, corpus, sort, docType, yearRange, results.length, totalCount]);

  // Check if default view is active
  const isDefaultActive = !query && !category && !docType && !yearRange && searchMode === 'curated';

  // Infinite scroll intersection callback
  const loadMore = useCallback(() => {
    if (isDefaultActive) {
      // Local slicing for default view
      setVisibleLimit(prev => Math.min(prev + CHUNK, processedDefaultReports.length));
    } else {
      // Server-side page fetching for search/filter mode
      fetchNextPage();
    }
  }, [isDefaultActive, processedDefaultReports.length, fetchNextPage]);

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
    if (isDefaultActive) {
      return processedDefaultReports.slice(0, visibleLimit);
    }
    return results;
  }, [isDefaultActive, processedDefaultReports, visibleLimit, results]);

  // Compute total counts
  const totalCountDisplay = useMemo(() => {
    if (isDefaultActive) {
      return processedDefaultReports.length;
    }
    return totalCount;
  }, [isDefaultActive, processedDefaultReports.length, totalCount]);

  // Reset local list pagination on search reset
  useEffect(() => {
    setVisibleLimit(CHUNK);
  }, [query, category, searchMode, docType, yearRange]);

  // Reset all filters helper
  const resetFilters = () => {
    setQuery('');
    setCategory('');
    setDocType('');
    setYearRange('');
    setSort('citations');
  };

  if (defaultLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/60 mb-3" />
        <p className="text-muted-foreground text-xs font-medium">Initializing library metadata...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Search Mode Tabs */}
      <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none border-b border-[#e3e3e0] dark:border-zinc-800 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => {
            setSearchMode('curated');
            resetFilters();
          }}
          className={`pb-3.5 px-1 text-sm font-bold border-b-2 transition-all -mb-px mr-6 shrink-0 ${
            searchMode === 'curated'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Curated Database <span className="text-xs font-normal opacity-70">({corpus === 'ai' ? '133k' : '100k'})</span>
        </button>
        <button
          onClick={() => {
            setSearchMode('academic');
            resetFilters();
          }}
          className={`pb-3.5 px-1 text-sm font-bold border-b-2 transition-all -mb-px shrink-0 ${
            searchMode === 'academic'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Academic Search <span className="text-xs font-normal opacity-70">(250M+)</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === 'curated'
                ? `Search within ${category || 'curated library'}...`
                : "Search 250M+ papers via OpenAlex..."
            }
            className="w-full pl-10 pr-10 py-2.5 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/10 text-sm focus:outline-none focus:border-primary transition-colors"
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

        {/* Filter Controls Row */}
        <div className="flex flex-wrap gap-3 items-center">
          {searchMode === 'curated' && (
            <>
              {/* Category Filter */}
              <div className="relative w-full sm:w-auto flex-1 min-w-[160px]">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/10 text-xs font-semibold appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/60 text-[10px]">▼</div>
              </div>

              {/* Document Type Filter */}
              <div className="relative w-full sm:w-auto flex-1 min-w-[160px]">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/10 text-xs font-semibold appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">All Document Types</option>
                  <option value="report">Industry Reports & Studies</option>
                  <option value="paper">Academic Papers & Books</option>
                  <option value="framework">Guidelines & Standards</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/60 text-[10px]">▼</div>
              </div>

              {/* Year Range Filter */}
              <div className="relative w-full sm:w-auto flex-1 min-w-[120px]">
                <select
                  value={yearRange}
                  onChange={(e) => setYearRange(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/10 text-xs font-semibold appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">All Years</option>
                  <option value="2025-2026">2025 – 2026</option>
                  <option value="2023-2024">2023 – 2024</option>
                  <option value="2020-2022">2020 – 2022</option>
                  <option value="earlier">Before 2020</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/60 text-[10px]">▼</div>
              </div>

              {/* Sort Selector */}
              <div className="relative w-full sm:w-auto flex-1 min-w-[140px]">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'citations' | 'date')}
                  className="w-full pl-3.5 pr-8 py-2 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/10 text-xs font-semibold appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="citations">Sort by Citations</option>
                  <option value="date">Sort by Date (Newest)</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/60 text-[10px]">▼</div>
              </div>
            </>
          )}

          {/* Reset Filters Button */}
          {(query || category || docType || yearRange || sort !== 'citations') && (
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 hover:bg-muted/40 text-xs font-bold transition-all shrink-0 w-full sm:w-auto"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading & Results Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
        <span className="text-sm text-muted-foreground font-medium">
          {(isDefaultActive) ? (
            `Top ${visibleItems.length} of ${totalCountDisplay.toLocaleString()} curated reports`
          ) : (
            visibleItems.length > 0 && (
              `${visibleItems.length} of ${totalCountDisplay.toLocaleString()} matching results`
            )
          )}
        </span>

        {apiLoading && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            <span>Searching...</span>
          </div>
        )}
      </div>

      {/* Academic Search Instructions */}
      {searchMode === 'academic' && (!query || query.length < 3) && (
        <div className="py-24 text-center border border-dashed border-[#e3e3e0] dark:border-zinc-800 rounded-[3px] bg-white dark:bg-zinc-900/10">
          <Database className="mx-auto h-8 w-8 text-muted-foreground/20 mb-3" />
          <h3 className="text-sm font-bold text-[#37352f] dark:text-zinc-200 mb-1">Global Academic Search</h3>
          <p className="text-muted-foreground text-xs max-w-sm mx-auto leading-relaxed px-4">
            Search over 250 million academic papers in real-time via OpenAlex. Enter a search query of 3 or more characters above.
          </p>
        </div>
      )}

      {/* No Results Fallback */}
      {visibleItems.length === 0 && !apiLoading && (searchMode !== 'academic' || (query && query.length >= 3)) && (
        <div className="py-24 text-center border border-dashed border-[#e3e3e0] dark:border-zinc-800 rounded-[3px] bg-white dark:bg-zinc-900/10">
          <Database className="mx-auto h-8 w-8 text-muted-foreground/20 mb-3" />
          <h3 className="text-sm font-bold text-[#37352f] dark:text-zinc-200 mb-1">No results found</h3>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto px-4">
            We couldn't find any entries matching "{query}". Try checking your spelling or clearing filters.
          </p>
        </div>
      )}

      {/* Report List Grid */}
      {visibleItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visibleItems.map((item, i) => (
            <Link
              key={`${item.url}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col p-5 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 hover:border-primary/40 bg-white dark:bg-zinc-900/10 transition-colors duration-150 group"
            >
              {item.category && (
                <span className="text-xs font-medium text-primary mb-2 block">
                  {item.category}
                </span>
              )}

              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm md:text-base font-bold text-[#37352f] dark:text-zinc-200 group-hover:text-primary transition-colors duration-150 leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <MoveUpRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-150 mt-1" />
              </div>
              
              {item.description && (
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                  {item.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground mt-auto">
                {item.date && (
                  <span className="font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-300 px-1.5 py-0.5 rounded-[3px]">
                    {item.date}
                  </span>
                )}
                {item.source && (
                  <span className="font-semibold text-foreground/85">
                    {item.source}
                  </span>
                )}
                {item.type && (
                  <span className="opacity-70 text-xs">
                    {item.type}
                  </span>
                )}
                {item.citations !== undefined && item.citations > 0 && (
                  <span className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-[3px]">
                    {item.citations.toLocaleString()} citations
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {((isDefaultActive && visibleLimit < processedDefaultReports.length) || hasMore) && (
        <div ref={sentinelRef} className="flex justify-center py-10 mt-4">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/40" />
        </div>
      )}
    </div>
  );
}
