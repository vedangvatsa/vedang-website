'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { Database, Search, MoveUpRight, Filter } from 'lucide-react';
import { web3Reports, CATEGORIES } from '@/lib/web3-reports-data';
import { StateOfWeb3KeywordsChart, StateOfWeb3BigramsChart } from '@/components/mdx/state-of-web3-charts';

export default function Web3ReportsPage() {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  // Filter reports
  const filteredReports = useMemo(() => {
    return web3Reports.filter((report) => {
      const matchesSearch = query 
        ? report.title.toLowerCase().includes(query.toLowerCase()) || report.source.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesCategory = categoryFilter 
        ? report.category === categoryFilter
        : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [query, categoryFilter]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const currentReports = filteredReports.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 md:px-6 pt-12 pb-16">
        
        {/* HEADER */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            <Database className="h-4 w-4" />
            <span>Open Source Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Web3 Research & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Reports Archive</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A comprehensive, concise directory of the latest Web3 reports, whitepapers, and on-chain analyses globally. To map the true trajectory of crypto in 2026, we bypassed retail hype and performed a deep-text tokenization on the full abstracts of 18,423 documents below.
          </p>

          {/* McKinsey Style CTA Banner */}
          <div className="mx-auto max-w-3xl bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm mb-12">
            <div className="text-left flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Data Science Insight
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">State of Web3 2026: The Comprehensive Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Read our exclusive 5,000-word McKinsey-style analysis. We extracted and tokenized millions of words from the abstracts of 18,000+ reports below to uncover the true institutional Web3 trends.
              </p>
            </div>
            <Link 
              href="/state-of-web3-2026"
              className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
            >
              Read Full Essay
              <MoveUpRight className="h-4 w-4" />
            </Link>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
            The 18,000+ Document Archive
          </h2>

          {/* SEARCH & FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search reports by title or source..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={query}
                onChange={handleQueryChange}
              />
            </div>
            <div className="relative md:w-64">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <select
                className="w-full pl-10 pr-8 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                value={categoryFilter}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RESULTS METADATA */}
        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground max-w-5xl mx-auto px-2">
          <div>
            Showing <span className="font-semibold text-foreground">{(page - 1) * itemsPerPage + (filteredReports.length > 0 ? 1 : 0)}</span> - <span className="font-semibold text-foreground">{Math.min(page * itemsPerPage, filteredReports.length)}</span> of <span className="font-semibold text-foreground">{filteredReports.length.toLocaleString()}</span> reports
          </div>
          {query && (
            <div>
              Search results for: <span className="font-semibold text-foreground">"{query}"</span>
            </div>
          )}
        </div>

        {/* DATA TABLE (Dense & Professional) */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-medium uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Title & Source</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {currentReports.map((report, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                          {report.title}
                        </div>
                        <div className="text-muted-foreground mt-1 text-xs md:text-sm flex items-center gap-2">
                          <span className="font-medium bg-secondary/50 px-2 py-0.5 rounded-md border border-border/50">
                            {report.source}
                          </span>
                          <span className="hidden md:inline text-border/50">•</span>
                          <span className="hidden md:inline">{report.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                          {report.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono text-xs">
                        {report.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link 
                          href={report.url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-secondary/80 text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                          title="Open Report"
                        >
                          <MoveUpRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  
                  {currentReports.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium text-foreground mb-1">No reports found</p>
                        <p>Adjust your search query or filters to see results.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg border border-border font-medium transition-colors ${page === 1 ? 'pointer-events-none opacity-50 bg-muted/50' : 'hover:bg-secondary bg-card text-foreground'}`}
              >
                Previous
              </button>
              
              <div className="px-4 py-2 font-mono text-sm">
                Page {page} of {totalPages}
              </div>

              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg border border-border font-medium transition-colors ${page === totalPages ? 'pointer-events-none opacity-50 bg-muted/50' : 'hover:bg-secondary bg-card text-foreground'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
