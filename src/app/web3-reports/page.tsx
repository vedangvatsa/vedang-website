import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { MoveUpRight, Database } from 'lucide-react';
import { web3Reports, CATEGORIES } from '@/lib/web3-reports-data';
import { ReportSearch } from '@/components/report-search';

export const metadata: Metadata = {
  title: 'Web3 Reports & Research Data Archive | Vedang Vatsa',
  description: 'A comprehensive, searchable database of 23,000+ Web3 reports, white papers, institutional research, and regulatory frameworks.',
};

const ITEMS_PER_PAGE = 50;

export default async function Web3ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.toLowerCase() : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10)) : 1;

  // Server-side filtering — data never hits the client bundle
  const filtered = web3Reports.filter((r) => {
    const matchesSearch = !query ||
      r.title.toLowerCase().includes(query) ||
      r.source.toLowerCase().includes(query);
    const matchesCategory = !category || r.category === category;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentReports = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
            A comprehensive, concise directory of the latest Web3 reports, whitepapers, and on-chain analyses globally. To map the true trajectory of crypto in 2026, we bypassed retail hype and performed a deep-text tokenization on the full abstracts of {web3Reports.length.toLocaleString()}+ documents below.
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
                Read our exclusive 5,000-word McKinsey-style analysis. We extracted and tokenized millions of words from the abstracts of {web3Reports.length.toLocaleString()}+ reports below to uncover the true institutional Web3 trends.
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
            The {web3Reports.length.toLocaleString()}+ Document Archive
          </h2>

          {/* Client-side search component */}
          <ReportSearch
            placeholder={`Search across ${web3Reports.length.toLocaleString()}+ reports by title or source...`}
            categories={CATEGORIES}
            currentQuery={query}
            currentCategory={category}
          />
        </div>

        {/* RESULTS METADATA */}
        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground max-w-5xl mx-auto px-2">
          <div>
            Showing <span className="font-semibold text-foreground">{filtered.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}</span> - <span className="font-semibold text-foreground">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-foreground">{filtered.length.toLocaleString()}</span> reports
            {query && <> for <span className="font-semibold text-foreground">&quot;{query}&quot;</span></>}
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-medium uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Title & Source</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Category</th>
                    <th className="px-6 py-4 whitespace-nowrap hidden md:table-cell">Date</th>
                    <th className="px-6 py-4 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {currentReports.map((report, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground text-base group-hover:text-primary transition-colors line-clamp-2">
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
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                          {report.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono text-xs hidden md:table-cell">
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
              <Link
                href={`?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(category ? { category } : {}), page: String(Math.max(1, page - 1)) }).toString()}`}
                className={`px-4 py-2 rounded-lg border border-border font-medium transition-colors ${page === 1 ? 'pointer-events-none opacity-50 bg-muted/50' : 'hover:bg-secondary bg-card text-foreground'}`}
              >
                Previous
              </Link>
              
              <div className="px-4 py-2 font-mono text-sm">
                Page {page} of {totalPages}
              </div>

              <Link
                href={`?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(category ? { category } : {}), page: String(Math.min(totalPages, page + 1)) }).toString()}`}
                className={`px-4 py-2 rounded-lg border border-border font-medium transition-colors ${page === totalPages ? 'pointer-events-none opacity-50 bg-muted/50' : 'hover:bg-secondary bg-card text-foreground'}`}
              >
                Next
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
