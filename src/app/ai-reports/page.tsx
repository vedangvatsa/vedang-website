import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { MoveUpRight, Database } from 'lucide-react';
import { aiReports, CATEGORIES } from '@/lib/ai-reports-data';
import { ReportSearch } from '@/components/report-search';

export const metadata: Metadata = {
  title: 'AI Reports & Research Library | Vedang Vatsa',
  description: 'A comprehensive, searchable database of 21,000+ AI reports, research papers, and industry analyses published since 2022.',
};

const ITEMS_PER_PAGE = 200;

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

  const pageNumbers: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (page > 3) pageNumbers.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pageNumbers.push(i);
    if (page < totalPages - 2) pageNumbers.push('...');
    pageNumbers.push(totalPages);
  }

  function buildUrl(p: number) {
    return `?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(category ? { category } : {}), ...(type ? { type } : {}), page: String(p) }).toString()}`;
  }

  return (
    <PageLayout>
      <BreadcrumbSchema items={[{ name: "AI Reports", url: "https://veda.ng/ai-reports" }]} />

      <section className="text-center pt-16 pb-12 border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
            AI Reports & Research Library
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            {aiReports.length.toLocaleString()}+ research papers, institutional reports, and industry analyses. Each entry links directly to a verified DOI or academic repository.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12">
        <ReportSearch
          placeholder={`Search ${aiReports.length.toLocaleString()}+ reports by title, source, or topic...`}
          categories={CATEGORIES}
          currentQuery={query}
          currentCategory={category}
        />

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}</span> – <span className="font-medium text-foreground">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length.toLocaleString()}</span>
            {query && <> for <span className="font-semibold text-foreground">&quot;{query}&quot;</span></>}
          </p>
        </div>

        {/* 3-column compact directory */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 bg-card border border-border/60 rounded-xl p-4 md:p-6">
          {currentReports.map((report, i) => (
            <Link
              key={i}
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-baseline gap-2 py-1 group break-inside-avoid hover:bg-secondary/50 rounded px-1.5 -mx-1.5 transition-colors"
            >
              <span className="text-[10px] text-muted-foreground/40 font-mono shrink-0 w-6 text-right tabular-nums">
                {(page - 1) * ITEMS_PER_PAGE + i + 1}
              </span>
              <span className="text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1 flex-1">
                {report.title}
              </span>
              <MoveUpRight className="h-2.5 w-2.5 text-muted-foreground/20 group-hover:text-primary shrink-0 transition-colors" />
            </Link>
          ))}
          {currentReports.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Database className="h-8 w-8 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No reports found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-1">
              <Link
                href={buildUrl(Math.max(1, page - 1))}
                className={`px-3 py-1.5 border border-border/60 bg-card rounded-md text-sm font-medium transition-colors ${page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-secondary'}`}
              >
                Prev
              </Link>
              {pageNumbers.map((p, idx) =>
                p === '...' ? (
                  <span key={`e${idx}`} className="px-2 text-muted-foreground text-sm">…</span>
                ) : (
                  <Link
                    key={p}
                    href={buildUrl(p)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${p === page ? 'bg-primary text-primary-foreground' : 'border border-border/60 bg-card hover:bg-secondary'}`}
                  >
                    {p}
                  </Link>
                )
              )}
              <Link
                href={buildUrl(Math.min(totalPages, page + 1))}
                className={`px-3 py-1.5 border border-border/60 bg-card rounded-md text-sm font-medium transition-colors ${page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-secondary'}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
