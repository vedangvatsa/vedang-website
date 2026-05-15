'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { MoveUpRight, Search, Filter, BookOpen, Globe2, Cpu, Building2, Shield, Eye, Briefcase, Heart, Landmark, GraduationCap, Leaf, Scale, Palette, Factory, Zap, Bot, ShoppingCart, Radio, Atom } from 'lucide-react';
import { aiReports, type AIReport, CATEGORIES } from '@/lib/ai-reports-data';

const CATEGORY_ICONS: Record<string, any> = {
  'All': Globe2,
  'State of AI': Cpu,
  'Enterprise & Strategy': Building2,
  'AI Ethics & Governance': Shield,
  'AI Safety & Alignment': Eye,
  'Workforce & Labor': Briefcase,
  'Healthcare & Biotech': Heart,
  'Finance & Banking': Landmark,
  'Education': GraduationCap,
  'Climate & Energy': Leaf,
  'Cybersecurity & Defense': Shield,
  'Legal & Justice': Scale,
  'Creative Industries': Palette,
  'Supply Chain & Manufacturing': Factory,
  'Semiconductors & Infrastructure': Cpu,
  'VC & Startup Funding': Zap,
  'Real Estate & Construction': Building2,
  'Government & Public Sector': Landmark,
  'LLMs & Benchmarks': Bot,
  'Robotics & Embodied AI': Bot,
  'Privacy & Data Protection': Eye,
  'Retail & E-Commerce': ShoppingCart,
  'Telecom & Connectivity': Radio,
  'Quantum Computing': Atom,
  'Emerging Markets': Globe2,
  'Insurance': Shield,
  'Agriculture & Food': Leaf,
};

const SOURCE_TYPES = ['All', 'Report', 'Paper', 'Framework', 'Guidance', 'White Paper', 'Survey', 'Analysis'] as const;
const ITEMS_PER_PAGE = 50;

export default function AIReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return aiReports.filter((r) => {
      const matchesSearch = searchQuery === '' ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
      const matchesType = selectedSourceType === 'All' || r.type === selectedSourceType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedSourceType]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All': aiReports.length };
    aiReports.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, []);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedReports = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: any, value: any) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <PageLayout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-4">
              <BookOpen className="h-4 w-4" />
              <span>{aiReports.length.toLocaleString()}+ Reports & Papers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              AI Reports & Research Library
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              A comprehensive, concise directory of the latest AI reports, research papers, and industry analyses globally.
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
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">State of AI 2026 Meta-Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Read our exclusive McKinsey-style analysis. We extracted and tokenized millions of words from the abstracts of 10,000+ reports below to uncover the true enterprise AI trends.
                </p>
              </div>
              <Link 
                href="/state-of-ai-2026"
                className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
              >
                Read Findings
                <MoveUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="mx-auto max-w-3xl mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search across 10,000+ reports by title, source, or topic..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                className="w-full rounded-xl border bg-card px-12 py-3.5 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                id="search-reports"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title="Toggle Filters"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Source Type Filter */}
          {showFilters && (
            <div className="mx-auto max-w-4xl mb-6 flex flex-wrap justify-center gap-2">
              {SOURCE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange(setSelectedSourceType, type)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    selectedSourceType === type
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card hover:bg-secondary border-border'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {/* Category Tabs */}
          <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {['All', ...CATEGORIES].map((cat) => {
                const Icon = CATEGORY_ICONS[cat] || Globe2;
                const count = categoryCounts[cat] || 0;
                // Only show categories that actually have reports
                if (cat !== 'All' && count === 0) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange(setSelectedCategory, cat)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-card border hover:bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{cat}</span>
                    <span className={`text-[10px] ${selectedCategory === cat ? 'text-primary-foreground/70' : 'text-muted-foreground/60'}`}>
                      {count.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary & Pagination Top */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length.toLocaleString()}</span> entries
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-secondary"
                >
                  Prev
                </button>
                <span className="text-sm text-muted-foreground px-2">Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Concise List View */}
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Title & Source</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Type</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedReports.map((report, i) => (
                    <ReportRow key={i} report={report} />
                  ))}
                  {paginatedReports.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                        <Search className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No reports found matching your criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Bottom */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border bg-card rounded-md text-sm font-medium disabled:opacity-50 hover:bg-secondary transition-colors"
                >
                  Previous Page
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 border bg-card rounded-md text-sm font-medium disabled:opacity-50 hover:bg-secondary transition-colors"
                >
                  Next Page
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

function ReportRow({ report }: { report: AIReport }) {
  const Icon = CATEGORY_ICONS[report.category] || Globe2;
  return (
    <tr className="group hover:bg-secondary/50 transition-colors">
      <td className="px-4 py-3 max-w-[300px] md:max-w-[500px]">
        <Link href={report.url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors mb-1 line-clamp-2">
            {report.title}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{report.source}</span>
            <span className="opacity-50">•</span>
            <span>{report.date}</span>
            {/* Show category/type on mobile only since columns are hidden */}
            <span className="sm:hidden opacity-50">•</span>
            <span className="sm:hidden inline-flex items-center gap-1"><Icon className="h-3 w-3"/> {report.category}</span>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground whitespace-nowrap">
          <Icon className="h-3 w-3" />
          {report.category}
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary uppercase tracking-wider whitespace-nowrap">
          {report.type}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <Link 
          href={report.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md border bg-card p-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
          title="Read Report"
        >
          <MoveUpRight className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}
