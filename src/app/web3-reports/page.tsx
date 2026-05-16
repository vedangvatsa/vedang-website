import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { MoveUpRight, Database, BookOpen } from 'lucide-react';
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
      r.source.toLowerCase().includes(query) ||
      (r.description && r.description.toLowerCase().includes(query));
    const matchesCategory = !category || r.category === category;
    return matchesSearch && matchesCategory;
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
              <span>{web3Reports.length.toLocaleString()}+ Reports & Papers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Web3 Reports & Research Library
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground mb-12">
              A comprehensive, concise directory of the latest Web3 reports, whitepapers, and on-chain analyses globally. To map the true trajectory of crypto in 2026, retail hype was bypassed and a deep-text tokenization was performed on the full abstracts of {web3Reports.length.toLocaleString()}+ documents below.
            </p>
          </div>

          {/* Client-side search component */}
          <ReportSearch
            placeholder={`Search across ${web3Reports.length.toLocaleString()}+ reports by title or source...`}
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

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentReports.map((report, i) => (
              <Link 
                key={i} 
                href={report.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col justify-between bg-card border rounded-xl p-5 hover:border-primary hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {report.category}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                      {report.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-3">
                    {report.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground border-t pt-3">
                  <div className="truncate pr-4">
                    <span className="font-medium text-foreground/80">{report.source}</span>
                    <span className="mx-1.5 opacity-50">•</span>
                    <span>{report.date}</span>
                  </div>
                  <MoveUpRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </Link>
            ))}
            {currentReports.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl bg-card">
                <Database className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No reports found matching your criteria.</p>
              </div>
            )}
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
