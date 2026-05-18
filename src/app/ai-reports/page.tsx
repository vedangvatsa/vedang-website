import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { aiReports, CATEGORIES } from '@/lib/ai-reports-data';
import { ReportSearch } from '@/components/report-search';
import { InfiniteReportList } from '@/components/infinite-report-list';

export const metadata: Metadata = {
  title: 'AI Reports Library | Vedang Vatsa',
  description: 'A comprehensive, searchable database of 21,000+ AI reports, research papers, and industry analyses published since 2022.',
};

export default async function AIReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.toLowerCase() : '';
  const category = typeof params.category === 'string' ? params.category : '';

  const filtered = aiReports.filter((r) => {
    const matchesSearch = !query ||
      r.title.toLowerCase().includes(query) ||
      r.source.toLowerCase().includes(query) ||
      (r.description && r.description.toLowerCase().includes(query));
    const matchesCategory = !category || r.category === category;
    return matchesSearch && matchesCategory;
  });

  const lightItems = filtered.map((r) => ({ title: r.title, url: r.url }));

  return (
    <PageLayout>
      <BreadcrumbSchema items={[{ name: "AI Reports", url: "https://veda.ng/ai-reports" }]} />

      <section className="text-center pt-16 pb-12 border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
            AI Reports Library
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            {aiReports.length.toLocaleString()}+ research papers, institutional reports, and industry analyses. Each entry links directly to a verified DOI or academic repository.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Read the full synthesis: <Link href="/state-of-ai" className="text-primary hover:underline font-medium">The State of AI →</Link>
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-[1600px] py-12">
        <ReportSearch
          placeholder={`Search ${aiReports.length.toLocaleString()}+ reports by title, source, or topic...`}
          categories={CATEGORIES}
          currentQuery={query}
          currentCategory={category}
        />

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filtered.length.toLocaleString()} entries
            {query && <> matching <span className="font-semibold text-foreground">&quot;{query}&quot;</span></>}
            {category && <> in <span className="font-semibold text-foreground">{category}</span></>}
          </p>
        </div>

        <InfiniteReportList items={lightItems} />
      </div>
    </PageLayout>
  );
}
