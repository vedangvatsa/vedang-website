import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { MoveUpRight, BookOpen, Globe2, Database } from 'lucide-react';
import { aiReports, CATEGORIES } from '@/lib/ai-reports-data';
import { ReportSearch } from '@/components/report-search';

export const metadata: Metadata = {
  title: 'AI Reports & Research Library | Vedang Vatsa',
  description: 'A comprehensive, searchable database of 21,000+ AI reports, research papers, and industry analyses published since 2022.',
};

const ITEMS_PER_PAGE = 50;

export default async function AIReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.toLowerCase() : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const type = typeof params.type === 'string' ? params.type : '';
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10)) : 1;

  // Server-side filtering — data never hits the client bundle
  const filtered = aiReports.filter((r) => {
    const matchesSearch = !query ||
      r.title.toLowerCase().includes(query) ||
      r.source.toLowerCase().includes(query) ||
      (r.description && r.description.toLowerCase().includes(query));
    const matchesCategory = !category || r.category === category;
    const matchesType = !type || r.type === type;
    return matchesSearch && matchesCategory && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentReports = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground mb-12">
              A comprehensive, concise directory of the latest AI reports, research papers, and industry analyses globally. To map the true trajectory of AI in 2026, we bypassed the marketing hype and performed a deep-text tokenization on the full abstracts of {aiReports.length.toLocaleString()}+ documents below.
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
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">State of AI 2026: The Comprehensive Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Read our exclusive 5,000-word McKinsey-style analysis. We extracted and tokenized millions of words from the abstracts of {aiReports.length.toLocaleString()}+ reports below to uncover the true enterprise AI trends.
                </p>
              </div>
              <Link 
                href="/state-of-ai-2026"
                className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
              >
                Read Full Essay
                <MoveUpRight className="h-4 w-4" />
              </Link>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              The {aiReports.length.toLocaleString()}+ Document Archive
            </h2>
          </div>

          {/* Client-side search component */}
          <ReportSearch
            placeholder={`Search across ${aiReports.length.toLocaleString()}+ reports by title, source, or topic...`}
            categories={CATEGORIES}
            currentQuery={query}
            currentCategory={category}
          />

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}</span> to <span className="font-medium text-foreground">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length.toLocaleString()}</span> entries
              {query && <> for <span className="font-semibold text-foreground">&quot;{query}&quot;</span></>}
            </p>
          </div>

          {/* Table */}
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Title & Source</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Type</th>
                    <th className="px-4 py-3 font-medium text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentReports.map((report, i) => (
                    <tr key={i} className="group hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3 max-w-[300px] md:max-w-[500px]">
                        <Link href={report.url} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors mb-1 line-clamp-2">
                            {report.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{report.source}</span>
                            <span className="opacity-50">•</span>
                            <span>{report.date}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground whitespace-nowrap">
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
                  ))}
                  {currentReports.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                        <Database className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No reports found matching your criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <Link
                  href={`?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(category ? { category } : {}), page: String(Math.max(1, page - 1)) }).toString()}`}
                  className={`px-4 py-2 border bg-card rounded-md text-sm font-medium transition-colors ${page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-secondary'}`}
                >
                  Previous
                </Link>
                <span className="text-sm text-muted-foreground px-2">Page {page} of {totalPages}</span>
                <Link
                  href={`?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(category ? { category } : {}), page: String(Math.min(totalPages, page + 1)) }).toString()}`}
                  className={`px-4 py-2 border bg-card rounded-md text-sm font-medium transition-colors ${page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-secondary'}`}
                >
                  Next
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
