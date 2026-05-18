import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { web3Reports, CATEGORIES } from '@/lib/web3-reports-data';
import { ReportSearch } from '@/components/report-search';
import { InfiniteReportList } from '@/components/infinite-report-list';

export const metadata: Metadata = {
  title: 'Web3 Reports Library | Vedang Vatsa',
  description: 'A comprehensive, searchable database of 23,000+ Web3 reports, white papers, institutional research, and regulatory frameworks.',
};

export default async function Web3ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.toLowerCase() : '';
  const category = typeof params.category === 'string' ? params.category : '';

  const filtered = web3Reports.filter((r) => {
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
      <BreadcrumbSchema items={[{ name: "Web3 Reports", url: "https://veda.ng/web3-reports" }]} />

      <section className="text-center pt-16 pb-12 border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
            Web3 Reports Library
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            {web3Reports.length.toLocaleString()}+ research papers, institutional reports, and on-chain analyses. Each entry links directly to a verified DOI or academic repository.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Read the full synthesis: <Link href="/state-of-web3" className="text-primary hover:underline font-medium">The State of Web3 →</Link>
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-[1600px] py-12">
        <ReportSearch
          placeholder={`Search ${web3Reports.length.toLocaleString()}+ reports by title or source...`}
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
