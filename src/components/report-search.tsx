'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Search, Filter } from 'lucide-react';

export function ReportSearch({
  placeholder,
  categories,
  currentQuery,
  currentCategory,
}: {
  placeholder: string;
  categories: string[];
  currentQuery: string;
  currentCategory: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [router]);

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto mb-12">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input 
          type="text" 
          id="report-search-input"
          aria-label={placeholder}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          defaultValue={currentQuery}
          onChange={(e) => {
            const timeout = setTimeout(() => updateParams('q', e.target.value), 300);
            return () => clearTimeout(timeout);
          }}
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
      <div className="relative md:w-64">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <select
          id="report-category-select"
          aria-label="Filter reports by category"
          className="w-full pl-10 pr-8 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
          defaultValue={currentCategory}
          onChange={(e) => updateParams('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
